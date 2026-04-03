// ============================================================
// FoodHive World — Country Page [country].js
// 12 category tabs, recipe grid, same beige premium design
// ============================================================
import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { COUNTRIES, RECIPE_CATEGORIES, getCountryById, getAllRecipes, SAMPLE_RECIPE } from '../../lib/data'

function RecipeCard({ recipe }) {
  return (
    <Link href={`/recipes/${recipe.slug}`}>
      <div className="recipe-card">
        <div className="recipe-card-top">
          <img src={recipe.image1} alt={recipe.title} loading="lazy" />
          <div className="recipe-card-top-overlay" />
          <div className="recipe-card-badges">
            <span className="recipe-badge-cat">{recipe.categoryIcon} {recipe.categoryName}</span>
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
            <span>⭐ {recipe.rating}</span>
          </div>
          <div className="recipe-card-footer">
            <div className="recipe-rating">⭐ {recipe.rating}</div>
            <span className="recipe-view-btn">View →</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function CountryPage({ country, allCountryRecipes, recipesByCategory }) {
  const [activecat, setActivecat] = useState(null)

  if (!country) return <div style={{ padding: '100px', textAlign: 'center' }}>Not found</div>

  const displayed = activecat ? (recipesByCategory[activecat] || []) : allCountryRecipes.slice(0, 12)
  const catCount = id => (recipesByCategory[id] || []).length

  return (
    <>
      <Head>
        <title>{country.flag} {country.name} Recipes — All 12 Categories | FoodHive World</title>
        <meta name="description" content={`Explore authentic ${country.name} cuisine: breakfast, lunch, dinner, desserts, appetizers, soups, pasta, vegetarian, seafood, chicken, beverages and baking.`} />
        <meta property="og:title" content={`${country.name} Recipes | FoodHive World`} />
        <meta property="og:image" content={country.image} />
        <link rel="canonical" href={`https://foodhive.vercel.app/countries/${country.id}`} />
      </Head>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="logo">🍽️ FoodHive <span className="logo-badge">WORLD</span></Link>
          <div className="nav-links">
            <Link href="/#countries" className="nav-link">Countries</Link>
            <Link href="/#categories" className="nav-link">Categories</Link>
            <Link href="/recipes" className="nav-link">All Recipes</Link>
          </div>
          <Link href="/recipes" className="btn-secondary" style={{ fontSize: '14px', padding: '10px 24px' }}>Browse All</Link>
        </div>
      </nav>

      {/* COUNTRY HERO */}
      <section style={{
        paddingTop: '72px',
        background: 'var(--cream)',
        minHeight: '380px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Blob */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '50%', height: '100%',
          background: 'var(--cream-dark)',
          borderRadius: '50% 0 0 60%',
          zIndex: 0,
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px', padding: '60px 0', flexWrap: 'wrap' }}>
            {/* Flag big */}
            <div style={{
              width: 140, height: 140, borderRadius: '50%',
              background: country.bgColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '72px', border: '4px solid var(--white)',
              boxShadow: 'var(--shadow-float)', flexShrink: 0,
              animation: 'float-center 4s ease-in-out infinite',
            }}>
              {country.flag}
            </div>
            <div className="fade-up">
              {/* Breadcrumb */}
              <div className="recipe-breadcrumb" style={{ marginBottom: '16px' }}>
                <Link href="/">Home</Link>
                <span className="recipe-breadcrumb-sep">›</span>
                <Link href="/#countries">Countries</Link>
                <span className="recipe-breadcrumb-sep">›</span>
                <span style={{ color: country.color, fontWeight: 700 }}>{country.name}</span>
              </div>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,5vw,64px)',
                fontWeight: 700, color: 'var(--dark)', letterSpacing: '-1px',
                lineHeight: 1.05, marginBottom: '16px',
              }}>
                {country.name} <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Cuisine</span>
              </h1>
              <p style={{ fontSize: '16px', color: 'var(--text-muted)', maxWidth: '560px', lineHeight: '1.8', marginBottom: '28px' }}>
                {country.desc}
              </p>
              <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                {[
                  { val: allCountryRecipes.length || '12+', label: 'Recipes' },
                  { val: '12', label: 'Categories' },
                  { val: '30m', label: 'Updates' },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: country.color }}>{s.val}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STICKY CATEGORY TABS */}
      <div style={{
        position: 'sticky', top: 72, zIndex: 100,
        background: 'rgba(245,240,232,0.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(196,168,130,0.25)',
      }}>
        <div className="container">
          <div style={{
            display: 'flex', gap: '6px', overflowX: 'auto', padding: '14px 0',
            scrollbarWidth: 'none', msOverflowStyle: 'none',
          }}>
            <button onClick={() => setActivecat(null)} style={{
              padding: '9px 20px', borderRadius: 'var(--r-full)',
              border: '1.5px solid', flexShrink: 0, fontWeight: 700, fontSize: '13px', cursor: 'pointer',
              transition: 'all 0.2s', whiteSpace: 'nowrap',
              borderColor: !activecat ? country.color : 'var(--beige)',
              background: !activecat ? country.color : 'transparent',
              color: !activecat ? 'white' : 'var(--text-muted)',
            }}>
              🌐 All ({allCountryRecipes.length})
            </button>
            {RECIPE_CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setActivecat(cat.id === activecat ? null : cat.id)} style={{
                padding: '9px 18px', borderRadius: 'var(--r-full)',
                border: '1.5px solid', flexShrink: 0, fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                transition: 'all 0.2s', whiteSpace: 'nowrap',
                borderColor: activecat === cat.id ? country.color : 'var(--beige)',
                background: activecat === cat.id ? country.color : 'transparent',
                color: activecat === cat.id ? 'white' : 'var(--text)',
              }}>
                {cat.icon} {cat.name} ({catCount(cat.id)})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORY CARDS when no filter */}
      {!activecat && (
        <section className="section" style={{ background: 'var(--cream-dark)' }}>
          <div className="container">
            <div className="section-header fade-up">
              <div className="section-eyebrow" style={{ color: country.color }}>{country.flag} {country.name}</div>
              <h2 className="section-title">Choose a <em>Category</em></h2>
            </div>
            <div className="categories-grid">
              {RECIPE_CATEGORIES.map((cat, i) => (
                <div key={cat.id} className="category-card fade-up"
                  style={{ animationDelay: `${i*50}ms`, borderTop: `3px solid ${country.color}`, cursor: 'pointer' }}
                  onClick={() => setActivecat(cat.id)}>
                  <div className="category-icon">{cat.icon}</div>
                  <div className="category-name">{cat.name}</div>
                  <div className="category-count" style={{ color: country.color, fontWeight: 700 }}>
                    {catCount(cat.id) > 0 ? `${catCount(cat.id)} recipes` : 'Coming soon'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RECIPES */}
      {(activecat || allCountryRecipes.length > 0) && (
        <section className="section" style={{ background: activecat ? 'var(--cream-dark)' : 'var(--cream)' }}>
          <div className="container">
            {activecat && (
              <div className="section-header fade-up">
                <div className="section-eyebrow" style={{ color: country.color }}>
                  {country.flag} {country.name}
                </div>
                <h2 className="section-title">
                  {RECIPE_CATEGORIES.find(c=>c.id===activecat)?.icon}{' '}
                  {RECIPE_CATEGORIES.find(c=>c.id===activecat)?.name}
                </h2>
              </div>
            )}
            {!activecat && allCountryRecipes.length > 0 && (
              <div className="section-header fade-up">
                <div className="section-eyebrow">Latest Added</div>
                <h2 className="section-title">Recent {country.name} <em>Recipes</em></h2>
              </div>
            )}
            {displayed.length > 0 ? (
              <div className="recipes-grid">
                {displayed.map((r, i) => (
                  <div key={r.slug||i} className="fade-up" style={{ animationDelay: `${i*60}ms` }}>
                    <RecipeCard recipe={r} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '80px', background: 'var(--white)', borderRadius: 'var(--r-xl)' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>{country.flag}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', marginBottom: '12px' }}>Coming Soon!</h3>
                <p style={{ color: 'var(--text-muted)' }}>AI is cooking {country.name} {RECIPE_CATEGORIES.find(c=>c.id===activecat)?.name} recipes. Check back in 30 minutes!</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* OTHER COUNTRIES */}
      <section className="section" style={{ background: 'var(--dark)' }}>
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-eyebrow" style={{ color: 'var(--gold-light)' }}>Explore More</div>
            <h2 className="section-title" style={{ color: 'white' }}>Other <em>Cuisines</em></h2>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {COUNTRIES.filter(c => c.id !== country.id).map(c => (
              <Link key={c.id} href={`/countries/${c.id}`}>
                <div style={{
                  background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--r-lg)',
                  padding: '16px 24px', textAlign: 'center', cursor: 'pointer',
                  transition: 'all 0.2s', minWidth: '110px',
                  border: '1px solid rgba(200,132,42,0.2)',
                }}
                  onMouseOver={e=>{e.currentTarget.style.background='rgba(200,132,42,0.15)'; e.currentTarget.style.transform='translateY(-3px)'}}
                  onMouseOut={e=>{e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.transform='none'}}
                >
                  <div style={{ fontSize: '30px' }}>{c.flag}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginTop: '6px' }}>{c.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-bottom">
            <Link href="/" style={{ color: 'var(--gold-light)', textDecoration: 'none' }}>🍽️ FoodHive World</Link>
            <span>Auto-published every 30 min · 10 countries · 12 categories</span>
          </div>
        </div>
      </footer>
    </>
  )
}

export async function getStaticPaths() {
  return { paths: COUNTRIES.map(c => ({ params: { country: c.id } })), fallback: false }
}

export async function getStaticProps({ params }) {
  const country = getCountryById(params.country)
  if (!country) return { notFound: true }
  const all = getAllRecipes()
  const countryRecipes = all.filter(r => r.country === params.country)
  const byCategory = {}
  for (const cat of RECIPE_CATEGORIES) byCategory[cat.id] = countryRecipes.filter(r => r.category === cat.id)
  return { props: { country, allCountryRecipes: countryRecipes, recipesByCategory: byCategory }, revalidate: 60 }
}
