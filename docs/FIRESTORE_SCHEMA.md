# Yoink Firestore Database Schema

Design rationale: Firestore charges per read/write and favors **denormalization** for faster reads. We duplicate some data (e.g., owner name on listings) to avoid joining collections.

---

## Collections Overview

| Collection    | Purpose                                      |
|---------------|----------------------------------------------|
| `users`       | User profiles, ratings, preferences          |
| `listings`    | Items available for rent                    |
| `rentalRequests` | Booking requests (before approval)        |
| `transactions`| Completed bookings (approved rentals)       |
| `reviews`     | Post-rental reviews between users           |

---

## 1. `users` Collection

**Document ID:** Firebase Auth UID

```typescript
{
  email: string;
  displayName: string;
  photoURL?: string;
  interests: string[];           // e.g. ["Books", "Tools", "Electronics"]
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // Denormalized for leaderboard / impact
  totalItemsShared: number;
  totalCO2SavedLbs: number;
  totalMoneySaved: number;
}
```

**Why:** `interests` supports the onboarding categories. Impact metrics are stored here for quick leaderboard queries.

---

## 2. `listings` Collection

**Document ID:** Auto-generated

```typescript
{
  title: string;                 // e.g. "Brothers sewing machine"
  description: string;
  category: "Clothing" | "Tools" | "Kitchen" | "Books" | "Furniture" | 
            "Outdoor gear" | "Art supplies" | "Electronics" | "Freebies";
  condition: "New" | "Like New" | "Good" | "Fair" | "Used";
  photos: string[];              // Firebase Storage URLs (max 5)
  pricePerDay: number;           // in cents to avoid float issues
  deposit: number;              // in cents, optional (0 = none)
  pickupMethod: "Meetup" | "Locker" | "Delivery";
  ownerId: string;              // references users/{uid}
  ownerName: string;             // denormalized for display
  ownerPhotoURL?: string;       // denormalized
  averageRating?: number;       // computed from reviews
  borrowCount: number;          // times borrowed (for "borrowed X times")
  // Calendar-based: availability = any dates not already booked.
  // Check rentalRequests (approved) + transactions (active/returned)
  // for that listing to find blocked date ranges.
  status: "active" | "paused" | "deleted";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Why:** Matches the "List an Item" form (name, description, category, condition, photos). `borrowCount` and `averageRating` support the Scrapbook UI.

---

## 3. `rentalRequests` Collection

**Document ID:** Auto-generated

```typescript
{
  listingId: string;
  renterId: string;
  renterName: string;            // denormalized
  ownerId: string;
  startDate: Timestamp;
  endDate: Timestamp;
  totalCost: number;             // in cents
  status: "pending" | "approved" | "declined";
  message?: string;              // renter's message to owner
  createdAt: Timestamp;
  respondedAt?: Timestamp;
}
```

**Why:** One document per request. `status` drives approval flow. `rentalRequests` holds unconfirmed bookings; approved ones move to `transactions`.

---

## 4. `transactions` Collection

**Document ID:** Auto-generated (often same as approved `rentalRequest` ID for traceability)

```typescript
{
  rentalRequestId: string;       // link back to original request
  listingId: string;
  listingTitle: string;          // denormalized
  ownerId: string;
  ownerName: string;
  renterId: string;
  renterName: string;
  startDate: Timestamp;
  endDate: Timestamp;
  totalCost: number;
  depositAmount: number;
  status: "active" | "returned" | "disputed";
  returnedAt?: Timestamp;
  ownerReviewedAt?: Timestamp;
  renterReviewedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Why:** Approved requests become `transactions`. `status` tracks rental lifecycle. `ownerReviewedAt` / `renterReviewedAt` control who can leave reviews.

---

## 5. `reviews` Collection

**Document ID:** Auto-generated

```typescript
{
  transactionId: string;
  listingId: string;
  reviewerId: string;            // who wrote the review
  revieweeId: string;            // who is being reviewed (owner or renter)
  transactionRole: "owner" | "renter";
  rating: number;                // 1–5
  text: string;
  mediaUrls: string[];           // optional images/videos (Storage URLs)
  createdAt: Timestamp;
}
```

**Why:** Matches Scrapbook reviews (text + media). `transactionRole` distinguishes owner vs renter reviews.

---

## Indexes Needed (Firestore)

You'll create these in Firebase Console as you add queries:

- `listings`: `(status, category)` – browse by category
- `listings`: `(ownerId, status)` – "My listings"
- `rentalRequests`: `(listingId, status)` – requests for a listing
- `rentalRequests`: `(renterId, status)` – "My requests"
- `transactions`: `(ownerId, status)` – "Rentals I'm lending"
- `transactions`: `(renterId, status)` – "My rentals"
- `reviews`: `(listingId)` – Scrapbook reviews per listing

---

## Subcollections (Alternative)

We use **top-level collections** instead of subcollections (`listings` under `users`) because:

1. Easier to query across listings (search, filters).
2. Simpler rules (direct read on `listings`).
3. Pricing scales better for large collections.

---

## Security Rules (Summary)

- `users`: User can read/write own document.
- `listings`: Anyone can read; only owner can create/update/delete.
- `rentalRequests`: Owner and renter can read; renter creates; owner updates `status`.
- `transactions`: Only participants can read.
- `reviews`: Anyone can read; only participants can create.

---

Next step: After you confirm this schema (or note any changes you want), we’ll set up the Firebase project and connect it to Next.js.
