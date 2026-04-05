// ============================================================
// FoodHive World — pages/rss.xml.js
// Complete RSS Feed with Media/Image support for Social Media
// Covers: Facebook, Instagram, Pinterest, X/Twitter, Threads
// URL: food-hive-one.vercel.app/rss.xml
// ============================================================

import { getAllRecipes, COUNTRIES, RECIPE_CATEGORIES } from '../lib/data'

const BASE_URL = 'https://food-hive-one.vercel.app'

export default function RSS() { return null }

export async function getServerSideProps({ res }) {

  // Get latest 50 recipes — sorted by publishedAt (newest first)
  const allRecipes = getAllRecipes()
  const recipes = allRecipes.slice(0, 50)

  // ── Helper: Safe XML string — removes chars that break XML ──
  function safeXml(str) {
    if (!str) return ''
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // remove control chars
  }

  // ── Helper: Safe CDATA — removes ]]> which breaks CDATA ──
  function safeCdata(str) {
    if (!str) return ''
    return String(str).replace(/\]\]>/g, ']]]]><![CDATA[>')
  }

  // ── Helper: ISO date to RFC 822 (RSS standard) ──
  function toRfc822(dateStr) {
    try {
      return new Date(dateStr || Date.now()).toUTCString()
    } catch (e) {
      return new Date().toUTCString()
    }
  }

  // ── Helper: Get country object by id ──
  function getCountry(countryId) {
    return COUNTRIES.find(c => c.id === countryId) || null
  }

  // ── Helper: Get category object by id ──
  function getCategory(categoryId) {
    return RECIPE_CATEGORIES.find(c => c.id === categoryId) || null
  }

  // ── Helper: Build hashtags from recipe tags ──
  function buildHashtags(recipe) {
    const tags = []
    if (recipe.countryName) tags.push(recipe.countryName.replace(/\s+/g, ''))
    if (recipe.cuisine) tags.push(recipe.cuisine.replace(/\s+/g, ''))
    if (recipe.categoryName) tags.push(recipe.categoryName.replace(/\s+/g, ''))
    tags.push('FoodHive', 'Recipes', 'Food', 'Cooking', 'WorldFood')
    // Add first 3 custom tags if available
    if (Array.isArray(recipe.tags)) {
      recipe.tags.slice(0, 3).forEach(t => {
        const clean = t.replace(/\s+/g, '')
        if (clean && !tags.includes(clean)) tags.push(clean)
      })
    }
    return tags.map(t => '#' + t).join(' ')
  }

  // ── Helper: Short description (max 200 chars) ──
  function shortDesc(str, max = 200) {
    if (!str) return ''
    if (str.length <= max) return str
    return str.slice(0, max - 3) + '...'
  }

  // ── Build each <item> ──
  const items = recipes.map(recipe => {
    const recipeUrl  = `${BASE_URL}/recipes/${recipe.slug}`
    const image1     = recipe.image1 || `${BASE_URL}/og-default.jpg`
    const image2     = recipe.image2 || image1
    const title      = recipe.title || 'FoodHive Recipe'
    const desc       = recipe.description || ''
    const shortDescription = shortDesc(desc)
    const hashtags   = buildHashtags(recipe)
    const pubDate    = toRfc822(recipe.publishedAt)
    const difficulty = recipe.difficulty || 'Medium'
    const totalTime  = recipe.totalTime || ''
    const rating     = recipe.rating || '4.8'
    const reviews    = recipe.reviews || '312'
    const servings   = recipe.servings || 4
    const cuisine    = recipe.cuisine || recipe.countryName || ''
    const flag       = recipe.countryFlag || ''
    const catIcon    = recipe.categoryIcon || ''
    const catName    = recipe.categoryName || ''
    const countryName = recipe.countryName || ''

    // Social-ready caption (for Instagram, Facebook, Threads)
    const socialCaption = `${flag} ${title}\n\n${shortDescription}\n\n⏱ ${totalTime} | ⭐ ${rating}/5 | 👥 ${servings} servings\n🍽️ ${cuisine} ${catName}\n\n👉 Full Recipe: ${recipeUrl}\n\n${hashtags}`

    // Twitter/X caption (max 280 chars including URL)
    const tweetText = `${flag} ${title}\n\n${shortDesc(desc, 100)}\n\n${recipeUrl}\n\n#FoodHive #${cuisine.replace(/\s/g,'')} #Recipe`

    return `    <item>
      <title><![CDATA[${safeCdata(title)}]]></title>
      <link>${recipeUrl}</link>
      <guid isPermaLink="true">${recipeUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${safeCdata(shortDescription)}]]></description>
      <category><![CDATA[${safeCdata(countryName)} — ${safeCdata(catName)}]]></category>

      <!-- ═══ MEDIA / IMAGE — for RSS readers & social media ═══ -->
      <media:content
        url="${safeXml(image1)}"
        medium="image"
        type="image/jpeg"
        width="940"
        height="650"
        isDefault="true"/>
      <media:thumbnail
        url="${safeXml(image1)}"
        width="300"
        height="200"/>
      <media:description type="plain"><![CDATA[${safeCdata(title)} — Authentic ${safeCdata(cuisine)} ${safeCdata(catName)} recipe on FoodHive World.]]></media:description>
      <media:title><![CDATA[${safeCdata(title)}]]></media:title>

      <!-- ═══ ENCLOSURE — required for some RSS readers & Activepieces ═══ -->
      <enclosure
        url="${safeXml(image1)}"
        type="image/jpeg"
        length="102400"/>

      <!-- ═══ FULL CONTENT — rendered in social media & RSS readers ═══ -->
      <content:encoded><![CDATA[
        <div style="font-family: sans-serif; max-width: 680px; margin: 0 auto;">
          <img
            src="${safeCdata(image1)}"
            alt="${safeCdata(title)}"
            style="width:100%; border-radius:12px; margin-bottom:16px;"
          />
          <h1>${safeCdata(title)}</h1>
          <p>${safeCdata(desc)}</p>
          <table style="border-collapse:collapse; width:100%; margin:16px 0;">
            <tr>
              <td style="padding:8px; border:1px solid #eee;">⏱ <strong>Total Time</strong></td>
              <td style="padding:8px; border:1px solid #eee;">${safeCdata(totalTime)}</td>
              <td style="padding:8px; border:1px solid #eee;">⭐ <strong>Rating</strong></td>
              <td style="padding:8px; border:1px solid #eee;">${rating}/5 (${reviews} reviews)</td>
            </tr>
            <tr>
              <td style="padding:8px; border:1px solid #eee;">🍽️ <strong>Cuisine</strong></td>
              <td style="padding:8px; border:1px solid #eee;">${flag} ${safeCdata(cuisine)}</td>
              <td style="padding:8px; border:1px solid #eee;">📂 <strong>Category</strong></td>
              <td style="padding:8px; border:1px solid #eee;">${catIcon} ${safeCdata(catName)}</td>
            </tr>
            <tr>
              <td style="padding:8px; border:1px solid #eee;">💪 <strong>Difficulty</strong></td>
              <td style="padding:8px; border:1px solid #eee;">${safeCdata(difficulty)}</td>
              <td style="padding:8px; border:1px solid #eee;">👥 <strong>Servings</strong></td>
              <td style="padding:8px; border:1px solid #eee;">${servings}</td>
            </tr>
          </table>
          <a href="${recipeUrl}"
            style="display:inline-block; background:#3D9E8C; color:white; padding:14px 28px;
                   border-radius:999px; text-decoration:none; font-weight:bold; font-size:16px;">
            👉 View Full Recipe
          </a>
          <p style="margin-top:20px; color:#888; font-size:13px;">${hashtags}</p>
        </div>
      ]]></content:encoded>

      <!-- ═══ CUSTOM FIELDS — Activepieces flow mein use honge ═══ -->
      <fh:slug>${safeXml(recipe.slug)}</fh:slug>
      <fh:country>${safeXml(recipe.country)}</fh:country>
      <fh:countryName>${safeXml(countryName)}</fh:countryName>
      <fh:countryFlag>${safeXml(flag)}</fh:countryFlag>
      <fh:category>${safeXml(recipe.category)}</fh:category>
      <fh:categoryName>${safeXml(catName)}</fh:categoryName>
      <fh:categoryIcon>${safeXml(catIcon)}</fh:categoryIcon>
      <fh:cuisine>${safeXml(cuisine)}</fh:cuisine>
      <fh:difficulty>${safeXml(difficulty)}</fh:difficulty>
      <fh:totalTime>${safeXml(totalTime)}</fh:totalTime>
      <fh:rating>${rating}</fh:rating>
      <fh:reviews>${reviews}</fh:reviews>
      <fh:servings>${servings}</fh:servings>
      <fh:image1>${safeXml(image1)}</fh:image1>
      <fh:image2>${safeXml(image2)}</fh:image2>
      <fh:hashtags>${safeXml(hashtags)}</fh:hashtags>
      <fh:socialCaption><![CDATA[${safeCdata(socialCaption)}]]></fh:socialCaption>
      <fh:tweetText><![CDATA[${safeCdata(tweetText)}]]></fh:tweetText>
    </item>`
  }).join('\n')

  // ── Build complete RSS XML ──
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:fh="https://food-hive-one.vercel.app/ns/feedhive">
  <channel>
    <title>FoodHive World — Authentic Recipes from 10 Countries</title>
    <link>${BASE_URL}</link>
    <description>Authentic recipes from 10 world cuisines — Pakistani, Turkish, Chinese, Korean, Indian, Mexican, Japanese, Italian, Middle Eastern and American. Auto-published every 30 minutes by AI.</description>
    <language>en-us</language>
    <copyright>FoodHive World © ${new Date().getFullYear()}</copyright>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>30</ttl>
    <image>
      <url>${BASE_URL}/favicon.ico</url>
      <title>FoodHive World</title>
      <link>${BASE_URL}</link>
      <width>144</width>
      <height>144</height>
    </image>
    <atom:link
      href="${BASE_URL}/rss.xml"
      rel="self"
      type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=300')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.write(rss)
  res.end()

  return { props: {} }
}
