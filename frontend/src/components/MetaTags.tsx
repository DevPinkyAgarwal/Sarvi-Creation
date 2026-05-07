import { Helmet } from 'react-helmet-async';

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function MetaTags({
  title = 'Sarvi Creation | Luxury Jewelry & Accessories',
  description = 'Experience the epitome of quiet luxury with Sarvi Creation. Explore our curated collection of fine jewelry and premium accessories.',
  keywords = 'jewelry, luxury, accessories, fine jewelry, diamonds, sarvi creation',
  image = 'https://res.cloudinary.com/dvz9v6p3p/image/upload/v1/sarvi/logo-meta.png', // Fallback meta image
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website'
}: MetaTagsProps) {
  const siteTitle = title.includes('Sarvi Creation') ? title : `${title} | Sarvi Creation`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Mobile Meta */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#000000" />
    </Helmet>
  );
}
