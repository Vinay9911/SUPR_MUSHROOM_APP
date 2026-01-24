
# 🍄 Supr Mushrooms - Premium Organic Mushroom Delivery App

**Supr Mushrooms** is a full-stack e-commerce application built with Next.js 16 (App Router) for a premium vertical farming business in Delhi NCR. The platform facilitates the sale and delivery of fresh, organic mushrooms (Oyster, Button, Cremini, etc.) directly to consumers and B2B clients.

🚀 **Live Demo:** [https://supr-mushroom.vercel.app](https://supr-mushroom.vercel.app)

<img width="1694" height="1078" alt="Screenshot 2026-01-25 015527" src="https://github.com/user-attachments/assets/2417cfcb-8572-4dd8-99af-2e0fb0881813" />

---

## ✨ Key Features

### 🛍️ E-Commerce Experience

* **Product Catalog:** Browse fresh mushroom varieties with details on weight, price, and stock status.
* **Cart & Checkout:** Fully functional shopping cart with quantity management and order summary.
* **Wishlist:** Users can save their favorite products for later.
* **Smart Search & Filtering:** (Implied) Efficient product discovery.

### 🤖 AI-Powered Support

* **Gemini AI Chatbot:** An integrated AI assistant powered by **Google Gemini 1.5 Flash**. It answers customer queries about mushroom types, pricing, delivery areas, and farming methods in real-time.

### 🔐 Authentication & Backend

* **Supabase Auth:** Secure user authentication (Sign Up/Login).
* **Real-time Database:** Supabase handles product inventory, user orders, and wishlists.
* **Admin Dashboard:** Dedicated interface for managing products, orders, and inventory (located at `/admin`).

### 🎨 UI/UX & Performance

* **Modern Design:** Built with **Tailwind CSS** and **Framer Motion** for smooth animations (fade-ins, stagger effects).
* **Responsive:** Fully optimized for mobile, tablet, and desktop views.
* **SEO Optimized:** Server-side rendering and semantic HTML for better search engine visibility in the Delhi NCR region.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/), [clsx](https://www.npmjs.com/package/clsx), [tailwind-merge](https://www.npmjs.com/package/tailwind-merge)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Animations:** [Framer Motion](https://www.framer.com/motion/)
* **Backend / DB:** [Supabase](https://supabase.com/) (PostgreSQL, Auth)
* **AI Integration:** [Google Generative AI SDK](https://www.npmjs.com/package/@google/generative-ai) (Gemini)
* **Charts:** [Recharts](https://recharts.org/) (for Admin analytics)
* **Toast Notifications:** [React Hot Toast](https://react-hot-toast.com/)

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

* Node.js (v18 or higher recommended)
* npm or yarn
* A Supabase project
* A Google Cloud Project with Gemini API enabled

### 1. Clone the Repository

```bash
git clone https://github.com/vinay9911/supr_mushroom_app.git
cd supr_mushroom_app

```

### 2. Install Dependencies

```bash
npm install
# or
yarn install

```

### 3. Environment Configuration

Create a `.env.local` file in the root directory and add the following environment variables. You will need credentials from Supabase and Google AI Studio.

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAIL=vinayaggarwal271@gmail.com

# Google Gemini AI (For Chatbot)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

---

## 📂 Project Structure

```bash
├── app/                  # Next.js App Router pages
│   ├── admin/            # Admin dashboard routes
│   ├── api/              # API routes (orders, webhooks, products)
│   ├── product/[id]/     # Product detail pages
│   ├── globals.css       # Global styles
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── pages/            # Page-specific components (HomePage, etc.)
│   ├── providers/        # Context Providers (Cart, Auth, Wishlist)
│   ├── shared/           # Shared components (SEO, etc.)
│   └── ui/               # UI components (Navbar, Chatbot, Cards)
├── lib/                  # Utility functions
│   ├── config.ts         # App constants and env vars
│   ├── supabase/         # Supabase client & server setup
│   └── utils.ts          # Helper functions
├── public/               # Static assets (images, icons)
├── types/                # TypeScript interfaces
└── ...config files

```

---

## 🧪 Farming Methods

The application highlights the business's unique selling proposition:

* **Aeroponic Technology:** Growing without soil or heavy metals.
* **Vertical Farming:** Climate-controlled environments (IoT monitored).
* **Organic Guarantee:** 100% pesticide-free and zero contamination.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 📞 Contact

**Vinay Aggarwal**

* 📧 Email: [vinayaggarwal271@gmail.com](mailto:vinayaggarwal271@gmail.com)
* 📱 Phone: +91-8826986127
* 🌐 Website: [supr-mushroom.vercel.app](https://supr-mushroom.vercel.app)
