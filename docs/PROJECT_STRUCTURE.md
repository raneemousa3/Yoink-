# Yoink Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout, metadata
│   ├── page.tsx            # Home (search feed)
│   ├── list/               # Create listing page (Step 4)
│   └── listings/[id]/      # Listing detail page (Step 4)
│
├── components/
│   ├── layout/             # Shell, nav bars
│   │   └── BottomNav.tsx   # 5-tab nav (Search, Message, List, Impact, Profile)
│   ├── listings/           # Listing-specific UI
│   │   ├── ListingCard.tsx  # Card for grid view
│   │   └── ListingForm.tsx  # Create/edit form
│   └── ui/                 # Reusable primitives
│       └── index.ts        # Button, Input, Select (add as needed)
│
├── lib/                    # Core logic & config
│   ├── firebase.ts         # Firebase init (Auth, Firestore, Storage)
│   ├── types.ts            # Firestore-aligned TypeScript types
│   └── listings.ts         # Firestore queries for listings
│
└── hooks/
    └── useAuth.ts          # Auth state (implement when Firebase connected)
```

## Design rationale

- **`lib/`** – All Firebase and Firestore logic lives here. Components stay dumb.
- **`components/`** – Split by feature (listings) vs shared (layout, ui).
- **`hooks/`** – Reusable state (auth, future: useListings).
- **App Router** – `list/` and `listings/[id]/` for create and detail pages.

## Next: Step 4

Implement the listings feature:
1. Build out `ListingForm` with all fields and image upload
2. Build out `ListingCard` to match Figma
3. Add routes `/list` and `/listings/[id]`
4. Wire `getListings` to the home feed
