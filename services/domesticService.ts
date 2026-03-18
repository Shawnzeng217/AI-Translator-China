import * as OpenCC from 'opencc-js';

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || '';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

const IFLYTEK_APP_ID = import.meta.env.VITE_IFLYTEK_APP_ID || '';
const IFLYTEK_API_KEY = import.meta.env.VITE_IFLYTEK_API_KEY || '';
const IFLYTEK_API_SECRET = import.meta.env.VITE_IFLYTEK_API_SECRET || '';

// Initialize converter: Traditional (hk/tw) -> Simplified (cn)
const converter = OpenCC.Converter({ from: 'hk', to: 'cn' });

/**
 * Utility to generate iFlytek WebSocket URL with signature
 */
const getWebsocketUrl = async (url: string, apiKey: string, apiSecret: string): Promise<string> => {
  const urlObj = new URL(url);
  const host = urlObj.host;
  const path = urlObj.pathname;
  const date = new Date().toUTCString();
  const signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${path} HTTP/1.1`;
  
  const encoder = new TextEncoder();
  const keyData = encoder.encode(apiSecret);
  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(signatureOrigin));
  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));
  
  const authorizationOrigin = `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signatureBase64}"`;
  const authorization = btoa(authorizationOrigin);
  
  return `${url}?authorization=${authorization}&date=${encodeURIComponent(date)}&host=${host}`;
};

/**
 * Translates text using DeepSeek-V3 API with streaming.
 */
export const translateTextStream = async (
  text: string, 
  from: string, 
  to: string, 
  onChunk: (chunk: string) => void
): Promise<void> => {
  if (!DEEPSEEK_API_KEY) {
    onChunk("DeepSeek API key is missing.");
    return;
  }

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        stream: true,
        messages: [
          {
            role: "system",
            content: `You are a professional hotel concierge translator. Translate from ${from} to ${to}. Provide ONLY the translated text.`
          },
          { role: "user", content: text }
        ]
      })
    });

    if (!response.body) return;
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let isChinese = to.toLowerCase().includes('chinese');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            const data = JSON.parse(line.slice(6));
            let content = data.choices[0]?.delta?.content || "";
            if (content) {
              if (isChinese) content = converter(content);
              onChunk(content);
            }
          } catch (e) {
            // Partial JSON or other error
          }
        }
      }
    }
  } catch (error) {
    console.error("DeepSeek Stream error:", error);
    onChunk("\n[Error during translation]");
  }
};

/**
 * Translates text using DeepSeek-V3 API (Batch).
 */
export const translateText = async (text: string, from: string, to: string): Promise<string> => {
  if (!DEEPSEEK_API_KEY) return "DeepSeek API key is missing.";

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `You are a professional hotel concierge translator. Translate from ${from} to ${to}. Provide ONLY the translated text. Use Simplified Chinese if target is Chinese.`
          },
          { role: "user", content: text }
        ]
      })
    });

    const data = await response.json();
    let translated = data.choices?.[0]?.message?.content?.trim() || "Translation failed.";
    if (to.toLowerCase().includes('chinese')) translated = converter(translated);
    return translated;
  } catch (error) {
    console.error("DeepSeek error:", error);
    return "Error during translation.";
  }
};

/**
 * iFlytek Real-time ASR (IAT)
 */
export class DomesticASR {
  private socket: WebSocket | null = null;
  private onResult: (text: string) => void;
  private status: number = 0; // 0: first, 1: middle, 2: last
  private langCode: string = 'zh';
  private segments: string[] = []; // Store stabilized and rolling segments

  constructor(onResult: (text: string) => void) {
    this.onResult = onResult;
  }

  async start(langCode: string) {
    this.langCode = langCode;
    this.status = 0;
    this.segments = []; 
    const url = await getWebsocketUrl('wss://iat-api.xfyun.cn/v2/iat', IFLYTEK_API_KEY, IFLYTEK_API_SECRET);
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log("iFlytek ASR Connected");
    };

    this.socket.onmessage = (e) => {
      const resp = JSON.parse(e.data);
      if (resp.code !== 0) {
        console.error("ASR Error:", resp.message);
        return;
      }
      if (resp.data && resp.data.result) {
        const result = resp.data.result;
        let text = "";
        result.ws.forEach((w: any) => {
          w.cw.forEach((c: any) => { text += c.w; });
        });
        
        if (result.pgs === 'apd') {
          this.segments.push(text);
        } else if (result.pgs === 'rpl') {
          const [start, end] = result.rg;
          this.segments.splice(start - 1, end - start + 1, text);
        } else {
          // Standard case: just append if not using wpgs properly, 
          // but we expect pgs to be present
          this.segments.push(text);
        }
        
        this.onResult(this.segments.join(''));
      }
    };

    this.socket.onerror = (e) => console.error("ASR WebSocket Error", e);
    this.socket.onclose = () => console.log("ASR Connection Closed");
  }

  sendAudio(data: Uint8Array) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    const frame = {
      common: this.status === 0 ? { app_id: IFLYTEK_APP_ID } : undefined,
      business: this.status === 0 ? {
        language: this.langCode === 'en' ? "en_us" : "zh_cn",
        domain: "iat",
        accent: "mandarin",
        vad_eos: 1000, // End of speech detection timeout (ms)
        dwa: "wpgs"    // Write Pre-Generated Stream for faster partials
      } : undefined,
      data: {
        status: this.status,
        format: "audio/L16;rate=16000",
        encoding: "raw",
        audio: btoa(String.fromCharCode(...data))
      }
    };

    this.socket.send(JSON.stringify(frame));
    this.status = 1;
  }

  stop() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ data: { status: 2, audio: "", format: "audio/L16;rate=16000", encoding: "raw" } }));
      this.status = 2;
    }
    setTimeout(() => {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
    }, 500);
  }
}

/**
 * iFlytek Online TTS
 */
export const generateSpeech = async (text: string, language: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const url = await getWebsocketUrl('wss://tts-api.xfyun.cn/v2/tts', IFLYTEK_API_KEY, IFLYTEK_API_SECRET);
    const socket = new WebSocket(url);
    let audioData = "";

    socket.onopen = () => {
      const frame = {
        common: { app_id: IFLYTEK_APP_ID },
        business: {
          aue: "raw",
          auf: "audio/L16;rate=16000",
          vcn: language.toLowerCase().includes('english') ? "catherine" : "xiaoyan",
          tte: "UTF8"
        },
        data: {
          status: 2,
          text: btoa(unescape(encodeURIComponent(text)))
        }
      };
      socket.send(JSON.stringify(frame));
    };

    socket.onmessage = (e) => {
      const resp = JSON.parse(e.data);
      if (resp.code !== 0) {
        console.error("TTS Error:", resp.message);
        socket.close();
        reject(resp.message);
        return;
      }
      audioData += resp.data.audio;
      if (resp.data.status === 2) {
        socket.close();
        resolve(audioData);
      }
    };

    socket.onerror = (e) => reject(e);
  });
};

export const encode = (bytes: Uint8Array) => {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const playPCM = async (base64Data: string) => {
  if (!base64Data) return;
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
  
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  const dataInt16 = new Int16Array(bytes.buffer);
  const buffer = audioContext.createBuffer(1, dataInt16.length, 16000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }

  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();
};
