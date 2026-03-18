
import { Language } from './types';

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: 'https://flagcdn.com/w40/us.png' },
  { code: 'zh', name: 'Simplified Chinese', flag: 'https://flagcdn.com/w40/cn.png' },
  { code: 'ja', name: 'Japanese', flag: 'https://flagcdn.com/w40/jp.png' },
  { code: 'ko', name: 'Korean', flag: 'https://flagcdn.com/w40/kr.png' },
  { code: 'th', name: 'Thai', flag: 'https://flagcdn.com/w40/th.png' },
  { code: 'vi', name: 'Vietnamese', flag: 'https://flagcdn.com/w40/vn.png' },
  { code: 'id', name: 'Indonesian', flag: 'https://flagcdn.com/w40/id.png' },
  { code: 'ms', name: 'Malay', flag: 'https://flagcdn.com/w40/my.png' },
  { code: 'es', name: 'Spanish', flag: 'https://flagcdn.com/w40/es.png' },
  { code: 'fr', name: 'French', flag: 'https://flagcdn.com/w40/fr.png' },
  { code: 'de', name: 'German', flag: 'https://flagcdn.com/w40/de.png' },
];

export const INITIAL_INPUT = "Welcome to our hotel. I would like to help you with your luggage and show you to your executive suite on the top floor.";
export const INITIAL_TRANSLATION = "欢迎来到我们的酒店。我想帮您拿行李，并带您前往顶层的行政套房。";

export const UI_STRINGS: Record<string, any> = {
  en: { 
    title: "AI Translator", solo: "Solo", bridge: "Bridge", from: "From", to: "To", 
    selectLang: "Select Language", placeholder: "Speak or type...", 
    listening: "Listening...", waiting: "Waiting...", preparing: "Preparing...", 
    live: "Live", tapMic: "Tap Mic", tapMicToSpeak: "Tap Mic to Speak", back: "Back",
    noInput: "No voice input was detected."
  },
  zh: { 
    title: "AI 翻译官", solo: "个人模式", bridge: "对等模式", from: "源语言", to: "目标语言", 
    selectLang: "选择语言", placeholder: "点击麦克风或输入...", 
    listening: "正在聆听...", waiting: "等待中...", preparing: "准备中...", 
    live: "直播中", tapMic: "点击录音", tapMicToSpeak: "点击麦克风开始说话", back: "返回",
    noInput: "未检测到语音输入。"
  },
  ja: { 
    title: "AI 翻訳機", solo: "ソロ", bridge: "ブリッジ", from: "から", to: "まで", 
    selectLang: "言語を選択", placeholder: "話すか入力する...", 
    listening: "聴いています...", waiting: "待機中...", preparing: "準備中...", 
    live: "ライブ", tapMic: "マイクをタップ", tapMicToSpeak: "マイクをタップして話す", back: "戻る",
    noInput: "音声入力が検出されませんでした。"
  },
  ko: { 
    title: "AI 번역기", solo: "솔로", bridge: "브리지", from: "부터", to: "까지", 
    selectLang: "언여 선택", placeholder: "말하거나 입력하세요...", 
    listening: "듣고 있습니다...", waiting: "대기 중...", preparing: "준비 중...", 
    live: "라이브", tapMic: "마이크 누르기", tapMicToSpeak: "마이크를 눌러 말하기", back: "뒤로",
    noInput: "음성 입력이 감지되지 않았습니다."
  },
  th: { 
    title: "เครื่องแปลภาษา AI", solo: "เดี่ยว", bridge: "ร่วม", from: "จาก", to: "ถึง", 
    selectLang: "เลือกภาษา", placeholder: "พูดหรือพิมพ์...", 
    listening: "กำลังฟัง...", waiting: "กำลังรอ...", preparing: "กำลังเตรียม...", 
    live: "สด", tapMic: "แตะไมค์", tapMicToSpeak: "แตะไมค์เพื่อพูด", back: "กลับ",
    noInput: "ไม่พบการป้อนข้อมูลด้วยเสียง"
  },
  vi: { 
    title: "Trình thông dịch AI", solo: "Đơn", bridge: "Cầu nối", from: "Từ", to: "Đến", 
    selectLang: "Chọn ngôn ngữ", placeholder: "Nói hoặc nhập...", 
    listening: "Đang nghe...", waiting: "Đang chờ...", preparing: "Đang chuẩn bị...", 
    live: "Trực tiếp", tapMic: "Chạm mic", tapMicToSpeak: "Chạm mic để nói", back: "Quay lại",
    noInput: "Không phát hiện thấy đầu vào giọng nói."
  },
  id: { 
    title: "Penerjemah AI", solo: "Solo", bridge: "Bridge", from: "Dari", to: "Ke", 
    selectLang: "Pilih Bahasa", placeholder: "Bicara atau ketik...", 
    listening: "Mendengarkan...", waiting: "Menunggu...", preparing: "Menyiapkan...", 
    live: "Langsung", tapMic: "Ketuk Mik", tapMicToSpeak: "Ketuk mik untuk bicara", back: "Kembali",
    noInput: "Masukan suara tidak terdeteksi."
  },
  ms: { 
    title: "Penterjemah AI", solo: "Solo", bridge: "Bridge", from: "Dari", to: "Ke", 
    selectLang: "Pilih Bahasa", placeholder: "Cakap atau taip...", 
    listening: "Mendengar...", waiting: "Menunggu...", preparing: "Menyediakan...", 
    live: "Langsung", tapMic: "Ketik Mik", tapMicToSpeak: "Ketik mik untuk bercakap", back: "Kembali",
    noInput: "Tiada input suara dikesan."
  },
  es: { 
    title: "Traductor AI", solo: "Solo", bridge: "Puente", from: "De", to: "A", 
    selectLang: "Seleccionar Idioma", placeholder: "Habla o escribe...", 
    listening: "Escuchando...", waiting: "Esperando...", preparing: "Preparando...", 
    live: "En vivo", tapMic: "Tocar Mic", tapMicToSpeak: "Toca el micro para hablar", back: "Volver",
    noInput: "No se detectó entrada de voz."
  },
  fr: { 
    title: "Traducteur AI", solo: "Solo", bridge: "Pont", from: "De", to: "À", 
    selectLang: "Choisir la langue", placeholder: "Parlez ou tapez...", 
    listening: "Écoute...", waiting: "En attente...", preparing: "Préparation...", 
    live: "En direct", tapMic: "Appuyez Mic", tapMicToSpeak: "Appuyez sur le micro pour parler", back: "Retour",
    noInput: "Aucune entrée vocale n'a été détectée."
  },
  de: { 
    title: "AI Übersetzer", solo: "Solo", bridge: "Brücke", from: "Von", to: "An", 
    selectLang: "Sprache wählen", placeholder: "Sprechen oder tippen...", 
    listening: "Hören...", waiting: "Warten...", preparing: "Vorbereiten...", 
    live: "Live", tapMic: "Mikro tippen", tapMicToSpeak: "Mikrofon zum Sprechen tippen", back: "Zurück",
    noInput: "Es wurde keine Spracheingabe erkannt."
  }
};

export const LANGUAGE_LOCAL_NAMES: Record<string, Record<string, string>> = {
  en: { en: "English", zh: "Simplified Chinese", ja: "Japanese", ko: "Korean", th: "Thai", vi: "Vietnamese", id: "Indonesian", ms: "Malay", es: "Spanish", fr: "French", de: "German" },
  zh: { en: "英语", zh: "简体中文", ja: "日语", ko: "韩语", th: "泰语", vi: "越南语", id: "印尼语", ms: "马来语", es: "西班牙语", fr: "法语", de: "德语" },
  ja: { en: "英語", zh: "簡体字中国語", ja: "日本語", ko: "韓国語", th: "タイ語", vi: "ベトナム語", id: "インドネシア語", ms: "マレー語", es: "スペイン語", fr: "フランス語", de: "ドイツ語" },
  ko: { en: "영어", zh: "중국어 간체", ja: "일본어", ko: "한국어", th: "태국어", vi: "베트남어", id: "인도네시아어", ms: "말레이어", es: "스페인어", fr: "프랑스어", de: "독일어" },
  th: { en: "อังกฤษ", zh: "จีนตัวย่อ", ja: "ญี่ปุ่น", ko: "เกาหลี", th: "ไทย", vi: "เวียดนาม", id: "อินโดนีเซีย", ms: "มลายู", es: "สเปน", fr: "ฝรั่งเศส", de: "เยอรมัน" },
  vi: { en: "Tiếng Anh", zh: "Tiếng Trung Giản thể", ja: "Tiếng Nhật", ko: "Tiếng Hàn", th: "Tiếng Thái", vi: "Tiếng Việt", id: "Tiếng Indonesia", ms: "Tiếng Mã Lai", es: "Tiếng Tây Ban Nha", fr: "Tiếng Pháp", de: "Tiếng Đức" },
  id: { en: "Inggris", zh: "Tionghoa Sederhana", ja: "Jepang", ko: "Korea", th: "Thai", vi: "Vietnam", id: "Bahasa Indonesia", ms: "Melayu", es: "Spanyol", fr: "Prancis", de: "Jerman" },
  ms: { en: "Inggeris", zh: "Cina Ringkas", ja: "Jepun", ko: "Korea", th: "Thai", vi: "Vietnam", id: "Bahasa Indonesia", ms: "Melayu", es: "Sepanyol", fr: "Perancis", de: "Jerman" },
  es: { en: "Inglés", zh: "Chino simplificado", ja: "Japonés", ko: "Coreano", th: "Tailandés", vi: "Vietnamita", id: "Indonesio", ms: "Malayo", es: "Español", fr: "Francés", de: "Alemán" },
  fr: { en: "Anglais", zh: "Chinois simplifié", ja: "Japonais", ko: "Coréen", th: "Thaï", vi: "Vietnamien", id: "Indonésien", ms: "Malais", es: "Espagnol", fr: "Français", de: "Allemand" },
  de: { en: "Englisch", zh: "Vereinfachtes Chinesisch", ja: "Japanisch", ko: "Koreanisch", th: "Thailändisch", vi: "Vietnamesisch", id: "Indonesisch", ms: "Malaiisch", es: "Spanisch", fr: "Französisch", de: "Deutsch" }
};
