// Static blog content (no CMS). Each post renders SEO metadata,
// Article + FAQ structured data, a branded cover image, inline diagrams,
// callouts and key-takeaways — and is auto-listed in the sitemap.

export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'callout'; variant?: 'tip' | 'info' | 'warning'; title?: string; text: string }
  | { type: 'diagram'; name: string; caption?: string }
  | { type: 'quote'; text: string }
  | { type: 'takeaways'; items: string[] };

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  description: string;
  excerpt: string;
  keywords: string[];
  date: string; // ISO published
  readTime: string;
  cover: string; // /blog/{slug}.png
  accent: string; // hex for the hero accent
  content: BlogBlock[];
  faq: { q: string; a: string }[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'health-benefits-of-oyster-mushrooms',
    title: '7 Proven Health Benefits of Oyster Mushrooms',
    category: 'Nutrition',
    description:
      'Oyster mushrooms are low in calories yet rich in protein, fibre, vitamin D and antioxidants. Here are 7 science-backed health benefits — and how to add fresh oyster mushrooms to your Delhi NCR diet.',
    excerpt:
      'Low in calories, high in protein, fibre, vitamin D and antioxidants — here are 7 science-backed reasons to eat more oyster mushrooms.',
    keywords: ['oyster mushroom benefits', 'oyster mushroom nutrition', 'health benefits of mushrooms', 'fresh mushrooms Delhi NCR', 'organic mushrooms Delhi'],
    date: '2026-04-02',
    readTime: '5 min read',
    cover: '/blog/health-benefits-of-oyster-mushrooms.png',
    accent: '#E0922F',
    content: [
      { type: 'p', text: 'Oyster mushrooms (Pleurotus ostreatus) are one of the most nutritious — and most underrated — vegetables you can add to your plate. They are naturally low in calories but pack a surprising amount of protein, fibre and disease-fighting antioxidants. Here are seven research-backed benefits of eating fresh oyster mushrooms.' },
      { type: 'diagram', name: 'nutrition', caption: 'A quick look at what a 100 g serving of oyster mushrooms gives you.' },
      { type: 'h2', text: '1. Very low in calories, high in nutrition' },
      { type: 'p', text: 'A 100 g serving of oyster mushrooms has roughly 33 calories, about 3 g of good-quality protein and 2 g of dietary fibre, along with B-vitamins and minerals like potassium and iron. That makes them an excellent choice if you want to eat well without the extra calories.' },
      { type: 'h2', text: '2. A rare plant source of vitamin D' },
      { type: 'p', text: 'Mushrooms are one of the very few non-animal foods that contain vitamin D. Oyster mushrooms provide ergocalciferol (vitamin D2), and mushrooms exposed to sunlight or UV light can become one of the best food sources of vitamin D available to vegetarians.' },
      { type: 'h2', text: '3. Loaded with antioxidants' },
      { type: 'p', text: 'Oyster mushrooms are rich in antioxidant compounds such as phenolics and flavonoids — including gallic acid, chlorogenic acid and naringenin. Studies have found oyster mushrooms contain higher antioxidant levels than many other cultivated mushrooms, helping protect your cells from oxidative stress.' },
      { type: 'h2', text: '4. May help lower cholesterol' },
      { type: 'p', text: 'Oyster mushrooms naturally contain lovastatin — the same class of compound used in cholesterol-lowering medicines. Animal and test-tube studies suggest oyster mushrooms may help reduce LDL ("bad") cholesterol as part of a balanced diet.' },
      { type: 'callout', variant: 'info', title: 'Good to know', text: 'No single food is a cure — but mushrooms are a smart, low-calorie addition to a balanced, mostly-plant diet.' },
      { type: 'h2', text: '5. Support a healthy immune system' },
      { type: 'p', text: 'Oyster mushrooms contain beta-glucans — natural fibres known for supporting immune function — along with anti-viral and anti-inflammatory compounds that may help the body defend itself.' },
      { type: 'h2', text: '6. Good for the heart and brain' },
      { type: 'p', text: 'With their combination of fibre, antioxidants and cholesterol-friendly compounds, oyster mushrooms are a heart-smart food. Early research also points to potential brain-health and anti-inflammatory benefits.' },
      { type: 'h2', text: '7. Naturally high in plant protein' },
      { type: 'p', text: 'Oyster mushrooms carry more good-quality protein than many other cultivated mushrooms, making them a great meat alternative for vegetarian and high-protein diets.' },
      { type: 'h2', text: 'How to add oyster mushrooms to your diet' },
      { type: 'ul', items: ['Sauté with garlic, butter and pepper for a quick side dish', 'Toss into stir-fries, pulao or fried rice', 'Add to soups, stews and curries for a meaty, umami bite', 'Grill or pan-roast as a vegetarian "tikka"'] },
      { type: 'p', text: 'For the best flavour and nutrition, always cook with the freshest mushrooms you can find. At Supr Mushrooms we grow oyster mushrooms in a clean, climate-controlled vertical farm and deliver them across Delhi, Noida, Gurugram, Ghaziabad and Faridabad within 24 hours of harvest — 100% organic and pesticide-free.' },
      { type: 'takeaways', items: ['Oyster mushrooms are low-calorie but high in protein, fibre and antioxidants', 'They are one of the few plant sources of vitamin D', 'They may support immunity, heart and cholesterol health', 'Freshness matters most — buy and cook them within a few days'] },
    ],
    faq: [
      { q: 'Are oyster mushrooms healthy?', a: 'Yes. Oyster mushrooms are low in calories and rich in protein, fibre, B-vitamins, vitamin D and antioxidants. They may help support immunity, heart health and healthy cholesterol levels.' },
      { q: 'How much protein is in oyster mushrooms?', a: 'About 3 grams of protein per 100 grams — a relatively high amount compared with most other cultivated mushrooms, which makes them popular in vegetarian diets.' },
      { q: 'Where can I buy fresh oyster mushrooms in Delhi NCR?', a: 'Supr Mushrooms delivers fresh, organic, pesticide-free oyster mushrooms across Delhi, Noida, Gurugram, Ghaziabad and Faridabad within 24 hours of harvest.' },
    ],
  },

  {
    slug: 'how-to-store-fresh-mushrooms',
    title: 'How to Store Fresh Mushrooms (Keep Them Fresh up to 10 Days)',
    category: 'Storage Guide',
    description:
      'The simple paper-bag trick that keeps fresh mushrooms firm for up to 10 days — plus the storage mistakes that make mushrooms go slimy. A practical guide.',
    excerpt:
      'The simple paper-bag trick that keeps mushrooms firm for up to 10 days — and the common mistakes that turn them slimy.',
    keywords: ['how to store mushrooms', 'keep mushrooms fresh', 'store fresh mushrooms refrigerator', 'mushroom storage tips'],
    date: '2026-04-10',
    readTime: '4 min read',
    cover: '/blog/how-to-store-fresh-mushrooms.png',
    accent: '#2F8F6B',
    content: [
      { type: 'p', text: 'Fresh mushrooms are delicate — store them the wrong way and they turn slimy in a couple of days. Store them the right way and they stay firm and tasty for over a week. Here is exactly how to do it.' },
      { type: 'diagram', name: 'storage', caption: 'The simple do’s and don’ts of keeping mushrooms fresh.' },
      { type: 'h2', text: 'The best way: a paper bag + paper towel' },
      { type: 'p', text: 'The single best method is to keep mushrooms in a brown paper bag with a paper towel inside. The breathable paper lets air flow and keeps the environment from getting damp, while the paper towel draws away excess moisture. Stored this way, mushrooms can stay fresh for up to 10 days.' },
      { type: 'h2', text: 'Keep them on the bottom shelf — not the crisper drawer' },
      { type: 'p', text: 'It is tempting to put mushrooms in the crisper drawer, but that drawer is designed to trap humidity (great for leafy greens, bad for mushrooms). Store your paper bag of mushrooms on the bottom shelf of the fridge instead, where it is cool but less humid.' },
      { type: 'callout', variant: 'warning', title: 'Don’t wash early', text: 'Never wash mushrooms before storing — water seeps into the tissue and makes them slimy. Clean them only just before cooking.' },
      { type: 'h2', text: 'How long do fresh mushrooms last?' },
      { type: 'p', text: 'Stored properly in a paper bag on the bottom shelf, most mushrooms keep for 7–10 days. If you plan to cook them within two or three days, the breathable packaging they arrive in is also fine.' },
      { type: 'h2', text: 'How to tell if mushrooms have gone bad' },
      { type: 'ul', items: ['Slimy or sticky surface', 'Dark spots or noticeable wrinkling', 'A sour or off smell'] },
      { type: 'h2', text: 'Can you freeze mushrooms?' },
      { type: 'p', text: 'Yes — but sauté or steam them first. Raw mushrooms have a high water content and turn mushy when frozen and thawed. Cook them lightly, cool, then freeze in a sealed bag for up to three months.' },
      { type: 'p', text: 'Of course, the freshest mushrooms last the longest. Supr Mushrooms delivers farm-fresh, organic mushrooms across Delhi NCR within 24 hours of harvest, so they keep beautifully at home.' },
      { type: 'takeaways', items: ['Store in a paper bag with a paper towel, on the bottom shelf', 'Never seal in plastic and never wash before storing', 'Properly stored, mushrooms last 7–10 days', 'Sauté before freezing for up to 3 months'] },
    ],
    faq: [
      { q: 'What is the best way to store fresh mushrooms?', a: 'Keep them in a brown paper bag with a paper towel inside, on the bottom shelf of the fridge (not the crisper drawer). This keeps them fresh for up to 10 days.' },
      { q: 'Should you wash mushrooms before storing them?', a: 'No. Washing adds moisture that makes mushrooms slimy and shortens their shelf life. Only clean them right before you cook.' },
      { q: 'How long do fresh mushrooms last in the fridge?', a: 'Stored correctly in a paper bag, most mushrooms stay fresh for 7–10 days.' },
    ],
  },

  {
    slug: 'types-of-mushrooms-cooking-guide',
    title: 'Button vs Cremini vs Oyster vs King Oyster: A Cook’s Guide',
    category: 'Cooking Guide',
    description:
      'Confused which mushroom to buy? Compare button, cremini, oyster and king oyster mushrooms — flavour, texture and the best ways to cook each one.',
    excerpt:
      'Button, cremini, oyster or king oyster? Compare flavour, texture and the best ways to cook each variety.',
    keywords: ['types of mushrooms', 'button vs cremini mushrooms', 'king oyster mushroom', 'best mushrooms for cooking', 'mushroom varieties India'],
    date: '2026-04-18',
    readTime: '6 min read',
    cover: '/blog/types-of-mushrooms-cooking-guide.png',
    accent: '#C75D3A',
    content: [
      { type: 'p', text: 'Not all mushrooms are the same. Each variety has its own flavour, texture and ideal cooking method. Here is a quick guide to four popular kinds so you always pick the right one for your dish.' },
      { type: 'diagram', name: 'mushroom-types', caption: 'Four popular mushrooms at a glance.' },
      { type: 'h2', text: 'Button mushrooms — the mild all-rounder' },
      { type: 'p', text: 'White button mushrooms (Agaricus bisporus) are the most common variety, with a small size and a mild, gentle flavour. They are wonderfully versatile: sauté, grill, roast, or slice them raw into salads, and add them to soups, stews, sauces, curries and stir-fries.' },
      { type: 'h2', text: 'Cremini mushrooms — deeper and earthier' },
      { type: 'p', text: 'Cremini (also called Swiss brown or baby bella) are simply a more mature button mushroom. They have a firmer texture and a deeper, earthier, more savoury flavour. Use them anywhere you would use button mushrooms when you want a richer taste — they are excellent in stews, soups and pasta.' },
      { type: 'h2', text: 'Oyster mushrooms — delicate and umami' },
      { type: 'p', text: 'Oyster mushrooms have a soft, velvety texture and a delicate, slightly briny, umami flavour that some describe as faintly seafood-like. Their fan shape and tenderness make them perfect for soups, stews, casseroles and quick stir-fries. Cook gently so you do not overpower their subtle taste.' },
      { type: 'h2', text: 'King oyster mushrooms — meaty and substantial' },
      { type: 'p', text: 'King oyster mushrooms are prized for their thick, meaty stems and small caps. The dense stem is the best part — slice it into rounds or "scallops" and roast, grill or air-fry for 3–5 minutes per side. With a firm bite and mild, earthy flavour, king oysters are a favourite meat substitute.' },
      { type: 'callout', variant: 'tip', title: 'Quick pick', text: 'Mild & everyday → Button · Rich & earthy → Cremini · Delicate stir-fries → Oyster · Meaty & grilled → King Oyster.' },
      { type: 'h2', text: 'A note on freshness' },
      { type: 'p', text: 'Whichever variety you choose, freshness makes the biggest difference to flavour and texture. Supr Mushrooms grows oyster, button, cremini and king oyster mushrooms in a climate-controlled vertical farm and delivers them across Delhi, Noida, Gurugram, Ghaziabad and Faridabad within 24 hours — organic and pesticide-free.' },
      { type: 'takeaways', items: ['Button = mild all-rounder; Cremini = deeper, earthier', 'Oyster = delicate & umami; King Oyster = meaty', 'Match the mushroom to the dish for the best result', 'Freshness affects flavour more than variety'] },
    ],
    faq: [
      { q: 'What is the difference between button and cremini mushrooms?', a: 'Cremini are a more mature version of white button mushrooms. They are firmer and have a deeper, earthier, more savoury flavour, while button mushrooms are milder.' },
      { q: 'What are king oyster mushrooms best for?', a: 'Their thick, meaty stems are ideal sliced and roasted, grilled or air-fried — they make a great vegetarian "scallop" or meat substitute.' },
      { q: 'Which mushroom has the most umami flavour?', a: 'Oyster mushrooms have a notably savoury, umami taste with a delicate, slightly briny note, making them excellent in soups and stir-fries.' },
    ],
  },

  {
    slug: 'aeroponic-mushroom-farming',
    title: 'How Aeroponic Vertical Farming Grows Cleaner Mushrooms',
    category: 'Our Farm',
    description:
      'What is aeroponic vertical farming, and why does it grow cleaner, pesticide-free mushrooms? A simple look at the technology behind Supr Mushrooms in Delhi NCR.',
    excerpt:
      'No soil, no pesticides, no heavy metals — here’s how aeroponic vertical farming grows cleaner, fresher mushrooms.',
    keywords: ['aeroponic mushroom farming', 'vertical farming mushrooms', 'how mushrooms are grown', 'pesticide free mushrooms Delhi', 'organic mushroom farm Delhi NCR'],
    date: '2026-05-02',
    readTime: '5 min read',
    cover: '/blog/aeroponic-mushroom-farming.png',
    accent: '#3B8F4F',
    content: [
      { type: 'p', text: 'You may have noticed our mushrooms are described as "aeroponic" and "vertically farmed". But what does that actually mean — and why does it make for cleaner, fresher mushrooms? Here is a simple explanation.' },
      { type: 'h2', text: 'What is aeroponic vertical farming?' },
      { type: 'p', text: 'Aeroponic farming grows plants without soil. Instead, the roots are suspended in air and fed a fine, nutrient-rich mist. "Vertical" means the crops are grown in stacked layers rather than spread across a field, so a small indoor space can produce a lot of food.' },
      { type: 'diagram', name: 'aeroponic', caption: 'The three ideas behind aeroponic vertical farming.' },
      { type: 'h2', text: 'Why it grows cleaner mushrooms' },
      { type: 'ul', items: ['No soil means no soil-borne heavy metals or contaminants', 'A sealed, climate-controlled room keeps pests out — so no pesticides are needed', 'Filtered air and strict hygiene reduce the risk of contamination', 'Precise nutrients and humidity produce consistent, high-quality mushrooms'] },
      { type: 'callout', variant: 'info', title: 'Why "controlled" matters', text: 'Because temperature, humidity and air are tuned indoors, we can grow premium mushrooms all year round — not just in one season.' },
      { type: 'h2', text: 'Better for the planet too' },
      { type: 'p', text: 'Vertical farming uses far less land and water than traditional farming, and growing close to the city means a much shorter journey from farm to your kitchen — which also means fresher food.' },
      { type: 'h2', text: 'From our farm to your door' },
      { type: 'p', text: 'Once harvested, our mushrooms move quickly through a simple, careful process so they reach you at peak freshness.' },
      { type: 'diagram', name: 'farm-to-door', caption: 'Every order follows the same fresh, careful journey.' },
      { type: 'p', text: 'That is how Supr Mushrooms delivers organic, pesticide-free mushrooms across Delhi, Noida, Gurugram, Ghaziabad and Faridabad within 24 hours of harvest.' },
      { type: 'takeaways', items: ['Aeroponics grows mushrooms in air + nutrient mist — no soil', 'Indoor, climate-controlled growing means no pesticides are needed', 'Cleaner, more consistent mushrooms, available year-round', 'Less land and water, and a shorter trip to your kitchen'] },
    ],
    faq: [
      { q: 'What is aeroponic mushroom farming?', a: 'Aeroponic farming grows crops without soil by feeding the roots a nutrient-rich mist. Combined with vertical (stacked) growing in a climate-controlled room, it produces clean, pesticide-free mushrooms year-round.' },
      { q: 'Are aeroponic mushrooms organic and pesticide-free?', a: 'Yes. Because they grow indoors in a sealed, controlled environment, pests are kept out without pesticides, and there is no soil to carry heavy metals or contaminants.' },
      { q: 'Why are vertically farmed mushrooms fresher?', a: 'They are grown close to the city in controlled conditions and delivered within 24 hours of harvest, so they spend far less time in transit than conventionally farmed produce.' },
    ],
  },

  {
    slug: 'easy-mushroom-recipes-indian',
    title: '5 Quick & Healthy Indian Mushroom Recipes',
    category: 'Recipes',
    description:
      'Five quick, healthy Indian-style mushroom recipes you can make in under 30 minutes — from garlic-butter mushrooms to mushroom masala and tikka.',
    excerpt:
      'Five quick, healthy Indian-style mushroom recipes — most ready in under 30 minutes.',
    keywords: ['mushroom recipes', 'indian mushroom recipes', 'easy mushroom recipes', 'mushroom masala', 'mushroom tikka', 'healthy mushroom dishes'],
    date: '2026-05-14',
    readTime: '6 min read',
    cover: '/blog/easy-mushroom-recipes-indian.png',
    accent: '#D2552E',
    content: [
      { type: 'p', text: 'Mushrooms soak up flavour beautifully, which makes them perfect for quick Indian cooking. Here are five simple, healthy recipes you can put together fast with fresh mushrooms.' },
      { type: 'callout', variant: 'tip', title: 'Prep tip', text: 'Wipe mushrooms with a damp cloth instead of soaking them, and cook on a high flame so they brown instead of stewing in their own water.' },
      { type: 'h2', text: '1. Garlic-Butter Mushrooms (10 minutes)' },
      { type: 'p', text: 'Heat butter, add chopped garlic and sauté sliced button or oyster mushrooms on high heat until golden. Season with salt, crushed pepper and a squeeze of lemon. Finish with coriander. A perfect quick side or toast topping.' },
      { type: 'h2', text: '2. Mushroom Masala (25 minutes)' },
      { type: 'p', text: 'Sauté onions, ginger and garlic, add tomato puree and everyday spices (turmeric, red chilli, coriander, garam masala). Add mushrooms and a splash of water, then simmer until the gravy thickens. Serve with roti or rice.' },
      { type: 'h2', text: '3. Mushroom Tikka (20 minutes + marinade)' },
      { type: 'p', text: 'Marinate king oyster or button mushrooms in thick curd with ginger-garlic paste, red chilli, garam masala and a little oil. Skewer with onion and capsicum and grill, air-fry or pan-roast until charred at the edges.' },
      { type: 'h2', text: '4. Mushroom Pulao (30 minutes)' },
      { type: 'p', text: 'Sauté whole spices and onions, add sliced mushrooms and soaked basmati rice, then cook with measured water until fluffy. A simple one-pot meal that lets the mushrooms shine.' },
      { type: 'h2', text: '5. Clear Mushroom Soup (15 minutes)' },
      { type: 'p', text: 'Simmer sliced oyster mushrooms with garlic, ginger, a little soy sauce and pepper in a light vegetable stock. Finish with spring onion and a few drops of lemon. Light, warming and packed with umami.' },
      { type: 'callout', variant: 'info', title: 'Make it your own', text: 'Oyster mushrooms work best in soups and stir-fries; king oyster shines on the grill; button and cremini are perfect for masala and pulao.' },
      { type: 'p', text: 'Every recipe tastes better with fresh mushrooms. Supr Mushrooms delivers organic, pesticide-free oyster, button, cremini and king oyster mushrooms across Delhi NCR within 24 hours of harvest.' },
      { type: 'takeaways', items: ['Cook mushrooms on high heat so they brown, not stew', 'Match the variety to the dish for the best texture', 'Most of these recipes are ready in 30 minutes or less', 'Fresh mushrooms make every recipe taste better'] },
    ],
    faq: [
      { q: 'Which mushrooms are best for Indian recipes?', a: 'Button and cremini mushrooms are great for masala and pulao, oyster mushrooms suit soups and stir-fries, and king oyster mushrooms are excellent grilled as tikka.' },
      { q: 'Should you wash mushrooms before cooking?', a: 'Wipe them with a damp cloth or rinse very quickly just before cooking. Avoid soaking — mushrooms absorb water and can turn soggy.' },
      { q: 'How do you keep mushrooms from getting watery when cooking?', a: 'Cook them on a high flame in a hot pan and avoid overcrowding, so the moisture evaporates and the mushrooms brown instead of stewing.' },
    ],
  },

  {
    slug: 'how-supr-mushrooms-works',
    title: 'How Supr Mushrooms Works: From Our Farm to Your Door',
    category: 'About Us',
    description:
      'A behind-the-scenes look at Supr Mushrooms — how we grow organic mushrooms with aeroponic vertical farming, and how easy it is to order fresh mushrooms online in Delhi NCR.',
    excerpt:
      'A behind-the-scenes look at how we grow, pack and deliver fresh organic mushrooms across Delhi NCR — and how to order in a few taps.',
    keywords: ['Supr Mushrooms', 'buy mushrooms online Delhi NCR', 'order fresh mushrooms Delhi', 'organic mushroom delivery Delhi', 'mushroom farm Delhi NCR'],
    date: '2026-05-26',
    readTime: '5 min read',
    cover: '/blog/how-supr-mushrooms-works.png',
    accent: '#BC6C25',
    content: [
      { type: 'p', text: 'Supr Mushrooms is a Delhi-NCR farm and online store built around one idea: get genuinely fresh, organic mushrooms from our farm to your kitchen as fast as possible. Here is how the whole thing works — from the growing room to your doorstep.' },
      { type: 'h2', text: 'How we grow' },
      { type: 'p', text: 'We grow our mushrooms using aeroponic vertical farming in a clean, climate-controlled room. There is no soil (so no heavy metals), and pests are kept out by design — which means no pesticides. The result is consistent, premium, 100% organic mushrooms, available all year round.' },
      { type: 'diagram', name: 'farm-to-door', caption: 'From harvest to your door, every order follows the same careful steps.' },
      { type: 'h2', text: 'How ordering works' },
      { type: 'p', text: 'Buying is simple and takes a few taps. You can order as a guest or create an account to track your orders and save a wishlist.' },
      { type: 'diagram', name: 'platform-flow', caption: 'The journey of an order on suprmushrooms.' },
      { type: 'h2', text: 'Order in 4 easy steps' },
      { type: 'diagram', name: 'how-to-order' },
      { type: 'h2', text: 'Payments & delivery' },
      { type: 'ul', items: ['Pay your way — Cash on Delivery (COD) or UPI', 'Free delivery across Delhi, Noida, Gurugram, Ghaziabad and Faridabad', 'Most orders arrive within 24 hours of harvest', 'An instant email confirms every order'] },
      { type: 'callout', variant: 'info', title: 'Buying for a restaurant or in bulk?', text: 'We supply restaurants, hotels and wholesalers across Delhi NCR with regular, fresh stock. Reach us at +91-8826986127 for wholesale pricing.' },
      { type: 'h2', text: 'Why customers choose us' },
      { type: 'ul', items: ['Genuinely fresh — delivered within 24 hours of harvest', '100% organic and pesticide-free', 'A range of varieties: oyster, button, cremini and king oyster', 'Simple online ordering with COD or UPI and free delivery'] },
      { type: 'takeaways', items: ['We grow with clean, soil-free aeroponic vertical farming', 'Order online as a guest or member in a few taps', 'Pay by COD or UPI with free NCR delivery', 'Fresh mushrooms at your door within 24 hours'] },
    ],
    faq: [
      { q: 'How do I order fresh mushrooms from Supr Mushrooms?', a: 'Browse the Shop, add mushrooms to your cart, and check out with Cash on Delivery or UPI. You will get an instant email confirmation and delivery within 24 hours across Delhi NCR.' },
      { q: 'Which areas do you deliver to?', a: 'We deliver across Delhi NCR — including Delhi, Noida, Gurugram, Ghaziabad and Faridabad — with free delivery.' },
      { q: 'Do you supply mushrooms in bulk to restaurants?', a: 'Yes. We supply restaurants, hotels and wholesalers across Delhi NCR. Call +91-8826986127 for wholesale pricing and regular supply.' },
    ],
  },
];

export const getPost = (slug: string) => blogPosts.find((p) => p.slug === slug);
