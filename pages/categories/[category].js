// FoodHive World — Category Page
import Head from 'next/head'
import Link from 'next/link'
import { RECIPE_CATEGORIES, getAllRecipes } from '../../lib/data'

function RecipeCard({ recipe }) {
  return (
    <Link href={`/recipes/${recipe.slug}`}>
      <div className="recipe-card">
        <div className="recipe-card-top">
          <img src={recipe.image1} alt={recipe.title} loading="lazy" />
          <div className="recipe-card-top-overlay"/>
          <div className="recipe-card-badges">
            <span className="recipe-badge-country">{recipe.countryFlag} {recipe.countryName}</span>
          </div>
        </div>
        <div className="recipe-card-circle">
          <img className="recipe-card-circle-img" src={recipe.image2||recipe.image1} alt={recipe.title} loading="lazy"/>
        </div>
        <div className="recipe-card-body">
          <h3 className="recipe-card-title">{recipe.title}</h3>
          <p className="recipe-card-desc">{recipe.description}</p>
          <div className="recipe-card-footer">
            <div className="recipe-rating">⭐ {recipe.rating}</div>
            <span className="recipe-view-btn">View →</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function CategoryPage({ cat, recipes }) {
  if (!cat) return null
  return (
    <>
      <Head>
        <title>{cat.icon} {cat.name} Recipes from 10 Countries | FoodHive World</title>
        <meta name="description" content={`${cat.desc} From 10 world cuisines on FoodHive World.`}/>
        <link rel="canonical" href={`https://foodhive.vercel.app/categories/${cat.id}`}/>
      </Head>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="logo">🍽️ FoodHive <span className="logo-badge">WORLD</span></Link>
          <div className="nav-links">
            <Link href="/#countries" className="nav-link">Countries</Link>
            <Link href="/#categories" className="nav-link">Categories</Link>
            <Link href="/recipes" className="nav-link">All Recipes</Link>
          </div>
          <Link href="/#categories" className="btn-secondary" style={{fontSize:'13px',padding:'10px 22px'}}>← Categories</Link>
        </div>
      </nav>
      <section style={{ paddingTop:'72px', background:'var(--cream)', padding:'120px 0 80px' }}>
        <div className="container" style={{ textAlign:'center' }}>
          <div className="section-eyebrow">{cat.icon} Category</div>
          <h1 className="section-title">{cat.name} <span style={{fontStyle:'italic',color:'var(--gold)'}}>Recipes</span></h1>
          <p className="section-desc">{cat.desc}</p>
          <p style={{ marginTop:'12px', fontSize:'15px', color:'var(--gold)', fontWeight:600 }}>{recipes.length} recipes from 10 world cuisines</p>
        </div>
      </section>
      <section className="section" style={{ background:'var(--cream-dark)' }}>
        <div className="container">
          {recipes.length > 0 ? (
            <div className="recipes-grid">
              {recipes.map((r,i) => <div key={r.slug||i} className="fade-up" style={{animationDelay:`${i*50}ms`}}><RecipeCard recipe={r}/></div>)}
            </div>
          ) : (
            <div style={{textAlign:'center',padding:'80px',background:'var(--white)',borderRadius:'var(--r-xl)'}}>
              <div style={{fontSize:'64px',marginBottom:'16px'}}>{cat.icon}</div>
              <h3 style={{fontFamily:'var(--font-display)',fontSize:'28px'}}>Coming Soon!</h3>
              <p style={{color:'var(--text-muted)',marginTop:'12px'}}>AI is preparing {cat.name} recipes. Back in 30 min!</p>
            </div>
          )}
        </div>
      </section>
      <footer className="footer">
        <div className="container">
          <div className="footer-bottom">
            <Link href="/" style={{color:'var(--gold-light)',textDecoration:'none'}}>🍽️ FoodHive World</Link>
            <span>Auto-published every 30 min · 10 countries · 12 categories</span>
          </div>
        </div>
      </footer>
    </>
  )
}

export async function getStaticPaths() {
  return { paths: RECIPE_CATEGORIES.map(c=>({params:{category:c.id}})), fallback:false }
}
export async function getStaticProps({ params }) {
  const cat = RECIPE_CATEGORIES.find(c=>c.id===params.category)
  if (!cat) return { notFound:true }
  const recipes = getAllRecipes().filter(r=>r.category===params.category)
  return { props:{ cat, recipes }, revalidate:60 }
}
