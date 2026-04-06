import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

        {/* SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

        {/* Open Graph (Pinterest + Facebook) */}
        <meta property="og:site_name" content="FoodHive World" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="FoodHive World - Best Global Recipes" />
        <meta property="og:description" content="Discover authentic recipes from 10 countries. Easy, delicious and auto-updated recipes." />
        <meta property="og:image" content="https://food-hive-one.vercel.app/og-image.jpg" />
        <meta property="og:url" content="https://food-hive-one.vercel.app" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FoodHive World - Best Global Recipes" />
        <meta name="twitter:description" content="Explore global recipes with step-by-step cooking guides." />
        <meta name="twitter:image" content="https://food-hive-one.vercel.app/og-image.jpg" />

        {/* Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "FoodHive World",
              "url": "https://food-hive-one.vercel.app",
              "description": "Authentic recipes from 10 countries, auto-published every 30 minutes.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://food-hive-one.vercel.app/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
