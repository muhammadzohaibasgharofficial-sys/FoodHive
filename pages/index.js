// FoodHive World — Homepage
// Hero: search bar + tagline (Tomato.app style)
// Categories: orange circles with name below (Image 2 exact)
// Countries: click to expand categories inline (accordion)
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { COUNTRIES, RECIPE_CATEGORIES, getAllRecipes, SAMPLE_RECIPE } from '../lib/data'

// ── Recipe Card ──
function RecipeCard({ recipe }) {
  const ings = recipe.ingredients?.slice(0, 3).map(i => i.item) || []
  return (
    <Link href={`/recipes/${recipe.slug}`}>
      <div className="recipe-card">
        <div className="rc-img-wrap">
          <div className="rc-circle">
            <img src={recipe.image2 || recipe.image1} alt={recipe.title} loading="lazy" />
          </div>
          <span className="rc-tag-cat">{recipe.categoryIcon} {recipe.categoryName}</span>
          <span className="rc-tag-country">{recipe.countryFlag} {recipe.countryName}</span>
        </div>
        <div className="rc-body">
          <h3 className="rc-title">{recipe.title}</h3>
          <p className="rc-desc">{recipe.description}</p>
          {ings.length > 0 && (
            <div className="rc-ings">{ings.map((g, i) => <span key={i} className="rc-ing-tag">{g}</span>)}</div>
          )}
          <div className="rc-meta">
            <span className="rc-stars">{'★'.repeat(Math.round(recipe.rating || 5))}</span>
            <span className="rc-time">⏱ {recipe.totalTime}</span>
          </div>
          <div className="rc-btn">View Recipe →</div>
        </div>
      </div>
    </Link>
  )
}

// ── Country Card with inline accordion categories ──
function CountryCard({ country, isOpen, onToggle }) {
  return (
    <div className={`country-accord${isOpen ? ' open' : ''}`}>
      {/* Country header — click to toggle */}
      <div className="ca-header" onClick={onToggle} style={{ borderTop: `3px solid ${country.color}` }}>
        <div className="ca-img">
          <img src={country.image} alt={country.name} loading="lazy" />
          <div className="ca-overlay">
            <div className="ca-flag">{country.flag}</div>
            <div className="ca-name">{country.name}</div>
          </div>
        </div>
        <div className="ca-body">
          <p className="ca-desc">{country.desc}</p>
          <div className="ca-footer">
            <div style={{ display: 'flex', gap: 4 }}>
              {RECIPE_CATEGORIES.slice(0, 4).map(cat => (
                <div key={cat.id} style={{
                  width: 28, height: 28, borderRadius: '50%', background: 'var(--cream2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13
                }}>{cat.icon}</div>
              ))}
            </div>
            <span className="ca-cta" style={{ color: country.color }}>
              {isOpen ? 'Hide ▲' : 'Browse →'}
            </span>
          </div>
        </div>
      </div>

      {/* Accordion — categories grid */}
      {isOpen && (
        <div className="ca-cats-panel">
          <div className="ca-cats-title">
            <span style={{ fontSize: 18 }}>{country.flag}</span>
            Choose a {country.name} Category
          </div>
          <div className="ca-cats-grid">
            {RECIPE_CATEGORIES.map((cat, i) => (
              <Link key={cat.id} href={`/countries/${country.id}?cat=${cat.id}`}>
                <div className="ca-cat-item" style={{ animationDelay: `${i * 35}ms` }}>
                  <div className="ca-cat-circle" style={{ background: country.bgColor, borderColor: country.color }}>
                    <span style={{ fontSize: 28 }}>{cat.icon}</span>
                  </div>
                  <div className="ca-cat-name">{cat.name}</div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Link href={`/countries/${country.id}`}>
              <span style={{
                display: 'inline-block', background: country.color, color: 'white',
                fontSize: 13, fontWeight: 700, padding: '10px 24px', borderRadius: '999px',
              }}>
                View All {country.name} Recipes →
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default function HomePage({ latestRecipes }) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [openCountry, setOpenCountry] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const heroImg = latestRecipes[0]?.image1 || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const toggleCountry = (id) => {
    setOpenCountry(prev => prev === id ? null : id)
  }

  // Category color cycling for circles
  const catColors = ['#E8873A', '#8B9E6B', '#3D9E8C', '#C96B20', '#5C3A1E', '#7B3FA0', '#E8873A', '#3D9E8C', '#8B9E6B', '#C96B20', '#E8873A', '#5C3A1E']

  // Filter recipes by active category
  const displayRecipes = activeCategory
    ? latestRecipes.filter(r => r.category === activeCategory).slice(0, 6)
    : latestRecipes.slice(0, 6)

  return (
    <>
      <Head>
        <title>FoodHive World — Authentic Recipes from 10 Countries</title>
        <meta name="description" content="Explore authentic recipes from 10 world cuisines — Pakistani, Turkish, Chinese, Korean, Indian and more. 12 categories, AI-crafted daily." />
        <link rel="canonical" href="https://food-hive-one.vercel.app" />
      </Head>

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="logo">
            <span className="logo-icon">🍽️</span>
            <span className="logo-text">FoodHive<span className="logo-accent"> World</span></span>
          </Link>
          <div className={`nav-links${mobileMenuOpen ? ' open' : ''}`}>
            <Link href="/#countries" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Countries</Link>
            <Link href="/#categories" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Menu</Link>
            <Link href="/recipes" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Recipes</Link>
          </div>
          <div className="navbar-right">
            <button className="nav-icon-btn" aria-label="Account">👤</button>
            <Link href="/recipes" className="nav-cta-btn">Sign In</Link>
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO — Tomato.app style ── */}
      <section className="hero">
        {/* Teal blob right side */}
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '48%', height: '100%', zIndex: 0,
          background: 'linear-gradient(150deg, #4FB8A5 0%, #3D9E8C 45%, #2A7A6A 100%)',
          clipPath: 'polygon(12% 0%, 100% 0%, 100% 100%, 8% 100%, 3% 80%, 9% 56%, 3% 30%, 10% 8%)',
          borderRadius: '0 0 0 20%',
        }} />

        <div className="hero-inner">
          {/* LEFT — text + search */}
          <div className="hero-left fade-up">
            <p className="hero-tagline">Good food, every day on</p>
            <h1 className="hero-title">
              Order your<br />
              <em>favorite food</em><br />
              here
            </h1>
            <p className="hero-desc">
              Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.
            </p>

            {/* SEARCH BAR */}
            <form onSubmit={handleSearch} className="hero-search-form">
              <div className="hero-search-wrap">
                <span style={{ fontSize: 18, opacity: 0.45, flexShrink: 0 }}>🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search biryani, sushi, pasta, tacos..."
                  className="hero-search-input"
                />
                <button type="submit" className="hero-search-btn">Search</button>
              </div>
              <div className="hero-search-tags">
                {['Biryani', 'Pasta', 'Sushi', 'Kebab', 'Bibimbap'].map(tag => (
                  <span key={tag} className="hero-stag" onClick={() => { setSearchQuery(tag); router.push(`/search?q=${tag}`) }}>{tag}</span>
                ))}
              </div>
            </form>

            {/* Stats */}
            <div className="hero-stats-row">
              <div className="hero-stat">
                <span className="hero-stat-num">360+</span>
                <span className="hero-stat-lbl">Recipes/Month</span>
              </div>
              <div className="hero-stat-div" />
              <div className="hero-stat">
                <span className="hero-stat-num">10</span>
                <span className="hero-stat-lbl">Cuisines</span>
              </div>
              <div className="hero-stat-div" />
              <div className="hero-stat">
                <span className="hero-stat-num">12</span>
                <span className="hero-stat-lbl">Categories</span>
              </div>
            </div>
          </div>

          {/* RIGHT — circular food image */}
          <div className="hero-right scale-in">
            <div className="hero-img-wrap">
              <img src={heroImg} alt="World Cuisine" className="hero-food-img" />
            </div>
            {/* Floating badge */}
            <div className="hero-float-card">
              <span style={{ fontSize: 32 }}>🌍</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#2C1810' }}>10 World Cuisines</div>
                <div style={{ fontSize: 11, color: '#7A6A5A' }}>Fresh recipes daily</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES SECTION — Tomato.app exact style ── */}
      <section id="categories" style={{ background: 'white', padding: '72px 0' }}>
        <div className="container">
          <div className="section-head fade-up">
            <div className="section-eyebrow">Browse by Type</div>
            <h2 className="section-title">Explore our <span style={{ color: 'var(--orange)' }}>menu</span></h2>
            <p className="section-desc">
              Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.
            </p>
          </div>

          {/* Horizontal scrollable circles — exact Image 2 style */}
          <div className="cat-circles-row">
            {RECIPE_CATEGORIES.map((cat, i) => (
              <div
                key={cat.id}
                className={`cat-circle-item${activeCategory === cat.id ? ' cat-circle-active' : ''}`}
                onClick={() => setActiveCategory(prev => prev === cat.id ? null : cat.id)}
              >
                <div
                  className="cat-circle-img"
                  style={{
                    background: catColors[i],
                    boxShadow: activeCategory === cat.id
                      ? `0 0 0 3px white, 0 0 0 5px ${catColors[i]}, 0 8px 28px rgba(0,0,0,0.2)`
                      : '0 8px 28px rgba(0,0,0,0.15)',
                  }}
                >
                  <span style={{ fontSize: 38, lineHeight: 1 }}>{cat.icon}</span>
                </div>
                <span className="cat-circle-name">{cat.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>

          {/* Horizontal divider */}
          <div style={{ height: 1, background: '#F0E8D6', margin: '40px 0 52px' }} />

          {/* Top dishes / filtered recipes */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="section-eyebrow">
                {activeCategory ? `${RECIPE_CATEGORIES.find(c => c.id === activeCategory)?.icon} Filtered` : '🌟 Just Published'}
              </div>
              <h2 className="section-title">
                {activeCategory
                  ? RECIPE_CATEGORIES.find(c => c.id === activeCategory)?.name
                  : 'Top dishes near you'
                }
              </h2>
            </div>
            <Link href={activeCategory ? `/categories/${activeCategory}` : '/recipes'}>
              <span style={{
                background: 'var(--orange)', color: 'white', fontSize: 13, fontWeight: 700,
                padding: '11px 26px', borderRadius: '999px',
                boxShadow: '0 4px 16px rgba(232,135,58,.35)',
              }}>
                View All →
              </span>
            </Link>
          </div>

          <div className="recipes-grid">
            {displayRecipes.map((r, i) => (
              <div key={r.slug || i} className="fade-up" style={{ animationDelay: `${i * 70}ms` }}>
                <RecipeCard recipe={r} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COUNTRIES SECTION — accordion style ── */}
      <section id="countries" style={{ background: 'var(--cream2)', padding: '72px 0' }}>
        <div className="container">
          <div className="section-head fade-up">
            <div className="section-eyebrow">10 World Cuisines</div>
            <h2 className="section-title">Choose Your <span style={{ color: 'var(--orange)' }}>Cuisine</span></h2>
            <p className="section-desc">Click any country to browse all 12 recipe categories — from breakfast to baking.</p>
          </div>

          <div className="countries-accord-grid">
            {COUNTRIES.map((country, i) => (
              <div key={country.id} className="fade-up" style={{ animationDelay: `${i * 55}ms` }}>
                <CountryCard
                  country={country}
                  isOpen={openCountry === country.id}
                  onToggle={() => toggleCountry(country.id)}
                />
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
              <div className="footer-logo-txt">🍽️ FoodHive World</div>
              <p className="footer-desc">Authentic recipes from 10 world cuisines, auto-published every 30 minutes by Gemini AI.</p>
            </div>
            <div>
              <div className="footer-col-title">Countries</div>
              {COUNTRIES.slice(0, 5).map(c => <Link key={c.id} href={`/countries/${c.id}`} className="footer-link">{c.flag} {c.name}</Link>)}
            </div>
            <div>
              <div className="footer-col-title">More Countries</div>
              {COUNTRIES.slice(5).map(c => <Link key={c.id} href={`/countries/${c.id}`} className="footer-link">{c.flag} {c.name}</Link>)}
            </div>
            <div>
              <div className="footer-col-title">Categories</div>
              {RECIPE_CATEGORIES.slice(0, 6).map(c => <Link key={c.id} href={`/categories/${c.id}`} className="footer-link">{c.icon} {c.name}</Link>)}
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 FoodHive World</span>
            <span>10 Countries · 12 Categories · Updated Every 30 Min</span>
          </div>
        </div>
      </footer>

      <style jsx>{`
        /* ── HERO ── */
        .hero {
          min-height: 100vh;
          padding-top: 68px;
          background: #FAF6EE;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .hero-inner {
          position: relative;
          z-index: 1;
          max-width: 1300px;
          margin: 0 auto;
          padding: 80px 40px 60px;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 40px;
          align-items: center;
          flex: 1;
        }
        .hero-tagline {
          font-size: 13px;
          font-weight: 700;
          color: #7A6A5A;
          letter-spacing: .5px;
          margin-bottom: 10px;
        }
        .hero-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(44px, 5.5vw, 78px);
          font-weight: 900;
          color: #2C1810;
          line-height: 1.05;
          margin-bottom: 20px;
          letter-spacing: -1px;
        }
        .hero-title em {
          color: #E8873A;
          font-style: italic;
        }
        .hero-desc {
          font-size: 14px;
          color: #7A6A5A;
          max-width: 420px;
          line-height: 1.85;
          margin-bottom: 32px;
        }

        /* SEARCH */
        .hero-search-form { margin-bottom: 36px; }
        .hero-search-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          background: white;
          border: 2px solid #E8DCC8;
          border-radius: 999px;
          padding: 10px 10px 10px 20px;
          max-width: 500px;
          box-shadow: 0 4px 24px rgba(44,24,16,0.1);
          transition: border-color .2s, box-shadow .2s;
        }
        .hero-search-wrap:focus-within {
          border-color: #E8873A;
          box-shadow: 0 4px 24px rgba(232,135,58,0.2);
        }
        .hero-search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 14px;
          font-family: 'Nunito', sans-serif;
          color: #2C1810;
          background: transparent;
        }
        .hero-search-input::placeholder { color: #B5A898; }
        .hero-search-btn {
          background: #E8873A;
          color: white;
          font-size: 13px;
          font-weight: 700;
          padding: 10px 22px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          transition: background .2s;
          font-family: 'Nunito', sans-serif;
          flex-shrink: 0;
        }
        .hero-search-btn:hover { background: #C96B20; }
        .hero-search-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 12px;
          padding-left: 4px;
        }
        .hero-stag {
          font-size: 12px;
          font-weight: 700;
          color: #7A6A5A;
          background: #F0E8D6;
          padding: 5px 14px;
          border-radius: 999px;
          cursor: pointer;
          transition: all .2s;
        }
        .hero-stag:hover { background: #E8873A; color: white; }

        /* STATS */
        .hero-stats-row {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .hero-stat { text-align: center; }
        .hero-stat-num {
          display: block;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 30px;
          font-weight: 700;
          color: #2C1810;
          line-height: 1;
        }
        .hero-stat-lbl {
          display: block;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #7A6A5A;
          margin-top: 3px;
        }
        .hero-stat-div { width: 1px; height: 36px; background: rgba(44,24,16,0.12); }

        /* HERO IMAGE */
        .hero-right {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-img-wrap {
          width: 420px;
          height: 420px;
          border-radius: 50%;
          overflow: hidden;
          border: 8px solid rgba(255,255,255,0.9);
          box-shadow: 0 30px 80px rgba(0,0,0,0.25);
          animation: heroFloat 4s ease-in-out infinite;
        }
        .hero-food-img { width: 100%; height: 100%; object-fit: cover; }
        @keyframes heroFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }

        .hero-float-card {
          position: absolute;
          bottom: 30px;
          left: -10px;
          background: white;
          border-radius: 16px;
          padding: 12px 18px;
          box-shadow: 0 8px 32px rgba(44,24,16,0.14);
          display: flex;
          align-items: center;
          gap: 10px;
          animation: badgeFloat 3s ease-in-out 1s infinite;
        }
        @keyframes badgeFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

        /* ── CATEGORY CIRCLES — Tomato.app exact ── */
        .cat-circles-row {
          display: flex;
          gap: 28px;
          justify-content: center;
          flex-wrap: wrap;
          padding: 8px 0 16px;
        }
        .cat-circle-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: transform .2s;
        }
        .cat-circle-item:hover { transform: translateY(-3px); }
        .cat-circle-img {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 4px solid white;
          transition: transform .35s cubic-bezier(.34,1.56,.64,1), box-shadow .3s;
        }
        .cat-circle-item:hover .cat-circle-img {
          transform: scale(1.1) translateY(-4px);
        }
        .cat-circle-active .cat-circle-img {
          transform: scale(1.08);
        }
        .cat-circle-name {
          font-size: 13px;
          font-weight: 700;
          color: #2C1810;
          text-align: center;
        }

        /* ── COUNTRIES ACCORDION ── */
        .countries-accord-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }
        .country-accord {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(44,24,16,0.08);
          transition: box-shadow .3s;
        }
        .country-accord.open {
          grid-column: 1 / -1;
          box-shadow: 0 12px 40px rgba(44,24,16,0.16);
        }
        .ca-header {
          cursor: pointer;
          transition: box-shadow .2s;
        }
        .ca-header:hover { box-shadow: 0 8px 30px rgba(44,24,16,0.14); }
        .ca-img {
          position: relative;
          height: 160px;
          overflow: hidden;
        }
        .ca-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .4s;
        }
        .country-accord:hover .ca-img img { transform: scale(1.05); }
        .ca-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(44,24,16,.78) 0%, rgba(44,24,16,.04) 55%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding: 18px;
        }
        .ca-flag { font-size: 32px; margin-bottom: 4px; }
        .ca-name {
          font-family: 'Caveat', cursive;
          font-size: 24px;
          font-weight: 700;
          color: white;
          text-shadow: 0 2px 8px rgba(0,0,0,.4);
        }
        .ca-body { padding: 14px 18px 18px; }
        .ca-desc { font-size: 12px; color: #7A6A5A; line-height: 1.6; margin-bottom: 12px; }
        .ca-footer { display: flex; align-items: center; justify-content: space-between; }
        .ca-cta { font-size: 13px; font-weight: 700; }

        /* Accordion panel */
        .ca-cats-panel {
          background: #FAF6EE;
          border-top: 1px solid #F0E8D6;
          padding: 28px 24px 24px;
          animation: panelOpen .3s ease;
        }
        @keyframes panelOpen { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .ca-cats-title {
          font-family: 'Caveat', cursive;
          font-size: 24px;
          font-weight: 700;
          color: #2C1810;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ca-cats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }
        .ca-cat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: transform .25s cubic-bezier(.34,1.56,.64,1);
        }
        .ca-cat-item:hover { transform: translateY(-5px); }
        .ca-cat-circle {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid;
          box-shadow: 0 4px 16px rgba(44,24,16,0.12);
          transition: box-shadow .2s;
        }
        .ca-cat-item:hover .ca-cat-circle {
          box-shadow: 0 8px 24px rgba(44,24,16,0.22);
        }
        .ca-cat-name {
          font-size: 11px;
          font-weight: 700;
          color: #2C1810;
          text-align: center;
          line-height: 1.3;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .hero-inner { grid-template-columns: 1fr; padding: 60px 20px 40px; text-align: center; }
          .hero-right { order: -1; }
          .hero-img-wrap { width: 260px; height: 260px; }
          .hero-desc, .hero-search-wrap { max-width: 100%; }
          .hero-stats-row { justify-content: center; }
          .hero-float-card { display: none; }
          .cat-circles-row { gap: 16px; }
          .cat-circle-img { width: 80px; height: 80px; }
          .cat-circle-name { font-size: 11px; }
        }
        @media (max-width: 600px) {
          .hero-title { font-size: 44px; }
          .cat-circles-row { justify-content: flex-start; overflow-x: auto; flex-wrap: nowrap; padding-bottom: 8px; scroll-snap-type: x mandatory; }
          .cat-circle-item { scroll-snap-align: start; flex-shrink: 0; }
          .countries-accord-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  )
}

export async function getStaticProps() {
  const all = getAllRecipes()
  const latest = all.length > 0 ? all.slice(0, 12) : Array(6).fill(SAMPLE_RECIPE)
  return { props: { latestRecipes: latest }, revalidate: 60 }
}
