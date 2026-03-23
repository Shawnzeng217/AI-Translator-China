
import { Language } from './types';

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nameEn: 'English', flag: 'https://flagcdn.com/w40/us.png' },
  { code: 'zh', name: '简体中文', nameEn: 'Simplified Chinese', flag: 'https://flagcdn.com/w40/cn.png' },
  { code: 'ja', name: '日本語', nameEn: 'Japanese', flag: 'https://flagcdn.com/w40/jp.png' },
  { code: 'ko', name: '한국어', nameEn: 'Korean', flag: 'https://flagcdn.com/w40/kr.png' },
  { code: 'th', name: 'ไทย', nameEn: 'Thai', flag: 'https://flagcdn.com/w40/th.png' },
  { code: 'vi', name: 'Tiếng Việt', nameEn: 'Vietnamese', flag: 'https://flagcdn.com/w40/vn.png' },
  { code: 'id', name: 'Bahasa Indonesia', nameEn: 'Indonesian', flag: 'https://flagcdn.com/w40/id.png' },
  { code: 'ms', name: 'Bahasa Melayu', nameEn: 'Malay', flag: 'https://flagcdn.com/w40/my.png' },
  { code: 'es', name: 'Español', nameEn: 'Spanish', flag: 'https://flagcdn.com/w40/es.png' },
  { code: 'fr', name: 'Français', nameEn: 'French', flag: 'https://flagcdn.com/w40/fr.png' },
  { code: 'de', name: 'Deutsch', nameEn: 'German', flag: 'https://flagcdn.com/w40/de.png' },
];

export const INITIAL_INPUT = "Welcome to our hotel. I would like to help you with your luggage and show you to your executive suite on the top floor.";
export const INITIAL_TRANSLATION = "欢迎来到我们的酒店。我想帮您拿行李，并带您前往顶层的行政套房。";

export const UI_STRINGS: Record<string, any> = {
  en: { 
    title: "AI Translator", solo: "Solo", bridge: "Dialogue", from: "From", to: "To", 
    selectLang: "Select Language", placeholder: "Speak or type...", 
    listening: "Listening...", waiting: "Waiting...", preparing: "Preparing...", 
    live: "Live", tapMic: "Tap Mic", tapMicToSpeak: "Tap Mic to Speak", back: "Back",
    noInput: "No voice input was detected."
  },
  zh: { 
    title: "AI Translator", solo: "个人模式", bridge: "对话模式", from: "源语言", to: "目标语言", 
    selectLang: "选择语言", placeholder: "点击麦克风或输入...", 
    listening: "正在聆听...", waiting: "等待中...", preparing: "准备中...", 
    live: "直播中", tapMic: "点击录音", tapMicToSpeak: "点击麦克风开始说话", back: "返回",
    noInput: "未检测到语音输入。"
  },
  ja: { 
    title: "AI Translator", solo: "ソロ", bridge: "対話モード", from: "から", to: "まで", 
    selectLang: "言語を選択", placeholder: "話すか入力する...", 
    listening: "聴いています...", waiting: "待機中...", preparing: "準備中...", 
    live: "ライブ", tapMic: "マイクをタップ", tapMicToSpeak: "マイクをタップして話す", back: "戻る",
    noInput: "音声入力が検出されませんでした。"
  },
  ko: { 
    title: "AI Translator", solo: "솔로", bridge: "대화 모드", from: "부터", to: "까지", 
    selectLang: "언여 선택", placeholder: "말하거나 입력하세요...", 
    listening: "듣고 있습니다...", waiting: "대기 중...", preparing: "준비 중...", 
    live: "라이브", tapMic: "마이크 누르기", tapMicToSpeak: "마이크를 눌러 말하기", back: "뒤로",
    noInput: "음성 입력이 감지되지 않았습니다."
  },
  th: { 
    title: "AI Translator", solo: "เดี่ยว", bridge: "โหมดสนทนา", from: "จาก", to: "ถึง", 
    selectLang: "เลือกภาษา", placeholder: "พูดหรือพิมพ์...", 
    listening: "กำลังฟัง...", waiting: "กำลังรอ...", preparing: "กำลังเตรียม...", 
    live: "สด", tapMic: "แตะไมค์", tapMicToSpeak: "แตะไมค์เพื่อพูด", back: "กลับ",
    noInput: "ไม่พบการป้อนข้อมูลด้วยเสียง"
  },
  vi: { 
    title: "AI Translator", solo: "Đơn", bridge: "Hội thoại", from: "Từ", to: "Đến", 
    selectLang: "Chọn ngôn ngữ", placeholder: "Nói hoặc nhập...", 
    listening: "Đang nghe...", waiting: "Đang chờ...", preparing: "Đang chuẩn bị...", 
    live: "Trực tiếp", tapMic: "Chạm mic", tapMicToSpeak: "Chạm mic để nói", back: "Quay lại",
    noInput: "Không phát hiện thấy đầu vào giọng nói."
  },
  id: { 
    title: "AI Translator", solo: "Solo", bridge: "Mode Dialog", from: "Dari", to: "Ke", 
    selectLang: "Pilih Bahasa", placeholder: "Bicara atau ketik...", 
    listening: "Mendengarkan...", waiting: "Menunggu...", preparing: "Menyiapkan...", 
    live: "Langsung", tapMic: "Ketuk Mik", tapMicToSpeak: "Ketuk mik untuk bicara", back: "Kembali",
    noInput: "Masukan suara tidak terdeteksi."
  },
  ms: { 
    title: "AI Translator", solo: "Solo", bridge: "Mod Dialog", from: "Dari", to: "Ke", 
    selectLang: "Pilih Bahasa", placeholder: "Cakap atau taip...", 
    listening: "Mendengar...", waiting: "Menunggu...", preparing: "Menyediakan...", 
    live: "Langsung", tapMic: "Ketik Mik", tapMicToSpeak: "Ketik mik untuk bercakap", back: "Kembali",
    noInput: "Tiada input suara dikesan."
  },
  es: { 
    title: "AI Translator", solo: "Solo", bridge: "Modo Diálogo", from: "De", to: "A", 
    selectLang: "Seleccionar Idioma", placeholder: "Habla o escribe...", 
    listening: "Escuchando...", waiting: "Esperando...", preparing: "Preparando...", 
    live: "En vivo", tapMic: "Tocar Mic", tapMicToSpeak: "Toca el micro para hablar", back: "Volver",
    noInput: "No se detectó entrada de voz."
  },
  fr: { 
    title: "AI Translator", solo: "Solo", bridge: "Mode Dialogue", from: "De", to: "À", 
    selectLang: "Choisir la langue", placeholder: "Parlez ou tapez...", 
    listening: "Écoute...", waiting: "En attente...", preparing: "Préparation...", 
    live: "En direct", tapMic: "Appuyez Mic", tapMicToSpeak: "Appuyez sur le micro pour parler", back: "Retour",
    noInput: "Aucune entrée vocale n'a été détectée."
  },
  de: { 
    title: "AI Translator", solo: "Solo", bridge: "Dialogmodus", from: "Von", to: "An", 
    selectLang: "Sprache wählen", placeholder: "Sprechen oder tippen...", 
    listening: "Hören...", waiting: "Warten...", preparing: "Vorbereiten...", 
    live: "Live", tapMic: "Mikro tippen", tapMicToSpeak: "Mikrofon zum Sprechen tippen", back: "Zurück",
    noInput: "Es wurde keine Spracheingabe erkannt."
  }
};

// Not used for picker anymore, picker uses LANGUAGES[].name which is now native
export const LANGUAGE_LOCAL_NAMES: Record<string, Record<string, string>> = {};
