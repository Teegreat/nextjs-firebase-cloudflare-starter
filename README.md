Next.js + Firebase client-only starter, ready for Cloudflare Pages and external APIs.

## Environment

Create `.env.local` (and set the same vars in Cloudflare Pages):

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...

# External backend base URL
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Auth & User Profile

- Client uses Firebase Web Auth
- On sign-up, creates `users/{uid}` in Firestore
- On sign-in, updates `lastLoginAt`

Firestore rules example:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() { return request.auth != null }
    match /users/{uid} {
      allow create: if signedIn() && request.auth.uid == uid;
      allow read, update, delete: if signedIn() && request.auth.uid == uid;
    }
  }
}
```

## External API Client

Use `lib/api/client.ts` to call your backend with the Firebase ID token automatically added.

```ts
import api from "@/lib/api/client";

// JSON POST
await api.post("/auth/sync", { body: { hello: "world" } });

// GET
const data = await api.get("/me");

// FormData example
const form = new FormData();
form.append("file", file);
await api.post("/uploads", { body: form, json: false });
```

## Cloudflare Pages

Set build command and output:

- Build command: `npx @cloudflare/next-on-pages@latest`
- Output directory: `.vercel/output/static`

Or deploy via CLI:

```
npm run pages:build
wrangler pages deploy .vercel/output/static
```

## Scripts

```
npm run dev      # local dev
npm run build    # next build
npm run pages:build  # Next on Pages output
npm run deploy   # deploy to Cloudflare Pages via wrangler
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
