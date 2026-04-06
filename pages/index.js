import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { COUNTRIES, RECIPE_CATEGORIES, getAllRecipes, SAMPLE_RECIPE } from '../lib/data'

export default function HomePage({ latestRecipes, heroRecipe }) {
  const router = useRouter()
  const [activeCountry, setActiveCountry] = useState(null)
  const [searchVal, setSearchVal] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchVal.trim()) router.push(`/search?q=${encodeURIComponent(searchVal.trim())}`)
  }

  const toggleCountry = (id) => {
    setActiveCountry(prev => prev === id ? null : id)
  }

  const heroImg = heroRecipe?.image1 ||
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=900'

  return (
    <>
      <Head>
        <title>FoodHive — Order your favorite food here</title>
        <meta name="description" content="Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients. Explore authentic recipes from 10 world cuisines." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      {/* ─────────────────────────────────
          NAVBAR — exact Image 1 style
      ───────────────────────────────── */}
      <nav className="nav">
        <div className="nav-inner">
          {/* Logo — "FoodHive." orange color, bold */}
          <Link href="/" className="nav-logo">Food<span>Hive</span>.</Link>

          {/* Nav links */}
          <div className="nav-links">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="#explore" className="nav-link">Menu</Link>
            <Link href="#countries" className="nav-link">Cuisines</Link>
            <Link href="/recipes" className="nav-link">Contact us</Link>
          </div>

          {/* Right side — search icon only (no login, no cart per requirement) */}
          <div className="nav-right">
            {/* Search icon — same style as Image 1 */}
            <button className="nav-icon-btn" onClick={() => router.push('/search')} aria-label="Search">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ─────────────────────────────────
          HERO — exact Image 1 style
          Full-width orange rounded banner
          White text left, food image right
      ───────────────────────────────── */}
      <section className="hero-wrap">
        <div className="hero-banner">
          {/* Decorative orange slice top-left */}
          <div className="hero-deco-tl">
            <div className="hero-deco-half-circle" />
          </div>

          {/* LEFT — text content */}
          <div className="hero-content">
            <h1 className="hero-title">
              Order your<br />
              favorite food<br />
              here
            </h1>
            <p className="hero-desc">
              Choose from a diverse menu featuring a delectable array of dishes crafted with
              the finest ingredients and culinary expertise. Our mission is to satisfy your cravings
              and elevate your dining experience, one delicious meal at a time.
            </p>
            <Link href="#explore" className="hero-btn">View Menu</Link>
          </div>

          {/* RIGHT — food image (circular plate) */}
          <div className="hero-img-area">
            <div className="hero-plate-wrap">
              <img
                src={heroImg}
                alt="Delicious food"
                className="hero-plate-img"
              />
            </div>
            {/* Fork decoration */}
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

      {/* ─────────────────────────────────
          EXPLORE — Image 2 style
          Countries as circles (not categories)
          Click → orange ring + expand categories
      ───────────────────────────────── */}
      <section id="explore" className="explore-section">
        <div className="page-container">

          {/* Header */}
          <div className="explore-head">
            <h2 className="explore-title">Explore our menu</h2>
            <p className="explore-desc">
              Choose from a diverse menu featuring a delectable array of dishes. Our
              mission is to satisfy your cravings and elevate your dining experience,
              one delicious meal at a time.
            </p>
          </div>

          {/* Country circles — Image 2 style with real food images */}
          <div className="country-circles-row">
            {COUNTRIES.map((country, i) => (
              <div
                key={country.id}
                className={`country-circle-item${activeCountry === country.id ? ' active' : ''}`}
                onClick={() => toggleCountry(country.id)}
              >
                <div className="country-circle-img-wrap">
                  <div className="country-circle-img">
                    <img src={country.image} alt={country.name} loading="lazy" />
                  </div>
                  {/* Orange animated ring when active */}
                  {activeCountry === country.id && (
                    <div className="country-circle-ring" />
                  )}
                </div>
                <span className="country-circle-label">{country.flag} {country.name}</span>
              </div>
            ))}
          </div>

          {/* Expanded categories for selected country */}
          {activeCountry && (() => {
            const country = COUNTRIES.find(c => c.id === activeCountry)
            return (
              <div className="country-cats-expand">
                <div className="cats-expand-header">
                  <span className="cats-expand-flag">{country.flag}</span>
                  <span className="cats-expand-name">{country.name} — Choose Category</span>
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

          {/* Divider */}
          <div className="explore-divider" />

          {/* "Top dishes near you" heading */}
          <h2 id="countries" className="top-dishes-title">Top dishes near you</h2>
          <p className="top-dishes-desc">Click any cuisine above to explore its full recipe collection</p>

        </div>
      </section>

      {/* ─────────────────────────────────
          FOOTER
      ───────────────────────────────── */}
      <footer className="fh-footer">
        <div className="page-container">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">Food<span>Hive</span>.</div>
              <p className="footer-desc">Authentic recipes from 10 world cuisines, auto-published daily.</p>
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
          </div>
        </div>
      </footer>

      <style jsx global>{`
        /* ── RESET ── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          font-family: 'Nunito', -apple-system, sans-serif;
          background: #fff;
          color: #1a1a1a;
          overflow-x: hidden;
        }
        a { text-decoration: none; color: inherit; }
        img { display: block; max-width: 100%; }

        /* ── TOKENS ── */
        :root {
          --orange: #E8873A;
          --orange-dark: #C96B20;
          --dark: #1a1a1a;
          --gray: #6b6b6b;
          --light-gray: #f5f5f5;
          --white: #ffffff;
        }

        .page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 48px;
        }

        /* ══════════════════════════
           NAVBAR — Image 1 exact
        ══════════════════════════ */
        .nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #fff;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          height: 64px;
        }
        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 48px;
          height: 100%;
          display: flex;
          align-items: center;
          gap: 32px;
        }

        /* Logo — exact "Tomato." style but "FoodHive." */
        .nav-logo {
          font-family: 'Nunito', sans-serif;
          font-size: 24px;
          font-weight: 900;
          color: var(--orange);
          letter-spacing: -0.3px;
          flex-shrink: 0;
        }
        .nav-logo span { color: var(--orange); }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2px;
          margin-left: 12px;
        }
        .nav-link {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          padding: 7px 16px;
          border-radius: 8px;
          transition: background 0.15s;
        }
        .nav-link:hover { background: #f5f5f5; }

        .nav-right {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        /* Search icon button — exact Image 1 style */
        .nav-icon-btn {
          width: 38px; height: 38px;
          border-radius: 50%;
          background: transparent;
          border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: #333;
          transition: background 0.15s;
        }
        .nav-icon-btn:hover { background: #f0f0f0; }

        /* ══════════════════════════
           HERO — Image 1 exact
           Orange full-width rounded banner
        ══════════════════════════ */
        .hero-wrap {
          padding: 20px 48px 40px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero-banner {
          background: var(--orange);
          border-radius: 20px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          min-height: 340px;
          padding: 40px 50px;
          gap: 0;
        }

        /* Decorative half-circle top-left (orange slice) */
        .hero-deco-tl {
          position: absolute;
          top: -20px; left: -20px;
          z-index: 1;
        }
        .hero-deco-half-circle {
          width: 90px; height: 90px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          position: relative;
        }
        .hero-deco-half-circle::after {
          content: '';
          position: absolute;
          top: 10px; left: 10px;
          width: 70px; height: 70px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
        }

        /* LEFT text */
        .hero-content {
          flex: 1;
          position: relative;
          z-index: 2;
          max-width: 420px;
        }

        .hero-title {
          font-family: 'Nunito', sans-serif;
          font-size: clamp(32px, 4vw, 54px);
          font-weight: 900;
          color: #ffffff;
          line-height: 1.1;
          margin-bottom: 16px;
          letter-spacing: -0.5px;
        }

        .hero-desc {
          font-size: 13px;
          color: rgba(255,255,255,0.85);
          line-height: 1.75;
          margin-bottom: 28px;
          max-width: 340px;
          font-weight: 500;
        }

        /* "View Menu" button — white rounded, exact Image 1 */
        .hero-btn {
          display: inline-block;
          background: #ffffff;
          color: var(--dark);
          font-size: 14px;
          font-weight: 700;
          font-family: 'Nunito', sans-serif;
          padding: 12px 32px;
          border-radius: 100px;
          transition: all 0.2s;
          box-shadow: 0 2px 12px rgba(0,0,0,0.12);
        }
        .hero-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.18);
        }

        /* RIGHT image area */
        .hero-img-area {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 55%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }

        .hero-plate-wrap {
          width: 320px;
          height: 320px;
          border-radius: 50%;
          overflow: hidden;
          position: relative;
          margin-right: 60px;
        }
        .hero-plate-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Fork decoration */
        .hero-fork {
          position: absolute;
          right: 36px;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0.7;
        }

        /* ══════════════════════════
           EXPLORE SECTION — Image 2
        ══════════════════════════ */
        .explore-section {
          padding: 60px 0 40px;
          background: #fff;
        }

        .explore-head { margin-bottom: 36px; }

        .explore-title {
          font-family: 'Nunito', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: var(--dark);
          margin-bottom: 12px;
        }

        .explore-desc {
          font-size: 14px;
          color: var(--gray);
          line-height: 1.75;
          max-width: 420px;
          font-weight: 500;
        }

        /* Country circles row — Image 2 exact spacing */
        .country-circles-row {
          display: flex;
          gap: 32px;
          align-items: flex-start;
          flex-wrap: wrap;
          padding-bottom: 8px;
        }

        .country-circle-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          user-select: none;
        }
        .country-circle-item:hover { opacity: 0.9; }

        .country-circle-img-wrap {
          position: relative;
          width: 80px; height: 80px;
        }

        .country-circle-img {
          width: 80px; height: 80px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid transparent;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          background: #f0f0f0;
        }
        .country-circle-item.active .country-circle-img {
          border-color: var(--orange);
          transform: scale(1.08);
        }
        .country-circle-img img {
          width: 100%; height: 100%;
          object-fit: cover;
        }

        /* Orange animated ring — appears on active */
        .country-circle-ring {
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          border: 2.5px solid var(--orange);
          animation: ringPulse 1.4s ease-in-out infinite;
        }
        @keyframes ringPulse {
          0%   { transform: scale(1);    opacity: 1; }
          50%  { transform: scale(1.1); opacity: 0.5; }
          100% { transform: scale(1);    opacity: 1; }
        }

        .country-circle-label {
          font-size: 13px;
          font-weight: 700;
          color: var(--dark);
          text-align: center;
          white-space: nowrap;
        }
        .country-circle-item.active .country-circle-label {
          color: var(--orange);
        }

        /* ── Expanded categories column ── */
        .country-cats-expand {
          margin-top: 32px;
          background: #fff9f5;
          border: 1.5px solid rgba(232,135,58,0.2);
          border-radius: 16px;
          padding: 28px 32px 24px;
          animation: expandDown 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes expandDown {
          from { opacity: 0; transform: translateY(-12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .cats-expand-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .cats-expand-flag { font-size: 24px; }
        .cats-expand-name {
          font-size: 16px;
          font-weight: 800;
          color: var(--dark);
        }

        .cats-expand-grid {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }

        .cat-expand-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          animation: catPopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes catPopIn {
          from { opacity: 0; transform: scale(0.5) rotate(-15deg); }
          to   { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        .cat-expand-item:hover { transform: translateY(-5px) scale(1.06); }

        .cat-expand-circle {
          width: 64px; height: 64px;
          border-radius: 50%;
          background: #fff;
          border: 2.5px solid var(--orange);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 12px rgba(232,135,58,0.2);
          transition: all 0.25s;
        }
        .cat-expand-item:hover .cat-expand-circle {
          background: var(--orange);
          box-shadow: 0 6px 20px rgba(232,135,58,0.4);
        }
        .cat-expand-emoji {
          font-size: 26px;
          line-height: 1;
          transition: transform 0.2s;
        }
        .cat-expand-item:hover .cat-expand-emoji {
          transform: scale(1.15);
          filter: brightness(0) invert(1);
        }
        .cat-expand-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--dark);
          text-align: center;
        }

        .view-country-btn {
          display: inline-block;
          background: var(--orange);
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          padding: 11px 26px;
          border-radius: 100px;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(232,135,58,0.35);
        }
        .view-country-btn:hover {
          background: var(--orange-dark);
          transform: translateY(-1px);
        }

        /* Divider */
        .explore-divider {
          height: 1px;
          background: #ebebeb;
          margin: 44px 0 36px;
        }

        /* "Top dishes near you" */
        .top-dishes-title {
          font-family: 'Nunito', sans-serif;
          font-size: clamp(22px, 3vw, 30px);
          font-weight: 900;
          color: var(--dark);
          margin-bottom: 8px;
          letter-spacing: -0.3px;
        }
        .top-dishes-desc {
          font-size: 14px;
          color: #999;
          font-weight: 500;
          margin-bottom: 48px;
        }

        /* ══════════════════════════
           FOOTER
        ══════════════════════════ */
        .fh-footer {
          background: #111;
          color: rgba(255,255,255,0.45);
          padding: 60px 0 28px;
          margin-top: 80px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 44px;
        }
        .footer-logo {
          font-family: 'Nunito', sans-serif;
          font-size: 22px;
          font-weight: 900;
          color: var(--orange);
          margin-bottom: 10px;
        }
        .footer-logo span { color: var(--orange); }
        .footer-desc {
          font-size: 13px;
          line-height: 1.8;
          color: rgba(255,255,255,0.3);
          max-width: 220px;
        }
        .footer-col-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 14px;
        }
        .footer-link {
          display: block;
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          margin-bottom: 9px;
          transition: color 0.15s;
          font-weight: 500;
        }
        .footer-link:hover { color: var(--orange); }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.07);
          padding-top: 22px;
          font-size: 12px;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }

        /* ══════════════════════════
           RESPONSIVE
        ══════════════════════════ */
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
        }
        @media (max-width: 600px) {
          .hero-title { font-size: 32px; }
          .hero-banner { padding: 30px 24px 240px; }
          .cats-expand-grid { gap: 16px; }
          .footer-grid { grid-template-columns: 1fr; }
          .cat-expand-circle { width: 52px; height: 52px; }
          .cat-expand-emoji { font-size: 22px; }
        }
      `}</style>
    </>
  )
}

export async function getStaticProps() {
  const all = getAllRecipes()
  const heroRecipe = all.length > 0 ? all[0] : SAMPLE_RECIPE
  return {
    props: { latestRecipes: all.slice(0, 6), heroRecipe },
    revalidate: 60
  }
}
