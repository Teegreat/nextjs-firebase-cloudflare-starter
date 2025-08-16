Next.js + Firebase client-only starter, optimized for Cloudflare Pages and external API access.

## 1) What you get

- Client-only Firebase Auth (no Admin SDK, Cloudflare Workers friendly)
- Zustand store with user profile sync from Firestore
- Client-side route gating in `app/(root)/_layout.tsx` and `app/(auth)/_layout.tsx`
- Cloudflare Pages build via `@cloudflare/next-on-pages`

## 2) Environment variables

Create `.env.local` for local dev (Node), and set the same keys in Cloudflare Pages → Settings → Environment variables for both Production and Preview.

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...

# Optional: public backend base URL for your own API
NEXT_PUBLIC_API_URL=https://api.example.com
```

Notes:

- These are browser-exposed values (NEXT*PUBLIC*\*). Copy them from Firebase Console → Project settings → Your apps (Web).
- After your first deployment (when you have the actual URLs), go to Firebase Authentication → Settings → Authorized domains and add your deployed domain(s): the `*.pages.dev` URL shown in the Pages deployment, and any custom domain you attach.

## 3) Local workflows

```
npm run dev           # Next.js dev (fastest)
npm run build         # Next.js production build (Node)
npm run pages:build   # Build for Cloudflare Pages
npm run preview       # Serve the Pages build locally via wrangler
```

## 4) Cloudflare Pages setup (Production & Preview)

In Cloudflare dashboard → Pages → Create a project → connect this repo.

- Select NextJs as framework
- Build command: `npx @cloudflare/next-on-pages@1 build`
- Build output directory: `.vercel/output/static`

Environment variables:

- Set all `NEXT_PUBLIC_FIREBASE_*` in the Production tab (used for `main` builds)
- Also set them in the Preview tab (used for all non-production branches)

Deploy:

- Production: push/merge to `main` (or your configured production branch)
- Preview: open a PR or push to any non-production branch

### Wrangler config (`wrangler.jsonc`)

This repo includes a minimal `wrangler.jsonc` used by `wrangler pages dev|deploy`:

```jsonc
{
  "name": "nextjs-starter-firebase",
  "compatibility_date": "2024-09-23",
  "compatibility_flags": ["nodejs_compat"],
  "pages_build_output_dir": ".vercel/output/static"
}
```

- `pages_build_output_dir` lets `wrangler pages dev` and `wrangler pages deploy` infer the artifact path so you can run them without arguments.

After the first successful deploy, copy the deployed domain(s) and add them to Firebase Authentication → Settings → Authorized domains. This is required for OAuth flows and Firebase Auth to work in the browser.

## 5) Firebase & auth model

- Firebase is initialized client-side only (see `firebase/firebaseClient.ts`), so SSR/prerender won’t crash.
- Client route gating uses Zustand:
  - `app/(root)/_layout.tsx`: redirects unauthenticated users to `/sign-in`
  - `app/(auth)/_layout.tsx`: redirects authenticated users to `/`
- Firestore profile doc is created/updated on sign-up/sign-in (`lib/actions/auth.action.ts`).

Example Firestore rules:

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

## 6) Calling external APIs

- If no secrets are needed, call them directly from the browser using `NEXT_PUBLIC_API_URL`.
- If secrets are needed (API keys), add a Next.js Route Handler under `app/api/*/route.ts` and call the external API from the server using `fetch`. Read secrets from Cloudflare Pages env vars that DO NOT use `NEXT_PUBLIC_` prefix.

## 7) Troubleshooting

- `auth/invalid-api-key` at build or runtime:

  - Ensure the environment you deployed (Production vs Preview) has the keys set
  - Redeploy after changing env vars (they are inlined at build time)
  - Check Firebase Auth → Authorized domains

- Node-only modules on Workers (fs, net, tls, http/https) will fail. Use `fetch` and Web APIs instead.

## 8) Scripts

```
npm run dev          # local dev
npm run build        # next build
npm run pages:build  # build for Cloudflare Pages
npm run preview      # local Pages preview (wrangler)
npm run deploy       # deploy to Cloudflare Pages via wrangler
```

## 9) Notes

- `next.config.ts` integrates Cloudflare dev platform during development so `npm run dev` behaves more like Pages when desired.
- Keep Production and Preview env vars in sync to avoid surprises.
