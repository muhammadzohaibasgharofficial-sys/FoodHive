// FoodHive — Category Page
import Head from 'next/head'
import Link from 'next/link'
import { getRecipesByCategory, RECIPE_CATEGORIES, SAMPLE_RECIPE } from '../../lib/data'

function RecipeCard({ recipe }) {
  return (
    <Link href={`/recipes/${recipe.slug}`}>
      <div className="recipe-card scale-in">
        <div className="recipe-card-image">
          <img src={recipe.image1} alt={recipe.title} loading="lazy" />
          <div className="recipe-badge">{recipe.categoryIcon} {recipe.categoryName}</div>
          <div className="recipe-difficulty">{recipe.difficulty}</div>
        </div>
        <div className="recipe-card-body">
          <span className="recipe-category-tag">{recipe.categoryName}</span>
          <h3 className="recipe-title">{recipe.title}</h3>
          <p className="recipe-desc">{recipe.description}</p>
          <div className="recipe-meta">
            <div className="recipe-meta-item">
              <span className="recipe-meta-icon">⏱️</span>{recipe.totalTime}
            </div>
            <div className="recipe-meta-item">
              <span className="recipe-meta-icon">👥</span>{recipe.servings} servings
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

export default function CategoryPage({ category, recipes }) {
  if (!category) {
    return (
      <div style={{ padding: '100px 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px' }}>Category Not Found</h1>
        <Link href="/" className="btn-primary">← Home</Link>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{category.name} — FoodHive</title>
        <meta name="description" content={category.desc} />
      </Head>

      <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
        <nav className="navbar">
          <div className="navbar-inner">
            <Link href="/" className="logo">
              <div className="logo-icon">🍳</div><span>FoodHive</span>
            </Link>
            <div className="nav-links">
              <Link href="/recipes" className="nav-link">All Recipes</Link>
              <Link href="/#categories" className="nav-link">Categories</Link>
            </div>
            <Link href="/" className="btn-primary">← Home</Link>
          </div>
        </nav>

        <section style={{ background: 'linear-gradient(135deg, #FFF8E7, #FFE4CC)', padding: '80px 0', borderBottom: '2px solid var(--orange)' }}>
          <div className="container">
            <div className="breadcrumb">
              <Link href="/">Home</Link>
              <span className="breadcrumb-separator">›</span>
              <Link href="/#categories">Categories</Link>
              <span className="breadcrumb-separator">›</span>
              <span style={{ color: 'var(--orange)' }}>{category.name}</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '20px' }}>
              <div style={{ fontSize: '72px' }}>{category.icon}</div>
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: '800', color: 'var(--black)', lineHeight: '1.1' }}>
                  {category.name}
                </h1>
                <p style={{ fontSize: '18px', color: 'var(--gray)', marginTop: '8px' }}>{category.desc}</p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '80px 0' }}>
          <div className="container">
            {recipes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>{category.icon}</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: '800', marginBottom: '12px' }}>
                  Recipes Coming Soon!
                </h2>
                <p style={{ fontSize: '16px', color: 'var(--gray)', marginBottom: '32px' }}>
                  We're adding new {category.name.toLowerCase()} every day. Check back soon!
                </p>
                <Link href="/recipes" className="btn-primary">Browse All Recipes</Link>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--black)' }}>
                    {recipes.length} Recipe{recipes.length !== 1 ? 's' : ''} Found
                  </h2>
                </div>
                <div className="recipes-grid">
                  {recipes.map((recipe, i) => (
                    <RecipeCard key={recipe.slug || i} recipe={recipe} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        <footer className="footer">
          <div className="container">
            <div className="footer-bottom">© 2026 FoodHive. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </>
  )
}

export async function getStaticPaths() {
  const paths = RECIPE_CATEGORIES.map(cat => ({ params: { category: cat.id } }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const category = RECIPE_CATEGORIES.find(c => c.id === params.category)
  if (!category) return { notFound: true }

  const recipes = getRecipesByCategory(params.category)
  
  return {
    props: { category, recipes },
    revalidate: 60
  }
}
