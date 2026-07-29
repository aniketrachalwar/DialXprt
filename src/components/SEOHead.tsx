import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Vendor } from '../types';

interface SEOHeadProps {
  title: string;
  description: string;
  locality?: string;
  service?: string;
  vendors?: Vendor[];
}

export const SEOHead: React.FC<SEOHeadProps> = ({ title, description, locality, service, vendors }) => {
  // Generate LocalBusiness Schema
  const generateSchema = () => {
    if (!vendors || vendors.length === 0) return null;

    const itemListElement = vendors.map((vendor, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "LocalBusiness",
        "name": vendor.name,
        "image": vendor.imageUrl,
        "telephone": vendor.phone || vendor.whatsapp,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": vendor.neighborhood,
          "addressRegion": vendor.city,
          "postalCode": vendor.pincode,
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": vendor.lat,
          "longitude": vendor.lng
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": vendor.rating || 4.8,
          "reviewCount": vendor.reviewsCount || 10
        }
      }
    }));

    const schema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": itemListElement
    };

    return JSON.stringify(schema);
  };

  const schemaJson = generateSchema();

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* Structured Data (Schema.org) */}
      {schemaJson && (
        <script type="application/ld+json">
          {schemaJson}
        </script>
      )}
    </Helmet>
  );
};
