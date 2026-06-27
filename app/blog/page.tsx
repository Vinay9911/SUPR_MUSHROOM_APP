import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen } from 'lucide-react';
import { blogPosts } from '@/lib/blog';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Mushroom Blog — Recipes, Health Benefits & Guides | Supr Mushrooms',
  description:
    'Practical guides on mushroom nutrition, storage, cooking and farming from Supr Mushrooms — Delhi NCR’s organic vertical mushroom farm.',
  keywords: ['mushroom blog', 'mushroom recipes', 'mushroom health benefits', 'how to cook mushrooms', 'mushrooms Delhi NCR'],
  alternates: { canonical: `${SITE_URL}/blog` },
};

function Chip({ category, accent }: { category: string; accent: string }) {
  return (
    <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-white px-3 py-1 rounded-full" style={{ backgroundColor: accent }}>
      {category}
    </span>
  );
}

export default function BlogIndex() {
  const posts = [...blogPosts].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const [featured, ...rest] = posts;

  return (
    <div className="pt-28 pb-20 bg-brand-light min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-brand-brown uppercase tracking-widest">
            <BookOpen size={16} /> Supr Mushrooms Blog
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-text mt-3">Mushroom Guides, Recipes &amp; Nutrition</h1>
          <p className="text-brand-muted mt-4 max-w-2xl mx-auto">
            Practical tips on choosing, storing, cooking and growing fresh mushrooms — from Delhi NCR’s organic vertical farm.
          </p>
        </header>

        {/* Featured */}
        <Link
          href={`/blog/${featured.slug}`}
          className="group block bg-white dark:bg-brand-darkCream border border-brand-cream rounded-3xl overflow-hidden mb-10 hover:shadow-xl transition-all"
        >
          <div className="overflow-hidden">
            <Image src={featured.cover} alt={featured.title} width={1200} height={630} className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-500" priority />
          </div>
          <div className="p-6 md:p-8">
            <Chip category={featured.category} accent={featured.accent} />
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-brand-text mt-3 group-hover:text-brand-brown transition-colors leading-snug">{featured.title}</h2>
            <div className="flex items-center gap-3 text-xs text-brand-muted mt-3">
              <span>{new Date(featured.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span>•</span>
              <span>{featured.readTime}</span>
            </div>
            <p className="text-brand-muted mt-4 leading-relaxed max-w-3xl">{featured.excerpt}</p>
            <span className="inline-flex items-center gap-1 text-brand-brown font-bold mt-5">Read article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></span>
          </div>
        </Link>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {rest.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex flex-col bg-white dark:bg-brand-darkCream border border-brand-cream rounded-3xl overflow-hidden hover:shadow-xl dark:hover:border-brand-brown/40 hover:-translate-y-1 transition-all">
              <div className="overflow-hidden">
                <Image src={p.cover} alt={p.title} width={1200} height={630} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <Chip category={p.category} accent={p.accent} />
                <h2 className="text-lg font-bold text-brand-text mt-3 group-hover:text-brand-brown transition-colors leading-snug line-clamp-2">{p.title}</h2>
                <p className="text-brand-muted mt-2 text-sm leading-relaxed line-clamp-3 flex-grow">{p.excerpt}</p>
                <div className="flex items-center justify-between mt-4 text-xs text-brand-muted">
                  <span>{p.readTime}</span>
                  <span className="inline-flex items-center gap-1 text-brand-brown font-bold">Read <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
