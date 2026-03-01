# ⚙️ React Native — Installation & Setup

> A step-by-step guide to setting up your React Native development environment using **Expo** on Windows.

---

## 🛠️ Initial Setup

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine

### Create a New Expo Project

```bash
npx create-expo-app@latest --template default@next
```

When prompted, **enter your project name** and let Expo scaffold everything for you.

---

## 📺 How to View & Test Your App

You have two options: run on a **real Android device** or use the **Android Studio Emulator**.

---

### Step 1 — Install Android Studio

Download **Android Studio** (Windows) or **Xcode** (Mac) and follow the official Expo guide:

📖 [Expo Android Studio Emulator Setup](https://docs.expo.dev/workflow/android-studio-emulator/)

---

### Step 2 — Install Java Development Kit (JDK)

Open **PowerShell as Administrator** and run:

```powershell
choco install -y microsoft-openjdk17
```

> ⚠️ You'll need [Chocolatey](https://chocolatey.org/) installed for this command to work.

---

### Step 3 — Configure SDK in Android Studio

Inside Android Studio, go to **More Actions → SDK Manager** and install the following:

**SDK Platforms:**

![SDK Platforms](image-1.png)

**SDK Tools:**

![SDK Tools](image-2.png)

---

### Step 4 — Set Environment Variables

1. Open: `Control Panel → User Accounts → User Accounts → Change my environment variables`
2. Click **New** to create a new user variable:

| Variable Name | Value |
|---|---|
| `ANDROID_HOME` | Path to your Android SDK folder |

**How to find your SDK path:**

![SDK Path](image-3.png)

---

## ▶️ Running the App

### On a Real Android Phone

```bash
cd your-project-name
npx expo start
```

- Install **Expo Go** from the Play Store on your phone.
- Scan the **QR code** displayed in the terminal.

---

### On Android Studio Emulator

```bash
cd your-project-name
npx expo start
```

1. In Android Studio → **More Actions → Virtual Device Manager → Start** your AVD.
2. Back in your terminal / VS Code, press **`a`** to launch the app on the emulator.
3. **BOOM!** 🎉 Your app is live.

---

## 🧪 Our Real-World Issue & Fix

While building the **BeReal Clone** with **Expo + Supabase**, we hit two problems that are useful to remember:

### 1. Supabase Auth + AsyncStorage error

- **Symptom**: On the Android emulator, the app logged  
  `AsyncStorageError: Native module is null, cannot access legacy storage` and signup failed.
- **Cause**: `@supabase/supabase-js` uses the storage you pass in (`auth.storage`) to keep the auth session. In Expo/React Native, we passed `@react-native-async-storage/async-storage`, but on some dev builds / emulators the **native AsyncStorage module wasn’t available**, so every access crashed.
- **Fix**: We kept using `AsyncStorage` as the storage implementation, but wrapped it in a tiny adapter that:
  - Tries `AsyncStorage.getItem / setItem / removeItem` first.
  - If the native module throws (e.g. on an emulator / Expo Go), it falls back to an in-memory store so Supabase Auth can still sign users up without crashing.

> **Takeaway**: When wiring Supabase Auth in a React Native + Expo app, always think about **where sessions are stored** and handle the case where the AsyncStorage native module might not be ready in development.

### 2. `npx expo run:android` failing with “Unable to delete directory”

- **Symptom**: `npx expo run:android` failed on Windows with errors like:  
  `Execution failed for task '...:generateDebugResValues'. Unable to delete directory ...\android\build\generated\res\resValues\debug`
- **Cause**: Gradle was trying to clean `android/build` folders inside `node_modules`, but Windows (plus **OneDrive sync** and parallel Gradle tasks) was locking some of those directories.
- **Fix**:
  - Stopped Gradle daemons: `cd android && gradlew.bat --stop`.
  - Manually deleted `android\build` and the `android\build` folders inside the affected `node_modules\...` packages.
  - In `android/gradle.properties`, disabled parallel builds to reduce file-lock issues:
    - `org.gradle.parallel=false`
    - `org.gradle.workers.max=1`
  - Re-ran `npx expo run:android`, which then completed successfully.

> **Extra tip**: For fewer Windows file-lock issues, prefer placing projects **outside OneDrive**, e.g. `C:\dev\my-app`, before running native builds.

---

*You're all set — start building something amazing! 🚀*