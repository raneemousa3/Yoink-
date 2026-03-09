# Firestore Rules Setup

The "Missing or insufficient permissions" error means Firestore Security Rules are blocking your requests. Apply the rules below.

---

## Option 1: Firebase Console (quickest)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. **Build → Firestore Database → Rules**
4. Replace the existing rules with the contents of `firestore.rules`
5. Click **Publish**

---

## Option 2: Firebase CLI

If you have Firebase CLI installed:

```bash
firebase init firestore   # if not already done
firebase deploy --only firestore:rules
```

---

## What the rules do

| Collection      | Read | Create | Update/Delete |
|-----------------|------|--------|---------------|
| `listings`     | Anyone | Auth required | Owner only |
| `users`        | Own doc only | — | Own doc only |
| `rentalRequests` | Participant | Auth | Owner (to approve) |
| `transactions` | Participant | — | Auth |
| `reviews`      | Anyone | Auth | — |

After publishing, refresh your app—the home feed should load.
