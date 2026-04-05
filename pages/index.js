// FoodHive World — New Homepage
// Hero: Image 1 style (white left + orange right blob, circular food image)
// Below: Image 2 style (explore menu with orange-bordered circles)
// Countries: with animated orange circle on click, expanding categories

import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { COUNTRIES, RECIPE_CATEGORIES, getAllRecipes, SAMPLE_RECIPE } from '../lib/data'

// ── Country Card with inline accordion categories ──
function CountryCard({ country, isOpen, onToggle }) {
  return (
    <div className={`country-accord${isOpen ? ' open' : ''}`}>
      <div className="ca-header" onClick={onToggle}>
        <div className="ca-img-wrap">
          <img src={country.image} alt={country.name} loading="lazy" />
          <div className="ca-img-overlay">
            <span className="ca-flag">{country.flag}</span>
            <span className="ca-name-overlay">{country.name}</span>
          </div>
        </div>
        <div className="ca-body">
          <div className="ca-country-name">{country.flag} {country.name}</div>
          <p className="ca-desc">{country.desc}</p>
          <div className="ca-footer">
            <span className="ca-browse" style={{ color: country.color }}>
              {isOpen ? 'Close ▲' : 'Browse →'}
            </span>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="ca-expand">
          <div className="ca-expand-title">Choose a Category</div>
          <div className="ca-cats-grid">
            {RECIPE_CATEGORIES.map((cat, i) => (
              <Link key={cat.id} href={`/countries/${country.id}?cat=${cat.id}`}>
                <div className="ca-cat-item" style={{ animationDelay: `${i * 35}ms` }}>
                  <div className="ca-cat-circle-orange">
                    <span className="ca-cat-emoji">{cat.icon}</span>
                  </div>
                  <span className="ca-cat-label">{cat.name.split(' ')[0]}</span>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Link href={`/countries/${country.id}`}>
              <span className="ca-view-all">View All {country.name} Recipes →</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default function HomePage({ latestRecipes }) {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState(null)
  const [openCountry, setOpenCountry] = useState(null)

  const heroImg = latestRecipes[0]?.image1 ||
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'

  const toggleCountry = (id) => {
    setOpenCountry(prev => prev === id ? null : id)
  }

  return (
    <>
      <Head>
        <title>FoodHive — Order your favorite food here</title>
        <meta name="description" content="Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients. Explore recipes from 10 world cuisines." />
        <link rel="canonical" href="https://food-hive-one.vercel.app" />
      </Head>

      {/* ══════════════════════════════
          NAVBAR
      ══════════════════════════════ */}
      <nav className="fh-nav">
        <div className="fh-nav-inner">
          <Link href="/" className="fh-logo">
            Food<span>Hive</span>.
          </Link>
          <div className="fh-nav-links">
            <Link href="/" className="fh-nav-link">Home</Link>
            <Link href="#menu" className="fh-nav-link">Menu</Link>
            <Link href="#countries" className="fh-nav-link">Cuisines</Link>
            <Link href="/recipes" className="fh-nav-link">Recipes</Link>
          </div>
          <div className="fh-nav-right">
            <button className="fh-search-btn" aria-label="search" onClick={() => router.push('/search')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════
          HERO — Image 1 style
          White left + Orange right blob
          Circular food image center-right
      ══════════════════════════════ */}
      <section className="fh-hero">
        {/* Orange organic blob — right side */}
        <div className="fh-hero-blob" />

        <div className="fh-hero-inner">
          {/* LEFT TEXT */}
          <div className="fh-hero-left">
            <h1 className="fh-hero-title">
              Order your<br />
              <em>favorite food</em><br />
              here
            </h1>
            <p className="fh-hero-desc">
              Choose from a diverse menu featuring a delectable array of dishes crafted with
              the finest ingredients and culinary expertise. Our mission is to satisfy your cravings
              and elevate your dining experience, one delicious meal at a time.
            </p>
            <Link href="#menu" className="fh-view-menu-btn">View Menu</Link>
          </div>

          {/* RIGHT — circular food image (positioned over the orange blob) */}
          <div className="fh-hero-right">
            <div className="fh-hero-img-ring">
              <div className="fh-hero-img-circle">
                <img src={heroImg} alt="Delicious food" />
              </div>
            </div>
            {/* Decorative fork icon */}
            <div className="fh-fork-deco">🍴</div>
          </div>
        </div>

        {/* Decorative orange slice top-left */}
        <div className="fh-deco-orange-slice">🍊</div>
      </section>

      {/* ══════════════════════════════
          EXPLORE MENU — Image 2 style
          Orange-bordered circles for categories
      ══════════════════════════════ */}
      <section id="menu" className="fh-menu-section">
        <div className="fh-container">
          <div className="fh-menu-head">
            <h2 className="fh-section-title">Explore our menu</h2>
            <p className="fh-section-desc">
              Choose from a diverse menu featuring a delectable array of dishes. Our
              mission is to satisfy your cravings and elevate your dining experience,
              one delicious meal at a time.
            </p>
          </div>

          {/* Category circles — Image 2 exact style */}
          <div className="fh-cat-circles">
            {RECIPE_CATEGORIES.map((cat, i) => (
              <div
                key={cat.id}
                className={`fh-cat-item${activeCategory === cat.id ? ' fh-cat-active' : ''}`}
                onClick={() => setActiveCategory(prev => prev === cat.id ? null : cat.id)}
              >
                <div className="fh-cat-circle">
                  <span className="fh-cat-emoji">{cat.icon}</span>
                </div>
                <span className="fh-cat-name">{cat.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="fh-divider" />

          {/* Active category link */}
          {activeCategory && (
            <div className="fh-cat-cta">
              <span className="fh-cat-cta-label">
                {RECIPE_CATEGORIES.find(c => c.id === activeCategory)?.icon}&nbsp;
                {RECIPE_CATEGORIES.find(c => c.id === activeCategory)?.name}
              </span>
              <Link href={`/categories/${activeCategory}`} className="fh-cat-cta-btn">
                View All Recipes →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════
          COUNTRIES SECTION
          Cards + animated orange circle expand
      ══════════════════════════════ */}
      <section id="countries" className="fh-countries-section">
        <div className="fh-container">
          <div className="fh-menu-head">
            <h2 className="fh-section-title">Top dishes near you</h2>
            <p className="fh-section-desc">
              Explore authentic recipes from 10 world cuisines. Click any cuisine to browse all 12 recipe categories.
            </p>
          </div>

          <div className="fh-countries-grid">
            {COUNTRIES.map((country, i) => (
              <div key={country.id} className="fh-country-wrap" style={{ animationDelay: `${i * 55}ms` }}>
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

      {/* ══════════════════════════════
          FOOTER
      ══════════════════════════════ */}
      <footer className="fh-footer">
        <div className="fh-container">
          <div className="fh-footer-grid">
            <div>
              <div className="fh-footer-logo">FoodHive.</div>
              <p className="fh-footer-desc">
                Authentic recipes from 10 world cuisines, auto-published by AI.
              </p>
            </div>
            <div>
              <div className="fh-footer-col-title">Categories</div>
              {RECIPE_CATEGORIES.slice(0, 6).map(c => (
                <Link key={c.id} href={`/categories/${c.id}`} className="fh-footer-link">
                  {c.icon} {c.name}
                </Link>
              ))}
            </div>
            <div>
              <div className="fh-footer-col-title">More</div>
              {RECIPE_CATEGORIES.slice(6).map(c => (
                <Link key={c.id} href={`/categories/${c.id}`} className="fh-footer-link">
                  {c.icon} {c.name}
                </Link>
              ))}
            </div>
            <div>
              <div className="fh-footer-col-title">Cuisines</div>
              {COUNTRIES.slice(0, 5).map(c => (
                <Link key={c.id} href={`/countries/${c.id}`} className="fh-footer-link">
                  {c.flag} {c.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="fh-footer-bottom">
            <span>© 2026 FoodHive World</span>
            <span>10 Cuisines · 12 Categories · Updated Every 30 Min</span>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        /* ─── GOOGLE FONTS ─── */
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@400;500;600;700&display=swap');

        /* ─── RESET & BASE ─── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          font-family: 'DM Sans', sans-serif;
          background: #fff;
          color: #1a1a1a;
          overflow-x: hidden;
        }
        a { text-decoration: none; color: inherit; }
        img { display: block; max-width: 100%; }

        /* ─── TOKENS ─── */
        :root {
          --orange: #E8873A;
          --orange-d: #C96B20;
          --orange-light: #FFF0E6;
          --dark: #1a1a1a;
          --gray: #6b6b6b;
          --gray-light: #9b9b9b;
          --cream: #FFF8F3;
          --white: #ffffff;
        }

        /* ─── CONTAINER ─── */
        .fh-container {
          max-width: 1260px;
          margin: 0 auto;
          padding: 0 48px;
        }

        /* ══════════════════════════════
           NAVBAR
        ══════════════════════════════ */
        .fh-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(12px);
          height: 72px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        .fh-nav-inner {
          max-width: 1260px;
          margin: 0 auto;
          padding: 0 48px;
          height: 100%;
          display: flex;
          align-items: center;
          gap: 40px;
        }
        .fh-logo {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 26px;
          font-weight: 900;
          color: var(--dark);
          letter-spacing: -0.5px;
          flex-shrink: 0;
        }
        .fh-logo span { color: var(--orange); }

        .fh-nav-links {
          display: flex;
          gap: 6px;
          align-items: center;
          margin-left: 20px;
        }
        .fh-nav-link {
          font-size: 15px;
          font-weight: 500;
          color: #444;
          padding: 8px 18px;
          border-radius: 100px;
          transition: all 0.2s;
        }
        .fh-nav-link:hover { color: var(--dark); background: #f5f5f5; }

        .fh-nav-right {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .fh-search-btn {
          width: 42px; height: 42px;
          border-radius: 50%;
          background: transparent;
          border: 1.5px solid #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #555;
          transition: all 0.2s;
        }
        .fh-search-btn:hover { background: #f5f5f5; border-color: #ccc; }

        /* ══════════════════════════════
           HERO — Image 1 Style
        ══════════════════════════════ */
        .fh-hero {
          min-height: 100vh;
          padding-top: 72px;
          background: #ffffff;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
        }

        /* Orange blob — right half, organic shape */
        .fh-hero-blob {
          position: absolute;
          top: 0; right: 0;
          width: 52%;
          height: 100%;
          background: linear-gradient(145deg, #F5A060 0%, #E8873A 35%, #D4711F 70%, #C26010 100%);
          border-radius: 52% 0 0 48% / 45% 0 0 55%;
          z-index: 0;
          /* slight texture overlay */
          background-image:
            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(0,0,0,0.06) 0%, transparent 50%),
            linear-gradient(145deg, #F5A060 0%, #E8873A 35%, #D4711F 70%, #C26010 100%);
        }

        /* Decorative elements */
        .fh-deco-orange-slice {
          position: absolute;
          top: 80px;
          left: 32px;
          font-size: 80px;
          opacity: 0.18;
          z-index: 1;
          animation: decoSpin 20s linear infinite;
          filter: hue-rotate(0deg);
        }
        @keyframes decoSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .fh-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 1260px;
          margin: 0 auto;
          padding: 60px 48px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          align-items: center;
          width: 100%;
          min-height: calc(100vh - 72px);
        }

        /* LEFT TEXT */
        .fh-hero-left {
          padding-right: 40px;
          z-index: 2;
          animation: heroFadeUp 0.8s ease both;
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fh-hero-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(48px, 5.5vw, 80px);
          font-weight: 900;
          color: var(--dark);
          line-height: 1.05;
          margin-bottom: 24px;
          letter-spacing: -1.5px;
        }
        .fh-hero-title em {
          color: var(--orange);
          font-style: italic;
        }

        .fh-hero-desc {
          font-size: 15px;
          color: var(--gray);
          line-height: 1.85;
          max-width: 420px;
          margin-bottom: 36px;
        }

        .fh-view-menu-btn {
          display: inline-block;
          background: white;
          color: var(--dark);
          font-size: 15px;
          font-weight: 600;
          padding: 15px 40px;
          border-radius: 100px;
          border: 2px solid rgba(0,0,0,0.12);
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          letter-spacing: 0.2px;
        }
        .fh-view-menu-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.14);
          background: #fafafa;
        }

        /* RIGHT — Circular image */
        .fh-hero-right {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          animation: heroScaleIn 0.9s ease 0.2s both;
        }
        @keyframes heroScaleIn {
          from { opacity: 0; transform: scale(0.88); }
          to { opacity: 1; transform: scale(1); }
        }

        .fh-hero-img-ring {
          width: 420px;
          height: 420px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: heroFloat 4s ease-in-out infinite;
        }
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }

        .fh-hero-img-circle {
          width: 380px;
          height: 380px;
          border-radius: 50%;
          overflow: hidden;
          border: 8px solid rgba(255,255,255,0.85);
          box-shadow:
            0 30px 80px rgba(0,0,0,0.25),
            0 0 0 12px rgba(255,255,255,0.08);
        }
        .fh-hero-img-circle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Decorative fork */
        .fh-fork-deco {
          position: absolute;
          right: -20px;
          bottom: 20px;
          font-size: 64px;
          opacity: 0.35;
          transform: rotate(20deg);
          animation: forkWiggle 5s ease-in-out infinite;
        }
        @keyframes forkWiggle {
          0%, 100% { transform: rotate(20deg); }
          50% { transform: rotate(15deg) scale(1.05); }
        }

        /* ══════════════════════════════
           EXPLORE MENU — Image 2 Style
        ══════════════════════════════ */
        .fh-menu-section {
          padding: 80px 0 70px;
          background: #ffffff;
        }

        .fh-menu-head {
          margin-bottom: 44px;
        }
        .fh-section-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(26px, 3vw, 38px);
          font-weight: 700;
          color: var(--dark);
          margin-bottom: 14px;
          letter-spacing: -0.5px;
        }
        .fh-section-desc {
          font-size: 14px;
          color: var(--gray);
          max-width: 480px;
          line-height: 1.8;
        }

        /* Category circles — Image 2 exact */
        .fh-cat-circles {
          display: flex;
          gap: 28px;
          align-items: flex-start;
          flex-wrap: wrap;
          padding-bottom: 8px;
        }

        .fh-cat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .fh-cat-item:hover { transform: translateY(-4px); }

        .fh-cat-circle {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          background: #f4f4f4;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid transparent;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          /* food image style using emoji */
          font-size: 36px;
          overflow: hidden;
          position: relative;
        }
        .fh-cat-item:hover .fh-cat-circle {
          transform: scale(1.1);
          box-shadow: 0 8px 24px rgba(232,135,58,0.25);
          border-color: var(--orange);
        }
        /* Active — orange border ring like Image 2 */
        .fh-cat-active .fh-cat-circle {
          border: 3.5px solid var(--orange);
          box-shadow:
            0 0 0 3px rgba(232,135,58,0.15),
            0 8px 24px rgba(232,135,58,0.3);
          transform: scale(1.08);
          background: var(--orange-light);
        }

        .fh-cat-emoji {
          font-size: 38px;
          line-height: 1;
          display: block;
        }

        .fh-cat-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--dark);
          text-align: center;
          white-space: nowrap;
        }
        .fh-cat-active .fh-cat-name {
          color: var(--orange);
          font-weight: 700;
        }

        /* Divider — thin line like Image 2 */
        .fh-divider {
          height: 1px;
          background: #ebebeb;
          margin: 40px 0 36px;
        }

        /* Active category CTA */
        .fh-cat-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--orange-light);
          border-radius: 16px;
          padding: 18px 28px;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fh-cat-cta-label {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 20px;
          font-weight: 700;
          color: var(--dark);
        }
        .fh-cat-cta-btn {
          background: var(--orange);
          color: white;
          font-size: 13px;
          font-weight: 700;
          padding: 12px 28px;
          border-radius: 100px;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(232,135,58,0.35);
        }
        .fh-cat-cta-btn:hover {
          background: var(--orange-d);
          transform: translateY(-1px);
        }

        /* ══════════════════════════════
           COUNTRIES SECTION
        ══════════════════════════════ */
        .fh-countries-section {
          padding: 80px 0;
          background: #fafafa;
        }

        .fh-countries-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .fh-country-wrap {
          animation: fadeUp 0.5s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Country Accordion Card */
        .country-accord {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(0,0,0,0.07);
          transition: box-shadow 0.3s;
        }
        .country-accord.open {
          grid-column: 1 / -1;
          box-shadow: 0 8px 40px rgba(0,0,0,0.12);
        }
        .ca-header {
          cursor: pointer;
        }
        .ca-header:hover { opacity: 0.95; }

        .ca-img-wrap {
          position: relative;
          height: 160px;
          overflow: hidden;
        }
        .ca-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s;
        }
        .country-accord:hover .ca-img-wrap img {
          transform: scale(1.05);
        }
        .ca-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding: 16px;
        }
        .ca-flag { font-size: 28px; margin-bottom: 4px; }
        .ca-name-overlay {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 20px;
          font-weight: 700;
          color: white;
          text-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        .ca-body {
          padding: 14px 18px 18px;
        }
        .ca-country-name {
          font-size: 11px;
          font-weight: 700;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }
        .ca-desc {
          font-size: 12px;
          color: var(--gray);
          line-height: 1.65;
          margin-bottom: 12px;
        }
        .ca-footer { display: flex; justify-content: flex-end; }
        .ca-browse {
          font-size: 13px;
          font-weight: 700;
        }

        /* Expanded panel */
        .ca-expand {
          background: #fdf6ef;
          border-top: 1px solid #f0e8de;
          padding: 24px 24px 20px;
          animation: expandIn 0.3s ease;
        }
        @keyframes expandIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ca-expand-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 20px;
          font-weight: 700;
          color: var(--dark);
          margin-bottom: 20px;
        }

        /* Category circles inside expanded — orange ring animated */
        .ca-cats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }
        .ca-cat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          animation: catPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes catPop {
          from { opacity: 0; transform: scale(0.6) rotate(-10deg); }
          to { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        .ca-cat-item:hover { transform: translateY(-5px); }

        /* Orange animated circle */
        .ca-cat-circle-orange {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: white;
          border: 3px solid var(--orange);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 0 0 0 rgba(232,135,58,0.3),
            0 4px 14px rgba(232,135,58,0.2);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          animation: orangePulse 2.5s ease-in-out infinite;
        }
        @keyframes orangePulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(232,135,58,0.3), 0 4px 14px rgba(232,135,58,0.2);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(232,135,58,0.12), 0 4px 14px rgba(232,135,58,0.2);
          }
        }
        .ca-cat-item:hover .ca-cat-circle-orange {
          background: var(--orange-light);
          transform: scale(1.12);
          box-shadow: 0 0 0 8px rgba(232,135,58,0.15), 0 8px 24px rgba(232,135,58,0.3);
        }
        .ca-cat-emoji {
          font-size: 28px;
          line-height: 1;
        }
        .ca-cat-label {
          font-size: 11px;
          font-weight: 600;
          color: var(--dark);
          text-align: center;
          line-height: 1.3;
        }

        .ca-view-all {
          display: inline-block;
          background: var(--orange);
          color: white;
          font-size: 13px;
          font-weight: 700;
          padding: 11px 26px;
          border-radius: 100px;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(232,135,58,0.35);
        }
        .ca-view-all:hover {
          background: var(--orange-d);
          transform: translateY(-1px);
        }

        /* ══════════════════════════════
           FOOTER
        ══════════════════════════════ */
        .fh-footer {
          background: #1a1a1a;
          color: rgba(255,255,255,0.5);
          padding: 64px 0 32px;
        }
        .fh-footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 48px;
        }
        .fh-footer-logo {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 26px;
          font-weight: 900;
          color: white;
          margin-bottom: 12px;
        }
        .fh-footer-desc {
          font-size: 13px;
          line-height: 1.8;
          color: rgba(255,255,255,0.35);
          max-width: 220px;
        }
        .fh-footer-col-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 16px;
        }
        .fh-footer-link {
          display: block;
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          margin-bottom: 10px;
          transition: color 0.2s;
        }
        .fh-footer-link:hover { color: var(--orange); }
        .fh-footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 24px;
          font-size: 12px;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }

        /* ══════════════════════════════
           RESPONSIVE
        ══════════════════════════════ */
        @media (max-width: 1024px) {
          .fh-hero-inner { grid-template-columns: 1fr; padding: 60px 32px; text-align: center; }
          .fh-hero-left { padding-right: 0; }
          .fh-hero-right { order: -1; }
          .fh-hero-img-ring, .fh-hero-img-circle { width: 280px; height: 280px; }
          .fh-hero-desc { margin: 0 auto 32px; }
          .fh-hero-blob { width: 100%; height: 60%; top: auto; bottom: 0; border-radius: 55% 55% 0 0 / 40% 40% 0 0; }
          .fh-footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 768px) {
          .fh-container { padding: 0 20px; }
          .fh-nav-inner { padding: 0 20px; }
          .fh-nav-links { display: none; }
          .fh-cat-circles { gap: 16px; overflow-x: auto; flex-wrap: nowrap; padding-bottom: 12px; scroll-snap-type: x mandatory; }
          .fh-cat-item { flex-shrink: 0; scroll-snap-align: start; }
          .fh-cat-circle { width: 72px; height: 72px; }
          .fh-cat-emoji { font-size: 30px; }
          .fh-countries-grid { grid-template-columns: 1fr; }
          .ca-cats-grid { grid-template-columns: repeat(4, 1fr); }
          .fh-footer-grid { grid-template-columns: 1fr; }
          .fh-menu-section, .fh-countries-section { padding: 56px 0; }
        }
        @media (max-width: 480px) {
          .fh-hero-title { font-size: 48px; letter-spacing: -1px; }
          .fh-hero-img-ring, .fh-hero-img-circle { width: 240px; height: 240px; }
          .ca-cats-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </>
  )
}

export async function getStaticProps() {
  const all = getAllRecipes()
  const latest = all.length > 0 ? all.slice(0, 6) : [SAMPLE_RECIPE]
  return { props: { latestRecipes: latest }, revalidate: 60 }
}
