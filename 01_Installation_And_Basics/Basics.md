# 📱 React Native — Basics

> A quick-reference guide to understanding the Expo project structure and core React Native components.

---

## 📁 Project Structure

| File / Folder | Purpose |
|---|---|
| `tsconfig.json` | TypeScript configuration — just like in a standard React project |
| `package.json` | Lists and manages all project libraries and dependencies |
| `app.json` | App-level config — favicon, version info, build outputs |
| `assets/` | Store all images, fonts, and static media files here |
| `node_modules/` | Auto-generated folder containing all installed packages |
| `scripts/` | Utility scripts, including the project reset script |
| `components/` | Reusable UI pieces — buttons, cards, modals, etc. |
| `constants/` | App-wide constants such as theme colors and typography |
| `hooks/` | Custom React hooks for shared stateful logic |

> 💡 **Expo** uses a **file-based routing system** — each file inside the `app/` directory automatically becomes a route.

---

## 🚀 First-Time Experiences

Getting familiar with the default Expo project layout:

1. **`index.tsx`** — The very first screen displayed to the user on app launch.
2. **`explore.tsx`** — The second tab / navigation screen shown in the default template.
3. **`_layout.tsx`** — Controls how screens are arranged; defines the navbar, navigation structure, and overall layout.
4. **`app/(tabs)/`** — The directory that defines tab-based navigation in the app.
5. **Reset the project** — To wipe the default template and start fresh:
   ```bash
   cd your-project-name
   npm run reset-project
   ```

---

## 🧩 Core Components

React Native uses its own set of built-in components instead of HTML elements.

### `<View>`
Works like a `<div>` in web development — used for layout and grouping elements.

```tsx
<View style={{ flex: 1, alignItems: 'center' }}>
  {/* child components go here */}
</View>
```

---

### `<Text>`
All visible text **must** be wrapped inside a `<Text>` tag.

```tsx
<Text style={{ fontSize: 18, fontWeight: 'bold' }}>
  Hello, React Native!
</Text>
```

---

### Styling
React Native uses JavaScript-based styles via `StyleSheet.create()`.

![Styling Example](image-4.png)

```tsx
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

---

### `<Image>` (via Expo)
Use the `expo-image` package for optimized image rendering.

```tsx
import { Image } from 'expo-image';

<Image
  source={{
    uri: 'https://i0.wp.com/www.dogwonder.co.uk/wp-content/uploads/2009/12/tumblr_ku2pvuJkJG1qz9qooo1_r1_400.gif?resize=320%2C320',
  }}
  style={{ width: 200, height: 200 }}
/>
```

---

*Happy coding! 🎉*