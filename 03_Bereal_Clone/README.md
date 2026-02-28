# BeReal Clone – React Native / Expo App

Modern BeReal-style social app built with **React Native**, **Expo**, and **expo-router**.  
This project is focused on **learning real-world mobile patterns**: authentication flows, tab navigation, safe areas, and clean UI with reusable styles.

---

## ✨ Features at a Glance

- **Authentication flow**
  - Dedicated `(auth)` route group with separate `login` and `signup` screens
  - Redirect logic using `useEffect` and `router.replace` to move between auth and main app

- **Tabbed application shell**
  - `(tabs)` route group for the main app experience
  - Centralized stack configuration in `_layout.tsx` (animations, header styles, etc.)

- **Polished UI & layout**
  - `SafeAreaView` to respect notches and system bars
  - Reusable `StyleSheet` styles for inputs, buttons, and layout
  - Color-tuned backgrounds and text for a clean, modern look

---

## 🗂 Project Structure (High Level)

The most important files in `src/app`:

- `src/app/_layout.tsx`  
  Root stack layout. Defines global `Stack` options and decides whether to send the user to auth or tabs using `useEffect` + `router.replace`.

- `src/app/(auth)/_layout.tsx`  
  Layout for all auth screens (login, signup). You can configure header options here if needed.

- `src/app/(auth)/login.tsx`  
  Login screen with:
  - Email + password inputs (`TextInput`)
  - `secureTextEntry` for hiding the password
  - Styled button and link to navigate to signup

- `src/app/(auth)/signup.tsx`  
  Signup UI (similar structure to login) for registering a new account.

- `src/app/(tabs)/_layout.tsx`  
  Tab navigator layout. Controls how the main app tabs are rendered.

- `src/app/(tabs)/index.tsx`  
  Example screen inside the tabs group (home / feed / placeholder content).

---

## 🔁 Navigation & Flow Explained

### 1. Auth vs. Main App

In `src/app/_layout.tsx`, we keep a simple `isAuth` flag (you can later replace this with real auth state from a store or backend).  
Inside a `useEffect`, we check that flag:

- If the user is **not authenticated** → `router.replace("/(auth)/login")`
- If the user **is authenticated** → `router.replace("/(tabs)/about")` (or any main tab route)

This pattern mimics a **splash / gatekeeper** that decides where users should go when the app loads.

### 2. Stack & Animations

The root `Stack` (in `_layout.tsx`) uses `screenOptions` to control:

- `headerShown`
- `headerStyle` and `headerTintColor`
- `animation: "slide_from_right"` for a smooth screen transition

Expo Router’s typed `animation` prop only accepts specific values like `"default"`, `"fade"`, `"slide_from_right"`, etc., which is why we use `"slide_from_right"` instead of an invalid string.

---

## 🎨 UI Details You Should Know

- **Safe areas**  
  `SafeAreaView` (from `react-native-safe-area-context`) wraps top-level screens so content doesn’t collide with notches or system UI.

- **Form styling**  
  Inputs use a light `backgroundColor`, rounded corners, and padding for a friendly form experience:
  - `backgroundColor: "#f5f5f5"`
  - `borderRadius: 12`
  - `padding: 16`

- **Buttons and links**  
  Primary buttons and “Don’t have an account? Sign up” links are styled with spacing and clear visual hierarchy.

---

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

2. **Start the Expo dev server**
   ```bash
   npx expo start
   ```

3. **Run the app**
   - Press **a** for Android emulator
   - Press **i** for iOS simulator (macOS)
   - Or scan the QR code with **Expo Go** on your device

---

## 🧠 What You Learn from This Project

- How to structure **auth vs main app** using Expo Router route groups
- How to programmatically **redirect with `router.replace`**
- How to configure **stack navigation** and **screen animations**
- How to build **simple, clean forms** with `TextInput` and `StyleSheet`
- How to use **safe areas** to make a UI feel native and polished

---

## 📌 Next Steps / Ideas

- Connect real backend auth (Supabase, Firebase, or your own API)
- Add image capture / upload to mimic real BeReal behavior
- Implement user profiles and a basic feed
- Add theming (light/dark) and more refined design details

---

If you’re reading this to “know what’s going on,” this README is your map: it tells you **what the app does**, **how the navigation is wired**, and **where to look in the code** to keep building. Have fun extending it! 🎉