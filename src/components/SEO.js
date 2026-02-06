import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

const SEO = ({ title, description, keywords, image, url, type = "website" }) => {
    const location = useLocation();
    const siteTitle = "Air Ikan Store";
    const defaultDescription = "Pusat jual beli ikan hias dan ikan predator terlengkap di Jakarta. Menyediakan Channa, Arwana, Discus, dan perlengkapan aquarium berkualitas.";
    const defaultKeywords = "ikan predator, jual ikan predator, jual ikan hias, channa, maru, stewari, asiatica, auranti, barca, limbata, pulchra, andrao, arwana, super red, golden red, cupang, discus, datz, uaru, palmas, green sumatra, orna, denisoni blue electric, gaint travelly, GT, rsp kalimaya, ikan hias, aquarium, pakan ikan, air ikan store, toko ikan hias jakarta, supplier ikan hias";
    const siteUrl = "https://airikan.com";
    const defaultImage = `${siteUrl}/favicon.png`;

    const metaTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} - Pusat Ikan Predator & Hias di Jakarta`;
    const metaDescription = description || defaultDescription;
    const metaKeywords = keywords || defaultKeywords;
    const metaImage = image ? (image.startsWith("http") ? image : `${siteUrl}${image}`) : defaultImage;

    // Logic: If 'url' prop is provided, use it. 
    // Otherwise, use the current active location (pathname + search query).
    // This allows every page to self-canonicalize by default.
    const currentUrl = `${siteUrl}${location.pathname}${location.search}`;
    const metaUrl = url ? (url.startsWith("http") ? url : `${siteUrl}${url}`) : currentUrl;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{metaTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />
            <link rel="canonical" href={metaUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={metaUrl} />
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={metaUrl} />
            <meta property="twitter:title" content={metaTitle} />
            <meta property="twitter:description" content={metaDescription} />
            <meta property="twitter:image" content={metaImage} />

            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Store",
                    "name": "Air Ikan Store",
                    "url": siteUrl,
                    "logo": defaultImage,
                    "description": defaultDescription,
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Jakarta",
                        "addressCountry": "ID"
                    },
                    "contactPoint": {
                        "@type": "ContactPoint",
                        "telephone": "+6281284124422",
                        "contactType": "customer service"
                    }
                })}
            </script>
        </Helmet>
    );
};

export default SEO;
