// ============================================================
// FoodHive World — robots.txt (Fixed BASE_URL)
// ============================================================

export default function Robots() { return null }

export async function getServerSideProps({ res }) {
  const robots = `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://food-hive-one.vercel.app/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Disallow admin/system paths
Disallow: /api/
Disallow: /_next/
`

  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Cache-Control', 'public, s-maxage=86400')
  res.write(robots)
  res.end()

  return { props: {} }
}
