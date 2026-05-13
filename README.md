# The Intelligent Bistro

A production-quality React Native (Expo) + Node.js demo of an AI-powered restaurant ordering experience. An Anthropic Claude assistant interprets natural language to manage a shopping cart with full visual polish.

## Features

- Warm-luxury design system: deep charcoal, ivory text, gold accents, Cormorant Garamond + DM Sans
- Three screens via Expo Router: splash / landing, menu, cart
- Sticky animated category tabs (Starters / Mains / Drinks / Desserts)
- Rich menu cards with emoji tile, tag pills, and a size picker bottom sheet
- Floating gold cart bar with item count and live total
- Cart screen with quantity stepper, swipe-to-delete (Reanimated + Gesture Handler), 10% service charge
- AI chat drawer (bottom sheet) with typing indicator and suggested prompt chips
- Haptic feedback for add-to-cart, size selection, swipe-remove, and AI confirmations
- Express backend that calls Google Gemini and validates the response with Zod

## Project layout

```
intelligent-bistro/
├── app/                       # Expo Router screens
│   ├── _layout.tsx            # Root layout with fonts + gesture handler
│   ├── index.tsx              # Splash / landing
│   ├── menu.tsx               # Menu browse screen
│   └── cart.tsx               # Cart screen
├── components/
│   ├── ChatDrawer.tsx         # Slide-up AI chat sheet
│   ├── ChatFab.tsx            # Glowing gold FAB that opens the chat
│   ├── MenuCard.tsx           # Menu item card + size picker
│   ├── CartItem.tsx           # Cart row with stepper + swipe delete
│   ├── FloatingCartBar.tsx    # Persistent cart CTA on menu
│   ├── TagPill.tsx            # Tag chip (popular / spicy / vegan / ...)
│   └── TypingIndicator.tsx    # 3-dot animated AI typing indicator
├── store/
│   └── cartStore.ts           # Zustand cart store
├── constants/
│   └── menu.ts                # Static menu data (18 items, 4 categories)
├── utils/
│   ├── api.ts                 # parseOrderMessage – calls backend, applies actions
│   └── icons.tsx              # Tiny dependency-free icon component
├── server/
│   ├── app.js                 # Express app (Vercel + local)
│   ├── index.js               # Local dev: listens on PORT
│   ├── routes/order.js        # POST /api/parse-order – Anthropic + Zod
│   └── prompts/system.js      # Claude system prompt with full menu rules
├── api/
│   └── index.js               # Vercel Serverless entry → Express app
├── vercel.json                # Static web export + /api rewrite to function
├── global.css                 # NativeWind directives
├── tailwind.config.js         # Theme tokens (colors + fonts)
├── babel.config.js            # NativeWind + Reanimated plugins
├── metro.config.js            # NativeWind metro wrapper
├── app.json                   # Expo config
└── tsconfig.json
```

## Prerequisites

- Node.js 18+
- A Google Gemini API key (https://aistudio.google.com/apikey)
- Expo Go on a physical device (iOS or Android), **or** the iOS Simulator / Android Emulator

## Setup

### 1. Install dependencies

```bash
# from the repo root
npm install

# backend
cd server
npm install
cd ..
```

### 2. Configure the backend

```bash
cp server/.env.example server/.env
# then edit server/.env and paste your real key
# GEMINI_API_KEY=AIza...
# GEMINI_MODEL=gemini-2.0-flash   (optional override)
# PORT=3001
```

### 3. Start the backend

```bash
cd server
node index.js
# expected:
# The Intelligent Bistro API running on port 3001
```

You can verify with:

```bash
curl http://localhost:3001/api/health
```

### 4. Start the Expo app

In another terminal at the project root:

```bash
npx expo start
```

Then press `i` for the iOS Simulator, `a` for the Android Emulator, or scan the QR code with Expo Go.

> **Android note:** the Android emulator can't reach `localhost` on your host machine. `utils/api.ts` automatically rewrites the dev host to `10.0.2.2:3001` when running on Android, which is the Android emulator's loopback to the host.
>
> If you're testing on a physical device with Expo Go, change `DEFAULT_DEV_HOST` in `utils/api.ts` to your computer's LAN IP (e.g. `http://192.168.1.42:3001`), and make sure your firewall allows port 3001.

## Deploy on Vercel

This repo is set up so **Vercel** serves the **Expo web** static export from `dist/` and routes **`/api/*`** to a **Serverless Function** that runs the same Express app as local development.

### 1. Push the latest code

Commit and push this repository to GitHub (or connect the folder in the Vercel dashboard).

### 2. Create a Vercel project

1. Open [vercel.com](https://vercel.com) → **Add New…** → **Project**.
2. Import the Git repository.
3. Vercel should pick up `vercel.json`:
   - **Build Command:** `npx expo export --platform web`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Deploy. (The first build may take a few minutes while dependencies install.)

### 3. Environment variables

In the Vercel project → **Settings** → **Environment Variables**, add:

| Name | Value | Environments |
| ---- | ----- | ------------ |
| `GEMINI_API_KEY` | Your Google Gemini API key (`AIza…`) | Production, Preview, Development |
| `GEMINI_MODEL` | _(optional)_ defaults to `gemini-2.0-flash` | Production, Preview, Development |

Redeploy after saving env vars so the function sees them.

### 4. Smoke test

- Static site: open your deployment URL in a browser.
- API: `GET https://your-deployment.vercel.app/api/health` should return JSON with `"ok": true`.
- In the web app, open the AI chat; requests go to **`/api/parse-order`** on the same origin (no CORS issues).

### 5. Expo Go / native builds pointing at Vercel

For **native** apps (not web), set **`EXPO_PUBLIC_API_URL`** at build time to your deployment origin **without** a trailing slash, e.g. `https://your-app.vercel.app`. `utils/api.ts` will call `https://your-app.vercel.app/api/...`. If you omit it, production native builds still fall back to the placeholder URL until you set this.

### Local preview of the production web bundle

```bash
npm install
npm run build
npx serve dist
```

### Note on SSL / corporate networks

If `npx vercel` fails locally with certificate errors, use **Import Git Repository** in the dashboard instead, or fix Node/Git SSL trust on your machine (e.g. corporate proxy CA).

## Trying the AI chat

Tap the glowing gold sparkle button on the menu or cart screen, then try:

- *"Add a wagyu burger and a large sparkling water."*
- *"Two truffle pastas, a lemonade, and the lava cake."*
- *"What's popular tonight?"*
- *"Remove the salmon and swap it for the short rib."*
- *"Make it three burgers instead of one."*
- *"Start fresh."*

Each prompt is sent to `POST /api/parse-order` with the current cart state. The server returns:

```json
{
  "reply": "Wagyu and a large sparkling water — excellent choice.",
  "actions": [
    { "type": "ADD", "itemId": "M1", "quantity": 1, "size": null },
    { "type": "ADD", "itemId": "D2", "quantity": 1, "size": "Large" }
  ],
  "cartSummary": "1× Wagyu Smash Burger, 1× Sparkling Water (Large)"
}
```

The client applies the actions to the Zustand store immediately, so the cart bar and cart screen update in real time.

## Tech stack

| Layer    | Choice                                                              |
| -------- | ------------------------------------------------------------------- |
| Mobile   | Expo SDK 51, Expo Router, React Native 0.74                         |
| Styling  | NativeWind v4 + Tailwind 3                                          |
| Motion   | React Native Reanimated 3, Gesture Handler 2                        |
| State    | Zustand                                                             |
| Polish   | expo-haptics, expo-linear-gradient, @expo-google-fonts              |
| Backend  | Node.js, Express, @google/generative-ai, Zod, CORS, dotenv         |
| AI Model | `gemini-2.0-flash` (configurable via `GEMINI_MODEL`)               |

## Notes & customization

- Update `constants/menu.ts` to change the menu. If you add new items, also update the `MENU ITEM IDs` block in `server/prompts/system.js` and the `VALID_ITEM_IDS` set in `server/routes/order.js`.
- The server prompt deliberately constrains Claude to return JSON only. `server/routes/order.js` additionally extracts the first balanced JSON object from the model output as a safety net.
- The design tokens (charcoal / ivory / gold / sage / rust) live in `tailwind.config.js` under `theme.extend.colors.bistro`.
