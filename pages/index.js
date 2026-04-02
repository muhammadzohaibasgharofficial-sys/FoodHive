// ============================================================
// FoodHive — Homepage
// 8 Sections: Hero, Categories, Trending, How It Works, Featured, Latest, Newsletter, Footer
// ============================================================

import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { RECIPE_CATEGORIES, getAllRecipes, SAMPLE_RECIPE } from '../lib/data'

function RecipeCard({ recipe }) {
  return (
    <Link href={`/recipes/${recipe.slug}`}>
      <div className="recipe-card scale-in">
        <div className="recipe-card-image">
          <img src={recipe.image1} alt={recipe.title} loading="lazy" />
          <div className="recipe-badge">
            {recipe.categoryIcon} {recipe.categoryName}
          </div>
          <div className="recipe-difficulty">{recipe.difficulty}</div>
        </div>
        <div className="recipe-card-body">
          <span className="recipe-category-tag">{recipe.categoryName}</span>
          <h3 className="recipe-title">{recipe.title}</h3>
          <p className="recipe-desc">{recipe.description}</p>
          <div className="recipe-meta">
            <div className="recipe-meta-item">
              <span className="recipe-meta-icon">⏱️</span>
              {recipe.totalTime}
            </div>
            <div className="recipe-meta-item">
              <span className="recipe-meta-icon">👥</span>
              {recipe.servings} servings
            </div>
          </div>
          <div className="recipe-footer">
            <div className="recipe-rating">
              <span className="recipe-stars">⭐</span>
              <span className="recipe-rating-text">{recipe.rating} ({recipe.reviews})</span>
            </div>
            <span className="recipe-cta">View Recipe →</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function HomePage({ trendingRecipes, latestRecipes }) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <>
      <Head>
        <title>FoodHive — Discover 1000+ Delicious Recipes | AI-Powered Recipe Website</title>
        <meta name="description" content="Discover thousands of delicious recipes on FoodHive. From breakfast to desserts, find easy-to-follow recipes with step-by-step instructions." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="FoodHive — Discover 1000+ Delicious Recipes" />
        <meta property="og:description" content="Your ultimate recipe destination. Browse categories from breakfast to desserts." />
        <meta property="og:type" content="website" />
      </Head>

      <div style={{ minHeight: '100vh' }}>
        {/* ── NAVBAR ── */}
        <nav className="navbar">
          <div className="navbar-inner">
            <Link href="/" className="logo">
              <div className="logo-icon">🍳</div>
              <span>FoodHive</span>
            </Link>
            
            <div className="nav-links">
              <Link href="/recipes" className="nav-link">All Recipes</Link>
              <Link href="#categories" className="nav-link">Categories</Link>
              <Link href="#trending" className="nav-link">Trending</Link>
              <Link href="#latest" className="nav-link">Latest</Link>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
              <Link href="/recipes" className="btn-primary">
                Browse All →
              </Link>
            </div>
          </div>
        </nav>

        {/* ── 1. HERO SECTION ── */}
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <div className="hero-badge">
                <span className="hero-dot"></span>
                Updated Daily with Fresh Recipes
              </div>
              <h1 className="hero-title">
                Discover <span>Delicious</span><br />
                Recipes Every Day
              </h1>
              <p className="hero-subtitle">
                Explore 1000+ recipes from breakfast to desserts. Step-by-step instructions, nutritional info, and chef's tips — all in one place.
              </p>
              <div className="hero-actions">
                <Link href="/recipes" className="btn-primary">
                  🍽️ Browse Recipes
                </Link>
                <Link href="#categories" className="btn-secondary">
                  View Categories
                </Link>
              </div>
            </div>
            <div className="hero-image">
              <img src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Featured Recipe" />
            </div>
          </div>
        </section>

        {/* ── 2. RECIPE CATEGORIES ── */}
        <section id="categories" className="category-section">
          <div className="container">
            <div className="section-header fade-in">
              <div className="section-eyebrow">Browse by Category</div>
              <h2 className="section-title">Explore Our Recipe Categories</h2>
            </div>
            <div className="category-grid">
              {RECIPE_CATEGORIES.map((category, i) => (
                <Link key={category.id} href={`/categories/${category.id}`}>
                  <div className={`category-card fade-in`} style={{ transitionDelay: `${i * 50}ms` }}>
                    <div className="category-icon">{category.icon}</div>
                    <h3 className="category-name">{category.name}</h3>
                    <p className="category-desc">{category.desc}</p>
                    <span className="category-count">View Recipes →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. TRENDING RECIPES ── */}
        <section id="trending" className="section" style={{ background: 'white' }}>
          <div className="container">
            <div className="section-header fade-in">
              <div className="section-eyebrow">Most Popular</div>
              <h2 className="section-title">Trending Recipes</h2>
            </div>
            <div className="recipes-grid">
              {trendingRecipes.slice(0, 6).map((recipe, i) => (
                <RecipeCard key={recipe.slug || i} recipe={recipe} />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <Link href="/recipes" className="btn-primary">
                View All Recipes →
              </Link>
            </div>
          </div>
        </section>

        {/* ── 4. HOW IT WORKS ── */}
        <section className="section" style={{ background: 'linear-gradient(135deg, #FFF8E7 0%, #FFE4CC 100%)' }}>
          <div className="container">
            <div className="section-header fade-in">
              <div className="section-eyebrow">Simple Process</div>
              <h2 className="section-title">How It Works</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', marginTop: '60px' }}>
              {[
                { icon: '📖', title: 'Browse Recipes', desc: 'Explore our extensive collection of recipes across 12 categories.' },
                { icon: '🍳', title: 'Cook & Enjoy', desc: 'Follow step-by-step instructions with prep and cook times.' },
                { icon: '⭐', title: 'Rate & Share', desc: 'Share your experience and help others discover great recipes.' }
              ].map((step, i) => (
                <div key={i} className="fade-in" style={{ 
                  background: 'white', 
                  borderRadius: 'var(--r-xl)', 
                  padding: '40px 32px', 
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-soft)',
                  transitionDelay: `${i * 100}ms`
                }}>
                  <div style={{ fontSize: '56px', marginBottom: '20px' }}>{step.icon}</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: '700', marginBottom: '12px', color: 'var(--black)' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '15px', color: 'var(--gray)', lineHeight: '1.7' }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. FEATURED RECIPE OF THE DAY ── */}
        <section className="section" style={{ background: 'var(--black)', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
            <img src={trendingRecipes[0]?.image1 || SAMPLE_RECIPE.image1} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
              <div className="fade-in">
                <div className="section-eyebrow" style={{ color: 'var(--orange)' }}>Recipe of the Day</div>
                <h2 className="section-title" style={{ color: 'white', marginBottom: '20px' }}>
                  {trendingRecipes[0]?.title || SAMPLE_RECIPE.title}
                </h2>
                <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8', marginBottom: '32px' }}>
                  {trendingRecipes[0]?.description || SAMPLE_RECIPE.description}
                </p>
                <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                  <div><strong style={{ color: 'var(--orange)' }}>⏱️ Time:</strong> {trendingRecipes[0]?.totalTime || SAMPLE_RECIPE.totalTime}</div>
                  <div><strong style={{ color: 'var(--orange)' }}>👥 Servings:</strong> {trendingRecipes[0]?.servings || SAMPLE_RECIPE.servings}</div>
                  <div><strong style={{ color: 'var(--orange)' }}>⭐ Rating:</strong> {trendingRecipes[0]?.rating || SAMPLE_RECIPE.rating}/5</div>
                </div>
                <Link href={`/recipes/${trendingRecipes[0]?.slug || SAMPLE_RECIPE.slug}`} className="btn-primary">
                  View Full Recipe →
                </Link>
              </div>
              <div className="scale-in" style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                <img 
                  src={trendingRecipes[0]?.image1 || SAMPLE_RECIPE.image1} 
                  alt={trendingRecipes[0]?.title || SAMPLE_RECIPE.title}
                  style={{ width: '100%', height: '500px', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. LATEST RECIPES ── */}
        <section id="latest" className="section">
          <div className="container">
            <div className="section-header fade-in">
              <div className="section-eyebrow">Just Added</div>
              <h2 className="section-title">Latest Recipes</h2>
            </div>
            <div className="recipes-grid">
              {latestRecipes.slice(0, 6).map((recipe, i) => (
                <RecipeCard key={recipe.slug || i} recipe={recipe} />
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. NEWSLETTER ── */}
        <section className="section" style={{ background: 'linear-gradient(135deg, var(--orange), var(--orange-light))', color: 'white' }}>
          <div className="container">
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
              <div className="section-eyebrow" style={{ color: 'rgba(255,255,255,0.9)' }}>Stay Updated</div>
              <h2 className="section-title" style={{ color: 'white', marginBottom: '16px' }}>Get Daily Recipes in Your Inbox</h2>
              <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)', marginBottom: '32px', lineHeight: '1.7' }}>
                Join 50,000+ food lovers and get fresh recipes delivered to your inbox every morning.
              </p>
              <form style={{ display: 'flex', gap: '12px', maxWidth: '500px', margin: '0 auto' }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  style={{
                    flex: 1,
                    padding: '16px 24px',
                    borderRadius: 'var(--r-full)',
                    border: 'none',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                  required
                />
                <button type="submit" className="btn-secondary" style={{ background: 'white', color: 'var(--orange)', border: 'none' }}>
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ── 8. FOOTER ── */}
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div>
                <div className="footer-logo">FoodHive</div>
                <p className="footer-desc">
                  Your ultimate recipe destination. Discover thousands of recipes from breakfast to desserts, all with step-by-step instructions.
                </p>
              </div>
              <div>
                <div className="footer-col-title">Categories</div>
                {RECIPE_CATEGORIES.slice(0, 6).map(cat => (
                  <Link key={cat.id} href={`/categories/${cat.id}`} className="footer-link">
                    {cat.icon} {cat.name}
                  </Link>
                ))}
              </div>
              <div>
                <div className="footer-col-title">Quick Links</div>
                <Link href="/recipes" className="footer-link">All Recipes</Link>
                <Link href="#trending" className="footer-link">Trending</Link>
                <Link href="#latest" className="footer-link">Latest</Link>
                <Link href="/about" className="footer-link">About Us</Link>
              </div>
              <div>
                <div className="footer-col-title">Connect</div>
                <a href="#" className="footer-link">Facebook</a>
                <a href="#" className="footer-link">Instagram</a>
                <a href="#" className="footer-link">Pinterest</a>
                <a href="#" className="footer-link">YouTube</a>
              </div>
            </div>
            <div className="footer-bottom">
              © 2026 FoodHive. All rights reserved. Made with ❤️ for food lovers.
            </div>
          </div>
        </footer>

        {/* Back to Top Button */}
        <button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↑
        </button>
      </div>
    </>
  )
}

export async function getStaticProps() {
  const allRecipes = getAllRecipes()
  
  // If no recipes, use sample
  const trendingRecipes = allRecipes.length > 0 ? allRecipes.slice(0, 12) : Array(12).fill(SAMPLE_RECIPE)
  const latestRecipes = allRecipes.length > 0 ? allRecipes.slice(0, 12) : Array(12).fill(SAMPLE_RECIPE)
  
  return {
    props: {
      trendingRecipes,
      latestRecipes
    },
    revalidate: 60
  }
}
