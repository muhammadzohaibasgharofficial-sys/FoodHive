// ============================================================
// FoodHive World — Dynamic Sitemap (Fixed BASE_URL)
// Covers: homepage, countries, categories, all recipe pages
// ============================================================

import { COUNTRIES, RECIPE_CATEGORIES, getAllRecipeSlugs } from '../lib/data'

// ✅ FIXED: Use actual website domain
const BASE_URL = 'https://food-hive-one.vercel.app'

function generateSitemap(slugs) {
  const today = new Date().toISOString().split('T')[0]

  const staticPages = [
    { url: '', priority: '1.0', freq: 'daily' },
    { url: '/recipes', priority: '0.9', freq: 'hourly' },
  ]

  const countryPages = COUNTRIES.map(c => ({
    url: `/countries/${c.id}`,
    priority: '0.9',
    freq: 'hourly'
  }))

  const categoryPages = RECIPE_CATEGORIES.map(c => ({
    url: `/categories/${c.id}`,
    priority: '0.8',
    freq: 'daily'
  }))

  const recipePages = slugs.map(s => ({
    url: `/recipes/${s}`,
    priority: '0.7',
    freq: 'weekly'
  }))

  const allPages = [...staticPages, ...countryPages, ...categoryPages, ...recipePages]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${BASE_URL}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`
}

export default function Sitemap() { return null }

export async function getServerSideProps({ res }) {
  const slugData = getAllRecipeSlugs()
  const slugs = slugData.map(s => s.params.slug)
  const sitemap = generateSitemap(slugs)

  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=600')
  res.write(sitemap)
  res.end()

  return { props: {} }
}
