import { Helmet } from 'react-helmet-async';

interface SchemaOrgProps {
  type: 'Product' | 'Organization' | 'BreadcrumbList' | 'LocalBusiness';
  data: any;
}

export default function SchemaOrg({ type, data }: SchemaOrgProps) {
  // Common Organization Data
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Sarvi Creation",
    "url": "https://sarvicreation.com",
    "logo": "https://res.cloudinary.com/dvz9v6p3p/image/upload/v1/sarvi/logo-meta.png",
    "sameAs": [
      "https://www.instagram.com/sarvi.creations",
      // Add other social links here
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-7080803366",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": "en"
    }
  };

  const getSchemaData = () => {
    switch (type) {
      case 'Product':
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": data.name,
          "image": data.images?.map((img: any) => img.url),
          "description": data.description,
          "sku": data.sku || data._id,
          "brand": {
            "@type": "Brand",
            "name": "Sarvi Creation"
          },
          "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "priceCurrency": "INR",
            "price": data.basePrice,
            "availability": data.stockQuantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": {
              "@type": "Organization",
              "name": "Sarvi Creation"
            }
          },
          "aggregateRating": data.ratingsQuantity > 0 ? {
            "@type": "AggregateRating",
            "ratingValue": data.ratingsAverage,
            "reviewCount": data.ratingsQuantity
          } : undefined
        };
      case 'Organization':
        return organizationData;
      case 'LocalBusiness':
        return {
          ...organizationData,
          "@type": "JewelryStore",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "4301, 1st Floor, KGB ka Rasta, 1st Crossing, Johari Bazar",
            "addressLocality": "Jaipur",
            "addressRegion": "Rajasthan",
            "postalCode": "302003",
            "addressCountry": "IN"
          },
          "telephone": "+91-7080803366",
          "priceRange": "₹₹₹"
        };
      case 'BreadcrumbList':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data.items.map((item: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          }))
        };
      default:
        return null;
    }
  };

  const schemaData = getSchemaData();

  if (!schemaData) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
}
