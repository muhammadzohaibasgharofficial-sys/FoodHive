// FoodHive World — Category Page — Matches Homepage Design Exactly
import Head from 'next/head'
import Link from 'next/link'
import { RECIPE_CATEGORIES, getAllRecipes, SAMPLE_RECIPE } from '../../lib/data'

// ── Recipe Card — same as homepage RecipeCard ──
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
            <div className="rc-ings">
              {ings.map((g, i) => <span key={i} className="rc-ing-tag">{g}</span>)}
            </div>
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

// ── Featured Card (big card on left) ──
function FeaturedCard({ recipe }) {
  if (!recipe) return null
  return (
    <Link href={`/recipes/${recipe.slug}`}>
      <div className="cp-featured-card">
        <div className="cp-featured-img-wrap">
          <div className="cp-featured-circle">
            <img src={recipe.image1 || recipe.image2} alt={recipe.title} loading="lazy" />
          </div>
          <span className="cp-featured-badge">⭐ Featured</span>
        </div>
        <div className="cp-featured-body">
          <h3 className="cp-featured-title">{recipe.title}</h3>
          <p className="cp-featured-desc">{recipe.description}</p>
          {recipe.ingredients && (
            <ul className="cp-featured-ings">
              {recipe.ingredients.slice(0, 4).map((ing, i) => (
                <li key={i}><span className="cp-ing-dot">●</span> {ing.item} <span className="cp-ing-amt">{ing.amount}</span></li>
              ))}
            </ul>
          )}
          <div className="cp-featured-meta">
            <span className="cp-stars">{'★'.repeat(Math.round(recipe.rating || 5))}</span>
            <span className="cp-reviews">({recipe.reviews || 0} reviews)</span>
            <span className="cp-time">⏱ {recipe.totalTime}</span>
          </div>
          <div className="cp-featured-btn">View Full Recipe →</div>
        </div>
      </div>
    </Link>
  )
}

// ── Mini Recipe Card (small cards) ──
function MiniCard({ recipe }) {
  if (!recipe) return null
  return (
    <Link href={`/recipes/${recipe.slug}`}>
      <div className="cp-mini-card">
        <div className="cp-mini-circle-wrap">
          <div className="cp-mini-circle">
            <img src={recipe.image2 || recipe.image1} alt={recipe.title} loading="lazy" />
          </div>
          <span className="cp-mini-tag">{recipe.countryFlag}</span>
        </div>
        <div className="cp-mini-body">
          <h4 className="cp-mini-title">{recipe.title}</h4>
          <p className="cp-mini-desc">{(recipe.description || '').slice(0, 70)}...</p>
          <div className="cp-mini-price">
            {recipe.totalTime && <span className="cp-mini-time">⏱ {recipe.totalTime}</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function CategoryPage({ cat, recipes }) {
  if (!cat) return null

  const heroImg = recipes[0]?.image1 || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'

  const fallbackRecipes = [
    { ...SAMPLE_RECIPE, slug: 'fb-1', title: 'Chicken Biryani', description: 'Aromatic basmati rice cooked with tender chicken and exotic spices.', countryFlag: '🇮🇳', countryName: 'Indian', categoryIcon: cat.icon, categoryName: cat.name, totalTime: '60 min', rating: 4.8, reviews: 312, image1: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800', image2: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { ...SAMPLE_RECIPE, slug: 'fb-2', title: 'Creamy Korma', description: 'Rich, velvety korma sauce with warming spices and tender meat.', countryFlag: '🌏', countryName: 'Asian', categoryIcon: cat.icon, categoryName: cat.name, totalTime: '45 min', rating: 4.6, reviews: 198, image1: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800', image2: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { ...SAMPLE_RECIPE, slug: 'fb-3', title: 'Dal Makhani', description: 'Slow-cooked black lentils simmered with butter and cream overnight.', countryFlag: '🇮🇳', countryName: 'Indian', categoryIcon: cat.icon, categoryName: cat.name, totalTime: '3 hrs', rating: 4.7, reviews: 254, image1: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800', image2: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { ...SAMPLE_RECIPE, slug: 'fb-4', title: 'Gilded Chicken', description: 'Juicy golden chicken marinated in herbs and grilled to perfection.', countryFlag: '🇮🇳', countryName: 'Indian', categoryIcon: cat.icon, categoryName: cat.name, totalTime: '35 min', rating: 4.5, reviews: 178, image1: 'https://images.pexels.com/photos/2087748/pexels-photo-2087748.jpeg?auto=compress&cs=tinysrgb&w=800', image2: 'https://images.pexels.com/photos/2087748/pexels-photo-2087748.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { ...SAMPLE_RECIPE, slug: 'fb-5', title: 'Spiced Khichdi', description: 'Comforting rice and lentil dish seasoned with aromatic spices.', countryFlag: '🇮🇳', countryName: 'Indian', categoryIcon: cat.icon, categoryName: cat.name, totalTime: '30 min', rating: 4.4, reviews: 134, image1: 'https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=800', image2: 'https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { ...SAMPLE_RECIPE, slug: 'fb-6', title: 'Lamb Khari Bhuno', description: 'Slow-cooked lamb in a thick, reduced masala sauce — bold and rich.', countryFlag: '🌙', countryName: 'Middle Eastern', categoryIcon: cat.icon, categoryName: cat.name, totalTime: '90 min', rating: 4.9, reviews: 421, image1: 'https://images.pexels.com/photos/2282532/pexels-photo-2282532.jpeg?auto=compress&cs=tinysrgb&w=800', image2: 'https://images.pexels.com/photos/2282532/pexels-photo-2282532.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ]

  const displayRecipes = recipes.length > 0 ? recipes : fallbackRecipes
  const displayFeatured = displayRecipes[0]
  const displayMini = displayRecipes.slice(1, 3)
  const displayGrid = displayRecipes.length > 3 ? displayRecipes.slice(3) : displayRecipes

  return (
    <>
      <Head>
        <title>{cat.icon} {cat.name} Recipes | FoodHive World</title>
        <meta name="description" content={`${cat.desc} Explore ${cat.name} recipes from 10 world cuisines on FoodHive World.`} />
        <link rel="canonical" href={`https://foodhive.vercel.app/categories/${cat.id}`} />
      </Head>

      {/* NAVBAR — exactly same as homepage */}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="logo">
            <span className="logo-icon">🍽️</span>
            <span className="logo-text">FoodHive<span className="logo-accent"> World</span></span>
          </Link>
          <div className="nav-links">
            <Link href="/#countries" className="nav-link">Countries</Link>
            <Link href="/#categories" className="nav-link">Categories</Link>
            <Link href="/recipes" className="nav-link">Recipes</Link>
            <Link href="/recipes" className="nav-link">Stories ▾</Link>
          </div>
          <div className="navbar-right">
            <button className="nav-icon-btn" aria-label="Search">🔍</button>
            <button className="nav-icon-btn" aria-label="Account">👤</button>
            <Link href="/#categories" className="nav-cta-btn">← Categories</Link>
          </div>
        </div>
      </nav>

      {/* HERO — same structure as homepage hero */}
      <section className="hero cp-hero-override">
        <div className="hero-brush-bg" />
        <div className="hero-inner">
          <div className="hero-left fade-up">
            <p className="hero-tagline">{cat.icon} Category</p>
            <h1 className="hero-title cp-hero-title">
              {cat.name}<br /><em>Recipes.</em>
            </h1>
            <p className="hero-desc">{cat.desc} Explore hand-curated recipes from 10 world cuisines — each crafted with authentic ingredients and traditional techniques.</p>
            <div className="hero-cta-row">
              <Link href="/#categories" className="btn-primary">← All Categories</Link>
              <Link href="/recipes" className="btn-outline">View All Recipes</Link>
            </div>
            <div className="cp-hero-stats">
              <div className="cp-stat">
                <span className="cp-stat-num">{displayRecipes.length}+</span>
                <span className="cp-stat-label">Recipes</span>
              </div>
              <div className="cp-stat-divider" />
              <div className="cp-stat">
                <span className="cp-stat-num">10</span>
                <span className="cp-stat-label">Cuisines</span>
              </div>
              <div className="cp-stat-divider" />
              <div className="cp-stat">
                <span className="cp-stat-num">30m</span>
                <span className="cp-stat-label">New recipes</span>
              </div>
            </div>
          </div>
          <div className="hero-right scale-in">
            <div className="hero-img-wrap">
              <img src={heroImg} alt={cat.name} className="hero-food-img" />
            </div>
            <div className="cp-hero-float-badge">
              <span className="badge-icon">{cat.icon}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{cat.name}</div>
                <div style={{ fontSize: 10, color: 'var(--gray)' }}>World Cuisine</div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-filter-row">
          <div className="hero-filters">
            {RECIPE_CATEGORIES.slice(0, 4).map((c, i) => (
              <Link key={c.id} href={`/categories/${c.id}`} className={`hero-filter-tab${c.id === cat.id ? ' active' : ''}`}>{c.icon} {c.name}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED SECTION — "Austin Biryani" style from image */}
      <section className="section cp-featured-section">
        <div className="container">
          <div className="section-head fade-up">
            <div className="section-eyebrow">🌟 Top Pick</div>
            <h2 className="section-title">Featured <span style={{ color: 'var(--orange)', fontStyle: 'italic' }}>{cat.name}</span></h2>
            <p className="section-desc">Our editors handpicked selection of the very best {cat.name.toLowerCase()} recipes from around the world.</p>
          </div>
          <div className="cp-featured-row">
            <FeaturedCard recipe={displayFeatured} />
            <div className="cp-mini-col">
              {displayMini.map((r, i) => (
                <MiniCard key={r.slug || i} recipe={r} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ALL RECIPES GRID — "Mined Food Choices" style */}
      <section className="section cp-grid-section">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 52, flexWrap: 'wrap', gap: 16 }} className="fade-up">
            <div>
              <div className="section-eyebrow">🍴 All Recipes</div>
              <h2 className="section-title">{cat.name} <span style={{ color: 'var(--orange)' }}>Choices</span></h2>
            </div>
            <Link href="/recipes" className="btn-primary" style={{ fontSize: 13, padding: '11px 26px' }}>View All →</Link>
          </div>

          {displayGrid.length > 0 ? (
            <div className="recipes-grid">
              {displayGrid.map((r, i) => (
                <div key={r.slug || i} className="fade-up" style={{ animationDelay: `${i * 70}ms` }}>
                  <RecipeCard recipe={r} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 40px', background: 'white', borderRadius: 'var(--r-xl)', boxShadow: 'var(--sh-soft)' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>{cat.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 28, marginBottom: 12 }}>Coming Soon!</h3>
              <p style={{ color: 'var(--gray)' }}>AI is preparing {cat.name} recipes. Check back in 30 min!</p>
            </div>
          )}
        </div>
      </section>

      {/* ALL CATEGORIES — same cat-grid style as homepage */}
      <section id="categories" className="section categories-section">
        <div className="container">
          <div className="section-head fade-up">
            <div className="section-eyebrow">Browse by Type</div>
            <h2 className="section-title">All 12 Categories</h2>
          </div>
          <div className="cat-grid">
            {RECIPE_CATEGORIES.map((c, i) => (
              <Link key={c.id} href={`/categories/${c.id}`}>
                <div className={`cat-item fade-up${c.id === cat.id ? ' cat-item-active' : ''}`} style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="cat-icon-emoji">{c.icon}</div>
                  <div className="cat-name">{c.name}</div>
                  <div className="cat-count">{c.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER — same as homepage */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-logo-txt">🍽️ FoodHive World</div>
              <p className="footer-desc">Authentic recipes from 10 world cuisines, auto-published every 30 minutes by AI.</p>
            </div>
            <div>
              <div className="footer-col-title">Categories</div>
              {RECIPE_CATEGORIES.slice(0, 6).map(c => (
                <Link key={c.id} href={`/categories/${c.id}`} className="footer-link">{c.icon} {c.name}</Link>
              ))}
            </div>
            <div>
              <div className="footer-col-title">More Categories</div>
              {RECIPE_CATEGORIES.slice(6).map(c => (
                <Link key={c.id} href={`/categories/${c.id}`} className="footer-link">{c.icon} {c.name}</Link>
              ))}
            </div>
            <div>
              <div className="footer-col-title">Quick Links</div>
              <Link href="/" className="footer-link">🏠 Home</Link>
              <Link href="/recipes" className="footer-link">📖 All Recipes</Link>
              <Link href="/#countries" className="footer-link">🌍 Countries</Link>
              <Link href="/#categories" className="footer-link">🗂️ Categories</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <Link href="/" style={{ color: 'var(--olive-l)', textDecoration: 'none' }}>🍽️ FoodHive World</Link>
            <span>Auto-published every 30 min · 10 countries · 12 categories</span>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .cp-hero-override { min-height: 85vh; }
        .cp-hero-title { font-size: clamp(44px, 5.5vw, 76px) !important; }

        .cp-hero-stats { display: flex; align-items: center; gap: 24px; margin-top: 32px; }
        .cp-stat { text-align: center; }
        .cp-stat-num { font-family: var(--font-title); font-size: 28px; font-weight: 700; color: var(--dark); display: block; line-height: 1; }
        .cp-stat-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--gray); margin-top: 3px; display: block; }
        .cp-stat-divider { width: 1px; height: 36px; background: rgba(44,24,16,0.12); }

        .cp-hero-float-badge {
          position: absolute; bottom: 30px; left: -10px;
          background: white; border-radius: 16px; padding: 12px 18px;
          box-shadow: var(--sh-card); display: flex; align-items: center; gap: 10px;
          font-size: 13px; font-weight: 700; color: var(--dark);
          animation: floatBadge 3s ease-in-out 1s infinite;
        }
        .cp-hero-float-badge .badge-icon { font-size: 26px; }

        .cp-featured-section { background: var(--cream2); }
        .cp-featured-row { display: grid; grid-template-columns: 1.4fr 1fr; gap: 28px; align-items: start; }

        .cp-featured-card {
          background: white; border-radius: var(--r-xl); overflow: visible;
          box-shadow: var(--sh-card); transition: all .35s cubic-bezier(.34,1.56,.64,1);
          cursor: pointer; position: relative;
        }
        .cp-featured-card:hover { transform: translateY(-6px); box-shadow: var(--sh-float); }
        .cp-featured-img-wrap { position: relative; display: flex; justify-content: center; padding-top: 32px; margin-bottom: -10px; }
        .cp-featured-circle { width: 180px; height: 180px; border-radius: 50%; overflow: hidden; border: 5px solid white; box-shadow: var(--sh-circle); background: var(--cream2); }
        .cp-featured-circle img { width: 100%; height: 100%; object-fit: cover; }
        .cp-featured-badge { position: absolute; top: 18px; right: 20px; background: var(--orange); color: white; font-size: 10px; font-weight: 700; padding: 5px 14px; border-radius: var(--r-full); letter-spacing: .8px; }
        .cp-featured-body { padding: 18px 28px 28px; }
        .cp-featured-title { font-family: var(--font-title); font-size: 22px; font-weight: 700; color: var(--dark); margin-bottom: 8px; line-height: 1.2; }
        .cp-featured-desc { font-size: 13px; color: var(--gray); line-height: 1.7; margin-bottom: 14px; }
        .cp-featured-ings { list-style: none; margin-bottom: 14px; display: flex; flex-direction: column; gap: 4px; }
        .cp-featured-ings li { font-size: 12px; color: var(--gray); display: flex; align-items: center; gap: 6px; }
        .cp-ing-dot { color: var(--olive); font-size: 8px; }
        .cp-ing-amt { color: var(--orange); font-weight: 700; margin-left: auto; }
        .cp-featured-meta { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
        .cp-stars { color: var(--orange); font-size: 13px; letter-spacing: 1px; }
        .cp-reviews { font-size: 11px; color: var(--gray-l); }
        .cp-time { font-size: 11px; color: var(--gray); margin-left: auto; }
        .cp-featured-btn { display: inline-block; background: var(--orange); color: white; font-size: 13px; font-weight: 700; padding: 12px 28px; border-radius: var(--r-full); transition: all .25s; box-shadow: 0 4px 16px rgba(232,135,58,.35); }
        .cp-featured-card:hover .cp-featured-btn { background: var(--orange-d); }

        .cp-mini-col { display: flex; flex-direction: column; gap: 20px; }
        .cp-mini-card {
          background: white; border-radius: var(--r-xl); overflow: visible;
          box-shadow: var(--sh-soft); transition: all .3s cubic-bezier(.34,1.56,.64,1);
          cursor: pointer; display: flex; flex-direction: column; align-items: center;
          padding-top: 24px; position: relative;
        }
        .cp-mini-card:hover { transform: translateY(-4px); box-shadow: var(--sh-card); }
        .cp-mini-circle-wrap { position: relative; margin-bottom: 4px; }
        .cp-mini-circle { width: 110px; height: 110px; border-radius: 50%; overflow: hidden; border: 4px solid white; box-shadow: var(--sh-circle); background: var(--cream2); }
        .cp-mini-circle img { width: 100%; height: 100%; object-fit: cover; }
        .cp-mini-tag { position: absolute; bottom: 0; right: -4px; background: white; border-radius: var(--r-full); font-size: 16px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,.12); }
        .cp-mini-body { padding: 10px 18px 18px; text-align: center; width: 100%; }
        .cp-mini-title { font-family: var(--font-title); font-size: 16px; font-weight: 700; color: var(--dark); margin-bottom: 6px; line-height: 1.2; }
        .cp-mini-desc { font-size: 11px; color: var(--gray); line-height: 1.6; margin-bottom: 10px; }
        .cp-mini-price { display: flex; align-items: center; justify-content: center; gap: 8px; }
        .cp-mini-time { font-size: 11px; color: var(--orange); font-weight: 700; }

        .cp-grid-section { background: var(--cream); }

        .cat-item-active { background: var(--olive) !important; color: white !important; }
        .cat-item-active .cat-name { color: white !important; }
        .cat-item-active .cat-count { color: rgba(255,255,255,0.75) !important; }

        @media(max-width: 900px) {
          .cp-featured-row { grid-template-columns: 1fr; }
          .cp-mini-col { flex-direction: row; }
          .cp-mini-card { flex: 1; }
        }
        @media(max-width: 600px) {
          .cp-mini-col { flex-direction: column; }
          .cp-hero-stats { gap: 16px; }
          .cp-stat-num { font-size: 22px; }
        }
      `}</style>
    </>
  )
}

export async function getStaticPaths() {
  return {
    paths: RECIPE_CATEGORIES.map(c => ({ params: { category: c.id } })),
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const cat = RECIPE_CATEGORIES.find(c => c.id === params.category)
  if (!cat) return { notFound: true }
  const recipes = getAllRecipes().filter(r => r.category === params.category)
  return { props: { cat, recipes }, revalidate: 60 }
}
