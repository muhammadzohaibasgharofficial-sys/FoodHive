// ============================================================
// FoodHive World — pages/search.js
// ============================================================

import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { getAllRecipes } from '../lib/data'

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

export default function SearchPage({ allRecipes }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const q = params.get('q') || ''
      if (q) {
        setQuery(q)
        doSearch(q, allRecipes)
      }
    }
  }, [])

  const doSearch = (q, recipes) => {
    const term = q.toLowerCase().trim()
    if (!term) { setResults([]); setSearched(false); return }
    const found = recipes.filter(r =>
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
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(query)}`)
      doSearch(query, allRecipes)
    }
  }

  return (
    <>
      <Head>
        <title>{query ? `"${query}" — Search Results` : 'Search Recipes'} | FoodHive World</title>
        <meta name="description" content={`Search results for ${query} — Find authentic world recipes on FoodHive.`} />
        <meta name="robots" content="noindex" />
      </Head>

      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="logo">
            <div className="logo-icon">🍽️</div>
            <span>FoodHive <span style={{ color: 'var(--orange)', fontSize: '12px' }}>WORLD</span></span>
          </Link>
          <Link href="/#countries" className="nav-link">Countries</Link>
          <Link href="/recipes" className="btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>All Recipes</Link>
        </div>
      </nav>

      <section style={{ background: 'linear-gradient(135deg, #FFF8E7, #FFE4CC)', padding: '80px 0 60px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: '900', marginBottom: '32px', color: 'var(--black)' }}>
            🔍 Search Recipes
          </h1>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', maxWidth: '600px', margin: '0 auto' }}>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by dish, country, category..."
              style={{
                flex: 1, padding: '18px 24px', borderRadius: 'var(--r-full)',
                border: '2px solid #eee', fontSize: '16px', outline: 'none',
                boxShadow: 'var(--shadow-soft)'
              }}
              autoFocus
            />
            <button type="submit" className="btn-primary" style={{ padding: '18px 32px' }}>Search</button>
          </form>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {searched && (
            <div className="section-header" style={{ marginBottom: '40px' }}>
              <h2 className="section-title">
                {results.length > 0
                  ? `${results.length} results for "${query}"`
                  : `No results for "${query}"`}
              </h2>
              {results.length === 0 && (
                <p style={{ color: 'var(--gray)', marginTop: '12px' }}>
                  Try searching for a country (Asian, Indian), category (breakfast, desserts), or dish name.
                </p>
              )}
            </div>
          )}

          {results.length > 0 && (
            <div className="recipes-grid">
              {results.map((r, i) => <RecipeCard key={r.slug || i} recipe={r} />)}
            </div>
          )}

          {!searched && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gray)' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🌍</div>
              <p style={{ fontSize: '18px' }}>Search across 10 world cuisines and 12 categories</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export async function getStaticProps() {
  const allRecipes = getAllRecipes()
  return { props: { allRecipes }, revalidate: 60 }
}
