# Supr Mushrooms — Project Guide (CLAUDE.md)

E-commerce web app for a Delhi-NCR mushroom/saffron farm. Customers browse products,
add to cart/wishlist, and check out (COD or UPI with payment-proof upload). An admin
dashboard manages products, orders, coupons, and customers.

> This file is the canonical reference for the codebase and database. Keep it updated
> when the schema, RLS model, or core workflows change.

---

## 1. Tech stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router, React 19, TypeScript) |
| Styling | Tailwind CSS 3, framer-motion, lucide-react icons |
| Backend / DB | Supabase (Postgres + Auth + Storage + Edge Functions) |
| Auth | Supabase Auth (email/password + Google OAuth) |
| AI | Groq (`llama-3.1-8b-instant`) for chatbot; Google Gemini (`gemini-1.5-flash`) for recipe generator |
| Email | Supabase Edge Function `send-order-email` via Gmail SMTP (nodemailer) |
| Hosting | Vercel (`https://supr-mushroom.vercel.app`) |

> **Web only.** The former Capacitor/Android wrapper has been removed. Do not re-add
> `@capacitor/*`, an `android/` folder, or `capacitor.config.ts`.

---

## 2. Commands

```bash
npm run dev      # local dev server
npm run build    # production build (use this to typecheck before pushing)
npm run start    # serve production build
npm run lint     # next lint
```

---

## 3. Directory map

```
app/
  layout.tsx                 # Root layout: providers, Navbar/Footer/Chatbot, SEO, metadata
  page.tsx                   # Home (renders components/pages/HomePage)
  product/[id]/page.tsx      # Product detail (server fetch -> ProductDetailPage)
  admin/
    page.tsx                 # Admin dashboard shell (tabs, data fetch, status updates)
    components/              # AdminOverview, AdminOrders, AdminProducts, AdminCoupons, AdminCustomers
  orders/page.tsx            # Logged-in user's orders (UserOrdersPage)
  wishlist/page.tsx          # Wishlist
  chef/page.tsx              # AI recipe generator (calls /api/recipe)
  reset-password/page.tsx    # Password reset
  api/
    orders/route.ts          # POST: create order (validates + calls process_order RPC)
    validate-coupon/route.ts # POST: look up a coupon for client display
    chat/route.ts            # POST: Groq chatbot proxy (server holds the key)
    recipe/route.ts          # POST: Gemini recipe generator (server holds the key)
    products/route.ts        # GET: products list (used by the chatbot)
  sitemap.ts / robots.ts / manifest.ts

components/
  providers/                 # React context providers (see §4)
  pages/                     # Page-level UI (HomePage, ProductDetailPage, UserOrdersPage, home/*)
  ui/                        # Navbar, Footer, CartSidebar, CheckoutModal, AuthModal, Chatbot, etc.
  shared/SEO.tsx             # JSON-LD structured data

lib/
  config.ts                  # ADMIN_EMAIL, CURRENCY, SITE_URL, Supabase env constants
  supabase/client.ts         # Browser Supabase client
  supabase/server.ts         # Server (RSC/route) Supabase client
  utils.ts

middleware.ts                # Session refresh + route protection for /admin and /orders
types/index.ts               # Shared TypeScript types
supabase/functions/send-order-email/index.ts  # Order-confirmation email (Deno edge fn)
```

---

## 4. Front-end architecture

Provider nesting in `app/layout.tsx`:

```
ThemeProvider → AuthProvider → DataProvider → WishlistProvider → CartProvider
```

| Provider | Responsibility |
|----------|----------------|
| `AuthProvider` | Supabase session, `user`, `isAdmin` (email === `ADMIN_EMAIL`), sign in/up/out, Google, reset |
| `DataProvider` | Loads all products once into context; `refreshProducts()` |
| `WishlistProvider` | Per-user wishlist (DB-backed, requires login) |
| `CartProvider` | Cart state; localStorage for guests, `carts` table for logged-in users (1.5s debounced sync); realtime stock updates; `validateStock()` |

**Admin identity is a single source of truth:** `lib/config.ts` → `ADMIN_EMAIL`
(reads `NEXT_PUBLIC_ADMIN_EMAIL`, falling back to `ADMIN_EMAIL`, then a hardcoded default).
The client (`AuthProvider`, admin page), the server (`middleware.ts`), **and** the database
(`public.is_admin()`) all key off the same admin email. Change it in **one** place: the
env var (and the `is_admin()` function if you rotate the admin).

---

## 5. Database schema (Supabase / Postgres `public`)

All tables have **Row Level Security enabled**. Admin access in RLS is via the
`public.is_admin()` helper (`auth.jwt()->>'email' = ADMIN_EMAIL`).

### `categories`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | default `uuid_generate_v4()` |
| name | text | |
| slug | text unique | |
| description | text null | |
| created_at | timestamptz | default now() |

RLS: public read; admin write. (Seed rows: Mushrooms, Saffron.)

### `products`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| name | text | |
| slug | text unique | |
| description | text null | |
| category_id | uuid null | FK → categories.id |
| images | text[] | default `{}` (public URLs in `products` bucket) |
| price | numeric | |
| stock | int | default 0 |
| weight | text | default 'Default' |
| farming_method | text null | check: Aeroponic / Modern Farming / Hydroponic |
| discount_percentage | numeric null | default 0 |
| rating | numeric null | default 5.0 |
| reviews_count | int null | default 0 |
| status | text null | 'active' / 'hidden' / 'coming_soon' (app convention) |
| is_deleted | bool null | default false (soft delete) |
| created_at / updated_at | timestamptz | |

RLS: public read; admin insert/update/delete.

### `profiles` (1:1 with `auth.users`)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | FK → auth.users.id |
| full_name | text null | |
| email | text null | |
| phone | text null | |
| avatar_url | text null | |
| addresses | text[] | default `{}` |
| updated_at | timestamptz | |

Auto-created by trigger `on_auth_user_created` → `handle_new_user()`.
RLS: user reads/updates own row; admin reads all.

### `orders`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid null | FK → auth.users.id (null for guest orders) |
| guest_email | text null | for guest checkout |
| total_amount | numeric | **authoritatively computed by `process_order`** |
| discount_applied | numeric null | default 0 |
| coupon_code | text null | |
| shipping_address | text | JSON string: `{name,address,phone,email}` |
| payment_method | text | 'Cash on Delivery' or 'UPI' |
| payment_proof_url | text null | URL into the **private** `payment_proofs` bucket |
| status | text null | check: Pending / Processing / Shipped / Delivered / Cancelled (default Pending) |
| created_at | timestamptz | |

RLS: owner (or admin) reads; owner/admin insert; **admin-only** update/delete.

### `order_items`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| order_id | uuid null | FK → orders.id |
| product_id | uuid null | FK → products.id |
| quantity | int | |
| price_at_order | numeric | snapshot of price at purchase |
| product_name_snapshot | text null | snapshot of name at purchase |

RLS: visible to order owner or admin; insert restricted to order owner/admin.

### `carts`
| Column | Type | Notes |
|--------|------|-------|
| user_id | uuid PK | FK → auth.users.id |
| items | jsonb | array of cart items |
| updated_at | timestamptz | |

RLS: user manages own cart only.

### `wishlist`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid | FK → auth.users.id |
| product_id | uuid | FK → products.id |
| created_at | timestamptz | |

RLS: user manages own rows only.

### `coupons`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| code | text unique | stored uppercase |
| discount_percentage | int | |
| min_order_value | numeric null | default 0 |
| max_discount_amount | numeric null | cap |
| is_active | bool null | default true |
| usage_count | int null | default 0 |
| created_at | timestamptz | |

RLS: public reads **active** coupons; admin manages all.

### `coupon_usages` (per-user coupon tracking)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| coupon_id | uuid null | FK → coupons.id |
| user_id | uuid null | FK → auth.users.id |
| order_id | uuid null | FK → orders.id |
| used_at | timestamptz | |
| **UNIQUE(coupon_id, user_id)** | | prevents a logged-in user reusing a coupon |

Written by `process_order`. RLS: user reads own; admin manages.

### `product_reviews`
| id | uuid PK | • product_id FK → products • user_id FK → auth.users • rating int (1–5) • comment text • created_at • **UNIQUE(product_id, user_id)** |

RLS: public read; user inserts/updates own; owner/admin delete.

### `waitlist` ("notify me" for out-of-stock / coming-soon)
| id | uuid PK | • product_id FK → products • email text • notified bool • created_at • **UNIQUE(product_id, email)** |

RLS: public insert; admin read.

### `inventory_alerts` (auto low-stock log)
| id | uuid PK | • product_id FK → products • product_name • remaining_stock • is_resolved • alert_time |

Written by trigger `trigger_low_stock` → `check_low_stock()` when stock drops to ≤5.
RLS: admin read only.

### `order_status_history` (audit log)
| id | uuid PK | • order_id FK → orders • old_status • new_status • changed_at |

Written by trigger `trigger_order_status` → `log_order_status_change()`.
RLS: admin or order owner reads.

---

## 6. Database functions

| Function | Security | Purpose |
|----------|----------|---------|
| `is_admin()` | invoker, stable | `auth.jwt()->>'email' = ADMIN_EMAIL`. Single source of admin truth in RLS. |
| `process_order(...)` | **definer** | Atomic checkout: locks product rows, validates stock (skips pre-orders), writes order + items with **DB-side prices**, computes total & discount authoritatively, records `coupon_usages`, bumps `usage_count`. Returns `(order_id, success, error_message)`. |
| `handle_new_user()` | definer | Trigger: create a `profiles` row when an auth user signs up. |
| `check_low_stock()` | definer | Trigger: log to `inventory_alerts` when stock ≤ 5. |
| `log_order_status_change()` | definer | Trigger: append to `order_status_history` on status change. |

Trigger functions are `SECURITY DEFINER` so they can write to RLS-protected audit tables,
and have `EXECUTE` revoked from `anon`/`authenticated` (callable only via their triggers).

> **Pricing is server/DB-authoritative.** `process_order` ignores the client-supplied
> total/discount and recomputes from the `products`/`coupons` tables. Never trust a price
> sent from the browser.

### Triggers
- `orders` AFTER INSERT → **`send-order-email`** (Supabase DB webhook → edge function). *Single* email path.
- `orders` AFTER UPDATE OF status → `trigger_order_status`.
- `products` AFTER UPDATE OF stock → `trigger_low_stock`.
- `auth.users` AFTER INSERT → `on_auth_user_created`.

---

## 7. Storage buckets

| Bucket | Public? | Policies |
|--------|---------|----------|
| `products` | public | Read by URL; **admin-only** insert/update/delete. Product images. |
| `payment_proofs` | **private** | Anyone may **upload** (guest checkout); **admin-only** read. Admin UI views proofs via short-lived **signed URLs** (`createSignedUrl`). |

---

## 8. Key workflows

### Customer checkout (`components/ui/CheckoutModal.tsx`)
1. Validate stock client-side (`cartContext.validateStock()`), validate phone/email.
2. If UPI: upload screenshot to `payment_proofs`, keep the URL.
3. `POST /api/orders` with items (`productId`, `quantity` only — **no prices**), address, coupon.
4. `/api/orders` re-validates server-side, then calls `process_order` RPC (authoritative).
5. On success: order + items created, stock decremented, coupon usage recorded, cart cleared.
6. `orders` INSERT trigger fires `send-order-email` → confirmation email.

### Admin (`app/admin/page.tsx`, gated by `middleware.ts` + client check)
- **Overview:** revenue (excludes Cancelled), order/customer counts, 30-day sales chart.
- **Orders:** search/filter, status dropdown (optimistic + reverts on failure), CSV export,
  detail modal with signed-URL payment proof.
- **Products:** create/edit (client compresses images → `products` bucket), soft delete.
- **Coupons:** create/delete.

---

## 9. Environment variables (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...      # server only — never expose to client
ADMIN_EMAIL=...                    # server
NEXT_PUBLIC_ADMIN_EMAIL=...        # client + middleware (keep equal to ADMIN_EMAIL)
NEXT_PUBLIC_SITE_URL=...
GROQ_API_KEY=...                   # chatbot (server only)
GEMINI_API_KEY=...                 # recipe generator (server only)
```

Edge function secrets (set in Supabase, not in `.env.local`): `SMTP_EMAIL`, `SMTP_PASSWORD`,
`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

`.env*` files are gitignored — keep secrets out of git.

---

## 10. Conventions & gotchas

- **Always check Supabase `{ error }`** after `.insert/.update/.delete` and surface it — don't show success blindly.
- `shipping_address` is a JSON **string**; parse with a try/catch (it may be legacy plain text).
- Pre-orders (`status = 'coming_soon'`) skip stock checks and do not decrement stock.
- Prices/totals are computed in `process_order`; the client value is display-only.
- The product `category` field is derived from the joined category name; the storefront
  does not currently filter by category.

---

## 11. Outstanding manual steps / future work

These are **not** done in code and need attention:

1. **Redeploy the edge function.** `supabase/functions/send-order-email/index.ts` was improved
   (clean address + discount line) but the production deploy requires your action:
   `supabase functions deploy send-order-email` (or via the dashboard).
2. **Enable "Leaked Password Protection"** in Supabase → Authentication → Policies (Dashboard toggle, can't be set via SQL).
3. **Run `npm install`** to prune the removed `@capacitor/*` packages from `package-lock.json`.
4. Minor: the reviews "Log In" link points to `/login` (no such route — auth is a modal); and the
   review fetch embeds `auth.users` which may need a `profiles` join instead. Low priority.
