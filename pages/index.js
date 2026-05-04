import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { COUNTRIES, RECIPE_CATEGORIES, getAllRecipes, SAMPLE_RECIPE } from '../lib/data'

export default function HomePage({ latestRecipes, heroRecipe, allRecipes }) {
  const router = useRouter()
  const [activeCountry, setActiveCountry] = useState(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [activeCat, setActiveCat] = useState(null)
  const [searchVal, setSearchVal] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)
  const exploreRef = useRef(null)
  const searchInputRef = useRef(null)

  const heroImg = heroRecipe?.image1 ||
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=900'

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openPanel = () => {
    setPanelOpen(true)
    setTimeout(() => searchInputRef.current?.focus(), 350)
  }
  const closePanel = () => setPanelOpen(false)

  const handleCatSelect = (catId) => {
    setActiveCat(catId)
    setSearchVal('')
    setSearching(true)
    const filtered = catId === 'all'
      ? allRecipes.slice(0, 12)
      : allRecipes.filter(r => r.category === catId).slice(0, 12)
    setSearchResults(filtered)
    closePanel()
    exploreRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSearch = (val) => {
    setSearchVal(val)
    setActiveCat(null)
    if (!val.trim()) { setSearching(false); setSearchResults([]); return }
    setSearching(true)
    const term = val.toLowerCase().trim()
    const filtered = allRecipes.filter(r =>
      r.title?.toLowerCase().includes(term) ||
      r.countryName?.toLowerCase().includes(term) ||
      r.categoryName?.toLowerCase().includes(term) ||
      r.cuisine?.toLowerCase().includes(term) ||
      r.description?.toLowerCase().includes(term) ||
      r.tags?.some(t => t.toLowerCase().includes(term))
    ).slice(0, 12)
    setSearchResults(filtered)
    exploreRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const clearSearch = () => {
    setSearchVal(''); setActiveCat(null); setSearching(false); setSearchResults([])
    if (searchInputRef.current) searchInputRef.current.focus()
  }

  const toggleCountry = (id) => setActiveCountry(prev => prev === id ? null : id)

  const currentCatLabel = activeCat
    ? (activeCat === 'all' ? 'All Recipes'
      : (RECIPE_CATEGORIES.find(c => c.id === activeCat)?.icon || '') + ' ' +
        (RECIPE_CATEGORIES.find(c => c.id === activeCat)?.name || ''))
    : ''

  // Mood/category quick picks
  const moodPicks = [
    { icon: '🔥', label: 'Quick', sub: 'Under 30 min', cat: 'appetizers', bg: '#FFF0E8' },
    { icon: '🍳', label: 'Breakfast', sub: 'Morning meals', cat: 'breakfast', bg: '#EAF5EE' },
    { icon: '🍽️', label: 'Dinner', sub: 'Family classics', cat: 'dinner', bg: '#FFF7E0' },
    { icon: '🍰', label: 'Desserts', sub: 'Sweet endings', cat: 'desserts', bg: '#F0EDFF' },
  ]

  return (
    <>
      <Head>
        <title>FoodHive World — Authentic Recipes from 10 World Cuisines</title>
        <meta name="description" content="Explore authentic step-by-step recipes from 10 world cuisines. Discover Pakistani, Turkish, Chinese, Indian, Korean, Mexican and more." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet" />
      </Head>

      {/* ── ANNOUNCEMENT STRIP ── */}
      <div className="ann-strip">
        <strong>New:</strong> 500+ recipes now live &nbsp;
        <span className="ann-dot" />&nbsp;
        10 world cuisines &nbsp;
        <span className="ann-dot" />&nbsp;
        Fresh drops every day
      </div>

      {/* ── NAVBAR ── */}
      <nav className={`nav${navScrolled ? ' nav-scrolled' : ''}`}>
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <span className="nav-logo-mark">
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <path d="M12 3C8.5 3 5 5.5 5 9c0 2.5 1.5 4.5 3.5 5.5V18h7v-3.5C17.5 13.5 19 11.5 19 9c0-3.5-3.5-6-7-6z" fill="white" fillOpacity="0.95"/>
                <rect x="8.5" y="18" width="7" height="2" rx="1" fill="white" fillOpacity="0.7"/>
              </svg>
            </span>
            Food<span>Hive</span>
          </Link>

          <div className="nav-links">
            <Link href="/" className="nav-link active">Home</Link>
            <Link href="#explore" className="nav-link">Recipes</Link>
            <Link href="#countries" className="nav-link">Cuisines</Link>
            <Link href="/about" className="nav-link">About</Link>
          </div>

          <div className="nav-right">
            <button className="nav-search-btn" onClick={() => router.push('/search')} aria-label="Search">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/>
                <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </button>
            <Link href="/recipes" className="nav-cta">Browse All →</Link>
          </div>
        </div>
      </nav>

      {/* ── FLOATING PANEL BUTTON ── */}
      <button
        className={`fab-dots${panelOpen ? ' fab-open' : ''}`}
        onClick={panelOpen ? closePanel : openPanel}
        aria-label={panelOpen ? 'Close panel' : 'Search & Categories'}
        title="Search & Categories"
      >
        <span className="fab-dot" />
        <span className="fab-dot" />
        <span className="fab-dot" />
      </button>

      {/* ── SIDE PANEL ── */}
      <aside className={`side-panel${panelOpen ? ' side-panel-open' : ''}`} aria-hidden={!panelOpen}>
        <div className="panel-head">
          <div className="panel-title-row">
            <span className="panel-title">Search & Browse</span>
            <button className="panel-close" onClick={closePanel} aria-label="Close">✕</button>
          </div>
          <div className="panel-search-box">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{flexShrink:0}}>
              <circle cx="7" cy="7" r="5" stroke="#bbb" strokeWidth="1.4"/>
              <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="#bbb" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              value={searchVal}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search biryani, pasta, tacos..."
              className="panel-search-input"
            />
            {searchVal && <button className="panel-search-clear" onClick={clearSearch}>✕</button>}
          </div>
        </div>

        <div className="panel-cats-wrap">
          <div className="panel-cats-label">Browse by Category</div>
          <div className="panel-cats-list">
            <button className={`panel-cat-btn${activeCat === 'all' ? ' active' : ''}`} onClick={() => handleCatSelect('all')}>
              <span className="pcb-icon">🌐</span><span className="pcb-name">All Recipes</span>
            </button>
            {RECIPE_CATEGORIES.map(cat => (
              <button key={cat.id} className={`panel-cat-btn${activeCat === cat.id ? ' active' : ''}`} onClick={() => handleCatSelect(cat.id)}>
                <span className="pcb-icon">{cat.icon}</span><span className="pcb-name">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="panel-cuisines-wrap">
          <div className="panel-cats-label">Browse by Cuisine</div>
          <div className="panel-cuisine-grid">
            {COUNTRIES.map(c => (
              <Link key={c.id} href={`/countries/${c.id}`} className="panel-cuisine-pill" onClick={closePanel}>
                {c.flag} {c.name}
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {panelOpen && <div className="panel-backdrop" onClick={closePanel} aria-hidden="true" />}

      {/* ════════════════════════════
          HERO SECTION
      ════════════════════════════ */}
      <section className="hero">
        {/* Left — content */}
        <div className="hero-left">
          <div className="hero-eyebrow">
            <span className="eyebrow-dot" />
            <span className="eyebrow-text">Today's Feature</span>
          </div>

          <h1 className="hero-title">
            {heroRecipe?.title
              ? <>Discover <em>{heroRecipe.title}</em></>
              : <>Discover &amp; Cook <em>Amazing Recipes</em></>}
          </h1>

          <p className="hero-desc">
            Authentic step-by-step recipes from 10 world cuisines — Pakistani, Turkish,
            Chinese, Korean, Indian and more. Traditional ingredients, time-tested techniques.
          </p>

          <div className="hero-actions">
            <Link href={heroRecipe?.slug ? `/recipes/${heroRecipe.slug}` : '#explore'} className="btn-primary">
              View Recipe
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="#explore" className="btn-ghost">Browse all recipes</Link>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-num">500+</div>
              <div className="stat-label">Recipes</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">10</div>
              <div className="stat-label">Cuisines</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">12</div>
              <div className="stat-label">Categories</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">Daily</div>
              <div className="stat-label">New Drops</div>
            </div>
          </div>
        </div>

        {/* Right — image */}
        <div className="hero-right">
          <div className="hero-img-overlay" />
          <img src={heroImg} alt={heroRecipe?.title || 'Featured recipe'} className="hero-img" />
          
          <div className="hero-badge hero-badge-time">
            <div className="hbt-num">{heroRecipe?.totalTime || '45 min'}</div>
            <div className="hbt-label">Cook Time</div>
          </div>

          <div className="hero-badge hero-badge-feat">
            <div className="hbf-info">
              <div className="hbf-title">{heroRecipe?.title || 'Featured Recipe'}</div>
              <div className="hbf-meta">
                {heroRecipe?.countryFlag || '🍴'} {heroRecipe?.countryName || 'World Cuisine'} · {heroRecipe?.categoryName || 'Recipe'}
              </div>
            </div>
            <div className="hbf-pill">Featured</div>
          </div>
        </div>
      </section>

      {/* ── TRENDING TICKER ── */}
      <div className="ticker-wrap">
        <div className="ticker-label-area">
          <span className="ticker-dot-live" />
          <span className="ticker-lbl">Trending</span>
        </div>
        <div className="ticker-scroll">
          <div className="ticker-inner">
            {['Biryani','Nihari','Butter Chicken','Baklava','Sushi','Tacos al Pastor','Pad Thai','Tiramisu','Kimchi Jjigae','Shawarma','Biryani','Nihari','Butter Chicken','Baklava','Sushi','Tacos al Pastor','Pad Thai','Tiramisu','Kimchi Jjigae','Shawarma'].map((item, i) => (
              <span key={i} className="ticker-item">{item}<span className="ticker-sep" /></span>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════
          FEATURED LATEST RECIPES
      ════════════════════════════ */}
      <section className="section-wrap" id="latest">
        <div className="section-head">
          <div>
            <div className="section-kicker">Hand-picked</div>
            <h2 className="section-title">Featured Recipes</h2>
          </div>
          <Link href="/recipes" className="section-view-all">
            View all recipes
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        <div className="featured-grid">
          {latestRecipes.slice(0, 3).map((r, i) => (
            <Link key={r.slug || i} href={`/recipes/${r.slug}`} className="recipe-card">
              <div className="rc-img-wrap">
                <img src={r.image1 || r.image2} alt={r.title} className="rc-img" loading="lazy" />
                <div className="rc-num">0{i + 1}</div>
                <div className="rc-save">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M8 13.5l-6-6a3.5 3.5 0 015-5l1 1 1-1a3.5 3.5 0 015 5z" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                </div>
              </div>
              <div className="rc-body">
                <div className="rc-cuisine-row">
                  <span className="rc-flag">{r.countryFlag}</span>
                  <span className="rc-cuisine">{r.countryName}</span>
                </div>
                <div className="rc-title">{r.title}</div>
                <div className="rc-foot">
                  <div className="rc-tags">
                    <span className="rtag">{r.totalTime || '–'}</span>
                    <span className={`rtag diff`}>{r.categoryName}</span>
                  </div>
                  <div className="rc-arrow">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── MOOD / QUICK PICKS ── */}
      <section className="mood-section">
        <div className="section-wrap">
          <div className="section-head" style={{paddingTop: '48px'}}>
            <div>
              <div className="section-kicker">Browse smarter</div>
              <h2 className="section-title">Find by Mood</h2>
            </div>
          </div>
          <div className="mood-grid">
            {moodPicks.map((m, i) => (
              <button key={i} className="mood-card" style={{background: m.bg}} onClick={() => handleCatSelect(m.cat)}>
                <span className="mood-icon">{m.icon}</span>
                <div className="mood-info">
                  <div className="mood-title">{m.label}</div>
                  <div className="mood-sub">{m.sub}</div>
                </div>
                <svg className="mood-arrow" width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════
          EXPLORE / SEARCH RESULTS
      ════════════════════════════ */}
      <section id="explore" className="explore-section" ref={exploreRef}>
        <div className="section-wrap">

          {searching && (
            <div className="search-results-block">
              <div className="srb-head">
                <div className="srb-info">
                  {searchVal
                    ? <><span className="srb-label">Results for</span><span className="srb-query">"{searchVal}"</span></>
                    : <span className="srb-query">{currentCatLabel}</span>}
                  <span className="srb-count">{searchResults.length} found</span>
                </div>
                <button className="srb-clear" onClick={clearSearch}>✕ Clear</button>
              </div>

              {searchResults.length > 0 ? (
                <div className="search-recipe-grid">
                  {searchResults.map((r, i) => (
                    <Link key={r.slug || i} href={`/recipes/${r.slug}`} className="src-card">
                      <div className="src-img-wrap">
                        <img src={r.image1 || r.image2} alt={r.title} className="src-img" loading="lazy" />
                        <span className="src-badge">{r.categoryIcon} {r.categoryName}</span>
                      </div>
                      <div className="src-body">
                        <div className="src-country">{r.countryFlag} {r.countryName}</div>
                        <div className="src-title">{r.title}</div>
                        <div className="src-meta">
                          <span>⏱ {r.totalTime}</span>
                          <span>⭐ {r.rating}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="srb-empty">
                  <div style={{fontSize:48, marginBottom:12}}>🍽️</div>
                  <p>No recipes found{searchVal ? ` for "${searchVal}"` : ''}.</p>
                  <p style={{fontSize:13, color:'#bbb', marginTop:6}}>Try a different search term</p>
                </div>
              )}
              <div className="srb-divider" />
            </div>
          )}

          {/* ── WORLD CUISINES EXPLORER ── */}
          <div id="countries" className="explore-head">
            <div className="section-kicker">Explore the world</div>
            <h2 className="section-title" style={{marginBottom:8}}>Browse by Cuisine</h2>
            <p className="explore-desc">
              Click any cuisine to explore its full recipe collection, or use the <strong style={{color:'var(--flame)'}}>⋮ button</strong> on the left to search and filter by category.
            </p>
          </div>

          {/* Cuisine Cards Grid */}
          <div className="cuisine-grid">
            {COUNTRIES.map((country) => (
              <div
                key={country.id}
                className={`cuisine-card${activeCountry === country.id ? ' cuisine-active' : ''}`}
                onClick={() => toggleCountry(country.id)}
              >
                <div className="cuisine-card-img-wrap">
                  <img src={country.image} alt={country.name} className="cuisine-card-img" loading="lazy" />
                  <div className="cuisine-card-overlay" />
                </div>
                <div className="cuisine-card-body">
                  <span className="cuisine-flag">{country.flag}</span>
                  <span className="cuisine-name">{country.name}</span>
                </div>
                {activeCountry === country.id && <div className="cuisine-active-ring" />}
              </div>
            ))}
          </div>

          {/* Category expand when cuisine selected */}
          {activeCountry && (() => {
            const country = COUNTRIES.find(c => c.id === activeCountry)
            return (
              <div className="cats-expand-wrap">
                <div className="cats-expand-header">
                  <span className="cats-expand-flag">{country.flag}</span>
                  <span className="cats-expand-name">{country.name} — Choose a Category</span>
                </div>
                <div className="cats-expand-grid">
                  {RECIPE_CATEGORIES.map((cat, i) => (
                    <Link
                      key={cat.id}
                      href={`/countries/${activeCountry}?cat=${cat.id}`}
                      className="cat-expand-item"
                      style={{animationDelay: `${i * 35}ms`}}
                    >
                      <div className="cat-expand-circle">
                        <span className="cat-expand-emoji">{cat.icon}</span>
                      </div>
                      <span className="cat-expand-label">{cat.name.split(' ')[0]}</span>
                    </Link>
                  ))}
                </div>
                <div style={{textAlign:'center', marginTop:28}}>
                  <Link href={`/countries/${activeCountry}`} className="view-country-btn">
                    View All {country.name} Recipes →
                  </Link>
                </div>
              </div>
            )
          })()}
        </div>
      </section>

      {/* ── DARK EDITORIAL SECTION ── */}
      <section className="editorial-section">
        <div className="editorial-left">
          <div className="editorial-kicker">Collection</div>
          <h2 className="editorial-title">
            30-Minute Weeknight <em>Dinners</em>
          </h2>
          <p className="editorial-desc">
            Real food for real families. Hand-curated recipes that go from pantry to plate in half an hour — no shortcuts, no compromise.
          </p>
          <button className="editorial-btn" onClick={() => handleCatSelect('dinner')}>
            Explore Dinners
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="editorial-right">
          {latestRecipes.slice(3, 6).map((r, i) => (
            <Link key={r.slug || i} href={`/recipes/${r.slug}`} className="mini-card">
              <span className="mini-card-flag">{r.countryFlag}</span>
              <div className="mini-card-info">
                <div className="mini-card-title">{r.title}</div>
                <div className="mini-card-sub">{r.totalTime} · {r.categoryName}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="fh-footer">
        <div className="section-wrap">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo-wrap">
                <span className="footer-logo-mark">
                  <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                    <path d="M12 3C8.5 3 5 5.5 5 9c0 2.5 1.5 4.5 3.5 5.5V18h7v-3.5C17.5 13.5 19 11.5 19 9c0-3.5-3.5-6-7-6z" fill="white" fillOpacity="0.9"/>
                    <rect x="8.5" y="18" width="7" height="2" rx="1" fill="white" fillOpacity="0.7"/>
                  </svg>
                </span>
                <span className="footer-logo-text">Food<span>Hive</span></span>
              </div>
              <p className="footer-desc">Recipes from every corner of the world — curated, tested, and published daily. 10 cuisines, 12 categories, one home.</p>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Explore</div>
              <Link href="/recipes" className="footer-link">All Recipes</Link>
              {RECIPE_CATEGORIES.slice(0, 5).map(c => (
                <Link key={c.id} href={`/categories/${c.id}`} className="footer-link">{c.icon} {c.name}</Link>
              ))}
            </div>
            <div className="footer-col">
              <div className="footer-col-title">More</div>
              {RECIPE_CATEGORIES.slice(5).map(c => (
                <Link key={c.id} href={`/categories/${c.id}`} className="footer-link">{c.icon} {c.name}</Link>
              ))}
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Cuisines</div>
              {COUNTRIES.slice(0, 6).map(c => (
                <Link key={c.id} href={`/countries/${c.id}`} className="footer-link">{c.flag} {c.name}</Link>
              ))}
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 FoodHive World. All rights reserved.</span>
            <span>10 Cuisines · 12 Categories · Updated Daily</span>
            <Link href="/privacy" className="footer-link-inline">Privacy Policy</Link>
          </div>
        </div>
      </footer>

      {/* ════════════════════════════
          ALL STYLES
      ════════════════════════════ */}
      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          font-family: 'DM Sans', -apple-system, sans-serif;
          background: #FAF6F0;
          color: #1A1410;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }
        a { text-decoration: none; color: inherit; }
        img { display: block; max-width: 100%; }

        :root {
          --flame: #C94A22;
          --flame-deep: #9E3317;
          --ember: #E8693D;
          --cream: #FAF6F0;
          --cream-warm: #F2EBE0;
          --parchment: #E8DDD0;
          --ink: #1A1410;
          --ink-50: #7A6A60;
          --ink-30: #B5A89E;
          --font-display: 'Playfair Display', Georgia, serif;
          --font-body: 'DM Sans', sans-serif;
          --font-mono: 'DM Mono', monospace;
        }

        /* ── ANNOUNCEMENT STRIP ── */
        .ann-strip {
          background: var(--flame);
          color: #fff;
          text-align: center;
          padding: 10px 24px;
          font-size: 12.5px;
          letter-spacing: 0.03em;
        }
        .ann-strip strong { font-weight: 600; }
        .ann-dot {
          display: inline-block;
          width: 3px; height: 3px;
          background: rgba(255,255,255,0.45);
          border-radius: 50%;
          margin: 0 10px;
          vertical-align: middle;
        }

        /* ── NAVBAR ── */
        .nav {
          position: sticky; top: 0; z-index: 200;
          background: rgba(250,246,240,0.92);
          backdrop-filter: blur(16px) saturate(1.4);
          border-bottom: 1px solid var(--parchment);
          height: 68px;
          transition: box-shadow 0.3s;
        }
        .nav-scrolled { box-shadow: 0 1px 24px rgba(26,20,16,0.08); }
        .nav-inner {
          max-width: 1280px; margin: 0 auto;
          padding: 0 48px; height: 100%;
          display: flex; align-items: center; gap: 0;
        }
        .nav-logo {
          display: flex; align-items: center; gap: 10px;
          font-family: var(--font-display);
          font-size: 20px; font-weight: 600;
          color: var(--ink); letter-spacing: -0.02em;
          flex-shrink: 0;
        }
        .nav-logo span { color: var(--flame); }
        .nav-logo-mark {
          width: 34px; height: 34px;
          background: var(--flame); border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .nav-links {
          display: flex; gap: 2px; margin-left: 24px;
        }
        .nav-link {
          font-size: 13.5px; font-weight: 400;
          color: var(--ink-50); padding: 6px 14px;
          border-radius: 6px;
          transition: color 0.15s, background 0.15s;
          letter-spacing: 0.01em;
        }
        .nav-link:hover { color: var(--ink); background: var(--cream-warm); }
        .nav-link.active { color: var(--flame); font-weight: 500; }
        .nav-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
        .nav-search-btn {
          width: 36px; height: 36px;
          border: 1px solid var(--parchment); border-radius: 9px;
          background: transparent; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: var(--ink-50); transition: all 0.15s;
        }
        .nav-search-btn:hover { background: var(--cream-warm); color: var(--ink); }
        .nav-cta {
          padding: 8px 18px;
          background: var(--flame); color: #fff;
          border-radius: 9px; font-size: 13px; font-weight: 500;
          transition: background 0.15s, transform 0.15s;
        }
        .nav-cta:hover { background: var(--flame-deep); transform: translateY(-1px); }

        /* ── FAB DOTS ── */
        .fab-dots {
          position: fixed; left: 18px; top: 50%; transform: translateY(-50%);
          z-index: 300; width: 44px; height: 44px; border-radius: 50%;
          background: var(--flame); border: none; cursor: pointer;
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 4px;
          box-shadow: 0 4px 16px rgba(201,74,34,0.45);
          transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .fab-dots:hover { transform: translateY(-50%) scale(1.08); }
        .fab-dots.fab-open { background: var(--ink); left: 304px; }
        .fab-dot { width: 4px; height: 4px; border-radius: 50%; background: #fff; flex-shrink: 0; }

        /* ── SIDE PANEL ── */
        .side-panel {
          position: fixed; left: 0; top: 0; bottom: 0; width: 288px;
          background: #fff; border-right: 1px solid var(--parchment);
          z-index: 250; display: flex; flex-direction: column;
          transform: translateX(-100%);
          transition: transform 0.35s cubic-bezier(0.34,1.2,0.64,1);
          box-shadow: 4px 0 28px rgba(26,20,16,0.1);
          overflow: hidden;
        }
        .side-panel-open { transform: translateX(0); }
        .panel-head { padding: 80px 18px 14px; border-bottom: 1px solid #f0ebe4; flex-shrink: 0; }
        .panel-title-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .panel-title { font-size: 14px; font-weight: 500; color: var(--ink); font-family: var(--font-display); }
        .panel-close { background: none; border: none; font-size: 15px; color: var(--ink-30); cursor: pointer; padding: 4px 7px; border-radius: 5px; transition: all 0.15s; }
        .panel-close:hover { background: var(--cream-warm); color: var(--ink); }
        .panel-search-box {
          display: flex; align-items: center; gap: 8px;
          background: var(--cream-warm); border-radius: 10px; padding: 10px 13px;
          border: 1px solid transparent; transition: border-color 0.2s, background 0.2s;
        }
        .panel-search-box:focus-within { border-color: var(--ember); background: #fff; }
        .panel-search-input { border: none; background: none; outline: none; font-size: 13px; color: var(--ink); width: 100%; font-family: var(--font-body); }
        .panel-search-input::placeholder { color: var(--ink-30); }
        .panel-search-clear { background: none; border: none; color: var(--ink-30); cursor: pointer; font-size: 12px; }
        .panel-search-clear:hover { color: var(--ink); }
        .panel-cats-wrap { padding: 14px 18px; flex: 1; overflow-y: auto; border-bottom: 1px solid #f0ebe4; }
        .panel-cats-label { font-family: var(--font-mono); font-size: 9.5px; font-weight: 400; color: var(--ink-30); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 10px; }
        .panel-cats-list { display: flex; flex-direction: column; gap: 1px; }
        .panel-cat-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 11px; border-radius: 8px; border: none;
          background: transparent; cursor: pointer; width: 100%; text-align: left;
          transition: background 0.15s; font-family: var(--font-body);
        }
        .panel-cat-btn:hover { background: var(--cream-warm); }
        .panel-cat-btn.active { background: #FDEEE6; }
        .panel-cat-btn.active .pcb-name { color: var(--flame); font-weight: 500; }
        .pcb-icon { font-size: 16px; flex-shrink: 0; }
        .pcb-name { font-size: 13px; font-weight: 400; color: var(--ink); }
        .panel-cuisines-wrap { padding: 14px 18px 20px; flex-shrink: 0; }
        .panel-cuisine-grid { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
        .panel-cuisine-pill { font-size: 11px; font-weight: 400; padding: 5px 11px; border-radius: 100px; background: var(--cream-warm); color: var(--ink-50); border: 1px solid var(--parchment); transition: all 0.15s; }
        .panel-cuisine-pill:hover { border-color: var(--flame); color: var(--flame); background: #FDEEE6; }
        .panel-backdrop { position: fixed; inset: 0; z-index: 240; background: rgba(26,20,16,0.2); animation: bdfadeIn 0.2s ease; }
        @keyframes bdfadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* ── HERO ── */
        .hero {
          display: grid; grid-template-columns: 1fr 1fr;
          min-height: 580px; border-bottom: 1px solid var(--parchment);
        }
        .hero-left {
          padding: 64px 56px 64px 72px;
          display: flex; flex-direction: column; justify-content: center;
          position: relative;
        }
        .hero-left::after {
          content: '';
          position: absolute; right: 0; top: 12%; height: 76%;
          width: 1px;
          background: linear-gradient(to bottom, transparent, var(--parchment) 20%, var(--parchment) 80%, transparent);
        }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          margin-bottom: 22px;
          animation: fadeUp 0.6s ease both;
        }
        .eyebrow-dot {
          width: 8px; height: 8px; border-radius: 50%; background: var(--flame);
          animation: eyebrow-pulse 2.4s ease infinite;
        }
        @keyframes eyebrow-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.45;transform:scale(0.72)} }
        .eyebrow-text {
          font-family: var(--font-mono); font-size: 10.5px; font-weight: 400;
          letter-spacing: 0.13em; text-transform: uppercase; color: var(--flame);
        }
        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(38px, 4vw, 54px);
          font-weight: 600; line-height: 1.1;
          letter-spacing: -0.03em; color: var(--ink);
          margin-bottom: 18px;
          animation: fadeUp 0.7s 0.1s ease both;
        }
        .hero-title em { font-style: italic; color: var(--flame); font-weight: 400; }
        .hero-desc {
          font-size: 15.5px; font-weight: 300; color: var(--ink-50);
          line-height: 1.75; max-width: 400px; margin-bottom: 32px;
          animation: fadeUp 0.7s 0.2s ease both;
        }
        .hero-actions {
          display: flex; align-items: center; gap: 20px; margin-bottom: 44px;
          animation: fadeUp 0.7s 0.3s ease both;
        }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 24px; background: var(--flame); color: #fff;
          border-radius: 9px; font-size: 14px; font-weight: 500;
          transition: all 0.2s;
        }
        .btn-primary:hover { background: var(--flame-deep); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(201,74,34,0.28); }
        .btn-ghost {
          font-size: 13.5px; font-weight: 400; color: var(--ink-50);
          border-bottom: 1px solid var(--parchment); padding-bottom: 2px;
          transition: color 0.15s, border-color 0.15s;
        }
        .btn-ghost:hover { color: var(--ink); border-color: var(--ink-30); }
        .hero-stats {
          display: flex; gap: 28px;
          padding-top: 28px; border-top: 1px solid var(--parchment);
          animation: fadeUp 0.7s 0.4s ease both;
        }
        .stat-num {
          font-family: var(--font-display); font-size: 24px; font-weight: 600;
          color: var(--ink); letter-spacing: -0.03em; line-height: 1; margin-bottom: 3px;
        }
        .stat-label {
          font-family: var(--font-mono); font-size: 10px;
          color: var(--ink-30); letter-spacing: 0.06em; text-transform: uppercase;
        }

        /* Hero Right — image */
        .hero-right {
          position: relative; overflow: hidden;
          background: var(--ink);
        }
        .hero-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%; object-fit: cover;
          opacity: 0.75;
          transition: transform 8s ease;
        }
        .hero-img-overlay {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(to right, rgba(26,20,16,0.3) 0%, transparent 40%),
                      linear-gradient(to top, rgba(26,20,16,0.7) 0%, transparent 50%);
        }
        .hero-badge {
          position: absolute; z-index: 2;
          background: rgba(250,246,240,0.1);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(250,246,240,0.15);
          border-radius: 12px; padding: 10px 14px; color: #fff;
        }
        .hero-badge-time { top: 28px; right: 24px; text-align: center; }
        .hbt-num { font-family: var(--font-display); font-size: 22px; font-weight: 700; line-height: 1; margin-bottom: 2px; }
        .hbt-label { font-family: var(--font-mono); font-size: 9.5px; color: rgba(255,255,255,0.5); letter-spacing: 0.08em; text-transform: uppercase; }
        .hero-badge-feat {
          bottom: 28px; left: 24px; right: 24px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .hbf-title { font-family: var(--font-display); font-size: 16px; font-weight: 600; margin-bottom: 3px; letter-spacing: -0.01em; }
        .hbf-meta { font-family: var(--font-mono); font-size: 10.5px; color: rgba(255,255,255,0.5); letter-spacing: 0.04em; }
        .hbf-pill {
          padding: 5px 12px; background: var(--flame); border-radius: 100px;
          font-size: 10.5px; font-weight: 500; letter-spacing: 0.04em;
          text-transform: uppercase; flex-shrink: 0;
        }

        /* ── TICKER ── */
        .ticker-wrap {
          border-bottom: 1px solid var(--parchment);
          background: var(--cream-warm);
          overflow: hidden; height: 44px;
          display: flex; align-items: center;
        }
        .ticker-label-area {
          flex-shrink: 0; padding: 0 20px 0 24px;
          border-right: 1px solid var(--parchment); height: 100%;
          display: flex; align-items: center; gap: 7px; background: var(--cream);
        }
        .ticker-dot-live {
          width: 6px; height: 6px; background: var(--flame); border-radius: 50%;
          animation: eyebrow-pulse 2s ease infinite;
        }
        .ticker-lbl {
          font-family: var(--font-mono); font-size: 10px;
          letter-spacing: 0.12em; text-transform: uppercase; color: var(--flame);
          white-space: nowrap;
        }
        .ticker-scroll {
          flex: 1; overflow: hidden; padding: 0 24px;
          mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
        }
        .ticker-inner {
          display: flex; width: max-content;
          animation: ticker 30s linear infinite;
        }
        .ticker-inner:hover { animation-play-state: paused; }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .ticker-item {
          display: inline-flex; align-items: center; gap: 16px;
          font-size: 13px; color: var(--ink-50); padding-right: 32px;
          white-space: nowrap; transition: color 0.2s;
        }
        .ticker-item:hover { color: var(--flame); }
        .ticker-sep { width: 4px; height: 4px; background: var(--parchment); border-radius: 50%; flex-shrink: 0; }

        /* ── LAYOUT UTIL ── */
        .section-wrap { max-width: 1280px; margin: 0 auto; padding: 0 48px; }
        .section-head {
          display: flex; align-items: flex-end; justify-content: space-between;
          padding: 56px 0 28px;
        }
        .section-kicker {
          font-family: var(--font-mono); font-size: 10px;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--flame); margin-bottom: 5px;
        }
        .section-title {
          font-family: var(--font-display); font-size: 28px;
          font-weight: 600; color: var(--ink); letter-spacing: -0.025em; line-height: 1.1;
        }
        .section-view-all {
          font-size: 13px; color: var(--ink-50);
          display: flex; align-items: center; gap: 5px;
          border-bottom: 1px solid var(--parchment); padding-bottom: 3px;
          transition: color 0.15s, border-color 0.15s;
        }
        .section-view-all:hover { color: var(--flame); border-color: var(--ember); }

        /* ── FEATURED GRID ── */
        .featured-grid {
          display: grid; grid-template-columns: repeat(3,1fr);
          border: 1px solid var(--parchment); border-radius: 16px;
          overflow: hidden; margin-bottom: 64px;
          box-shadow: 0 2px 28px rgba(26,20,16,0.06);
        }
        .recipe-card {
          border-right: 1px solid var(--parchment);
          background: #fff; transition: background 0.2s; cursor: pointer;
          display: block;
        }
        .recipe-card:last-child { border-right: none; }
        .recipe-card:hover { background: var(--cream); }
        .rc-img-wrap { height: 180px; position: relative; overflow: hidden; border-bottom: 1px solid var(--parchment); }
        .rc-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .recipe-card:hover .rc-img { transform: scale(1.04); }
        .rc-num {
          position: absolute; top: 12px; left: 14px;
          font-family: var(--font-mono); font-size: 11px;
          color: rgba(255,255,255,0.7); letter-spacing: 0.06em;
          text-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }
        .rc-save {
          position: absolute; top: 10px; right: 12px;
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(255,255,255,0.85); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          color: var(--flame); opacity: 0; transition: opacity 0.2s;
        }
        .recipe-card:hover .rc-save { opacity: 1; }
        .rc-body { padding: 16px 18px 20px; }
        .rc-cuisine-row { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
        .rc-flag { font-size: 14px; }
        .rc-cuisine { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-30); }
        .rc-title {
          font-family: var(--font-display); font-size: 16.5px; font-weight: 500;
          color: var(--ink); line-height: 1.3; letter-spacing: -0.01em; margin-bottom: 12px;
        }
        .rc-foot { display: flex; align-items: center; justify-content: space-between; }
        .rc-tags { display: flex; gap: 6px; }
        .rtag {
          font-size: 11px; padding: 3px 9px; border-radius: 100px;
          background: var(--cream-warm); color: var(--ink-50);
          border: 1px solid var(--parchment);
        }
        .rtag.diff { background: #EAF5EE; color: #3A7A52; border-color: #C2E0CC; }
        .rc-arrow {
          width: 28px; height: 28px; border-radius: 50%;
          border: 1px solid var(--parchment);
          display: flex; align-items: center; justify-content: center;
          color: var(--ink-30); transition: all 0.2s;
        }
        .recipe-card:hover .rc-arrow { background: var(--flame); border-color: var(--flame); color: #fff; }

        /* ── MOOD SECTION ── */
        .mood-section { background: var(--cream-warm); border-top: 1px solid var(--parchment); border-bottom: 1px solid var(--parchment); }
        .mood-grid {
          display: grid; grid-template-columns: repeat(4,1fr);
          gap: 12px; margin-bottom: 64px;
        }
        .mood-card {
          padding: 18px 18px; border-radius: 14px;
          border: 1px solid var(--parchment);
          display: flex; align-items: center; gap: 14px;
          cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
          text-align: left; font-family: var(--font-body);
        }
        .mood-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(26,20,16,0.1); }
        .mood-icon { font-size: 24px; flex-shrink: 0; }
        .mood-info { flex: 1; }
        .mood-title { font-size: 14px; font-weight: 500; color: var(--ink); margin-bottom: 2px; }
        .mood-sub { font-size: 11.5px; color: var(--ink-50); }
        .mood-arrow { color: var(--ink-30); flex-shrink: 0; }

        /* ── EXPLORE / SEARCH RESULTS ── */
        .explore-section { padding: 56px 0 48px; background: var(--cream); }
        .explore-head { margin-bottom: 28px; }
        .explore-desc { font-size: 14px; font-weight: 300; color: var(--ink-50); line-height: 1.75; max-width: 520px; margin-top: 8px; }

        .search-results-block { margin-bottom: 48px; }
        .srb-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; padding-bottom: 14px; border-bottom: 1px solid var(--parchment); flex-wrap: wrap; gap: 12px; }
        .srb-info { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .srb-label { font-size: 13px; color: var(--ink-30); }
        .srb-query { font-family: var(--font-display); font-size: 22px; font-weight: 600; color: var(--ink); }
        .srb-count { font-family: var(--font-mono); font-size: 11px; color: var(--flame); background: #FDEEE6; padding: 4px 12px; border-radius: 100px; }
        .srb-clear { background: none; border: 1px solid var(--parchment); color: var(--ink-50); font-size: 12px; font-weight: 400; padding: 7px 16px; border-radius: 100px; cursor: pointer; font-family: var(--font-body); transition: all 0.15s; }
        .srb-clear:hover { border-color: var(--flame); color: var(--flame); }
        .srb-divider { height: 1px; background: var(--parchment); margin: 48px 0 36px; }
        .srb-empty { text-align: center; padding: 56px 40px; background: var(--cream-warm); border-radius: 14px; border: 1px dashed var(--parchment); }
        .srb-empty p { font-size: 15px; color: var(--ink-50); }

        .search-recipe-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
        .src-card { background: #fff; border-radius: 14px; overflow: hidden; border: 1px solid var(--parchment); box-shadow: 0 2px 12px rgba(26,20,16,0.05); transition: transform 0.25s, box-shadow 0.25s; display: block; }
        .src-card:hover { transform: translateY(-4px); box-shadow: 0 10px 28px rgba(26,20,16,0.1); }
        .src-img-wrap { position: relative; height: 160px; overflow: hidden; }
        .src-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s; }
        .src-card:hover .src-img { transform: scale(1.04); }
        .src-badge { position: absolute; bottom: 10px; left: 10px; background: var(--flame); color: #fff; font-size: 10px; font-weight: 500; padding: 3px 10px; border-radius: 100px; }
        .src-body { padding: 13px 15px 16px; }
        .src-country { font-family: var(--font-mono); font-size: 10px; color: var(--ink-30); margin-bottom: 5px; letter-spacing: 0.06em; }
        .src-title { font-family: var(--font-display); font-size: 15px; font-weight: 500; color: var(--ink); line-height: 1.3; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .src-meta { display: flex; gap: 12px; font-size: 11.5px; color: var(--ink-30); font-family: var(--font-mono); }

        /* ── CUISINE GRID ── */
        .cuisine-grid {
          display: grid; grid-template-columns: repeat(5, 1fr);
          gap: 10px; margin-bottom: 24px;
        }
        .cuisine-card {
          border-radius: 14px; overflow: hidden; cursor: pointer;
          position: relative; height: 140px; transition: transform 0.25s, box-shadow 0.25s;
          border: 2px solid transparent;
        }
        .cuisine-card:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(26,20,16,0.14); }
        .cuisine-active { border-color: var(--flame); }
        .cuisine-card-img-wrap { position: absolute; inset: 0; }
        .cuisine-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
        .cuisine-card:hover .cuisine-card-img { transform: scale(1.06); }
        .cuisine-card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,8,3,0.72) 0%, transparent 60%); }
        .cuisine-card-body {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 12px 14px; display: flex; align-items: center; gap: 7px; z-index: 1;
        }
        .cuisine-flag { font-size: 18px; }
        .cuisine-name { font-family: var(--font-display); font-size: 14.5px; font-weight: 600; color: #fff; letter-spacing: -0.01em; }
        .cuisine-active-ring {
          position: absolute; inset: -2px; border-radius: 14px;
          border: 2px solid var(--flame); pointer-events: none;
        }

        /* Category expand */
        .cats-expand-wrap {
          background: var(--cream-warm); border: 1px solid var(--parchment);
          border-radius: 14px; padding: 28px 32px 24px; margin-bottom: 24px;
          animation: expandDown 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes expandDown { from{opacity:0;transform:translateY(-10px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }
        .cats-expand-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
        .cats-expand-flag { font-size: 24px; }
        .cats-expand-name { font-family: var(--font-display); font-size: 17px; font-weight: 500; color: var(--ink); }
        .cats-expand-grid { display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 8px; }
        .cat-expand-item {
          display: flex; flex-direction: column; align-items: center; gap: 7px;
          cursor: pointer; transition: transform 0.25s;
          animation: catPopIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes catPopIn { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
        .cat-expand-item:hover { transform: translateY(-4px); }
        .cat-expand-circle {
          width: 60px; height: 60px; border-radius: 50%;
          background: #fff; border: 1.5px solid var(--parchment);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 10px rgba(26,20,16,0.07); transition: all 0.2s;
        }
        .cat-expand-item:hover .cat-expand-circle { background: var(--flame); border-color: var(--flame); }
        .cat-expand-emoji { font-size: 24px; transition: filter 0.2s; }
        .cat-expand-item:hover .cat-expand-emoji { filter: brightness(0) invert(1); }
        .cat-expand-label { font-size: 11.5px; font-weight: 400; color: var(--ink-50); text-align: center; }
        .view-country-btn {
          display: inline-block; background: var(--flame); color: #fff;
          font-size: 13px; font-weight: 500; padding: 11px 24px;
          border-radius: 9px; transition: all 0.2s;
        }
        .view-country-btn:hover { background: var(--flame-deep); transform: translateY(-1px); }

        /* ── EDITORIAL DARK SECTION ── */
        .editorial-section {
          background: var(--ink); padding: 72px 72px;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 72px; align-items: center;
          border-top: 1px solid rgba(255,255,255,0.06);
          position: relative; overflow: hidden;
        }
        .editorial-section::before {
          content: ''; position: absolute;
          top: -80px; right: -80px; width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,74,34,0.18), transparent 70%);
          pointer-events: none;
        }
        .editorial-kicker {
          font-family: var(--font-mono); font-size: 10.5px;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--ember); margin-bottom: 14px;
          display: flex; align-items: center; gap: 10px;
        }
        .editorial-kicker::before { content: ''; display: block; width: 20px; height: 1px; background: var(--ember); }
        .editorial-title {
          font-family: var(--font-display);
          font-size: clamp(32px, 3.5vw, 46px);
          font-weight: 600; color: #fff;
          line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 18px;
        }
        .editorial-title em { font-style: italic; color: var(--ember); font-weight: 400; }
        .editorial-desc { font-size: 15px; font-weight: 300; color: rgba(255,255,255,0.45); line-height: 1.8; margin-bottom: 28px; }
        .editorial-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 22px; border: 1px solid rgba(255,255,255,0.15);
          border-radius: 9px; color: #fff; font-size: 13.5px;
          background: none; cursor: pointer; font-family: var(--font-body);
          transition: all 0.2s;
        }
        .editorial-btn:hover { background: var(--flame); border-color: var(--flame); transform: translateY(-2px); }
        .editorial-right { display: flex; flex-direction: column; gap: 10px; position: relative; z-index: 1; }
        .mini-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 11px; padding: 14px 16px;
          display: flex; align-items: center; gap: 14px;
          transition: all 0.2s; cursor: pointer;
        }
        .mini-card:hover { background: rgba(255,255,255,0.09); transform: translateX(4px); }
        .mini-card-flag { font-size: 22px; flex-shrink: 0; }
        .mini-card-title { font-family: var(--font-display); font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.82); margin-bottom: 3px; letter-spacing: -0.01em; }
        .mini-card-sub { font-family: var(--font-mono); font-size: 11px; color: rgba(255,255,255,0.3); letter-spacing: 0.04em; }

        /* ── FOOTER ── */
        .fh-footer { background: var(--ink); padding: 60px 0 32px; }
        .footer-grid {
          display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px; padding-bottom: 44px;
          border-bottom: 1px solid rgba(255,255,255,0.07); margin-bottom: 28px;
        }
        .footer-brand {}
        .footer-logo-wrap { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
        .footer-logo-mark { width: 32px; height: 32px; background: var(--flame); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .footer-logo-text { font-family: var(--font-display); font-size: 18px; font-weight: 600; color: #fff; letter-spacing: -0.02em; }
        .footer-logo-text span { color: var(--ember); }
        .footer-desc { font-size: 13px; font-weight: 300; color: rgba(255,255,255,0.35); line-height: 1.8; max-width: 240px; }
        .footer-col-title { font-family: var(--font-mono); font-size: 10px; font-weight: 400; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 14px; }
        .footer-link { display: block; font-size: 13px; font-weight: 300; color: rgba(255,255,255,0.35); margin-bottom: 9px; transition: color 0.15s; }
        .footer-link:hover { color: rgba(255,255,255,0.8); }
        .footer-bottom { display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: rgba(255,255,255,0.2); font-family: var(--font-mono); letter-spacing: 0.03em; flex-wrap: wrap; gap: 8px; }
        .footer-link-inline { font-size: 12px; color: rgba(255,255,255,0.2); font-family: var(--font-mono); transition: color 0.15s; }
        .footer-link-inline:hover { color: rgba(255,255,255,0.6); }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

        /* ── RESPONSIVE ── */
        @media (max-width: 1100px) {
          .cuisine-grid { grid-template-columns: repeat(4,1fr); }
        }
        @media (max-width: 900px) {
          .hero { grid-template-columns: 1fr; }
          .hero-left { padding: 48px 28px 40px; }
          .hero-left::after { display: none; }
          .hero-right { min-height: 280px; }
          .featured-grid { grid-template-columns: 1fr; }
          .recipe-card { border-right: none; border-bottom: 1px solid var(--parchment); }
          .editorial-section { grid-template-columns: 1fr; padding: 48px 28px; gap: 36px; }
          .cuisine-grid { grid-template-columns: repeat(3,1fr); }
          .mood-grid { grid-template-columns: 1fr 1fr; }
          .footer-grid { grid-template-columns: 1fr 1fr; }
          .nav-inner { padding: 0 24px; }
          .section-wrap { padding: 0 24px; }
          .fab-dots.fab-open { left: 296px; }
          .side-panel { width: 282px; }
        }
        @media (max-width: 600px) {
          .cuisine-grid { grid-template-columns: 1fr 1fr; }
          .mood-grid { grid-template-columns: 1fr; }
          .search-recipe-grid { grid-template-columns: 1fr 1fr; }
          .footer-grid { grid-template-columns: 1fr; }
          .nav-links { display: none; }
          .fab-dots.fab-open { left: 286px; }
          .side-panel { width: 272px; }
          .editorial-section { padding: 40px 24px; }
        }
        @media (max-width: 400px) {
          .search-recipe-grid { grid-template-columns: 1fr; }
          .fab-dots.fab-open { left: 270px; }
          .side-panel { width: 258px; }
        }
      `}</style>
    </>
  )
}

export async function getStaticProps() {
  const all = getAllRecipes()
  const heroRecipe = all.length > 0 ? all[0] : SAMPLE_RECIPE
  return {
    props: {
      latestRecipes: all.slice(0, 6),
      heroRecipe,
      allRecipes: all,
    },
    revalidate: 60
  }
}
