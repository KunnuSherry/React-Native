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

## 🔐 Backend Integration with Supabase

This project uses **Supabase** as the backend for authentication and data storage. Here's how it's set up:

### Installation

All required packages are already included in `package.json`:

```bash
npm install
```

Key packages for backend integration:
- `@supabase/supabase-js` — Supabase client library
- `@react-native-async-storage/async-storage` — Persistent session storage on the device

### Supabase Client Setup

The Supabase client is configured in [src/lib/supabase/client.ts](src/lib/supabase/client.ts):

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,           // Persist sessions locally
    autoRefreshToken: true,          // Auto-refresh expired tokens
    persistSession: true,            // Keep user logged in across app restarts
    detectSessionInUrl: false,       // Not needed for mobile apps
  }
});
```

### Environment Variables

Create a `.env.local` file in the root directory with your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these values in your **Supabase Project Dashboard** → **Settings** → **API**.

---

## 🔑 Authentication Context

The project uses a **custom Auth Context** to manage authentication state globally. This allows any component to access user data and auth methods without prop drilling.

### AuthContext Setup

Located in [src/context/AuthContext.tsx](src/context/AuthContext.tsx):

**Key Features:**
- `useAuth()` hook to access auth state anywhere in the app
- `signUp()` method to register new users with email and password
- `signIn()` method for user login (extensible)
- Typed `User` interface with profile information
- `AuthProvider` wrapper to make auth state available to the entire app

**Usage Example:**

```tsx
import { useAuth } from "@/context/AuthContext";

export default function MyComponent() {
  const { user, signUp } = useAuth();
  
  return (
    <Text>{user?.email}</Text>
  );
}
```

### How Auth Context Works

1. **Provides Context** — Wraps the entire app in `_layout.tsx`
2. **Manages State** — Keeps track of the current user and auth status
3. **Exposes Methods** — Provides `signUp`, `signIn`, and other auth functions
4. **Error Handling** — Throws errors if hooks are used outside the provider

---

## 👤 Authentication Flow

### Sign Up Process

The [src/app/(auth)/signup.tsx](src/app/(auth)/signup.tsx) screen allows users to create a new account:

1. User enters **email** and **password**
2. Input validation ensures fields are filled and password is at least 6 characters
3. `signUp()` is called from AuthContext, which creates a new user in Supabase
4. On successful signup, user is redirected to the **Onboarding screen**
5. If signup fails, an error alert is shown

**Features:**
- Email validation with `keyboardType="email-address"`
- Password hidden with `secureTextEntry`
- Loading indicator while processing
- Link to login for existing users

### Login Process

The [src/app/(auth)/login.tsx](src/app/(auth)/login.tsx) screen (similar to signup):

1. User enters credentials
2. Auth context verifies with Supabase
3. On success, redirects to main app `(tabs)`
4. Session is persisted locally for offline access

---

## 🎯 Onboarding Screen

After signup, users are guided through an **onboarding experience** to complete their profile. Located in [src/app/(auth)/onboarding.tsx](src/app/(auth)/onboarding.tsx):

### Features

1. **Profile Picture Upload**
   - Launch native image picker with `expo-image-picker`
   - Preview selected image
   - Edit badge for quick re-selection

2. **Profile Information**
   - **Full Name** — User's real name (auto-capitalized)
   - **Username** — Unique identifier for the app

3. **Loading State**
   - Activity indicator during profile save
   - Prevents multiple submissions

### Image Picker Implementation

```tsx
const pickImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission Denied", "We need permission to access your photos");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: false,
    quality: 0.8,
  });

  if (!result.canceled && result.assets[0]) {
    setImage(result.assets[0].uri);
  }
};
```

---

## 🗂️ Key Files Reference

| File | Purpose |
|------|---------|
| [src/app/_layout.tsx](src/app/_layout.tsx) | Root layout with auth/tabs routing |
| [src/context/AuthContext.tsx](src/context/AuthContext.tsx) | Global auth state management |
| [src/lib/supabase/client.ts](src/lib/supabase/client.ts) | Supabase SDK configuration |
| [src/app/(auth)/login.tsx](src/app/(auth)/login.tsx) | Login screen |
| [src/app/(auth)/signup.tsx](src/app/(auth)/signup.tsx) | Sign up screen |
| [src/app/(auth)/onboarding.tsx](src/app/(auth)/onboarding.tsx) | Profile completion screen |
| [src/app/(tabs)/_layout.tsx](src/app/(tabs)/_layout.tsx) | Tab navigation layout |

---

## 💡 Architecture Patterns Used

### Route Groups & File-Based Routing

Expo Router uses **route groups** to organize screens:

- `(auth)` — All authentication screens (login, signup, onboarding)
- `(tabs)` — Main app screens with bottom tab navigation

Screens in different groups are isolated and can use different navigation stacks.

### Auth State Persistence

Using Supabase's `autoRefreshToken` and `persistSession`, user sessions survive app restarts:

1. Service worker/refresh token automatically renewed before expiry
2. Session stored securely in AsyncStorage
3. App checks session on startup and redirects appropriately

### Context API for State Management

Instead of prop drilling, we use React Context to share auth state:

```tsx
// Anywhere in the app
const { user, signUp } = useAuth();
```

---

## 🚀 Extended Features to Build

Ready to extend this foundation? Here are proven next steps:

### 1. **Social Feed**
   - Query Supabase database for user posts
   - Implement pagination with `react-native-flatlist`
   - Real-time updates with Supabase subscriptions

### 2. **Image Upload & Storage**
   - Upload profile pictures to Supabase Storage
   - Compress before upload to save bandwidth
   - Display from CDN URL

### 3. **Real-Time Notifications**
   - Supabase Push Notifications
   - Receive alerts when friends post

### 4. **Dark Mode Support**
   - Use `useColorScheme` hook from React Native
   - Toggle between light and dark themes
   - Persist preference in AsyncStorage

### 5. **Offline Support**
   - Cache data locally with SQLite
   - Sync when connection is restored
   - Show "last updated" timestamp

---

## 🐛 Common Issues & Solutions

### "Cannot read property 'user' of undefined"
Make sure your component is wrapped inside `<AuthProvider>`. The provider should be in [src/app/_layout.tsx](src/app/_layout.tsx).

### Session Not Persisting
Verify that:
- `.env.local` has correct Supabase credentials
- AsyncStorage is properly installed
- `persistSession: true` is set in client.ts

### Image Picker Not Working
- Grant camera roll permissions in `app.json`
- Test on a real device (simulator may have permission issues)
- Ensure `expo-image-picker` is installed

---

## 📚 Learning Resources

- [Expo Router Documentation](https://expo.dev/routing)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [React Native Documentation](https://reactnative.dev/)
- [React Native Safe Area Context](https://github.com/th3rdEyeRaven/react-native-safe-area-context)

---

**Master real-world mobile app patterns and deploy to production! 🚀**

---

## 🗓️ Progress Update – Profiles, RLS & Onboarding

This update introduces a **fully integrated profile system** backed by Supabase, including **row-level security (RLS)**, **storage policies for profile images**, and **completed signup/onboarding flows** on the frontend.

### 1️⃣ Supabase `profiles` Table

We created a table named **`public.profiles`** with the following columns:

- **id**: `uuid`, primary key, references `auth.users.id` (1:1 with each authenticated user)
- **created_at**: `timestamp` with default `now()`
- **name**: `text`
- **username**: `text`
- **onboarding_completed**: `boolean`
- **profile_image_url**: `text`

Key points:

- **1:1 link with users**: The `id` column is the same as `auth.users.id`, so every authenticated user has exactly one profile row.
- **Row Level Security enabled**: RLS is turned on to ensure all access is filtered per user.
- **Force RLS**: Even super roles must respect policies, preventing accidental leaks.

```sql
alter table public.profiles enable row level security;
alter table public.profiles force row level security;
```

This guarantees that **all queries, inserts, updates, and selects** against `public.profiles` are governed by explicit security policies.

### 2️⃣ RLS Policies for `profiles`

We defined granular RLS policies to control how authenticated users can interact with profile rows.

```sql
-- Users can insert their own profile
create policy "Users can insert their own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Users can view their own profile
create policy "Users can view their own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

-- Users can view other profiles
create policy "Users can view other profiles"
on public.profiles
for select
to authenticated
using (auth.uid() <> id);
```

**Explanation:**

- **Insert policy**: Only allows authenticated users to insert a profile row **where `id` equals `auth.uid()`**, preventing creation of profiles for other users.
- **Update policy**: Users can only update a profile **if they own it** (`auth.uid() = id`) and the update continues to satisfy this condition.
- **Self-select policy**: Allows each authenticated user to query **their own profile**.
- **Other-select policy**: Allows authenticated users to **read other users’ public profiles**, enabling social features like viewing friends’ names, usernames, and avatars while still keeping writes locked down.

Together, these policies ensure **safe self-service profile management** while still supporting social discovery.

### 3️⃣ Trigger: Auto-Create Profile on Signup

To avoid manual profile creation in the frontend, we added a **database trigger** that automatically creates a profile row whenever a new user is added to `auth.users`.

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, username)
  values (new.id, null, null);

  return new;
end;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
```

**Explanation:**

- Every time a new user signs up, `handle_new_user` runs and inserts a corresponding row in `public.profiles`.
- `name` and `username` are initialized as `null` so they can be safely filled during onboarding.
- The frontend does **not** need to create profile rows manually; it only **updates** the existing row, which plays nicely with the RLS policies above.

### 4️⃣ Storage Bucket – Profile Images

We added a Supabase Storage bucket named **`profiles`** to store user profile images.

- **Bucket name**: `profiles`
- **Usage**: Each user’s images live under a folder that matches their `auth.uid()`:
  - `profiles/<user-id>/avatar.png`
  - `profiles/<user-id>/profile.jpg`

The core policy condition we rely on is:

```sql
(bucket_id = 'profiles'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)
```

This expression ensures that:

- Access is restricted to the **`profiles`** bucket.
- The **first folder segment** in the object path (obtained via `storage.foldername(name)[1]`) **must equal the user’s `auth.uid()`**.
- Users can only interact with files inside `/profiles/<their-user-id>/...`.

We applied this pattern consistently across all storage policies:

```sql
-- Allow users to upload to their own folder
((bucket_id = 'profiles'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text))

-- Allow users to update their own files
((bucket_id = 'profiles'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text))

-- Allow users to delete their own files
((bucket_id = 'profiles'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text))

-- Allow users to view their own files
((bucket_id = 'profiles'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text))

-- Allow public read access (if enabled)
(bucket_id = 'profiles'::text)

-- Restrict access strictly to user folder
(bucket_id = 'profiles'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)
```

**Explanation:**

- **Per-user isolation**: Upload, update, delete, and view policies are all scoped so users can only manage files in their own `<auth.uid()>` folder.
- **Optional public reads**: A separate policy can allow `select` access on `(bucket_id = 'profiles')` for public avatars, while still keeping write operations user-specific.
- **Defense in depth**: The repeated folder check ensures any access to objects under `profiles` is **always** filtered by the user’s ID.

### 5️⃣ Frontend: Signup, Onboarding & Profile Updates

On the frontend, the **signup** and **onboarding** flows are now fully wired into Supabase Auth, the `profiles` table, and the `profiles` storage bucket.

- **`signup.tsx`**
  - Handles email/password registration.
  - Calls `signUp` from `AuthContext` and, on success, navigates the user to the onboarding screen.
  - Validates inputs and surfaces failure states via alerts.

- **`onboarding.tsx`**
  - Allows the user to:
    - Pick or capture a profile picture.
    - Enter **Full Name** and **Username**.
  - Uploads the image to the `profiles` storage bucket under `<auth.uid()>`.
  - Checks that the chosen username is unique (excluding the current user).
  - Marks `onboarding_completed` as `true` when finished and redirects to the main `(tabs)` experience.

#### Safe, Partial Profile Updates

Profile updates are performed via the `updateUser` function in `AuthContext`, which only sends fields that are explicitly defined:

```ts
if (userData.name !== undefined) updateData.name = userData.name;
if (userData.username !== undefined)
  updateData.username = userData.username;
if (userData.profileImage !== undefined)
  updateData.profile_image_url = userData.profileImage;
if (userData.onboardingCompleted !== undefined)
  updateData.onboarding_completed = userData.onboardingCompleted;
```

**Why this matters:**

- **Prevents accidental data loss**: Existing columns are **not overwritten with `NULL` or `undefined`** when a field is omitted from an update.
- **Supports incremental onboarding**: Users can update only their name, only their username, or only the image without touching other fields.
- **Aligns with RLS**: Because we only update the row the user owns and send minimal data, we stay within the boundaries of our RLS policies.

Overall, this release brings the project much closer to a **production-ready authentication and profile system**, with strong security guarantees and a smooth onboarding UX.

### 6️⃣ Additional Frontend & Utility Work (Today)

This section documents the extra pieces wired up today and how they fit into the overall architecture.

#### 6.1 Expo File System (`File`) in `storage.ts`

- **Use case**: Read a local image file (from camera or gallery) as binary data so it can be uploaded directly to Supabase Storage.
- **Why we used it**: Supabase Storage expects raw bytes (`ArrayBuffer`/`Uint8Array`) when uploading files. The `File` API from `expo-file-system` gives us a simple way to turn a local URI (e.g. `file:///...`) into an object we can read as an `arrayBuffer`.
- **How it’s used**: In `src/lib/supabase/storage.ts`, we construct a `File` from the `imageUri`, read its `arrayBuffer`, and pass that buffer to `supabase.storage.from("profiles").upload(...)`.

```12:20:src/lib/supabase/storage.ts
const file = new File(imageUri);
const arrayBuffer = await file.arrayBuffer();

const { error } = await supabase.storage
  .from("profiles")
  .upload(fileName, arrayBuffer, {
    contentType: `image/${fileExtension}`,
    upsert: true,
  });
```

#### 6.2 Login Page (`login.tsx`)

- **Use case**: Allow existing users to sign into the app using email and password.
- **Why we used it**: The login screen is the entry point for returning users and ties into `AuthContext` and Supabase Auth, so the rest of the app can be protected behind the auth flow.
- **How it’s used**: `login.tsx` renders `TextInput` fields for email and password, uses `secureTextEntry` to hide the password, and calls `signIn` from `useAuth()` (once wired) to authenticate the user. It also provides navigation to the signup screen for new users.

#### 6.3 `checkSession` / “CheckUser” in `AuthContext`

- **Use case**: On app start, determine whether there is an existing Supabase session and, if so, load the user’s profile.
- **Why we used it**: Without a session check, users would have to log in every time they open the app. `checkSession` lets us restore the authenticated state and keep the UI in sync with Supabase.
- **How it’s used**: In `AuthProvider`, an `useEffect` runs once on mount and calls `checkSession`, which in turn uses `supabase.auth.getSession()` and `fetchUserProfile` to populate the `user` state.

```39:47:src/context/AuthContext.tsx
const checkSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    const profile = await fetchUserProfile(session.user.id);
    setUser(profile);
  } else {
    setUser(null);
  }
};
```

#### 6.4 `RouteGuard` in `_layout.tsx`

- **Use case**: Central place to protect routes and redirect users based on whether they are authenticated.
- **Why we used it**: Instead of sprinkling auth checks inside every screen, `RouteGuard` wraps the whole app and decides whether the user should be on `(auth)` routes or `(tabs)` routes.
- **How it’s used**: `RouteGuard` reads `user` and `isLoading` from `useAuth()` and uses `router.replace` to move users to `/ (auth)/login` when logged out, or to `/(tabs)` when logged in.

```6:26:src/app/_layout.tsx
function RouteGuard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    if (!user && segments[0] !== "(auth)") {
      router.replace("/(auth)/login");
    } else if (user && segments[0] !== "(tabs)") {
      router.replace("/(tabs)");
    }
  }, [user, segments, router, isLoading]);

  // Renders the main Stack when not loading
}
```

#### 6.5 `useSegments` (Segments) in `_layout.tsx`

- **Use case**: Detect which top-level route group (`(auth)` or `(tabs)`) the user is currently in.
- **Why we used it**: `useSegments` from `expo-router` gives us access to the current route path broken into segments, which is perfect for building route guards and redirect logic.
- **How it’s used**: We read `const segments = useSegments();` and then check `segments[0]` to see whether we are in auth screens or tab screens, and only redirect when necessary.

```9:13:src/app/_layout.tsx
const segments = useSegments();

const isAuth = segments[0] === "(auth)";
const isTabs = segments[0] === "(tabs)";
```

#### 6.6 `NativeTabs` in `(tabs)/_layout.tsx`

- **Use case**: Provide a fast, native-feeling bottom tab navigation for the main app using Expo Router’s `NativeTabs` (supports effects like “liquid glass” navigation on supported platforms).
- **Why we used it**: `NativeTabs` offers better platform integration and performance than plain JS tab bars, and it integrates directly with Expo Router’s file-based routing.
- **How it’s used**: In `src/app/(tabs)/_layout.tsx`, we declare a `NativeTabs` component with `Trigger`s for each screen (`index`, `profile`) and give them labels and icons.

```4:16:src/app/(tabs)/_layout.tsx
export default function TabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.fill" md="person" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

#### 6.7 Modal in `index.tsx` (Post Preview)

- **Use case**: Let users pick or capture a photo, preview it, optionally add a description, and then post it.
- **Why we used it**: This mirrors the BeReal interaction pattern where you stage your post in a modal-like preview before sharing it, while keeping the main screen clean.
- **How it’s used**: `index.tsx` uses React Native’s `Modal` plus `expo-image-picker` to show a centered card with the selected image, a multiline description input, and `Cancel` / `Post` actions.

```71:104:src/app/(tabs)/index.tsx
<Modal visible={showPreview} transparent animationType="fade">
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Preview Your Post</Text>
      {previewImage && (
        <Image style={styles.previewImage} source={{ uri: previewImage }} contentFit="cover" />
      )}

      <TextInput
        placeholder="Add a description (optional)"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      {/* Cancel / Post buttons */}
    </View>
  </View>
</Modal>
```

#### 6.8 Home `index.tsx` Page

- **Use case**: Act as the main entry point inside the `(tabs)` group, giving users a floating action button (FAB) to start creating a new post.
- **Why we used it**: This page ties together camera/gallery access, modal previews, and future post submission logic, forming the backbone of the core BeReal-like posting experience.
- **How it’s used**: `index.tsx` renders a `SafeAreaView` with a styled FAB in the bottom-right corner; tapping it opens an `Alert` to choose between gallery or camera, then shows the preview modal described above.

```62:69:src/app/(tabs)/index.tsx
<SafeAreaView style={styles.container} edges={["bottom", "top"]}>
  <TouchableOpacity style={styles.fab} onPress={showImagePicker}>
    <Text style={styles.fabText}>+</Text>
  </TouchableOpacity>

  {/* Modal preview for the selected image and description */}
</SafeAreaView>
```