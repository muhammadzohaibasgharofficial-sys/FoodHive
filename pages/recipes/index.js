// FoodHive — All Recipes Page
import Head from 'next/head'
import Link from 'next/link'
import { getAllRecipes, RECIPE_CATEGORIES, SAMPLE_RECIPE } from '../../lib/data'

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

export default function AllRecipesPage({ recipes }) {
  return (
    <>
      <Head>
        <title>All Recipes — FoodHive</title>
        <meta name="description" content="Browse all recipes on FoodHive. Find your next favorite dish!" />
      </Head>

      <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
        <nav className="navbar">
          <div className="navbar-inner">
            <Link href="/" className="logo">
              <div className="logo-icon">🍳</div><span>FoodHive</span>
            </Link>
            <div className="nav-links">
              <Link href="/recipes" className="nav-link active">All Recipes</Link>
              <Link href="/#categories" className="nav-link">Categories</Link>
            </div>
            <Link href="/" className="btn-primary">← Home</Link>
          </div>
        </nav>

        <section style={{ padding: '80px 0' }}>
          <div className="container">
            <div className="breadcrumb">
              <Link href="/">Home</Link>
              <span className="breadcrumb-separator">›</span>
              <span style={{ color: 'var(--orange)' }}>All Recipes</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: '800', color: 'var(--black)', marginBottom: '16px' }}>
              All Recipes
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--gray)', marginBottom: '48px' }}>
              Explore our complete collection of {recipes.length}+ delicious recipes
            </p>

            <div className="recipes-grid">
              {recipes.map((recipe, i) => (
                <RecipeCard key={recipe.slug || i} recipe={recipe} />
              ))}
            </div>
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

export async function getStaticProps() {
  const recipes = getAllRecipes()
  return {
    props: { recipes: recipes.length > 0 ? recipes : Array(12).fill(SAMPLE_RECIPE) },
    revalidate: 60
  }
}
