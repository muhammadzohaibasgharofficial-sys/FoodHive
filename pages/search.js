// ============================================================
// FoodHive World — pages/search.js (FIXED)
// Fix: Use getServerSideProps so URL query params work properly
// Fix: Read query from router instead of window.location
// ============================================================

import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getAllRecipes } from '../lib/data'

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

export default function SearchPage({ allRecipes, initialQuery, initialResults }) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery || '')
  const [results, setResults] = useState(initialResults || [])
  const [searched, setSearched] = useState(!!initialQuery)

  // If user navigates to /search?q=something, update results
  useEffect(() => {
    const q = router.query.q || ''
    if (q && q !== query) {
      setQuery(q)
      doSearch(q)
    }
  }, [router.query.q])

  const doSearch = (q) => {
    const term = q.toLowerCase().trim()
    if (!term) { setResults([]); setSearched(false); return }
    const found = allRecipes.filter(r =>
      r.title?.toLowerCase().includes(term) ||
      r.countryName?.toLowerCase().includes(term) ||
      r.categoryName?.toLowerCase().includes(term) ||
      r.cuisine?.toLowerCase().includes(term) ||
      r.description?.toLowerCase().includes(term) ||
      r.tags?.some(t => t.toLowerCase().includes(term))
    )
    setResults(found)
    setSearched(true)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`, undefined, { shallow: true })
      doSearch(query.trim())
    }
  }

  return (
    <>
      <Head>
        <title>{query ? `"${query}" — Search` : 'Search Recipes'} | FoodHive World</title>
        <meta name="description" content={`Search results for ${query} — Authentic world recipes on FoodHive.`} />
        <meta name="robots" content="noindex" />
      </Head>

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
          <Link href="/recipes" className="btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>All Recipes</Link>
        </div>
      </nav>

      <section style={{ background: 'var(--cream)', padding: '120px 0 60px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-eyebrow">Search</div>
          <h1 className="section-title">Find Your <em>Recipe</em></h1>
          <p className="section-desc">Search across 10 world cuisines and 12 categories</p>

          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', maxWidth: '600px', margin: '40px auto 0' }}>
            <div className="nav-search" style={{ flex: 1, width: 'auto', borderRadius: 'var(--r-full)' }}>
              <span style={{ fontSize: '16px', opacity: 0.5 }}>🔍</span>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by dish, country, category..."
                style={{ width: '100%' }}
                autoFocus
              />
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '14px 28px' }}>Search</button>
          </form>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--cream-dark)' }}>
        <div className="container">
          {searched && (
            <div className="section-header" style={{ marginBottom: '40px' }}>
              <h2 className="section-title">
                {results.length > 0
                  ? <>{results.length} results for <em>"{query}"</em></>
                  : <>No results for <em>"{query}"</em></>
                }
              </h2>
              {results.length === 0 && (
                <p className="section-desc" style={{ marginTop: '12px' }}>
                  Try searching for a country (Asian, Indian), category (breakfast, desserts), or dish name.
                </p>
              )}
            </div>
          )}

          {results.length > 0 && (
            <div className="recipes-grid">
              {results.map((r, i) => (
                <div key={r.slug || i} className="fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <RecipeCard recipe={r} />
                </div>
              ))}
            </div>
          )}

          {!searched && (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '72px', marginBottom: '20px' }}>🌍</div>
              <p style={{ fontSize: '18px', fontFamily: 'var(--font-display)' }}>
                Search across 10 world cuisines and 12 categories
              </p>
            </div>
          )}
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-bottom">
            <Link href="/" style={{ color: 'var(--gold-light)', textDecoration: 'none' }}>🍽️ FoodHive World</Link>
            <span>© 2026 FoodHive World</span>
          </div>
        </div>
      </footer>
    </>
  )
}

// FIXED: Use getServerSideProps so query params are available on server
export async function getServerSideProps({ query }) {
  const allRecipes = getAllRecipes()
  const q = (query.q || '').toLowerCase().trim()

  let initialResults = []
  if (q) {
    initialResults = allRecipes.filter(r =>
      r.title?.toLowerCase().includes(q) ||
      r.countryName?.toLowerCase().includes(q) ||
      r.categoryName?.toLowerCase().includes(q) ||
      r.cuisine?.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q) ||
      r.tags?.some(t => t.toLowerCase().includes(q))
    )
  }

  return {
    props: {
      allRecipes,
      initialQuery: query.q || '',
      initialResults
    }
  }
}
