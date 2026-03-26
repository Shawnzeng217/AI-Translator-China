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
  toCode: string,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
) => {
  if (!DEEPSEEK_API_KEY) {
    onChunk("DeepSeek API key is missing.");
    return;
  }

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
      },
      signal,
      body: JSON.stringify({
        model: "deepseek-chat",
        stream: true,
        messages: [
          {
            role: "system",
            content: `You are a professional, literal translator for a hotel concierge application. 
Your task is to translate the provided text from ${from} to ${to}.

STRICT RULES:
1. Provide ONLY the translated text. 
2. DO NOT answer any questions contained in the text.
3. DO NOT engage in conversation or provide any commentary.
4. If the input is a question, translate the question itself into the target language.
5. Maintain the original tone and meaning precisely.`
          },
          { role: "user", content: text }
        ]
      })
    });

    if (!response.body) return;
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let isChinese = toCode === 'zh';

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
export const translateText = async (text: string, from: string, to: string, toCode: string): Promise<string> => {
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
            content: `You are a professional, literal translator for a hotel concierge application. 
Your task is to translate the provided text from ${from} to ${to}.

STRICT RULES:
1. Provide ONLY the translated text. 
2. DO NOT answer any questions contained in the text.
3. DO NOT engage in conversation or provide any commentary.
4. If the input is a question, translate the question itself into the target language.
5. Maintain the original tone and meaning precisely.
6. Use Simplified Chinese if the target is Chinese.`
          },
          { role: "user", content: text }
        ]
      })
    });

    const data = await response.json();
    let translated = data.choices?.[0]?.message?.content?.trim() || "Translation failed.";
    if (toCode === 'zh') translated = converter(translated);
    return translated;
  } catch (error) {
    console.error("DeepSeek error:", error);
    return "Error during translation.";
  }
};

/**
 * iFlytek Real-time ASR (IAT)
 */
const IFLYTEK_LANG_MAP: Record<string, string> = {
  'en': 'en',
  'zh': 'zh',
  'ja': 'ja',
  'ko': 'ko',
  'th': 'th',
  'vi': 'vi',
  'id': 'id',
  'ms': 'ms',
  'es': 'es',
  'fr': 'fr',
  'de': 'de',
};

const IFLYTEK_VCN_MAP: Record<string, string> = {
  'en': 'catherine',
  'zh': 'xiaoyan',
  'ja': 'nana',
  'ko': 'hana',
  'th': 'th_th', // iFlytek Thai support might vary, using code as fallback if vcn not known
  'vi': 'vi_vn',
  'id': 'id_id',
  'ms': 'ms_my',
  'es': 'lucy',
  'fr': 'mariane',
  'de': 'karl',
};

export class DomesticASR {
  private socket: WebSocket | null = null;
  private onResult: (text: string) => void;
  private onComplete?: () => void;
  private onError?: (message: string, code: number) => void;
  private status: number = 0; // 0: first, 1: middle, 2: last
  private langCode: string = 'zh';
  private results: Map<number, string> = new Map(); // Store results by sequence number (sn)

  constructor(onResult: (text: string) => void, onComplete?: () => void, onError?: (message: string, code: number) => void) {
    this.onResult = onResult;
    this.onComplete = onComplete;
    this.onError = onError;
  }

  async start(langCode: string) {
    this.langCode = langCode;
    this.status = 0;
    this.results.clear();
    const url = await getWebsocketUrl('wss://iat.cn-huabei-1.xf-yun.com/v1', IFLYTEK_API_KEY, IFLYTEK_API_SECRET);
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log("iFlytek ASR Connected");
    };

    this.socket.onmessage = (e) => {
      const resp = JSON.parse(e.data);
      
      // New format uses header.code
      const code = resp.header?.code ?? resp.code; 
      if (code !== 0) {
        const msg = resp.header?.message ?? resp.message;
        console.error(`ASR Error: ${msg} (Code: ${code})`);
        if (this.onError) this.onError(msg, code);
        return;
      }

      if (resp.payload && resp.payload.result) {
        const resultPayload = resp.payload.result;
        try {
          // The 'text' field is base64 encoded JSON (UTF-8)
          const binaryString = atob(resultPayload.text);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const decodedText = new TextDecoder().decode(bytes);
          const resultJson = JSON.parse(decodedText);
          
          let text = "";
          resultJson.ws.forEach((w: any) => {
            w.cw.forEach((c: any) => { text += c.w; });
          });

          const sn = resultJson.sn;
          const pgs = resultJson.pgs; // Check for partial results field

          // iFlytek's wpgs/SLM returns partial results (pgs: apd or rpl)
          // We update the results Map with the latest text for the given sn.
          // In wpgs mode, rpl usually means the text for an existing sn is updated/corrected.
          this.results.set(sn, text);

          if (pgs === 'rpl') {
            // Optional: If rg is present, we could clear intermediate sns if the engine 
            // is replacing a larger range, but usually just updating the current sn is enough.
          }

          // Combine all results in order of sn
          const sortedSns = Array.from(this.results.keys()).sort((a, b) => a - b);
          const fullText = sortedSns.map(key => this.results.get(key)).join('');
          
          this.onResult(fullText);
        } catch (err) {
          console.error("Error parsing ASR result text", err);
        }
      }

      const status = resp.header?.status ?? resp.data?.status;
      if (status === 2) {
        console.log("ASR Server signaled end of input (VAD)");
        if (this.onComplete) this.onComplete();
      }
    };

    this.socket.onerror = (e) => console.error("ASR WebSocket Error", e);
    this.socket.onclose = () => console.log("ASR Connection Closed");
  }

  sendAudio(data: Uint8Array) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    const frame: any = {
      header: {
        app_id: IFLYTEK_APP_ID,
        status: this.status
      },
      payload: {
        audio: {
          encoding: "raw",
          sample_rate: 16000,
          status: this.status,
          audio: btoa(String.fromCharCode(...data))
        }
      }
    };

    if (this.status === 0) {
      frame.parameter = {
        iat: {
          domain: "slm",
          language: "mul_cn",
          accent: "mandarin",
          ln: IFLYTEK_LANG_MAP[this.langCode] || "zh",
          eos: 1000, // Reduced from 1500 to 1000 for even faster synchronization
          dwa: "wpgs",    // Enable Write Pre-Generated Stream for real-time partials
          result: {
            encoding: "utf8",
            compress: "raw",
            format: "json"
          }
        }
      };
    }

    this.socket.send(JSON.stringify(frame));
    this.status = 1;
  }

  stop() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ 
        header: { app_id: IFLYTEK_APP_ID, status: 2 },
        payload: { audio: { status: 2, audio: "", encoding: "raw", sample_rate: 16000 } } 
      }));
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
    const audioChunks: Uint8Array[] = [];

    socket.onopen = () => {
      const frame = {
        common: { app_id: IFLYTEK_APP_ID },
        business: {
        aue: "raw",
        auf: "audio/L16;rate=16000",
        vcn: IFLYTEK_VCN_MAP[language] || "xiaoyan",
        tte: "utf8",
      },
        data: {
          status: 2,
          text: encode(new TextEncoder().encode(text))
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
      if (resp.data && resp.data.audio) {
        const binaryString = atob(resp.data.audio);
        const chunk = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          chunk[i] = binaryString.charCodeAt(i);
        }
        audioChunks.push(chunk);
      }
      
      if (resp.data.status === 2) {
        socket.close();
        // Merge chunks
        const totalLength = audioChunks.reduce((acc, c) => acc + c.length, 0);
        const merged = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of audioChunks) {
          merged.set(chunk, offset);
          offset += chunk.length;
        }
        // Convert back to base64 for playPCM
        resolve(encode(merged));
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
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  const numSamples = Math.floor(len / 2);
  const buffer = audioContext.createBuffer(1, numSamples, 16000);
  const channelData = buffer.getChannelData(0);
  const dataView = new DataView(bytes.buffer);
  
  for (let i = 0; i < numSamples; i++) {
    if (i * 2 + 1 < len) {
      // iFlytek returns Little Endian PCM
      channelData[i] = dataView.getInt16(i * 2, true) / 32768.0;
    }
  }
  
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.onended = () => { 
    audioContext.close(); 
  };
  source.start();
};
