import { getAllRecipes, getAllCategories } from '../lib/data'

const SITE_URL = 'https://nexi-post.vercel.app'

export async function getServerSideProps({ res }) {
  const recipes = await getAllRecipes()
  const categories = await getAllCategories()

  const urls = [
    `${SITE_URL}/`,
    `${SITE_URL}/recipes`,
    ...recipes.map(r => `${SITE_URL}/recipes/${r.slug}`),
    ...categories.map(c => `${SITE_URL}/categories/${c.slug}`)
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(url => {
      return `
    <url>
      <loc>${url}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`
    })
    .join('')}
</urlset>`

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return { props: {} }
}

export default function Sitemap() {
  return null
}
