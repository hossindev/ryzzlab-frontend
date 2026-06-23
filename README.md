# ryzzlab Frontend — Setup & Deployment Guide

## 1. Create the project from scratch (if needed)

```bash
npm create vite@latest ryzzlab-frontend -- --template react
cd ryzzlab-frontend
# Replace the generated src/ with the files in this repo
```

## 2. Install dependencies

```bash
npm install
```

## 3. Environment variables

### Local development — create `.env.local`:

```env
VITE_API_BASE_URL=https://api.ryzzlab.xyz
# To test a storefront locally (since localhost has no subdomain):
VITE_DEV_SUBDOMAIN=nike
```

- Set `VITE_DEV_SUBDOMAIN` to the subdomain of the shop you want to preview.
- Remove or leave blank to test the owner dashboard at localhost.

### Production — `.env` (already in repo):

```env
VITE_API_BASE_URL=https://api.ryzzlab.xyz
```

`VITE_DEV_SUBDOMAIN` must **not** be set in production — subdomain detection uses the real hostname there.

## 4. Run locally

```bash
npm run dev
# → http://localhost:5173
```

## 5. Build for production

```bash
npm run build
# Output: dist/
```

## 6. Cloudflare Pages deployment

### Option A — Via Cloudflare Dashboard (recommended)

1. Push the repo to GitHub.
2. Go to **Cloudflare Dashboard → Pages → Create a project → Connect to Git**.
3. Select the repo.
4. Build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Under **Environment variables**, add:
   - `VITE_API_BASE_URL` = `https://api.ryzzlab.xyz`
   - (Do **not** set `VITE_DEV_SUBDOMAIN` in production)
6. Click **Save and Deploy**.

### Option B — Via Wrangler CLI

```bash
npm install -g wrangler
wrangler login
npm run build
wrangler pages deploy dist --project-name ryzzlab-frontend
```

For subsequent deploys:
```bash
npm run build && wrangler pages deploy dist --project-name ryzzlab-frontend
```

## 7. SPA routing (`_redirects`)

The file `public/_redirects` contains:
```
/* /index.html 200
```

Vite copies everything in `public/` to `dist/` at build time, so Cloudflare Pages will pick this up automatically and serve `index.html` for all routes.

## 8. Custom domain & wildcard DNS

You need `*.ryzzlab.xyz` to point to your Cloudflare Pages deployment so that `nike.ryzzlab.xyz`, `adidas.ryzzlab.xyz`, etc. all resolve to the same app.

### Step 1 — Add a custom domain in Cloudflare Pages

1. In Cloudflare Pages → your project → **Custom domains**.
2. Click **Set up a custom domain**.
3. Enter `ryzzlab.xyz` (root) — Pages will auto-provision SSL.
4. Repeat for `*.ryzzlab.xyz` (wildcard).

> Cloudflare Pages supports wildcard custom domains. Both the root and wildcard must be on **the same Cloudflare account** that manages the DNS zone.

### Step 2 — DNS records in Cloudflare DNS

Go to **DNS → Records** for the `ryzzlab.xyz` zone and add:

| Type  | Name | Content                        | Proxy |
|-------|------|-------------------------------|-------|
| CNAME | `@`  | `<your-project>.pages.dev`    | ✅ Proxied |
| CNAME | `*`  | `<your-project>.pages.dev`    | ✅ Proxied |

Replace `<your-project>` with the `.pages.dev` subdomain assigned to your Cloudflare Pages project (visible in the project overview).

The wildcard CNAME `*` covers every subdomain — `nike.ryzzlab.xyz`, `adidas.ryzzlab.xyz`, etc.

### Step 3 — Verify

After DNS propagates (usually seconds on Cloudflare):

```bash
curl -I https://nike.ryzzlab.xyz/
# Should return HTTP 200 and serve the React app
```

Navigate to `nike.ryzzlab.xyz` in a browser — it should load the storefront for the shop with subdomain `nike` (if it exists in the backend).

## 9. End-to-end verification checklist

- [ ] `ryzzlab.xyz` → owner dashboard loads, login/register works
- [ ] `<subdomain>.ryzzlab.xyz` → storefront loads for that shop
- [ ] Unknown subdomain → "Shop not found" page
- [ ] Customer can register, log in, add to cart, checkout
- [ ] Owner can create shop, add products, view & update orders
- [ ] Tokens are stored as `token_<subdomain>` (customer) and `owner_token` (owner)
- [ ] Refreshing any route doesn't 404 (SPA redirect is working)

## 10. Adding a new template in future

1. Create `src/templates/mytemplate/` with:
   - `components/Nav.jsx`
   - `pages/AllPages.jsx` (exports all 7 page components)
   - `index.js` (re-exports them)
2. Register it in `src/templates/index.js`:
   ```js
   mytemplate: lazy(() => import('./mytemplate/index.js')),
   ```
3. That's it — zero other changes needed.

Template names owners can use: `minimal`, `bold`, `elegant` (+ any you add).
