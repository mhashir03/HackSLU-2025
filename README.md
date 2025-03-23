# Ozzy

## Voice Assistance for Enhanced Communication

Ozzy is a mobile application designed to help users with speech difficulties communicate more effectively. The app uses advanced speech recognition and AI technology to clarify spoken words, making verbal communication more accessible for everyone.

**Website:** [www.useozzy.com](https://www.useozzy.com)

![Ozzy App](assets/app-preview.png)

## 🏆 HackSLU 2025 Submission

### Problem Statement
**How can we leverage technology to improve healthcare access, quality, and affordability for all?**

### Track
**Assistive Technology for Disabilities:** Build tools or devices that enhance the independence and quality of life for individuals with physical or cognitive disabilities.

## 🌟 Why Ozzy?

### The Problem

Many individuals face communication challenges due to speech impediments, neurological conditions, or language barriers. These challenges can lead to:

- Frustration during everyday conversations
- Social isolation
- Reduced independence
- Decreased quality of life

### Our Solution

Ozzy serves as a real-time communication assistant that:

1. Captures speech through advanced audio recording
2. Processes and clarifies speech using OpenAI's Whisper API
3. Provides clear, audible playback using text-to-speech
4. Enhances clarity for individuals with speech difficulties

By bridging the gap between spoken words and clear communication, Ozzy empowers users to express themselves confidently and be better understood.

## ✨ Key Features

- **Speech Recognition & Clarification**: Convert speech to text with special handling for slurred or unclear speech
- **Text-to-Speech Playback**: High-quality voice synthesis for clear communication
- **Multiple Language Support**: Use in various languages to assist diverse users
- **Accessibility-First Design**: Intuitive interface designed for users of all abilities
- **Dark/Light Mode**: Comfortable viewing in any environment
- **Real-time Processing**: Quick turnaround from speech to enhanced output

## 🛠️ Technologies Used

- React Native & Expo for cross-platform mobile development
- OpenAI Whisper API for advanced speech recognition
- Expo AV for audio recording and playback
- Expo Speech for text-to-speech functionality
- React Navigation for seamless app navigation
- Adaptive theming with context API

## 📱 Screens

- **Home**: Welcome screen and introduction to the app's features
- **Speech**: Core speech recording, recognition, and playback interface
- **Settings**: User preferences including theme selection and language options

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI
- iOS/Android device or emulator
- OpenAI API key (for speech recognition)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ozzy.git
   cd ozzy
   ```

2. Install dependencies:
   ```
   cd frontend/HackSLU-2025
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the frontend/HackSLU-2025 directory with:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server:
   ```
   npx expo start
   ```

5. Open on your device:
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press 'i' for iOS simulator or 'a' for Android emulator

## 🤝 Contributing

We welcome contributions to improve Ozzy! Whether it's bug fixes, feature enhancements, or documentation improvements, your help is appreciated.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

Developed during HackSLU 2025 by a passionate team dedicated to making communication accessible for everyone.

---

*Ozzy - Empowering clear communication for all.*

Visit us at [www.useozzy.com](https://www.useozzy.com)
