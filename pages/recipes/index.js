import Head from 'next/head'
import Link from 'next/link'
import { getAllRecipes, RECIPE_CATEGORIES, COUNTRIES, SAMPLE_RECIPE } from '../../lib/data'

function RecipeCard({ recipe }) {
  return (
    <Link href={`/recipes/${recipe.slug}`} className="rcard-link">
      <div className="rcard">
        <div className="rcard-img-wrap">
          <img src={recipe.image1} alt={recipe.title} loading="lazy" className="rcard-img" />
          <div className="rcard-img-overlay" />
          {recipe.categoryIcon && (
            <div className="rcard-cat-badge">{recipe.categoryIcon} {recipe.categoryName}</div>
          )}
        </div>
        <div className="rcard-body">
          <div className="rcard-meta-top">
            <span className="rcard-flag">{recipe.countryFlag} {recipe.countryName}</span>
            <span className="rcard-diff">{recipe.difficulty}</span>
          </div>
          <h3 className="rcard-title">{recipe.title}</h3>
          <p className="rcard-desc">{(recipe.description || '').slice(0, 90)}…</p>
          <div className="rcard-footer">
            <div className="rcard-rating">
              {'★'.repeat(Math.min(5, Math.round(recipe.rating || 4.8)))}
              <span className="rcard-rating-num">{recipe.rating || '4.8'}</span>
            </div>
            <span className="rcard-time">⏱ {recipe.totalTime}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function AllRecipesPage({ recipes, totalCount }) {
  return (
    <>
      <Head>
        <title>All Recipes — FoodHive</title>
        <meta name="description" content="Browse authentic recipes from 10 world cuisines on FoodHive." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      {/* NAV */}
      <nav className="ar-nav">
        <div className="ar-nav-inner">
          <Link href="/" className="ar-logo">Food<span>Hive</span>.</Link>
          <div className="ar-nav-links">
            <Link href="/" className="ar-nav-link">Home</Link>
            <Link href="#" className="ar-nav-link">Menu</Link>
            <Link href="#" className="ar-nav-link">Cuisines</Link>
          </div>
          <div className="ar-nav-right">
            <Link href="/" className="ar-back-btn">← Back</Link>
          </div>
        </div>
      </nav>

      <main className="ar-main">
        <div className="ar-container">

          {/* PAGE HEADER */}
          <div className="ar-header">
            <div className="ar-breadcrumb">
              <Link href="/">Home</Link>
              <span>›</span>
              <span className="ar-bc-current">All Recipes</span>
            </div>
            <h1 className="ar-page-title">All Recipes</h1>
            <p className="ar-page-desc">
              Explore {totalCount}+ authentic dishes from 10 world cuisines and 12 categories
            </p>
          </div>

          {/* CUISINE FILTER PILLS */}
          <div className="ar-filter-row">
            {COUNTRIES.map(c => (
              <Link key={c.id} href={`/countries/${c.id}`} className="ar-filter-pill">
                {c.flag} {c.name}
              </Link>
            ))}
          </div>

          {/* CATEGORY PILLS */}
          <div className="ar-cat-filter-row">
            {RECIPE_CATEGORIES.map(c => (
              <Link key={c.id} href={`/categories/${c.id}`} className="ar-cat-pill">
                {c.icon} {c.name}
              </Link>
            ))}
          </div>

          {/* RECIPES GRID */}
          {recipes.length > 0 ? (
            <div className="ar-grid">
              {recipes.map((recipe, i) => (
                <RecipeCard key={recipe.slug || i} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="ar-empty">
              <div className="ar-empty-icon">🍽️</div>
              <h3>No recipes yet</h3>
              <p>Check back soon — new recipes are published daily!</p>
            </div>
          )}

        </div>
      </main>

      {/* FOOTER */}
      <footer className="ar-footer">
        <div className="ar-container">
          <div className="ar-footer-inner">
            <Link href="/" className="ar-footer-logo">Food<span>Hive</span>.</Link>
            <span>© 2026 FoodHive — 10 Cuisines · 12 Categories</span>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Nunito', -apple-system, sans-serif;
          background: #f7f7f7;
          color: #1a1a1a;
        }
        a { text-decoration: none; color: inherit; }
        img { display: block; max-width: 100%; }

        :root {
          --orange: #E8873A;
          --orange-dark: #C96B20;
        }

        /* NAV */
        .ar-nav {
          background: #fff;
          border-bottom: 1px solid #ebebeb;
          height: 62px;
          position: sticky; top: 0; z-index: 100;
        }
        .ar-nav-inner {
          max-width: 1240px; margin: 0 auto; padding: 0 40px;
          height: 100%; display: flex; align-items: center; gap: 32px;
        }
        .ar-logo {
          font-family: 'Nunito', sans-serif;
          font-size: 22px; font-weight: 900; color: var(--orange);
          flex-shrink: 0;
        }
        .ar-logo span { color: var(--orange); }
        .ar-nav-links { display: flex; gap: 2px; }
        .ar-nav-link {
          font-size: 14px; font-weight: 600; color: #444;
          padding: 7px 14px; border-radius: 8px; transition: background 0.15s;
        }
        .ar-nav-link:hover { background: #f5f5f5; }
        .ar-nav-right { margin-left: auto; }
        .ar-back-btn {
          font-size: 13px; font-weight: 700; color: #555;
          padding: 8px 18px; border: 1.5px solid #e0e0e0;
          border-radius: 100px; transition: all 0.15s;
        }
        .ar-back-btn:hover { border-color: var(--orange); color: var(--orange); }

        /* MAIN */
        .ar-main { padding: 40px 0 80px; }
        .ar-container { max-width: 1240px; margin: 0 auto; padding: 0 40px; }

        /* HEADER */
        .ar-header { margin-bottom: 32px; }
        .ar-breadcrumb {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; color: #999; margin-bottom: 16px; font-weight: 500;
        }
        .ar-breadcrumb a { color: #999; transition: color 0.15s; }
        .ar-breadcrumb a:hover { color: var(--orange); }
        .ar-bc-current { color: var(--orange); font-weight: 700; }
        .ar-page-title {
          font-family: 'Nunito', sans-serif;
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 900; color: #1a1a1a;
          margin-bottom: 8px; letter-spacing: -0.5px;
        }
        .ar-page-desc { font-size: 14px; color: #777; font-weight: 500; }

        /* FILTER PILLS */
        .ar-filter-row {
          display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;
        }
        .ar-filter-pill {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12px; font-weight: 700;
          padding: 7px 15px; border-radius: 100px;
          background: #fff; border: 1.5px solid #e0e0e0;
          color: #444; transition: all 0.15s; cursor: pointer;
        }
        .ar-filter-pill:hover {
          border-color: var(--orange); color: var(--orange);
          background: #fff9f5;
        }

        .ar-cat-filter-row {
          display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 36px;
        }
        .ar-cat-pill {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12px; font-weight: 600;
          padding: 6px 14px; border-radius: 100px;
          background: #f0f0f0; color: #555;
          transition: all 0.15s;
        }
        .ar-cat-pill:hover {
          background: var(--orange); color: #fff;
        }

        /* GRID */
        .ar-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        /* RECIPE CARD */
        .rcard-link { display: block; }
        .rcard {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s;
          cursor: pointer;
          height: 100%;
        }
        .rcard:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 36px rgba(0,0,0,0.13);
        }

        .rcard-img-wrap {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        .rcard-img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.4s;
        }
        .rcard:hover .rcard-img { transform: scale(1.05); }
        .rcard-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 55%);
        }
        .rcard-cat-badge {
          position: absolute; bottom: 12px; left: 12px;
          background: var(--orange); color: #fff;
          font-size: 11px; font-weight: 700;
          padding: 4px 10px; border-radius: 100px;
          letter-spacing: 0.2px;
        }

        .rcard-body { padding: 16px 18px 20px; }
        .rcard-meta-top {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 8px;
        }
        .rcard-flag { font-size: 12px; font-weight: 700; color: #666; }
        .rcard-diff {
          font-size: 11px; font-weight: 700; color: #999;
          background: #f5f5f5; padding: 3px 9px; border-radius: 100px;
        }
        .rcard-title {
          font-size: 17px; font-weight: 800; color: #1a1a1a;
          margin-bottom: 7px; line-height: 1.25;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .rcard-desc {
          font-size: 13px; color: #777; line-height: 1.6;
          margin-bottom: 14px; font-weight: 500;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .rcard-footer {
          display: flex; align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid #f0f0f0;
        }
        .rcard-rating {
          display: flex; align-items: center; gap: 5px;
          color: #f59e0b; font-size: 13px; font-weight: 700; letter-spacing: 1px;
        }
        .rcard-rating-num { color: #555; font-size: 12px; letter-spacing: 0; }
        .rcard-time { font-size: 12px; color: #999; font-weight: 600; }

        /* EMPTY */
        .ar-empty {
          text-align: center; padding: 100px 40px;
          background: #fff; border-radius: 16px;
          border: 1.5px dashed #e0e0e0;
        }
        .ar-empty-icon { font-size: 64px; margin-bottom: 16px; }
        .ar-empty h3 { font-size: 22px; font-weight: 800; margin-bottom: 8px; }
        .ar-empty p { color: #888; font-size: 14px; }

        /* FOOTER */
        .ar-footer {
          background: #111; padding: 28px 0;
        }
        .ar-footer-inner {
          display: flex; align-items: center;
          justify-content: space-between; flex-wrap: wrap; gap: 12px;
          font-size: 12px; color: rgba(255,255,255,0.35);
        }
        .ar-footer-logo {
          font-size: 18px; font-weight: 900; color: var(--orange);
        }
        .ar-footer-logo span { color: var(--orange); }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .ar-container { padding: 0 16px; }
          .ar-nav-inner { padding: 0 16px; }
          .ar-nav-links { display: none; }
          .ar-grid { grid-template-columns: 1fr; gap: 16px; }
          .ar-main { padding: 28px 0 60px; }
        }
        @media (max-width: 500px) {
          .ar-grid { grid-template-columns: 1fr; }
          .rcard-img-wrap { height: 180px; }
        }
      `}</style>
    </>
  )
}

export async function getStaticProps() {
  const recipes = getAllRecipes()
  const valid = recipes.filter(r => r.slug && r.title && r.image1)
  const fallback = valid.length > 0 ? valid : Array(6).fill(SAMPLE_RECIPE)
  return {
    props: { recipes: fallback, totalCount: fallback.length },
    revalidate: 60
  }
}
