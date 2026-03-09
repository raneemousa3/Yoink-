# Firebase Setup Guide for Yoink

Follow these steps to connect your Next.js app to Firebase.

---

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** (or use existing)
3. Name it (e.g. "Yoink")
4. Disable Google Analytics if you don't need it (optional)
5. Create project

---

## 2. Register Your App

1. In the Firebase Console, click the **Web** icon (`</>`) to add an app
2. Register app with nickname (e.g. "Yoink Web")
3. Copy the config object – you'll use these values for `.env.local`

---

## 3. Enable Services

### Authentication
- Go to **Build → Authentication**
- Click **Get started**
- Enable **Email/Password** (or add WashU Key later via custom auth)

### Firestore
- Go to **Build → Firestore Database**
- Click **Create database**
- Start in **test mode** for development (we'll add rules before production)
- Choose a region (e.g. `us-central1`)

### Storage
- Go to **Build → Storage**
- Click **Get started**
- Use default rules for now (test mode)

---

## 4. Add Config to Next.js

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and paste your Firebase config values:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc123
   ```

3. Restart the dev server after changing env vars:
   ```bash
   npm run dev
   ```

---

## 5. Create Firestore Indexes

For the listings feed, create these composite indexes in Firestore:

1. **Collection:** `listings`
   - Fields: `status` (Ascending), `createdAt` (Descending)

2. **Collection:** `listings`
   - Fields: `status` (Ascending), `category` (Ascending), `createdAt` (Descending)

Firebase Console → Firestore → Indexes → Composite → Create index. Or run a query and use the error link to auto-create.

---

## 6. Verify Connection

Once `.env.local` is set, the app will initialize Firebase on load. You'll see a console warning if config is missing.

---

## Security Note

- `NEXT_PUBLIC_*` vars are exposed to the browser – this is normal for Firebase
- Firebase security is enforced by **Firestore Rules** and **Storage Rules**, not by hiding the config
- Never put secrets (API keys for paid services, etc.) in `NEXT_PUBLIC_*`
