import { useState, useRef } from 'react'
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
  const exploreRef = useRef(null)
  const searchInputRef = useRef(null)

  const heroImg = heroRecipe?.image1 ||
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=900'

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
    exploreRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSearch = (val) => {
    setSearchVal(val)
    setActiveCat(null)
    if (!val.trim()) {
      setSearching(false)
      setSearchResults([])
      return
    }
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
    setSearchVal('')
    setActiveCat(null)
    setSearching(false)
    setSearchResults([])
    if (searchInputRef.current) searchInputRef.current.focus()
  }

  const toggleCountry = (id) => setActiveCountry(prev => prev === id ? null : id)

  const currentCatLabel = activeCat
    ? (activeCat === 'all'
        ? 'All Recipes'
        : (RECIPE_CATEGORIES.find(c => c.id === activeCat)?.icon || '') + ' ' + (RECIPE_CATEGORIES.find(c => c.id === activeCat)?.name || ''))
    : ''

  return (
    <>
      <Head>
        <title>FoodHive — Authentic Recipes from 10 World Cuisines</title>
        <meta name="description" content="Explore authentic step-by-step recipes from 10 world cuisines. Discover Pakistani, Turkish, Chinese, Indian, Korean, Mexican and more." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      {/* ── NAVBAR ── */}
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">Food<span>Hive</span>.</Link>
          <div className="nav-links">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="#explore" className="nav-link">Recipes</Link>
            <Link href="#countries" className="nav-link">Cuisines</Link>
            <Link href="/about" className="nav-link">About</Link>
          </div>
          <div className="nav-right">
            <button className="nav-icon-btn" onClick={() => router.push('/search')} aria-label="Search">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════
          FLOATING 3-DOTS BUTTON
      ═══════════════════════════ */}
      <button
        className={`fab-dots${panelOpen ? ' fab-open' : ''}`}
        onClick={panelOpen ? closePanel : openPanel}
        aria-label={panelOpen ? 'Close panel' : 'Open search and categories'}
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
            <span className="panel-title">🔍 Search &amp; Browse</span>
            <button className="panel-close" onClick={closePanel} aria-label="Close panel">✕</button>
          </div>
          <div className="panel-search-box">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              value={searchVal}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search biryani, pasta, tacos..."
              className="panel-search-input"
            />
            {searchVal && (
              <button className="panel-search-clear" onClick={clearSearch}>✕</button>
            )}
          </div>
        </div>

        <div className="panel-cats-wrap">
          <div className="panel-cats-label">Browse by Category</div>
          <div className="panel-cats-list">
            <button
              className={`panel-cat-btn${activeCat === 'all' ? ' active' : ''}`}
              onClick={() => handleCatSelect('all')}
            >
              <span className="pcb-icon">🌐</span>
              <span className="pcb-name">All Recipes</span>
            </button>
            {RECIPE_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`panel-cat-btn${activeCat === cat.id ? ' active' : ''}`}
                onClick={() => handleCatSelect(cat.id)}
              >
                <span className="pcb-icon">{cat.icon}</span>
                <span className="pcb-name">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="panel-cuisines-wrap">
          <div className="panel-cats-label">Browse by Cuisine</div>
          <div className="panel-cuisine-grid">
            {COUNTRIES.map(c => (
              <Link
                key={c.id}
                href={`/countries/${c.id}`}
                className="panel-cuisine-pill"
                onClick={closePanel}
              >
                {c.flag} {c.name}
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* Backdrop */}
      {panelOpen && (
        <div className="panel-backdrop" onClick={closePanel} aria-hidden="true" />
      )}

      {/* ═══════════════════════════
          HERO SECTION
      ═══════════════════════════ */}
      <section className="hero-wrap">
        <div className="hero-banner">
          <div className="hero-deco-tl"><div className="hero-deco-half-circle" /></div>
          <div className="hero-content">
            <p className="hero-eyebrow">Authentic World Recipes</p>
            <h1 className="hero-title">
              Discover &amp;<br />
              Cook Amazing<br />
              Recipes
            </h1>
            <p className="hero-desc">
              Explore authentic step-by-step recipes from 10 world cuisines — Pakistani, Turkish,
              Chinese, Korean, Indian and more. Traditional ingredients, time-tested techniques.
            </p>
            <Link href="#explore" className="hero-btn">Browse Recipes</Link>
          </div>
          <div className="hero-img-area">
            <div className="hero-plate-wrap">
              <img src={heroImg} alt="Authentic world cuisine" className="hero-plate-img" />
            </div>
            <div className="hero-fork">
              <svg viewBox="0 0 40 200" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="140">
                <rect x="18" y="0" width="4" height="200" rx="2" fill="rgba(255,255,255,0.55)"/>
                <rect x="8" y="0" width="3" height="80" rx="1.5" fill="rgba(255,255,255,0.55)"/>
                <rect x="29" y="0" width="3" height="80" rx="1.5" fill="rgba(255,255,255,0.55)"/>
                <rect x="13" y="0" width="2.5" height="80" rx="1.25" fill="rgba(255,255,255,0.55)"/>
                <rect x="24.5" y="0" width="2.5" height="80" rx="1.25" fill="rgba(255,255,255,0.55)"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          EXPLORE / RESULTS SECTION
      ═══════════════════════════ */}
      <section id="explore" className="explore-section" ref={exploreRef}>
        <div className="page-container">

          {/* ── SEARCH / CATEGORY RESULTS ── */}
          {searching && (
            <div className="search-results-block">
              <div className="srb-head">
                <div className="srb-info">
                  {searchVal ? (
                    <>
                      <span className="srb-label">Results for</span>
                      <span className="srb-query">"{searchVal}"</span>
                    </>
                  ) : (
                    <span className="srb-query">{currentCatLabel}</span>
                  )}
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
                  <div style={{fontSize:48,marginBottom:12}}>🍽️</div>
                  <p>No recipes found{searchVal ? ` for "${searchVal}"` : ''}.</p>
                  <p style={{fontSize:13,color:'#bbb',marginTop:6}}>
                    Try searching by country, dish name, or category
                  </p>
                </div>
              )}

              <div className="srb-divider" />
            </div>
          )}

          {/* ── WORLD CUISINES ── */}
          <div className="explore-head">
            <h2 className="explore-title">Explore World Cuisines</h2>
            <p className="explore-desc">
              Discover authentic recipes from 10 countries. Click any cuisine to browse its full
              recipe collection — or use the <strong style={{color:'var(--orange)'}}>⋮ button</strong> on
              the left to search &amp; filter by category.
            </p>
          </div>

          <div className="country-circles-row">
            {COUNTRIES.map((country) => (
              <div
                key={country.id}
                className={`country-circle-item${activeCountry === country.id ? ' active' : ''}`}
                onClick={() => toggleCountry(country.id)}
              >
                <div className="country-circle-img-wrap">
                  <div className="country-circle-img">
                    <img src={country.image} alt={country.name} loading="lazy" />
                  </div>
                  {activeCountry === country.id && <div className="country-circle-ring" />}
                </div>
                <span className="country-circle-label">{country.flag} {country.name}</span>
              </div>
            ))}
          </div>

          {activeCountry && (() => {
            const country = COUNTRIES.find(c => c.id === activeCountry)
            return (
              <div className="country-cats-expand">
                <div className="cats-expand-header">
                  <span className="cats-expand-flag">{country.flag}</span>
                  <span className="cats-expand-name">{country.name} — Choose a Recipe Category</span>
                </div>
                <div className="cats-expand-grid">
                  {RECIPE_CATEGORIES.map((cat, i) => (
                    <Link
                      key={cat.id}
                      href={`/countries/${activeCountry}?cat=${cat.id}`}
                      className="cat-expand-item"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <div className="cat-expand-circle">
                        <span className="cat-expand-emoji">{cat.icon}</span>
                      </div>
                      <span className="cat-expand-label">{cat.name.split(' ')[0]}</span>
                    </Link>
                  ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                  <Link href={`/countries/${activeCountry}`} className="view-country-btn">
                    View All {country.name} Recipes →
                  </Link>
                </div>
              </div>
            )
          })()}

          <div className="explore-divider" />
          <h2 id="countries" className="top-dishes-title">Popular Recipes to Try</h2>
          <p className="top-dishes-desc">
            Use the <strong>⋮</strong> button on the left to search or filter by category
          </p>

        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="fh-footer">
        <div className="page-container">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">Food<span>Hive</span>.</div>
              <p className="footer-desc">Authentic step-by-step recipes from 10 world cuisines, published daily.</p>
            </div>
            <div>
              <div className="footer-col-title">Categories</div>
              {RECIPE_CATEGORIES.slice(0, 6).map(c => (
                <Link key={c.id} href={`/categories/${c.id}`} className="footer-link">{c.icon} {c.name}</Link>
              ))}
            </div>
            <div>
              <div className="footer-col-title">More</div>
              {RECIPE_CATEGORIES.slice(6).map(c => (
                <Link key={c.id} href={`/categories/${c.id}`} className="footer-link">{c.icon} {c.name}</Link>
              ))}
            </div>
            <div>
              <div className="footer-col-title">Cuisines</div>
              {COUNTRIES.slice(0, 6).map(c => (
                <Link key={c.id} href={`/countries/${c.id}`} className="footer-link">{c.flag} {c.name}</Link>
              ))}
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 FoodHive</span>
            <span>10 Cuisines · 12 Categories · Updated Daily</span>
            <Link href="/privacy" className="footer-link" style={{display:'inline', marginBottom:0}}>🔒 Privacy Policy</Link>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Nunito', -apple-system, sans-serif; background: #fff; color: #1a1a1a; overflow-x: hidden; }
        a { text-decoration: none; color: inherit; }
        img { display: block; max-width: 100%; }
        :root { --orange: #E8873A; --orange-dark: #C96B20; --dark: #1a1a1a; --gray: #6b6b6b; }
        .page-container { max-width: 1200px; margin: 0 auto; padding: 0 48px; }

        /* ══ NAVBAR ══ */
        .nav { position: sticky; top: 0; z-index: 200; background: #fff; border-bottom: 1px solid rgba(0,0,0,0.06); height: 64px; }
        .nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 48px; height: 100%; display: flex; align-items: center; gap: 32px; }
        .nav-logo { font-size: 24px; font-weight: 900; color: var(--orange); flex-shrink: 0; }
        .nav-logo span { color: var(--orange); }
        .nav-links { display: flex; align-items: center; gap: 2px; margin-left: 12px; }
        .nav-link { font-size: 14px; font-weight: 600; color: #333; padding: 7px 16px; border-radius: 8px; transition: background 0.15s; }
        .nav-link:hover { background: #f5f5f5; }
        .nav-right { margin-left: auto; display: flex; align-items: center; gap: 12px; }
        .nav-icon-btn { width: 38px; height: 38px; border-radius: 50%; background: transparent; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #333; transition: background 0.15s; }
        .nav-icon-btn:hover { background: #f0f0f0; }

        /* ══ FAB 3-DOTS ══ */
        .fab-dots {
          position: fixed; left: 18px; top: 50%; transform: translateY(-50%);
          z-index: 300; width: 46px; height: 46px; border-radius: 50%;
          background: var(--orange); border: none; cursor: pointer;
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 4px;
          box-shadow: 0 4px 18px rgba(232,135,58,0.5);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .fab-dots:hover { transform: translateY(-50%) scale(1.1); box-shadow: 0 6px 24px rgba(232,135,58,0.6); }
        .fab-dots.fab-open { background: #222; left: 306px; box-shadow: 0 4px 18px rgba(0,0,0,0.3); }
        .fab-dot { width: 4px; height: 4px; border-radius: 50%; background: #fff; flex-shrink: 0; }

        /* ══ SIDE PANEL ══ */
        .side-panel {
          position: fixed; left: 0; top: 0; bottom: 0; width: 290px;
          background: #fff; border-right: 1px solid #ebebeb;
          z-index: 250; overflow: hidden; display: flex; flex-direction: column;
          transform: translateX(-100%);
          transition: transform 0.35s cubic-bezier(0.34, 1.2, 0.64, 1);
          box-shadow: 4px 0 30px rgba(0,0,0,0.1);
        }
        .side-panel-open { transform: translateX(0); }

        .panel-head { padding: 80px 18px 14px; border-bottom: 1px solid #f0f0f0; flex-shrink: 0; }
        .panel-title-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .panel-title { font-size: 15px; font-weight: 800; color: #1a1a1a; }
        .panel-close { background: none; border: none; font-size: 16px; color: #bbb; cursor: pointer; padding: 4px 7px; border-radius: 6px; transition: all 0.15s; }
        .panel-close:hover { background: #f5f5f5; color: #555; }

        .panel-search-box {
          display: flex; align-items: center; gap: 8px;
          background: #f5f5f5; border-radius: 12px; padding: 10px 14px;
          border: 1.5px solid transparent; transition: border-color 0.2s, background 0.2s;
        }
        .panel-search-box:focus-within { border-color: var(--orange); background: #fff; }
        .panel-search-input { border: none; background: none; outline: none; font-size: 13px; color: #1a1a1a; width: 100%; font-family: 'Nunito', sans-serif; }
        .panel-search-input::placeholder { color: #bbb; }
        .panel-search-clear { background: none; border: none; color: #bbb; cursor: pointer; font-size: 13px; padding: 0; transition: color 0.15s; }
        .panel-search-clear:hover { color: #555; }

        .panel-cats-wrap { padding: 14px 18px; flex: 1; overflow-y: auto; border-bottom: 1px solid #f0f0f0; }
        .panel-cats-label { font-size: 10px; font-weight: 700; color: #ccc; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px; }
        .panel-cats-list { display: flex; flex-direction: column; gap: 2px; }
        .panel-cat-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 10px; border: none;
          background: transparent; cursor: pointer; width: 100%; text-align: left;
          transition: background 0.15s; font-family: 'Nunito', sans-serif;
        }
        .panel-cat-btn:hover { background: #f5f5f5; }
        .panel-cat-btn.active { background: #fff3ea; }
        .panel-cat-btn.active .pcb-name { color: var(--orange); font-weight: 700; }
        .pcb-icon { font-size: 17px; flex-shrink: 0; }
        .pcb-name { font-size: 13px; font-weight: 600; color: #333; }

        .panel-cuisines-wrap { padding: 14px 18px 20px; flex-shrink: 0; }
        .panel-cuisine-grid { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
        .panel-cuisine-pill { font-size: 11px; font-weight: 700; padding: 5px 11px; border-radius: 100px; background: #f5f5f5; color: #444; border: 1.5px solid #ebebeb; transition: all 0.15s; }
        .panel-cuisine-pill:hover { border-color: var(--orange); color: var(--orange); background: #fff9f5; }

        .panel-backdrop { position: fixed; inset: 0; z-index: 240; background: rgba(0,0,0,0.25); animation: bdfadeIn 0.2s ease; }
        @keyframes bdfadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* ══ HERO ══ */
        .hero-wrap { padding: 20px 48px 40px; max-width: 1200px; margin: 0 auto; }
        .hero-banner { background: var(--orange); border-radius: 20px; position: relative; overflow: hidden; display: flex; align-items: center; min-height: 340px; padding: 40px 50px; }
        .hero-deco-tl { position: absolute; top: -20px; left: -20px; z-index: 1; }
        .hero-deco-half-circle { width: 90px; height: 90px; border-radius: 50%; background: rgba(255,255,255,0.12); position: relative; }
        .hero-deco-half-circle::after { content: ''; position: absolute; top: 10px; left: 10px; width: 70px; height: 70px; border-radius: 50%; background: rgba(255,255,255,0.08); }
        .hero-content { flex: 1; position: relative; z-index: 2; max-width: 420px; }
        .hero-eyebrow { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.80); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 10px; }
        .hero-title { font-family: 'Nunito', sans-serif; font-size: clamp(32px, 4vw, 54px); font-weight: 900; color: #ffffff; line-height: 1.1; margin-bottom: 16px; letter-spacing: -0.5px; }
        .hero-desc { font-size: 13px; color: rgba(255,255,255,0.85); line-height: 1.75; margin-bottom: 28px; max-width: 340px; font-weight: 500; }
        .hero-btn { display: inline-block; background: #ffffff; color: var(--dark); font-size: 14px; font-weight: 700; padding: 12px 32px; border-radius: 100px; transition: all 0.2s; box-shadow: 0 2px 12px rgba(0,0,0,0.12); }
        .hero-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,0.18); }
        .hero-img-area { position: absolute; right: 0; top: 0; bottom: 0; width: 55%; display: flex; align-items: center; justify-content: center; z-index: 1; }
        .hero-plate-wrap { width: 320px; height: 320px; border-radius: 50%; overflow: hidden; margin-right: 60px; }
        .hero-plate-img { width: 100%; height: 100%; object-fit: cover; }
        .hero-fork { position: absolute; right: 36px; top: 50%; transform: translateY(-50%); opacity: 0.7; }

        /* ══ SEARCH RESULTS ══ */
        .search-results-block { margin-bottom: 48px; }
        .srb-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; padding-bottom: 14px; border-bottom: 1.5px solid rgba(232,135,58,0.2); flex-wrap: wrap; gap: 12px; }
        .srb-info { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .srb-label { font-size: 13px; color: #999; font-weight: 600; }
        .srb-query { font-size: 20px; font-weight: 900; color: #1a1a1a; }
        .srb-count { font-size: 12px; font-weight: 700; color: var(--orange); background: #fff3ea; padding: 4px 12px; border-radius: 100px; }
        .srb-clear { background: none; border: 1.5px solid #e0e0e0; color: #888; font-size: 12px; font-weight: 700; padding: 7px 16px; border-radius: 100px; cursor: pointer; font-family: 'Nunito', sans-serif; transition: all 0.15s; }
        .srb-clear:hover { border-color: var(--orange); color: var(--orange); }
        .srb-divider { height: 1px; background: #ebebeb; margin: 48px 0 36px; }
        .srb-empty { text-align: center; padding: 60px 40px; background: #fff9f5; border-radius: 16px; border: 1.5px dashed rgba(232,135,58,0.3); }
        .srb-empty p { font-size: 15px; font-weight: 600; color: #555; }

        .search-recipe-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
        .src-card { background: #fff; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.07); transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s; display: block; }
        .src-card:hover { transform: translateY(-5px); box-shadow: 0 10px 28px rgba(0,0,0,0.12); }
        .src-img-wrap { position: relative; height: 160px; overflow: hidden; }
        .src-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s; }
        .src-card:hover .src-img { transform: scale(1.04); }
        .src-badge { position: absolute; bottom: 10px; left: 10px; background: var(--orange); color: #fff; font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 100px; }
        .src-body { padding: 12px 14px 16px; }
        .src-country { font-size: 11px; font-weight: 700; color: #888; margin-bottom: 4px; }
        .src-title { font-size: 15px; font-weight: 800; color: #1a1a1a; line-height: 1.25; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .src-meta { display: flex; align-items: center; gap: 12px; font-size: 12px; color: #999; font-weight: 600; }

        /* ══ EXPLORE ══ */
        .explore-section { padding: 60px 0 40px; background: #fff; }
        .explore-head { margin-bottom: 36px; }
        .explore-title { font-size: 22px; font-weight: 800; color: var(--dark); margin-bottom: 12px; }
        .explore-desc { font-size: 14px; color: var(--gray); line-height: 1.75; max-width: 520px; font-weight: 500; }

        .country-circles-row { display: flex; gap: 32px; align-items: flex-start; flex-wrap: wrap; padding-bottom: 8px; }
        .country-circle-item { display: flex; flex-direction: column; align-items: center; gap: 10px; cursor: pointer; user-select: none; }
        .country-circle-item:hover { opacity: 0.9; }
        .country-circle-img-wrap { position: relative; width: 80px; height: 80px; }
        .country-circle-img { width: 80px; height: 80px; border-radius: 50%; overflow: hidden; border: 3px solid transparent; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); background: #f0f0f0; }
        .country-circle-item.active .country-circle-img { border-color: var(--orange); transform: scale(1.08); }
        .country-circle-img img { width: 100%; height: 100%; object-fit: cover; }
        .country-circle-ring { position: absolute; inset: -5px; border-radius: 50%; border: 2.5px solid var(--orange); animation: ringPulse 1.4s ease-in-out infinite; }
        @keyframes ringPulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.5; } }
        .country-circle-label { font-size: 13px; font-weight: 700; color: var(--dark); text-align: center; white-space: nowrap; }
        .country-circle-item.active .country-circle-label { color: var(--orange); }

        .country-cats-expand { margin-top: 32px; background: #fff9f5; border: 1.5px solid rgba(232,135,58,0.2); border-radius: 16px; padding: 28px 32px 24px; animation: expandDown 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes expandDown { from { opacity: 0; transform: translateY(-12px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .cats-expand-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
        .cats-expand-flag { font-size: 24px; }
        .cats-expand-name { font-size: 16px; font-weight: 800; color: var(--dark); }
        .cats-expand-grid { display: flex; gap: 24px; flex-wrap: wrap; margin-bottom: 8px; }
        .cat-expand-item { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); animation: catPopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        @keyframes catPopIn { from { opacity: 0; transform: scale(0.5) rotate(-15deg); } to { opacity: 1; transform: scale(1) rotate(0deg); } }
        .cat-expand-item:hover { transform: translateY(-5px) scale(1.06); }
        .cat-expand-circle { width: 64px; height: 64px; border-radius: 50%; background: #fff; border: 2.5px solid var(--orange); display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 12px rgba(232,135,58,0.2); transition: all 0.25s; }
        .cat-expand-item:hover .cat-expand-circle { background: var(--orange); }
        .cat-expand-emoji { font-size: 26px; line-height: 1; transition: transform 0.2s; }
        .cat-expand-item:hover .cat-expand-emoji { transform: scale(1.15); filter: brightness(0) invert(1); }
        .cat-expand-label { font-size: 12px; font-weight: 700; color: var(--dark); text-align: center; }
        .view-country-btn { display: inline-block; background: var(--orange); color: #fff; font-size: 13px; font-weight: 700; padding: 11px 26px; border-radius: 100px; transition: all 0.2s; box-shadow: 0 4px 14px rgba(232,135,58,0.35); }
        .view-country-btn:hover { background: var(--orange-dark); transform: translateY(-1px); }

        .explore-divider { height: 1px; background: #ebebeb; margin: 44px 0 36px; }
        .top-dishes-title { font-size: clamp(22px, 3vw, 30px); font-weight: 900; color: var(--dark); margin-bottom: 8px; letter-spacing: -0.3px; }
        .top-dishes-desc { font-size: 14px; color: #999; font-weight: 500; margin-bottom: 48px; }

        /* ══ FOOTER ══ */
        .fh-footer { background: #111; color: rgba(255,255,255,0.45); padding: 60px 0 28px; margin-top: 80px; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 44px; }
        .footer-logo { font-size: 22px; font-weight: 900; color: var(--orange); margin-bottom: 10px; }
        .footer-logo span { color: var(--orange); }
        .footer-desc { font-size: 13px; line-height: 1.8; color: rgba(255,255,255,0.3); max-width: 220px; }
        .footer-col-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(255,255,255,0.4); margin-bottom: 14px; }
        .footer-link { display: block; font-size: 13px; color: rgba(255,255,255,0.35); margin-bottom: 9px; transition: color 0.15s; font-weight: 500; }
        .footer-link:hover { color: var(--orange); }
        .footer-bottom { border-top: 1px solid rgba(255,255,255,0.07); padding-top: 22px; font-size: 12px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; }

        /* ══ RESPONSIVE ══ */
        @media (max-width: 900px) {
          .hero-wrap { padding: 16px 20px 32px; }
          .hero-banner { flex-direction: column; min-height: auto; padding: 36px 28px 260px; }
          .hero-img-area { width: 100%; height: 220px; position: absolute; bottom: 0; right: 0; }
          .hero-plate-wrap { width: 200px; height: 200px; margin-right: 40px; }
          .hero-fork { right: 12px; }
          .nav-links { display: none; }
          .page-container { padding: 0 20px; }
          .footer-grid { grid-template-columns: 1fr 1fr; }
          .country-circles-row { gap: 20px; overflow-x: auto; flex-wrap: nowrap; padding-bottom: 12px; }
          .country-circle-item { flex-shrink: 0; }
          .fab-dots { left: 10px; width: 42px; height: 42px; }
          .fab-dots.fab-open { left: 298px; }
          .side-panel { width: 285px; }
        }
        @media (max-width: 600px) {
          .hero-title { font-size: 32px; }
          .hero-banner { padding: 30px 24px 240px; }
          .footer-grid { grid-template-columns: 1fr; }
          .search-recipe-grid { grid-template-columns: 1fr 1fr; }
          .fab-dots.fab-open { left: 290px; }
          .side-panel { width: 278px; }
        }
        @media (max-width: 400px) {
          .search-recipe-grid { grid-template-columns: 1fr; }
          .fab-dots.fab-open { left: 278px; }
          .side-panel { width: 265px; }
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
