# Cactus World — Frontend (React + TypeScript + Vite)

Plain Vite SPA using `react-router-dom`. Talks to the Express/MongoDB API in `../backend`.

## Setup
```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL + EmailJS keys
npm run dev            # http://localhost:5173
```

## Env
- `VITE_API_URL` — backend base URL (e.g. http://localhost:5000). Empty = offline/localStorage mode.
- `VITE_EMAILJS_SERVICE_ID` / `VITE_EMAILJS_TEMPLATE_ID` / `VITE_EMAILJS_PUBLIC_KEY`

## Structure
- `src/pages/` — route components (Home, Shop, ProductDetail, Cart, Checkout, Care, Admin)
- `src/components/` — header, footer, product card, shadcn UI
- `src/lib/` — store, cart, api client, emailjs, products
