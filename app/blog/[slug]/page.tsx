import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Lightbulb, Info, AlertTriangle, Sparkles } from 'lucide-react';
import { blogPosts, getPost, type BlogBlock } from '@/lib/blog';
import { ArticleSchema, BreadcrumbSchema, FAQJsonLd } from '@/components/shared/SEO';
import { BlogDiagram } from '@/components/blog/Diagrams';
import { SITE_URL } from '@/lib/config';

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: 'Article Not Found | Supr Mushrooms' };
  return {
    title: `${post.title} | Supr Mushrooms`,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      url: `${SITE_URL}/blog/${post.slug}`,
      images: [post.cover],
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description, images: [post.cover] },
  };
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const CALLOUT = {
  tip: { icon: Lightbulb, cls: 'border-emerald-200 dark:border-emerald-500/25 bg-emerald-50 dark:bg-emerald-500/10', ic: 'text-emerald-600 dark:text-emerald-400' },
  info: { icon: Info, cls: 'border-brand-brown/25 bg-brand-brown/5', ic: 'text-brand-brown' },
  warning: { icon: AlertTriangle, cls: 'border-amber-200 dark:border-amber-500/25 bg-amber-50 dark:bg-amber-500/10', ic: 'text-amber-600 dark:text-amber-400' },
};

function Block({ b, dropCap }: { b: BlogBlock; dropCap?: boolean }) {
  switch (b.type) {
    case 'h2':
      return <h2 id={slugify(b.text)} className="scroll-mt-28 text-2xl md:text-3xl font-serif font-bold text-brand-text pt-6">{b.text}</h2>;
    case 'p':
      return (
        <p className={`text-brand-text/90 leading-[1.8] text-[17px] ${dropCap ? 'first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-brand-brown first-letter:mr-2 first-letter:float-left first-letter:leading-[0.85]' : ''}`}>
          {b.text}
        </p>
      );
    case 'ul':
      return (
        <ul className="space-y-2 pl-1">
          {b.items.map((it, j) => (
            <li key={j} className="flex gap-3 text-brand-text/90 leading-relaxed">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-brown shrink-0" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case 'callout': {
      const c = CALLOUT[b.variant || 'info'];
      const Icon = c.icon;
      return (
        <div className={`rounded-2xl border p-5 flex gap-3 ${c.cls}`}>
          <Icon size={22} className={`${c.ic} shrink-0 mt-0.5`} />
          <div>
            {b.title && <p className="font-bold text-brand-text">{b.title}</p>}
            <p className="text-brand-text/80 text-sm leading-relaxed mt-0.5">{b.text}</p>
          </div>
        </div>
      );
    }
    case 'diagram':
      return (
        <figure className="my-2">
          <BlogDiagram name={b.name} />
          {b.caption && <figcaption className="text-center text-xs text-brand-muted mt-3">{b.caption}</figcaption>}
        </figure>
      );
    case 'quote':
      return <blockquote className="border-l-4 border-brand-brown pl-5 italic text-brand-text/80 text-lg">{b.text}</blockquote>;
    case 'takeaways':
      return (
        <div className="rounded-2xl bg-brand-brown/5 border border-brand-brown/20 p-6">
          <p className="font-bold text-brand-text flex items-center gap-2 mb-3"><Sparkles size={18} className="text-brand-brown" /> Key takeaways</p>
          <ul className="space-y-2">
            {b.items.map((it, j) => (
              <li key={j} className="flex gap-3 text-brand-text/90 text-sm"><span className="text-brand-brown font-bold">✓</span>{it}</li>
            ))}
          </ul>
        </div>
      );
    default:
      return null;
  }
}

export default async function BlogArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const toc = post.content.filter((b): b is Extract<BlogBlock, { type: 'h2' }> => b.type === 'h2');
  const firstParagraphIdx = post.content.findIndex((b) => b.type === 'p');

  return (
    <article className="pb-20 bg-brand-light min-h-screen">
      <ArticleSchema article={{ title: post.title, description: post.description, image: `${SITE_URL}${post.cover}`, datePublished: post.date, url: `${SITE_URL}/blog/${post.slug}` }} />
      <BreadcrumbSchema items={[{ name: 'Home', url: SITE_URL }, { name: 'Blog', url: `${SITE_URL}/blog` }, { name: post.title, url: `${SITE_URL}/blog/${post.slug}` }]} />
      <FAQJsonLd items={post.faq} id={`faq-${post.slug}`} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <Link href="/blog" className="inline-flex items-center gap-2 text-brand-brown font-medium mb-6 hover:underline">
          <ArrowLeft size={18} /> All articles
        </Link>

        {/* Cover */}
        <div className="rounded-3xl overflow-hidden border border-brand-cream shadow-sm">
          <Image src={post.cover} alt={post.title} width={1200} height={630} className="w-full h-auto" priority />
        </div>

        {/* Header */}
        <div className="mt-8">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-white px-3 py-1 rounded-full" style={{ backgroundColor: post.accent }}>
            {post.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-brand-text leading-tight mt-4">{post.title}</h1>
          <div className="flex items-center gap-3 text-sm text-brand-muted mt-4">
            <span>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
          <p className="text-lg text-brand-muted mt-5 leading-relaxed">{post.excerpt}</p>
        </div>

        {/* Table of contents */}
        {toc.length > 2 && (
          <nav className="mt-8 rounded-2xl bg-white dark:bg-brand-darkCream border border-brand-cream p-5">
            <p className="text-xs font-bold text-brand-muted uppercase tracking-wide mb-3">In this article</p>
            <ol className="space-y-2 list-decimal list-inside">
              {toc.map((h) => (
                <li key={h.text}>
                  <a href={`#${slugify(h.text)}`} className="text-brand-text/80 hover:text-brand-brown text-sm transition-colors">{h.text}</a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Body */}
        <div className="mt-10 space-y-6">
          {post.content.map((b, i) => <Block key={i} b={b} dropCap={i === firstParagraphIdx} />)}
        </div>

        {/* FAQ */}
        {post.faq.length > 0 && (
          <section className="mt-14 pt-10 border-t border-brand-cream">
            <h2 className="text-2xl font-serif font-bold text-brand-text mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {post.faq.map((f, i) => (
                <div key={i} className="bg-white dark:bg-brand-darkCream border border-brand-cream rounded-2xl p-5">
                  <h3 className="font-bold text-brand-text">{f.q}</h3>
                  <p className="text-brand-muted mt-2 text-sm leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="mt-12 bg-brand-brown text-white rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-serif font-bold">Fresh, organic mushrooms — delivered</h2>
          <p className="text-white/80 mt-2">Farm-fresh oyster, button, cremini &amp; king oyster mushrooms across Delhi NCR within 24 hours.</p>
          <Link href="/#shop" className="inline-flex items-center gap-2 bg-white text-brand-brown font-bold px-6 py-3 rounded-full mt-5 hover:scale-105 transition-transform">Shop fresh mushrooms</Link>
        </div>
      </div>
    </article>
  );
}
