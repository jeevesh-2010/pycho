# 📱 ZenDaily — Android Daily Check-in & Q&A

[![Download Android APK](https://img.shields.io/badge/Download-Android%20APK-34A853?style=for-the-badge&logo=android&logoColor=white)](https://github.com/jeevesh-2010/pycho/releases/latest/download/zendaily-android.apk)
[![GitHub Releases](https://img.shields.io/badge/GitHub-Releases-1a73e8?style=for-the-badge&logo=github&logoColor=white)](https://github.com/jeevesh-2010/pycho/releases)

> 📥 **Direct Android Download**: [**Download zendaily-android.apk**](https://github.com/jeevesh-2010/pycho/releases/latest/download/zendaily-android.apk)  
> You can download the `.apk` file directly on your Android phone and install it with one tap. Or open the web app in Chrome and tap **Add to Home screen** for instant WebAPK installation.

---

## 📱 Native Android Material Design 3 Features

- **Material You Dynamic Tonal Surface System**: Tonal surface containers (`Surface Container Low/High/Highest`) with soft pastel accents and authentic contrast.
- **Android M3 NavigationBar**: Native 80px bottom navigation bar with active horizontal pill indicators for ergonomic thumb reach on mobile.
- **Android M3 Extended FAB**: Prominent pill action button with elevation and tactile ripple touch response.
- **Android M3 Outlined Text Fields**: Smooth auto-resizing text fields with 16px corner radius, focused primary borders, and subtle helper hints.
- **Android M3 Filter Chips**: Horizontal rounded chips with checkmark indicators for date ranges.
- **Android M3 Cards**: Generous 24px/28px rounded surface containers that keep each submission distinct and isolated.
- **Material 3 Snackbars**: Android-native floating notification pills with quick dismiss.
- **Adaptive Light & Dark Theme**: Supports both Android M3 Light and Dark palettes.

---

## ⚡ Core Functionality

### 1. Quick Answer Screen (Home)
- Immediately presents the active list of reflection questions upon opening.
- Clean, distraction-free inputs with live word count.
- **Autosave Draft**: Your typed answers are safely cached locally in real time so you never lose your thoughts if you switch apps or lock your phone.
- Single prominent **Submit Daily Check-in** button with keyboard shortcut (`Ctrl+Enter` / `⌘+Enter`).
- Calming post-submission confirmation with celebratory confetti.

### 2. Separate Submission History (Dashboard)
- Saves each submission as one **distinct, self-contained record** stamped with the exact date and timestamp (e.g., `Today • 5:15 PM` / `Wednesday, Nov 18, 2026 • 5:15:10 PM`).
- **No Aggregated Charts**: Past check-ins are displayed strictly as individual cards in reverse chronological order—never clustered or merged into Google Forms charts.
- **Two-Column Grid or Focused Single-Column Layout**: Clean responsive layout on desktop; streamlined feed on mobile.
- **Instant Search**: Search through answers and question prompts simultaneously.
- **M3 Date Filter Chips**: Filter by `All`, `Today`, `Yesterday`, `Past 7 Days`, `Past 30 Days`, or pick a `Custom Date`.
- **Export Options**: Export any entry or your entire journal to **Markdown (.md)**, **Full JSON Backup**, or **Spreadsheet (.csv)**.

### 3. Custom Question Manager
- Add new custom questions with titles, helper hints, and mandatory/optional toggles.
- Reorder questions using up/down arrow buttons with instantaneous position updates.
- In-place editing and archive/restore toggle (archived questions are hidden from new check-ins while preserving historical answers).
- Curated **Preset Templates**: 1-click loading for *Daily Reflection*, *Agile Standup*, *Mindfulness & Wellbeing*, and *Evening Decompression*.

### 4. Cross-Device Real-Time Sync & Simple Auth
- **Real-Time WebSockets**: Powered by Supabase PostgreSQL Changes. When you submit answers on your Android phone, they appear instantly on your laptop without refreshing!
- **Local Multi-Tab Broadcast**: Uses the browser `BroadcastChannel` API so you can also test real-time sync across two browser tabs locally without credentials.
- **Simple Authentication**: Sign in or create an account with email and password so your check-in journal is private and synced across all your devices.
- **Turnkey Setup**: Includes a 1-click SQL schema (`supabase_schema.sql`) ready to paste into Supabase.

---

## 🚀 Getting Started

### 1. Install & Run Locally

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Test on Your Phone
On the same Wi-Fi network, open the Network URL displayed by Vite (e.g., `http://192.168.1.36:5173`) in Chrome or your mobile browser.

---

## ☁️ Supabase Cloud Database Setup (Optional)

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Paste the contents of `supabase_schema.sql` and click **Run**.
4. In ZenDaily, tap the **Cloud Sync** chip in the top bar or settings, enter your **Project URL** and **Anon Public Key**, and click **Save & Connect**.
5. Create an account or sign in to sync your check-ins across your phone, tablet, and desktop!
