// ============================================================
// FoodHive World — pages/index.js
// Homepage with 10 Country Sections
// ============================================================

import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { COUNTRIES, RECIPE_CATEGORIES, getAllRecipes, SAMPLE_RECIPE } from '../lib/data'

function RecipeCard({ recipe }) {
  return (
    <Link href={`/recipes/${recipe.slug}`}>
      <div className="recipe-card scale-in">
        <div className="recipe-card-image">
          <img src={recipe.image1} alt={recipe.title} loading="lazy" />
          <div className="recipe-badge">{recipe.categoryIcon} {recipe.categoryName}</div>
          <div className="recipe-country-badge">{recipe.countryFlag} {recipe.countryName}</div>
        </div>
        <div className="recipe-card-body">
          <h3 className="recipe-title">{recipe.title}</h3>
          <p className="recipe-desc">{recipe.description}</p>
          <div className="recipe-meta">
            <span>⏱️ {recipe.totalTime}</span>
            <span>⭐ {recipe.rating}</span>
          </div>
          <span className="recipe-cta">View Recipe →</span>
        </div>
      </div>
    </Link>
  )
}

export default function HomePage({ latestRecipes, recipesByCountry }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCountry, setActiveCountry] = useState(null)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <>
      <Head>
        <title>FoodHive World — Recipes from 10 Countries | AI-Powered Recipe Site</title>
        <meta name="description" content="Explore authentic recipes from 10 countries — Asian, European, Chinese, Korean, Indian, Mexican, Japanese, Italian, Middle Eastern, and American cuisines." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet" />
      </Head>

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="logo">
            <div className="logo-icon">🍽️</div>
            <span>FoodHive <span style={{ color: 'var(--orange)', fontSize: '12px', fontWeight: '600' }}>WORLD</span></span>
          </Link>
          <div className="nav-links">
            <Link href="/recipes" className="nav-link">All Recipes</Link>
            <Link href="#countries" className="nav-link">Countries</Link>
            <Link href="#categories" className="nav-link">Categories</Link>
          </div>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              className="search-input"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>Search</button>
          </form>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-dot"></span>
              10 Countries · 12 Categories · Auto-Updated Daily
            </div>
            <h1 className="hero-title">
              Recipes from<br />
              <span>Around the World</span>
            </h1>
            <p className="hero-subtitle">
              Explore authentic recipes from 10 cuisines — Asian, European, Chinese, Korean, Indian, Mexican, Japanese, Italian, Middle Eastern, and American. New recipes every 30 minutes.
            </p>
            <div className="hero-actions">
              <Link href="#countries" className="btn-primary">🌍 Explore Countries</Link>
              <Link href="/recipes" className="btn-secondary">All Recipes</Link>
            </div>
            {/* Country Quick Flags */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '32px' }}>
              {COUNTRIES.map(c => (
                <Link key={c.id} href={`/countries/${c.id}`}>
                  <div style={{
                    background: 'white',
                    border: '2px solid rgba(255,107,53,0.2)',
                    borderRadius: '50px',
                    padding: '8px 18px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }}
                    onMouseOver={e => { e.currentTarget.style.background = 'var(--orange)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--orange)' }}
                    onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'inherit'; e.currentTarget.style.borderColor = 'rgba(255,107,53,0.2)' }}
                  >
                    {c.flag} {c.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="hero-image">
            <img src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800" alt="World Cuisine" />
          </div>
        </div>
      </section>

      {/* ── COUNTRIES SECTION ── */}
      <section id="countries" className="section" style={{ background: '#FAFAFA' }}>
        <div className="container">
          <div className="section-header fade-in">
            <div className="section-eyebrow">Explore by Origin</div>
            <h2 className="section-title">Choose Your Cuisine</h2>
            <p style={{ color: 'var(--gray)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7' }}>
              Click any country to explore all 12 categories of authentic recipes from that cuisine.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
            marginTop: '48px'
          }}>
            {COUNTRIES.map((country, i) => {
              const countryRecipes = recipesByCountry[country.id] || []
              return (
                <Link key={country.id} href={`/countries/${country.id}`}>
                  <div className="country-card fade-in" style={{ transitionDelay: `${i * 60}ms` }}>
                    <div className="country-card-image">
                      <img src={country.image} alt={country.name} loading="lazy" />
                      <div className="country-card-overlay">
                        <span style={{ fontSize: '48px' }}>{country.flag}</span>
                        <h3>{country.name}</h3>
                      </div>
                    </div>
                    <div className="country-card-body" style={{ borderTop: `3px solid ${country.color}` }}>
                      <p style={{ fontSize: '14px', color: 'var(--gray)', lineHeight: '1.6', marginBottom: '16px' }}>
                        {country.desc}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {RECIPE_CATEGORIES.slice(0, 4).map(cat => (
                            <span key={cat.id} style={{
                              background: country.bgColor,
                              color: country.color,
                              fontSize: '11px',
                              padding: '3px 8px',
                              borderRadius: '50px',
                              fontWeight: '600'
                            }}>
                              {cat.icon}
                            </span>
                          ))}
                          <span style={{
                            background: country.bgColor,
                            color: country.color,
                            fontSize: '11px',
                            padding: '3px 8px',
                            borderRadius: '50px',
                            fontWeight: '600'
                          }}>+8</span>
                        </div>
                        <span style={{ fontSize: '13px', color: country.color, fontWeight: '700' }}>
                          {countryRecipes.length > 0 ? `${countryRecipes.length} recipes` : '12 categories'} →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 12 CATEGORIES (Global) ── */}
      <section id="categories" className="category-section">
        <div className="container">
          <div className="section-header fade-in">
            <div className="section-eyebrow">All Cuisines Combined</div>
            <h2 className="section-title">Browse by Category</h2>
          </div>
          <div className="category-grid">
            {RECIPE_CATEGORIES.map((cat, i) => (
              <Link key={cat.id} href={`/categories/${cat.id}`}>
                <div className="category-card fade-in" style={{ transitionDelay: `${i * 50}ms` }}>
                  <div className="category-icon">{cat.icon}</div>
                  <h3 className="category-name">{cat.name}</h3>
                  <p className="category-desc">{cat.desc}</p>
                  <span className="category-count">View All →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── LATEST RECIPES ── */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header fade-in">
            <div className="section-eyebrow">Just Published</div>
            <h2 className="section-title">Latest Recipes</h2>
          </div>
          <div className="recipes-grid">
            {latestRecipes.slice(0, 6).map((recipe, i) => (
              <RecipeCard key={recipe.slug || i} recipe={recipe} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/recipes" className="btn-primary">View All Recipes →</Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" style={{ background: 'linear-gradient(135deg, #FFF8E7 0%, #FFE4CC 100%)' }}>
        <div className="container">
          <div className="section-header fade-in">
            <div className="section-eyebrow">How FoodHive Works</div>
            <h2 className="section-title">Auto-Published Every 30 Minutes</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', marginTop: '48px' }}>
            {[
              { icon: '🌍', title: '10 Country Rotation', desc: 'Our AI rotates through 10 cuisines — Asian, European, Chinese, Korean, Indian, Mexican, Japanese, Italian, Middle Eastern, American.' },
              { icon: '🤖', title: 'AI Recipe Generation', desc: 'Google Gemini AI writes complete authentic recipes with ingredients, steps, nutrition, and chef tips.' },
              { icon: '⏰', title: 'Every 30 Minutes', desc: 'A new recipe is published automatically every 30 minutes, cycling through all 12 categories.' }
            ].map((s, i) => (
              <div key={i} className="fade-in" style={{
                background: 'white',
                borderRadius: 'var(--r-xl)',
                padding: '40px 32px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-soft)',
                transitionDelay: `${i * 100}ms`
              }}>
                <div style={{ fontSize: '56px', marginBottom: '16px' }}>{s.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: '700', marginBottom: '12px', color: 'var(--black)' }}>{s.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--gray)', lineHeight: '1.8' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div>
              <div className="footer-logo">🍽️ FoodHive World</div>
              <p className="footer-desc">Authentic recipes from 10 countries, auto-published every 30 minutes by AI.</p>
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
              {RECIPE_CATEGORIES.slice(0, 6).map(cat => (
                <Link key={cat.id} href={`/categories/${cat.id}`} className="footer-link">{cat.icon} {cat.name}</Link>
              ))}
            </div>
          </div>
          <div className="footer-bottom">© 2026 FoodHive World. AI-powered recipes updated every 30 minutes.</div>
        </div>
      </footer>
    </>
  )
}

export async function getStaticProps() {
  const allRecipes = getAllRecipes()
  const latestRecipes = allRecipes.length > 0 ? allRecipes.slice(0, 12) : Array(6).fill(SAMPLE_RECIPE)

  // Group by country
  const recipesByCountry = {}
  for (const recipe of allRecipes) {
    if (!recipesByCountry[recipe.country]) recipesByCountry[recipe.country] = []
    recipesByCountry[recipe.country].push(recipe)
  }

  return {
    props: { latestRecipes, recipesByCountry },
    revalidate: 60
  }
}
