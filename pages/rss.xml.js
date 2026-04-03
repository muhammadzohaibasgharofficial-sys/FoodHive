// ============================================================
// FoodHive World — pages/rss.xml.js
// RSS Feed for Google News / Feed readers
// ============================================================

import { getAllRecipes } from '../lib/data'

const BASE_URL = 'https://foodhive.vercel.app'

export default function RSS() { return null }

export async function getServerSideProps({ res }) {
  const recipes = getAllRecipes().slice(0, 50)

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>FoodHive World — Authentic World Recipes</title>
    <link>${BASE_URL}</link>
    <description>Authentic recipes from 10 countries — Asian, European, Chinese, Korean, Indian, Mexican, Japanese, Italian, Middle Eastern, American. Updated every 30 minutes.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200</url>
      <title>FoodHive World</title>
      <link>${BASE_URL}</link>
    </image>
${recipes.map(r => `    <item>
      <title><![CDATA[${r.title}]]></title>
      <link>${BASE_URL}/recipes/${r.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/recipes/${r.slug}</guid>
      <description><![CDATA[${r.description || ''}]]></description>
      <pubDate>${new Date(r.publishedAt || Date.now()).toUTCString()}</pubDate>
      <category>${r.countryName || ''} ${r.categoryName || ''}</category>
      <media:content url="${r.image1 || ''}" medium="image"/>
    </item>`).join('\n')}
  </channel>
</rss>`

  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=300')
  res.write(rss)
  res.end()

  return { props: {} }
}
