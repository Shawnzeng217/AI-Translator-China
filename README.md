# Hilton Travel AI Translator (China Local Hub)

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

This is a customized version of the AI Translator, specifically optimized for the China region by replacing Google Gemini with domestic AI services for better performance and accessibility.

## 🚀 Key Features (China Optimized)

- **Translation**: Powered by **DeepSeek-V3** for high-quality, cost-effective translations.
- **ASR (Speech-to-Text)**: Powered by **iFlytek (讯飞) Spark/IAT** for real-time, low-latency Chinese and English transcription.
- **TTS (Text-to-Speech)**: Powered by **iFlytek (讯飞) Online TTS** with dedicated domestic voices.
- **Modes**:
  - **Solo Mode**: Real-time bilingual transcription and translation for individual use.
  - **Bridge Mode**: Split-screen interface for face-to-face concierge/guest interaction.

## 🛠 Prerequisites

- **Node.js** (v18 or higher recommended)
- **API Keys**:
  - DeepSeek API Key
  - iFlytek APPID, APIKey, and APISecret

## 📦 Setup & Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Shawnzeng217/AI-Translator-China.git
    cd AI-Translator-China
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in the root directory (do **NOT** share this file):
    ```env
    VITE_DEEPSEEK_API_KEY=your_deepseek_key
    VITE_IFLYTEK_APP_ID=your_iflytek_appid
    VITE_IFLYTEK_API_KEY=your_iflytek_apikey
    VITE_IFLYTEK_API_SECRET=your_iflytek_apisecret
    ```

4.  **Run Locally**:
    ```bash
    npm run dev
    ```

## 🛡️ Security Note

API keys are managed via the `.env` file and are excluded from version control via `.gitignore`. For production deployments, it is recommended to use a backend proxy or environment secrets.

---
*Created for Hilton China Local Hub.*
