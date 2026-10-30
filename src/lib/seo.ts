// JSON-LD: Article은 모든 글, FAQPage는 FAQ가 있을 때만.
import { SITE } from '../config';
import type { Post } from './posts';

export function postJsonLd(post: Post, url: string, image: string) {
  const { title, description, date, updated, faq } = post.data;
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image,
    mainEntityOfPage: url,
    datePublished: date.toISOString(),
    dateModified: (updated ?? date).toISOString(),
    author: { '@type': 'Person', name: SITE.author },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
      logo: { '@type': 'ImageObject', url: `${SITE.url}/brand/alzza-logo-480.png` },
    },
  };
  if (faq.length === 0) return article;
  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  return [article, faqPage];
}
