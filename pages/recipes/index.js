// ============================================================
// FoodHive World — All Recipes Page (FIXED)
// Uses correct CSS classes from globals.css
// ============================================================
import Head from 'next/head'
import Link from 'next/link'
import { getAllRecipes, RECIPE_CATEGORIES, COUNTRIES, SAMPLE_RECIPE } from '../../lib/data'

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
            <div className="recipe-rating">
              ⭐ {recipe.rating}
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({recipe.reviews})</span>
            </div>
            <span className="recipe-view-btn">View Recipe →</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function AllRecipesPage({ recipes }) {
  return (
    <>
      <Head>
        <title>All Recipes — FoodHive World</title>
        <meta name="description" content="Browse all recipes on FoodHive World. Authentic dishes from 10 countries and 12 categories!" />
        <link rel="canonical" href="https://foodhive.vercel.app/recipes" />
      </Head>

      <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
        {/* NAVBAR */}
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
            <Link href="/" className="btn-secondary" style={{ fontSize: '14px', padding: '10px 24px' }}>← Home</Link>
          </div>
        </nav>

        {/* HEADER */}
        <section style={{ paddingTop: '72px', background: 'var(--cream)', padding: '120px 0 60px' }}>
          <div className="container">
            {/* Breadcrumb */}
            <div className="recipe-breadcrumb" style={{ marginBottom: '24px' }}>
              <Link href="/">Home</Link>
              <span className="recipe-breadcrumb-sep">›</span>
              <span style={{ color: 'var(--gold)', fontWeight: 700 }}>All Recipes</span>
            </div>
            <div className="section-header" style={{ textAlign: 'left', marginBottom: '48px' }}>
              <div className="section-eyebrow">Complete Collection</div>
              <h1 className="section-title">
                All <em>Recipes</em>
              </h1>
              <p className="section-desc" style={{ textAlign: 'left', marginLeft: 0 }}>
                Explore {recipes.length}+ authentic dishes from 10 world cuisines and 12 categories.
              </p>
            </div>

            {/* Country filter pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '48px' }}>
              {COUNTRIES.map(c => (
                <Link key={c.id} href={`/countries/${c.id}`}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    background: c.bgColor, color: c.color,
                    fontSize: '12px', fontWeight: 700,
                    padding: '7px 16px', borderRadius: '9999px',
                    border: `1.5px solid ${c.color}22`,
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}>
                    {c.flag} {c.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* RECIPES GRID */}
        <section className="section" style={{ background: 'var(--cream-dark)', paddingTop: '0' }}>
          <div className="container">
            <div className="recipes-grid">
              {recipes.map((recipe, i) => (
                <div key={recipe.slug || i} className="fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="container">
            <div className="footer-bottom">
              <Link href="/" style={{ color: 'var(--gold-light)', textDecoration: 'none' }}>🍽️ FoodHive World</Link>
              <span>© 2026 FoodHive World — 10 Countries · 12 Categories</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export async function getStaticProps() {
  const recipes = getAllRecipes()
  // Filter out broken/incomplete recipes (no slug, no title, no image)
  const validRecipes = recipes.filter(r => r.slug && r.title && r.image1)
  return {
    props: { recipes: validRecipes.length > 0 ? validRecipes : Array(6).fill(SAMPLE_RECIPE) },
    revalidate: 60
  }
}
