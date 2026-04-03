// ============================================================
// FoodHive World — Homepage
// Premium beige/cream design, floating circular food images
// ============================================================
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { COUNTRIES, RECIPE_CATEGORIES, getAllRecipes, SAMPLE_RECIPE } from '../lib/data'

// ── Orbit positions (5 satellites around center) ──
const ORBIT_POSITIONS = [
  { top: '4%',  left: '50%', size: 90,  delay: '0s',    translateX: '-50%' },
  { top: '22%', left: '88%', size: 75,  delay: '0.4s',  translateX: '0' },
  { top: '68%', left: '82%', size: 80,  delay: '0.8s',  translateX: '0' },
  { top: '72%', left: '14%', size: 75,  delay: '1.2s',  translateX: '0' },
  { top: '22%', left: '4%',  size: 82,  delay: '1.6s',  translateX: '0' },
]

function RecipeCard({ recipe }) {
  return (
    <Link href={`/recipes/${recipe.slug}`}>
      <div className="recipe-card">
        <div className="recipe-card-top">
          <img src={recipe.image1} alt={recipe.title} loading="lazy" />
          <div className="recipe-card-top-overlay" />
          <div className="recipe-card-badges">
            <span className="recipe-badge-cat">{recipe.categoryIcon} {recipe.categoryName}</span>
            <span className="recipe-badge-country">{recipe.countryFlag} {recipe.countryName}</span>
          </div>
        </div>
        <div className="recipe-card-circle">
          <img className="recipe-card-circle-img" src={recipe.image2 || recipe.image1} alt={recipe.title} loading="lazy" />
        </div>
        <div className="recipe-card-body">
          <h3 className="recipe-card-title">{recipe.title}</h3>
          <p className="recipe-card-desc">{recipe.description}</p>
          <div className="recipe-card-meta">
            <span>⏱ {recipe.totalTime}</span>
            <span>👥 {recipe.servings} servings</span>
          </div>
          <div className="recipe-card-footer">
            <div className="recipe-rating">⭐ {recipe.rating} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({recipe.reviews})</span></div>
            <span className="recipe-view-btn">View Recipe →</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function HomePage({ latestRecipes, recipesByCountry, heroRecipes }) {
  const [searchQ, setSearchQ] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQ.trim()) window.location.href = `/search?q=${encodeURIComponent(searchQ)}`
  }

  // Hero orbit images (use first 5 latest recipe images or fallbacks)
  const orbitImgs = [
    heroRecipes[1]?.image1, heroRecipes[2]?.image1,
    heroRecipes[3]?.image1, heroRecipes[4]?.image1,
    heroRecipes[5]?.image1,
  ].map(i => i || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400')

  const centerImg = heroRecipes[0]?.image1 || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'

  return (
    <>
      <Head>
        <title>FoodHive World — Authentic Recipes from 10 Countries</title>
        <meta name="description" content="Explore authentic recipes from 10 world cuisines — Asian, European, Chinese, Korean, Indian, Mexican, Japanese, Italian, Middle Eastern, American. New recipes every 30 minutes." />
        <meta property="og:title" content="FoodHive World — Authentic Recipes from 10 Countries" />
        <meta property="og:description" content="10 cuisines, 12 categories, AI-published every 30 minutes." />
        <meta property="og:image" content={centerImg} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://foodhive.vercel.app" />
      </Head>

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="logo">
            🍽️ FoodHive <span className="logo-badge">WORLD</span>
          </Link>
          <div className="nav-links">
            <Link href="/#countries" className="nav-link">Countries</Link>
            <Link href="/#categories" className="nav-link">Categories</Link>
            <Link href="/recipes" className="nav-link">All Recipes</Link>
          </div>
          <form onSubmit={handleSearch}>
            <div className="nav-search">
              <span style={{ fontSize: '16px', opacity: 0.5 }}>🔍</span>
              <input
                type="text" placeholder="Search recipes, cuisines..."
                value={searchQ} onChange={e => setSearchQ(e.target.value)}
              />
            </div>
          </form>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="container">
          <div className="hero-inner">
            {/* Left */}
            <div className="hero-left fade-up">
              <div className="hero-tag">
                <span className="hero-tag-dot" />
                Updated Every 30 Minutes
              </div>
              <h1 className="hero-title">
                Discover <em>World</em><br />Cuisine Recipes
              </h1>
              <p className="hero-subtitle">
                Authentic recipes from 10 countries — Asian, European, Chinese, Korean, Indian, Mexican, Japanese, Italian, Middle Eastern & American. 12 categories, AI-crafted with love.
              </p>
              <div className="hero-actions">
                <Link href="/#countries" className="btn-primary">🌍 Explore Countries</Link>
                <Link href="/recipes" className="btn-secondary">All Recipes →</Link>
              </div>
              <div className="hero-stats">
                {[
                  { num: '10', label: 'Cuisines' },
                  { num: '12', label: 'Categories' },
                  { num: '30m', label: 'Update Rate' },
                  { num: '1200+', label: 'Recipes' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="hero-stat-num">{s.num}</div>
                    <div className="hero-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — floating orbit */}
            <div className="hero-orbit">
              {/* Dashed ring */}
              <div className="orbit-ring" style={{ width: 420, height: 420 }} />
              {/* Center image */}
              <div className="orbit-center">
                <img src={centerImg} alt="Featured Recipe" />
              </div>
              {/* Satellite images */}
              {ORBIT_POSITIONS.map((pos, i) => (
                <div key={i} className="orbit-item" style={{
                  top: pos.top, left: pos.left,
                  width: pos.size, height: pos.size,
                  transform: `translateX(${pos.translateX})`,
                  animationDelay: pos.delay,
                  animation: `orbitFloat ${3.5 + i * 0.4}s ease-in-out ${pos.delay} infinite`,
                }}>
                  <img src={orbitImgs[i]} alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COUNTRIES ── */}
      <section id="countries" className="section" style={{ background: 'var(--cream-dark)' }}>
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-eyebrow">10 World Cuisines</div>
            <h2 className="section-title">Choose Your <em>Cuisine</em></h2>
            <p className="section-desc">
              Click any country to browse all 12 recipe categories — from breakfast to baking, seafood to desserts.
            </p>
          </div>
          <div className="countries-grid">
            {COUNTRIES.map((country, i) => {
              const count = (recipesByCountry[country.id] || []).length
              return (
                <Link key={country.id} href={`/countries/${country.id}`}>
                  <div className="country-card fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="country-card-img">
                      <img src={country.image} alt={country.name} loading="lazy" />
                      <div className="country-card-overlay">
                        <div className="country-flag-big">{country.flag}</div>
                        <div className="country-card-name">{country.name}</div>
                      </div>
                    </div>
                    <div className="country-card-body" style={{ borderTop: `3px solid ${country.color}` }}>
                      <p className="country-card-desc">{country.desc}</p>
                      <div className="country-card-pills">
                        {RECIPE_CATEGORIES.slice(0, 4).map(c => (
                          <span key={c.id} className="country-pill" style={{ background: country.bgColor, color: country.color }}>{c.icon}</span>
                        ))}
                        <span className="country-pill" style={{ background: country.bgColor, color: country.color }}>+8</span>
                      </div>
                      <div className="country-card-cta">
                        <span>{count > 0 ? `${count} recipes` : '12 categories'}</span>
                        <span>Explore →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 12 CATEGORIES ── */}
      <section id="categories" className="section" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-eyebrow">Browse by Type</div>
            <h2 className="section-title">All <em>12 Categories</em></h2>
          </div>
          <div className="categories-grid">
            {RECIPE_CATEGORIES.map((cat, i) => (
              <Link key={cat.id} href={`/categories/${cat.id}`}>
                <div className="category-card fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="category-icon">{cat.icon}</div>
                  <div className="category-name">{cat.name}</div>
                  <div className="category-count">{cat.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── LATEST RECIPES ── */}
      <section className="section" style={{ background: 'var(--cream-dark)' }}>
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-eyebrow">Just Published</div>
            <h2 className="section-title">Latest <em>Recipes</em></h2>
          </div>
          <div className="recipes-grid">
            {latestRecipes.slice(0, 6).map((r, i) => (
              <div key={r.slug || i} className="fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <RecipeCard recipe={r} />
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '56px' }}>
            <Link href="/recipes" className="btn-primary">View All Recipes →</Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" style={{ background: 'var(--dark)' }}>
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-eyebrow" style={{ color: 'var(--gold-light)' }}>Powered by AI</div>
            <h2 className="section-title" style={{ color: 'white' }}>New Recipe <em>Every 30 Minutes</em></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              { icon: '🌍', title: '10 Country Rotation', desc: 'Country 1 all categories → Country 2 all categories → ... → Country 10 → repeat cycle.' },
              { icon: '🤖', title: 'Gemini AI Writes', desc: 'Google Gemini AI generates complete authentic recipes with ingredients, steps, nutrition & chef tips.' },
              { icon: '⚡', title: 'Auto Deployed', desc: 'Published to GitHub instantly, Vercel rebuilds, Telegram confirms. Fully automated 24/7.' },
            ].map((s, i) => (
              <div key={i} className="fade-up" style={{
                background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--r-xl)',
                padding: '40px 32px', border: '1px solid rgba(200,132,42,0.2)',
                animationDelay: `${i * 100}ms`
              }}>
                <div style={{ fontSize: '52px', marginBottom: '20px' }}>{s.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'white', marginBottom: '12px' }}>{s.title}</h3>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.8' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">🍽️ FoodHive World</div>
              <p className="footer-desc">Authentic recipes from 10 world cuisines, auto-published every 30 minutes by AI. Breakfast to baking, all in one place.</p>
            </div>
            <div>
              <div className="footer-col-title">Countries</div>
              {COUNTRIES.slice(0, 5).map(c => (
                <Link key={c.id} href={`/countries/${c.id}`} className="footer-link">{c.flag} {c.name}</Link>
              ))}
            </div>
            <div>
              <div className="footer-col-title">More Countries</div>
              {COUNTRIES.slice(5).map(c => (
                <Link key={c.id} href={`/countries/${c.id}`} className="footer-link">{c.flag} {c.name}</Link>
              ))}
            </div>
            <div>
              <div className="footer-col-title">Categories</div>
              {RECIPE_CATEGORIES.slice(0, 6).map(c => (
                <Link key={c.id} href={`/categories/${c.id}`} className="footer-link">{c.icon} {c.name}</Link>
              ))}
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 FoodHive World — Recipes from 10 Countries</span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>Auto-updated every 30 min · Powered by Gemini AI</span>
          </div>
        </div>
      </footer>
    </>
  )
}

export async function getStaticProps() {
  const all = getAllRecipes()
  const latest = all.length > 0 ? all.slice(0, 12) : Array(6).fill(SAMPLE_RECIPE)
  const hero = all.length > 0 ? all.slice(0, 6) : Array(6).fill(SAMPLE_RECIPE)
  const byCountry = {}
  for (const r of all) {
    if (!byCountry[r.country]) byCountry[r.country] = []
    byCountry[r.country].push(r)
  }
  return { props: { latestRecipes: latest, heroRecipes: hero, recipesByCountry: byCountry }, revalidate: 60 }
}
