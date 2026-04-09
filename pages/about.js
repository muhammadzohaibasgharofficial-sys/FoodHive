// ============================================================
// FoodHive World — pages/about.js
// Professional About Page matching FoodHive design system
// Fonts: Caveat (titles) + Nunito (body) + Playfair Display (serif)
// Colors: --orange #E8873A, --cream #FAF6EE, --dark #2C1810
// ============================================================

import Head from 'next/head'
import Link from 'next/link'
import { COUNTRIES, RECIPE_CATEGORIES } from '../lib/data'

// ── Team Members ──
const TEAM = [
  {
    name: 'Zohaib Asghar',
    role: 'Founder & Head Chef',
    emoji: '👨‍🍳',
    bio: 'Passionate about authentic world cuisines, Zohaib built FoodHive to bring traditional recipes from every corner of the globe to your kitchen.',
    country: '🇵🇰',
  },
  {
    name: 'Aisha Rahman',
    role: 'Recipe Curator',
    emoji: '👩‍🍳',
    bio: 'With expertise in South Asian and Middle Eastern cuisines, Aisha ensures every recipe on FoodHive is authentic, tested, and delicious.',
    country: '🇮🇳',
  },
  {
    name: 'Ji-hoon Park',
    role: 'Asian Cuisine Expert',
    emoji: '🍱',
    bio: 'Ji-hoon brings deep knowledge of Korean, Japanese, and Chinese culinary traditions, sharing recipes passed down through generations.',
    country: '🇰🇷',
  },
  {
    name: 'Sofia Martini',
    role: 'European Food Writer',
    emoji: '🍝',
    bio: 'Sofia specializes in Italian, Spanish, and European cuisine, crafting recipes that capture the soul of Mediterranean cooking.',
    country: '🇮🇹',
  },
]

// ── Stats ──
const STATS = [
  { value: '500+', label: 'Authentic Recipes', icon: '📖' },
  { value: '10',   label: 'World Cuisines',    icon: '🌍' },
  { value: '12',   label: 'Categories',         icon: '🗂️'  },
  { value: '30m',  label: 'New Recipe Updates', icon: '⏱️'  },
]

// ── Values ──
const VALUES = [
  {
    icon: '🌱',
    title: 'Authenticity First',
    desc: 'Every recipe is researched and crafted to honor its cultural origins. We never compromise on tradition.',
  },
  {
    icon: '🤝',
    title: 'Community Driven',
    desc: 'FoodHive thrives because of food lovers worldwide who share, review, and celebrate great cooking together.',
  },
  {
    icon: '🔬',
    title: 'Quality Tested',
    desc: 'Our team tests and refines each recipe to ensure it works perfectly in your home kitchen, every time.',
  },
  {
    icon: '🌐',
    title: 'Globally Inspired',
    desc: 'From Pakistani karahi to Korean bibimbap, we celebrate the incredible diversity of world food culture.',
  },
  {
    icon: '⚡',
    title: 'Always Fresh',
    desc: 'New recipes are published daily using AI-assisted curation, so there is always something new to discover.',
  },
  {
    icon: '❤️',
    title: 'Made with Love',
    desc: 'Food is more than nutrition — it is memory, culture, and love. Every recipe reflects that belief.',
  },
]

// ── Cuisines showcase ──
const CUISINE_HIGHLIGHTS = [
  { flag: '🇵🇰', name: 'Pakistani',     dish: 'Biryani & Karahi',       color: '#01411C' },
  { flag: '🇹🇷', name: 'Turkish',       dish: 'Kebabs & Baklava',        color: '#E30A17' },
  { flag: '🇨🇳', name: 'Chinese',       dish: 'Dim Sum & Stir-fry',      color: '#D32F2F' },
  { flag: '🇰🇷', name: 'Korean',        dish: 'Bibimbap & Kimchi',       color: '#7B3FA0' },
  { flag: '🇮🇳', name: 'Indian',        dish: 'Curry & Dosa',            color: '#F57C00' },
  { flag: '🇲🇽', name: 'Mexican',       dish: 'Tacos & Guacamole',       color: '#2E7D32' },
  { flag: '🇯🇵', name: 'Japanese',      dish: 'Sushi & Ramen',           color: '#C62828' },
  { flag: '🇮🇹', name: 'Italian',       dish: 'Pasta & Risotto',         color: '#1565C0' },
  { flag: '🌙',  name: 'Middle Eastern', dish: 'Hummus & Shawarma',      color: '#795548' },
  { flag: '🇺🇸', name: 'American',      dish: 'BBQ & Comfort Food',      color: '#1976D2' },
]

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About FoodHive — Our Story, Mission & Team</title>
        <meta name="description" content="Learn about FoodHive World — a platform dedicated to authentic recipes from 10 world cuisines. Meet our team, discover our mission, and join our food-loving community." />
        <link rel="canonical" href="https://food-hive-one.vercel.app/about" />
      </Head>

      {/* ─────────────────────────
          NAVBAR — matches site
      ───────────────────────── */}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="logo">
            Food<span>Hive</span>.
          </Link>
          <div className="nav-links">
            <Link href="/"          className="nav-link">Home</Link>
            <Link href="/recipes"   className="nav-link">Recipes</Link>
            <Link href="/#explore"  className="nav-link">Menu</Link>
            <Link href="/about"     className="nav-link nav-link-active">About</Link>
          </div>
          <div className="nav-right">
            <Link href="/recipes" className="nav-cta">Explore Recipes →</Link>
          </div>
        </div>
      </nav>

      {/* ─────────────────────────
          HERO — orange banner
          same style as homepage
      ───────────────────────── */}
      <section className="about-hero">
        <div className="about-hero-blob" />

        <div className="about-hero-inner">
          {/* LEFT */}
          <div className="about-hero-left">
            <div className="about-eyebrow">Our Story</div>
            <h1 className="about-hero-title">
              Bringing the<br />
              world's <em>finest</em><br />
              food to you.
            </h1>
            <p className="about-hero-desc">
              FoodHive was born from a simple belief — that great food has no borders.
              We curate authentic recipes from 10 world cuisines, making it effortless
              for anyone to cook extraordinary meals at home.
            </p>
            <div className="about-hero-cta-row">
              <Link href="/recipes" className="btn-orange">Explore Recipes</Link>
              <Link href="#mission" className="btn-ghost">Our Mission ↓</Link>
            </div>
          </div>

          {/* RIGHT — stacked food emoji circles */}
          <div className="about-hero-right">
            <div className="about-hero-orbs">
              <div className="orb orb-1">🍛</div>
              <div className="orb orb-2">🍜</div>
              <div className="orb orb-3">🥘</div>
              <div className="orb orb-4">🍱</div>
              <div className="orb orb-5">🫕</div>
              <div className="orb orb-center">🌍</div>
            </div>
          </div>
        </div>

        {/* STATS BAR inside hero */}
        <div className="about-stats-bar">
          <div className="about-stats-inner">
            {STATS.map((s, i) => (
              <div key={i} className="about-stat-item">
                <span className="about-stat-icon">{s.icon}</span>
                <span className="about-stat-value">{s.value}</span>
                <span className="about-stat-label">{s.label}</span>
                {i < STATS.length - 1 && <div className="about-stat-divider" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────
          MISSION SECTION
      ───────────────────────── */}
      <section id="mission" className="about-section">
        <div className="about-container">
          <div className="mission-grid">
            {/* LEFT — big quote */}
            <div className="mission-left">
              <div className="section-eyebrow">Our Mission</div>
              <h2 className="section-title-big">
                Food is the universal<br />
                <em>language of love.</em>
              </h2>
              <blockquote className="mission-quote">
                "We believe every person deserves access to the world's most
                authentic, time-honored recipes — prepared with real ingredients,
                real technique, and real passion."
              </blockquote>
              <p className="mission-body">
                FoodHive started as a personal project by a food-obsessed developer
                who was frustrated by recipes that had lost their soul to clicks and
                shortcuts. We set out to build something different — a platform where
                authenticity is non-negotiable, where the recipes you find here are
                the same ones grandmothers make in Lahore, Seoul, Istanbul, and Rome.
              </p>
              <p className="mission-body">
                Today, FoodHive publishes fresh recipes daily across 10 world cuisines
                and 12 categories, powered by AI curation and human expertise — making
                world-class cooking accessible to everyone.
              </p>
            </div>

            {/* RIGHT — visual card */}
            <div className="mission-right">
              <div className="mission-card">
                <div className="mission-card-header">
                  <span className="mission-card-icon">🌍</span>
                  <span className="mission-card-tag">Global Kitchen</span>
                </div>
                <div className="mission-card-cuisines">
                  {CUISINE_HIGHLIGHTS.slice(0, 5).map((c, i) => (
                    <div key={i} className="mission-cuisine-row">
                      <span className="mc-flag">{c.flag}</span>
                      <div className="mc-info">
                        <span className="mc-name">{c.name}</span>
                        <span className="mc-dish">{c.dish}</span>
                      </div>
                      <div className="mc-dot" style={{ background: c.color }} />
                    </div>
                  ))}
                </div>
                <div className="mission-card-footer">
                  + 5 more world cuisines
                </div>
              </div>

              {/* Floating badge */}
              <div className="mission-float-badge">
                <span style={{ fontSize: 24 }}>📖</span>
                <div>
                  <div className="mfb-num">500+</div>
                  <div className="mfb-label">Recipes & counting</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────
          VALUES SECTION
      ───────────────────────── */}
      <section className="about-section about-section-cream">
        <div className="about-container">
          <div className="section-head-center">
            <div className="section-eyebrow">What We Stand For</div>
            <h2 className="section-title-big" style={{ textAlign: 'center' }}>Our Core Values</h2>
            <p className="section-desc-center">
              Everything we do at FoodHive is guided by these principles.
            </p>
          </div>

          <div className="values-grid">
            {VALUES.map((v, i) => (
              <div
                key={i}
                className="value-card"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="value-icon-wrap">
                  <span className="value-icon">{v.icon}</span>
                </div>
                <h3 className="value-title">{v.title}</h3>
                <p className="value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────
          CUISINES SHOWCASE
      ───────────────────────── */}
      <section className="about-section">
        <div className="about-container">
          <div className="section-head-center">
            <div className="section-eyebrow">10 World Cuisines</div>
            <h2 className="section-title-big" style={{ textAlign: 'center' }}>
              A world of flavours<br />
              <em>on one platform.</em>
            </h2>
          </div>

          <div className="cuisines-showcase">
            {CUISINE_HIGHLIGHTS.map((c, i) => (
              <Link
                key={i}
                href={`/countries/${COUNTRIES.find(cc =>
                  cc.name === c.name || cc.cuisine === c.name
                )?.id || ''}`}
                className="cuisine-card"
                style={{ '--cuisine-color': c.color }}
              >
                <div className="cuisine-card-flag">{c.flag}</div>
                <div className="cuisine-card-body">
                  <div className="cuisine-card-name">{c.name}</div>
                  <div className="cuisine-card-dish">{c.dish}</div>
                </div>
                <div className="cuisine-card-arrow">→</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────
          TEAM SECTION
      ───────────────────────── */}
      <section className="about-section about-section-cream">
        <div className="about-container">
          <div className="section-head-center">
            <div className="section-eyebrow">The People Behind FoodHive</div>
            <h2 className="section-title-big" style={{ textAlign: 'center' }}>
              Meet our team.
            </h2>
            <p className="section-desc-center">
              Food lovers, culinary experts, and tech enthusiasts united by one mission.
            </p>
          </div>

          <div className="team-grid">
            {TEAM.map((member, i) => (
              <div
                key={i}
                className="team-card"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="team-avatar">
                  <span className="team-avatar-emoji">{member.emoji}</span>
                  <span className="team-country-badge">{member.country}</span>
                </div>
                <div className="team-body">
                  <h3 className="team-name">{member.name}</h3>
                  <div className="team-role">{member.role}</div>
                  <p className="team-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────
          HOW IT WORKS SECTION
      ───────────────────────── */}
      <section className="about-section">
        <div className="about-container">
          <div className="section-head-center">
            <div className="section-eyebrow">How FoodHive Works</div>
            <h2 className="section-title-big" style={{ textAlign: 'center' }}>
              From kitchen to your screen.
            </h2>
          </div>

          <div className="how-steps">
            {[
              {
                num: '01',
                icon: '🔍',
                title: 'Recipe Research',
                desc: 'Our culinary experts and AI system research authentic recipes from their culture of origin, ensuring historical accuracy and genuine flavour.',
              },
              {
                num: '02',
                icon: '✍️',
                title: 'Expert Curation',
                desc: 'Every recipe is written with clear instructions, precise measurements, chef tips, and nutritional information for a complete cooking guide.',
              },
              {
                num: '03',
                icon: '📸',
                title: 'Beautiful Presentation',
                desc: 'Professional food images, step-by-step guides, and ingredient breakdowns make each recipe a visual and culinary delight.',
              },
              {
                num: '04',
                icon: '🚀',
                title: 'Published Daily',
                desc: 'Fresh recipes are published continuously so you always have something new and exciting to cook for your family and friends.',
              },
            ].map((step, i) => (
              <div key={i} className="how-step" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="how-step-num">{step.num}</div>
                <div className="how-step-icon">{step.icon}</div>
                <h3 className="how-step-title">{step.title}</h3>
                <p className="how-step-desc">{step.desc}</p>
                {i < 3 && <div className="how-step-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────
          CTA SECTION
      ───────────────────────── */}
      <section className="about-cta-section">
        <div className="about-cta-blob" />
        <div className="about-container">
          <div className="about-cta-inner">
            <div className="about-cta-left">
              <div className="section-eyebrow" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Join FoodHive Today
              </div>
              <h2 className="about-cta-title">
                Start your culinary<br />
                <em>adventure now.</em>
              </h2>
              <p className="about-cta-desc">
                Explore 500+ authentic recipes from 10 world cuisines. New recipes added every day.
              </p>
              <div className="about-cta-btns">
                <Link href="/recipes" className="cta-btn-white">Browse All Recipes</Link>
                <Link href="/#explore" className="cta-btn-outline">Explore Cuisines</Link>
              </div>
            </div>

            <div className="about-cta-right">
              <div className="cta-cuisine-grid">
                {RECIPE_CATEGORIES.slice(0, 6).map((cat, i) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.id}`}
                    className="cta-cat-pill"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    {cat.icon} {cat.name.split(' ')[0]}
                  </Link>
                ))}
                {RECIPE_CATEGORIES.slice(6).map((cat, i) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.id}`}
                    className="cta-cat-pill"
                    style={{ animationDelay: `${(i + 6) * 60}ms` }}
                  >
                    {cat.icon} {cat.name.split(' ')[0]}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────
          FOOTER
      ───────────────────────── */}
      <footer className="about-footer">
        <div className="about-container">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">Food<span>Hive</span>.</div>
              <p className="footer-desc">
                Authentic recipes from 10 world cuisines,<br />
                published daily for food lovers everywhere.
              </p>
            </div>
            <div>
              <div className="footer-col-title">Cuisines</div>
              {COUNTRIES.slice(0, 5).map(c => (
                <Link key={c.id} href={`/countries/${c.id}`} className="footer-link">
                  {c.flag} {c.name}
                </Link>
              ))}
            </div>
            <div>
              <div className="footer-col-title">More Cuisines</div>
              {COUNTRIES.slice(5).map(c => (
                <Link key={c.id} href={`/countries/${c.id}`} className="footer-link">
                  {c.flag} {c.name}
                </Link>
              ))}
            </div>
            <div>
              <div className="footer-col-title">Pages</div>
              <Link href="/"        className="footer-link">🏠 Home</Link>
              <Link href="/recipes" className="footer-link">📖 All Recipes</Link>
              <Link href="/about"   className="footer-link">ℹ️ About</Link>
              <Link href="/search"  className="footer-link">🔍 Search</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 FoodHive World — All rights reserved</span>
            <span>10 Cuisines · 12 Categories · Updated Daily</span>
          </div>
        </div>
      </footer>

      {/* ─────────────────────────
          STYLES
      ───────────────────────── */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,900&family=Caveat:wght@600;700&family=Nunito:wght@400;500;600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          font-family: 'Nunito', sans-serif;
          background: #FAF6EE;
          color: #2C1810;
          overflow-x: hidden;
        }
        a { text-decoration: none; color: inherit; }
        img { display: block; max-width: 100%; }

        :root {
          --orange:   #E8873A;
          --orange-d: #C96B20;
          --cream:    #FAF6EE;
          --cream2:   #F0E8D6;
          --cream3:   #E8DCC8;
          --dark:     #2C1810;
          --gray:     #7A6A5A;
          --gray-l:   #B5A898;
          --white:    #FFFFFF;
          --olive:    #8B9E6B;
          --r-xl:     32px;
          --r-full:   9999px;
        }

        .about-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 48px;
        }

        /* ─── NAVBAR ─── */
        .navbar {
          position: sticky;
          top: 0; z-index: 1000;
          background: rgba(250,246,238,0.96);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(139,158,107,0.15);
          height: 68px;
        }
        .navbar-inner {
          max-width: 1240px; margin: 0 auto; padding: 0 48px;
          height: 100%; display: flex; align-items: center; gap: 24px;
        }
        .logo {
          font-family: 'Nunito', sans-serif;
          font-size: 24px; font-weight: 900;
          color: var(--orange); flex-shrink: 0; letter-spacing: -0.3px;
        }
        .logo span { color: var(--orange); }
        .nav-links {
          display: flex; gap: 2px; align-items: center; margin-left: 16px;
        }
        .nav-link {
          font-size: 14px; font-weight: 600; color: var(--gray);
          padding: 8px 16px; border-radius: var(--r-full); transition: all .2s;
        }
        .nav-link:hover { color: var(--dark); background: var(--cream2); }
        .nav-link-active { color: var(--orange) !important; background: rgba(232,135,58,0.1) !important; }
        .nav-right { margin-left: auto; }
        .nav-cta {
          background: var(--orange); color: white;
          font-size: 13px; font-weight: 700;
          padding: 10px 22px; border-radius: var(--r-full);
          box-shadow: 0 4px 14px rgba(232,135,58,.35);
          transition: all .2s; white-space: nowrap;
        }
        .nav-cta:hover { background: var(--orange-d); transform: translateY(-1px); }

        /* ─── SECTION COMMONS ─── */
        .about-section { padding: 92px 0; }
        .about-section-cream { background: var(--cream2); }

        .section-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 700; letter-spacing: 2.5px;
          text-transform: uppercase; color: var(--orange); margin-bottom: 12px;
        }
        .section-eyebrow::before {
          content: ''; width: 22px; height: 2px;
          background: var(--orange); border-radius: 2px;
        }
        .section-title-big {
          font-family: 'Caveat', cursive;
          font-size: clamp(34px, 4.5vw, 58px);
          font-weight: 700; color: var(--dark);
          line-height: 1.1; margin-bottom: 16px;
        }
        .section-title-big em { color: var(--orange); font-style: italic; }
        .section-head-center { text-align: center; margin-bottom: 56px; }
        .section-desc-center {
          font-size: 15px; color: var(--gray);
          line-height: 1.8; max-width: 500px; margin: 0 auto;
        }

        /* ─── HERO ─── */
        .about-hero {
          min-height: 86vh;
          padding-top: 68px;
          background: var(--cream);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .about-hero-blob {
          position: absolute; top: 0; right: 0;
          width: 50%; height: 100%;
          background: linear-gradient(145deg, #F5A060 0%, #E8873A 40%, #C96B20 100%);
          clip-path: polygon(10% 0%, 100% 0%, 100% 100%, 5% 100%, 0% 80%, 8% 55%, 2% 28%, 9% 8%);
          z-index: 0;
        }
        .about-hero-inner {
          position: relative; z-index: 1;
          max-width: 1240px; margin: 0 auto; padding: 72px 48px 32px;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 48px; align-items: center; flex: 1;
        }
        .about-hero-left { animation: fadeUp .7s ease both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .about-eyebrow {
          font-size: 11px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; color: var(--gray); margin-bottom: 12px;
        }
        .about-hero-title {
          font-family: 'Caveat', cursive;
          font-size: clamp(44px, 5.5vw, 76px);
          font-weight: 700; color: var(--dark);
          line-height: 1.05; margin-bottom: 20px; letter-spacing: -0.5px;
        }
        .about-hero-title em { color: var(--orange); font-style: italic; }
        .about-hero-desc {
          font-size: 15px; color: var(--gray);
          line-height: 1.85; margin-bottom: 32px; max-width: 420px;
        }
        .about-hero-cta-row { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; }
        .btn-orange {
          display: inline-flex; align-items: center;
          background: var(--orange); color: white;
          font-size: 14px; font-weight: 700;
          padding: 14px 32px; border-radius: var(--r-full);
          box-shadow: 0 6px 20px rgba(232,135,58,.4);
          transition: all .3s cubic-bezier(.34,1.56,.64,1);
        }
        .btn-orange:hover { transform: translateY(-2px); background: var(--orange-d); }
        .btn-ghost {
          display: inline-flex; align-items: center;
          font-size: 14px; font-weight: 700; color: var(--gray);
          padding: 13px 24px; border-radius: var(--r-full);
          border: 2px solid rgba(44,24,16,.15);
          transition: all .2s;
        }
        .btn-ghost:hover { border-color: var(--orange); color: var(--orange); }

        /* Orb cluster — right side */
        .about-hero-right {
          display: flex; align-items: center; justify-content: center;
          position: relative; z-index: 2;
          animation: scaleIn .8s ease .2s both;
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        .about-hero-orbs {
          position: relative;
          width: 340px; height: 340px;
        }
        .orb {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.22);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          font-size: 36px;
          border: 2px solid rgba(255,255,255,0.3);
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          animation: orbFloat 4s ease-in-out infinite;
        }
        @keyframes orbFloat {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-12px); }
        }
        .orb-center {
          width: 120px; height: 120px; font-size: 56px;
          top: 50%; left: 50%;
          transform: translate(-50%,-50%);
          background: rgba(255,255,255,0.3);
          animation-duration: 5s;
          box-shadow: 0 16px 48px rgba(0,0,0,0.18);
        }
        .orb-1 { width: 80px; height: 80px; top: 0; left: 50%; transform: translateX(-50%); animation-delay: 0s; }
        .orb-2 { width: 72px; height: 72px; top: 30%; right: 0; animation-delay: .5s; }
        .orb-3 { width: 76px; height: 76px; bottom: 10%; right: 10%; animation-delay: 1s; font-size: 32px; }
        .orb-4 { width: 70px; height: 70px; bottom: 10%; left: 10%; animation-delay: 1.5s; font-size: 30px; }
        .orb-5 { width: 74px; height: 74px; top: 30%; left: 0; animation-delay: .8s; }

        /* STATS BAR */
        .about-stats-bar {
          position: relative; z-index: 1;
          background: white;
          border-top: 1px solid rgba(139,158,107,.12);
          padding: 24px 0;
          box-shadow: 0 -2px 20px rgba(44,24,16,.06);
        }
        .about-stats-inner {
          max-width: 1240px; margin: 0 auto; padding: 0 48px;
          display: flex; align-items: center; justify-content: center;
          gap: 0; flex-wrap: wrap;
        }
        .about-stat-item {
          display: flex; align-items: center; gap: 12px;
          padding: 8px 40px; position: relative;
        }
        .about-stat-icon { font-size: 28px; }
        .about-stat-value {
          font-family: 'Caveat', cursive;
          font-size: 32px; font-weight: 700; color: var(--orange);
          line-height: 1;
        }
        .about-stat-label {
          font-size: 12px; font-weight: 700;
          color: var(--gray); text-transform: uppercase;
          letter-spacing: .8px; max-width: 80px; line-height: 1.3;
        }
        .about-stat-divider {
          position: absolute; right: 0; top: 50%;
          transform: translateY(-50%);
          width: 1px; height: 44px;
          background: rgba(44,24,16,.1);
        }

        /* ─── MISSION ─── */
        .mission-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 64px; align-items: center;
        }
        .mission-left {}
        .mission-quote {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 17px; font-style: italic;
          color: var(--orange); line-height: 1.7;
          border-left: 3px solid var(--orange);
          padding-left: 20px; margin: 24px 0; max-width: 440px;
        }
        .mission-body {
          font-size: 14px; color: var(--gray); line-height: 1.9;
          margin-bottom: 14px; max-width: 460px;
        }
        .mission-right { position: relative; }
        .mission-card {
          background: white; border-radius: var(--r-xl);
          padding: 28px; box-shadow: 0 8px 40px rgba(44,24,16,.12);
          border: 1px solid rgba(139,158,107,.12);
          position: relative; z-index: 1;
        }
        .mission-card-header {
          display: flex; align-items: center; gap: 10px; margin-bottom: 20px;
        }
        .mission-card-icon { font-size: 28px; }
        .mission-card-tag {
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 1.5px;
          color: var(--olive); background: rgba(139,158,107,.12);
          padding: 4px 12px; border-radius: var(--r-full);
        }
        .mission-cuisine-row {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 0; border-bottom: 1px solid var(--cream2);
        }
        .mission-cuisine-row:last-child { border-bottom: none; }
        .mc-flag { font-size: 22px; }
        .mc-info { flex: 1; }
        .mc-name {
          font-size: 14px; font-weight: 700; color: var(--dark); display: block;
        }
        .mc-dish { font-size: 12px; color: var(--gray); }
        .mc-dot {
          width: 10px; height: 10px; border-radius: 50%;
          flex-shrink: 0; opacity: .7;
        }
        .mission-card-footer {
          margin-top: 14px; font-size: 12px; font-weight: 700;
          color: var(--orange); text-align: center;
        }
        .mission-float-badge {
          position: absolute; bottom: -20px; right: -16px;
          background: var(--orange); color: white;
          border-radius: 18px; padding: 14px 20px;
          box-shadow: 0 8px 28px rgba(232,135,58,.45);
          display: flex; align-items: center; gap: 12px;
          animation: badgeFloat 4s ease-in-out infinite;
          z-index: 2;
        }
        @keyframes badgeFloat {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        .mfb-num {
          font-family: 'Caveat', cursive;
          font-size: 28px; font-weight: 700; line-height: 1;
        }
        .mfb-label { font-size: 11px; opacity: .8; }

        /* ─── VALUES ─── */
        .values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .value-card {
          background: white; border-radius: 24px; padding: 30px 26px;
          box-shadow: 0 4px 20px rgba(44,24,16,.07);
          border: 1px solid rgba(139,158,107,.1);
          transition: all .3s cubic-bezier(.34,1.56,.64,1);
          animation: fadeUp .6s ease both;
        }
        .value-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 44px rgba(44,24,16,.14);
        }
        .value-icon-wrap {
          width: 56px; height: 56px; border-radius: 16px;
          background: rgba(232,135,58,.1);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
        }
        .value-icon { font-size: 28px; }
        .value-title {
          font-family: 'Caveat', cursive;
          font-size: 22px; font-weight: 700;
          color: var(--dark); margin-bottom: 10px;
        }
        .value-desc { font-size: 13px; color: var(--gray); line-height: 1.75; }

        /* ─── CUISINES SHOWCASE ─── */
        .cuisines-showcase {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
        }
        .cuisine-card {
          background: white; border-radius: 18px;
          padding: 20px 16px; text-align: center;
          border: 2px solid transparent;
          box-shadow: 0 3px 14px rgba(44,24,16,.07);
          transition: all .3s cubic-bezier(.34,1.56,.64,1);
          cursor: pointer; display: flex; flex-direction: column;
          align-items: center; gap: 8px; position: relative; overflow: hidden;
        }
        .cuisine-card::before {
          content: ''; position: absolute;
          bottom: 0; left: 0; right: 0; height: 3px;
          background: var(--cuisine-color);
          transform: scaleX(0); transition: transform .3s;
          transform-origin: left;
        }
        .cuisine-card:hover { transform: translateY(-5px); border-color: var(--cream2); }
        .cuisine-card:hover::before { transform: scaleX(1); }
        .cuisine-card-flag { font-size: 36px; }
        .cuisine-card-name {
          font-size: 13px; font-weight: 800; color: var(--dark);
        }
        .cuisine-card-dish {
          font-size: 11px; color: var(--gray); line-height: 1.4;
        }
        .cuisine-card-arrow {
          font-size: 14px; color: var(--gray-l);
          transition: color .2s, transform .2s;
        }
        .cuisine-card:hover .cuisine-card-arrow {
          color: var(--orange); transform: translateX(3px);
        }

        /* ─── TEAM ─── */
        .team-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .team-card {
          background: white; border-radius: 24px;
          overflow: hidden; box-shadow: 0 4px 20px rgba(44,24,16,.08);
          border: 1px solid rgba(139,158,107,.1);
          transition: all .3s cubic-bezier(.34,1.56,.64,1);
          animation: fadeUp .6s ease both;
        }
        .team-card:hover { transform: translateY(-7px); box-shadow: 0 18px 48px rgba(44,24,16,.14); }
        .team-avatar {
          background: linear-gradient(135deg, var(--cream2) 0%, var(--cream3) 100%);
          height: 130px; display: flex; align-items: center;
          justify-content: center; position: relative;
        }
        .team-avatar-emoji { font-size: 60px; }
        .team-country-badge {
          position: absolute; top: 12px; right: 12px;
          font-size: 20px;
          background: white; border-radius: 50%;
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(44,24,16,.12);
        }
        .team-body { padding: 18px 20px 22px; }
        .team-name {
          font-family: 'Caveat', cursive;
          font-size: 22px; font-weight: 700;
          color: var(--dark); margin-bottom: 4px;
        }
        .team-role {
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 1px;
          color: var(--orange); margin-bottom: 10px;
        }
        .team-bio { font-size: 13px; color: var(--gray); line-height: 1.7; }

        /* ─── HOW IT WORKS ─── */
        .how-steps {
          display: flex; align-items: flex-start;
          gap: 0; position: relative;
        }
        .how-step {
          flex: 1; text-align: center; padding: 0 20px;
          position: relative; animation: fadeUp .6s ease both;
        }
        .how-step-num {
          font-family: 'Caveat', cursive;
          font-size: 72px; font-weight: 700;
          color: rgba(232,135,58,.12); line-height: 1;
          margin-bottom: -12px; user-select: none;
        }
        .how-step-icon {
          font-size: 44px; margin-bottom: 14px;
          position: relative; z-index: 1;
        }
        .how-step-title {
          font-family: 'Caveat', cursive;
          font-size: 22px; font-weight: 700;
          color: var(--dark); margin-bottom: 10px;
        }
        .how-step-desc {
          font-size: 13px; color: var(--gray); line-height: 1.75; max-width: 220px; margin: 0 auto;
        }
        .how-step-arrow {
          position: absolute; right: -16px; top: 80px;
          font-size: 24px; color: var(--orange);
          opacity: .4; font-weight: 700;
        }

        /* ─── CTA ─── */
        .about-cta-section {
          background: var(--orange);
          position: relative; overflow: hidden; padding: 80px 0;
        }
        .about-cta-blob {
          position: absolute; top: -40%; right: -8%;
          width: 55%; height: 200%;
          background: radial-gradient(ellipse at center, rgba(0,0,0,.08) 0%, transparent 65%);
          border-radius: 50%; pointer-events: none;
        }
        .about-cta-inner {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 60px; align-items: center;
          position: relative; z-index: 1;
        }
        .about-cta-title {
          font-family: 'Caveat', cursive;
          font-size: clamp(36px, 5vw, 60px);
          font-weight: 700; color: white;
          line-height: 1.05; margin-bottom: 16px;
        }
        .about-cta-title em { font-style: italic; opacity: .9; }
        .about-cta-desc {
          font-size: 15px; color: rgba(255,255,255,.8);
          line-height: 1.8; margin-bottom: 32px; max-width: 400px;
        }
        .about-cta-btns { display: flex; gap: 14px; flex-wrap: wrap; }
        .cta-btn-white {
          display: inline-block; background: white; color: var(--orange-d);
          font-size: 14px; font-weight: 700;
          padding: 14px 30px; border-radius: var(--r-full);
          box-shadow: 0 4px 20px rgba(0,0,0,.12);
          transition: all .2s;
        }
        .cta-btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,.18); }
        .cta-btn-outline {
          display: inline-block; background: transparent; color: white;
          font-size: 14px; font-weight: 700;
          padding: 13px 28px; border-radius: var(--r-full);
          border: 2px solid rgba(255,255,255,.55);
          transition: all .2s;
        }
        .cta-btn-outline:hover { border-color: white; background: rgba(255,255,255,.1); }
        .about-cta-right {}
        .cta-cuisine-grid {
          display: flex; flex-wrap: wrap; gap: 10px;
        }
        .cta-cat-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,.18);
          color: white; font-size: 13px; font-weight: 700;
          padding: 9px 18px; border-radius: var(--r-full);
          border: 1.5px solid rgba(255,255,255,.28);
          transition: all .25s cubic-bezier(.34,1.56,.64,1);
          animation: fadeUp .5s ease both;
        }
        .cta-cat-pill:hover {
          background: rgba(255,255,255,.32);
          transform: translateY(-2px) scale(1.04);
        }

        /* ─── FOOTER ─── */
        .about-footer { background: var(--dark); padding: 70px 0 36px; }
        .footer-grid {
          display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px; margin-bottom: 48px;
        }
        .footer-logo {
          font-family: 'Nunito', sans-serif;
          font-size: 24px; font-weight: 900; color: var(--orange); margin-bottom: 12px;
        }
        .footer-logo span { color: var(--orange); }
        .footer-desc {
          font-size: 13px; line-height: 1.8;
          color: rgba(255,255,255,.35); max-width: 230px;
        }
        .footer-col-title {
          font-size: 11px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          color: rgba(255,255,255,.4); margin-bottom: 16px;
        }
        .footer-link {
          display: block; font-size: 13px;
          color: rgba(255,255,255,.35); margin-bottom: 10px; transition: color .15s;
        }
        .footer-link:hover { color: var(--orange); }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,.08);
          padding-top: 24px; font-size: 12px;
          color: rgba(255,255,255,.3);
          display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 1100px) {
          .about-hero-inner { grid-template-columns: 1fr; gap: 32px; }
          .about-hero-right { order: -1; }
          .about-hero-orbs { width: 260px; height: 260px; }
          .orb-center { width: 90px; height: 90px; font-size: 42px; }
          .orb-1,.orb-2,.orb-3,.orb-4,.orb-5 { width: 58px; height: 58px; font-size: 26px; }
          .mission-grid { grid-template-columns: 1fr; }
          .values-grid { grid-template-columns: repeat(2, 1fr); }
          .team-grid { grid-template-columns: repeat(2, 1fr); }
          .cuisines-showcase { grid-template-columns: repeat(5, 1fr); }
          .about-cta-inner { grid-template-columns: 1fr; gap: 36px; }
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 768px) {
          .about-container { padding: 0 20px; }
          .navbar-inner { padding: 0 20px; }
          .nav-links { display: none; }
          .about-section { padding: 60px 0; }
          .about-stats-inner { gap: 0; }
          .about-stat-item { padding: 8px 20px; }
          .how-steps { flex-direction: column; gap: 40px; }
          .how-step-arrow { display: none; }
          .values-grid { grid-template-columns: 1fr; }
          .cuisines-showcase { grid-template-columns: repeat(2, 1fr); }
          .team-grid { grid-template-columns: 1fr; }
          .footer-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .about-hero-title { font-size: 42px; }
          .about-hero-blob { clip-path: none; width: 100%; height: 50%; top: auto; bottom: 0; }
          .cuisines-showcase { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </>
  )
}
