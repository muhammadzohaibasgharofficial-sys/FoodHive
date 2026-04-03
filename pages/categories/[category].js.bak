// FoodHive World — Category Page — Image 2 style
import Head from 'next/head'
import Link from 'next/link'
import { RECIPE_CATEGORIES, getAllRecipes } from '../../lib/data'

function RecipeCard({ recipe }) {
  return (
    <Link href={`/recipes/${recipe.slug}`}>
      <div className="recipe-card">
        <div className="rc-img-wrap">
          <div className="rc-circle"><img src={recipe.image2||recipe.image1} alt={recipe.title} loading="lazy"/></div>
          <span className="rc-tag-country">{recipe.countryFlag} {recipe.countryName}</span>
        </div>
        <div className="rc-body">
          <h3 className="rc-title">{recipe.title}</h3>
          <p className="rc-desc">{recipe.description}</p>
          <div className="rc-meta">
            <span className="rc-stars">{'★'.repeat(Math.round(recipe.rating||5))}</span>
            <span className="rc-time">⏱ {recipe.totalTime}</span>
          </div>
          <div className="rc-btn">View Recipe →</div>
        </div>
      </div>
    </Link>
  )
}

export default function CategoryPage({ cat, recipes }) {
  if (!cat) return null
  return (<>
    <Head>
      <title>{cat.icon} {cat.name} Recipes from 10 Countries | FoodHive World</title>
      <meta name="description" content={`${cat.desc} From 10 world cuisines on FoodHive World.`}/>
      <link rel="canonical" href={`https://foodhive.vercel.app/categories/${cat.id}`}/>
    </Head>
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="logo">FoodHive <span>World</span></Link>
        <div className="nav-links">
          <Link href="/#countries" className="nav-link">Countries</Link>
          <Link href="/#categories" className="nav-link">Categories</Link>
          <Link href="/recipes" className="nav-link">All Recipes</Link>
        </div>
        <Link href="/#categories" className="nav-btn">← Categories</Link>
      </div>
    </nav>
    <section className="cp-hero">
      <div className="cp-hero-inner container">
        <div className="fade-up" style={{textAlign:'center',paddingTop:60,paddingBottom:60}}>
          <div className="section-eyebrow">{cat.icon} Category</div>
          <h1 className="section-title" style={{fontSize:'clamp(32px,5vw,60px)'}}>{cat.name} <span style={{color:'var(--orange)',fontStyle:'italic'}}>Recipes</span></h1>
          <p className="section-desc" style={{margin:'0 auto',textAlign:'center'}}>{cat.desc}</p>
          <p style={{marginTop:12,fontSize:14,color:'var(--orange)',fontWeight:700}}>{recipes.length} recipes from 10 world cuisines</p>
        </div>
      </div>
    </section>
    <section className="section" style={{background:'var(--cream2)'}}>
      <div className="container">
        {recipes.length>0 ? (
          <div className="recipes-grid">
            {recipes.map((r,i)=><div key={r.slug||i} className="fade-up" style={{animationDelay:`${i*50}ms`}}><RecipeCard recipe={r}/></div>)}
          </div>
        ) : (
          <div style={{textAlign:'center',padding:'80px 40px',background:'white',borderRadius:'var(--r-xl)',boxShadow:'var(--sh-soft)'}}>
            <div style={{fontSize:64,marginBottom:16}}>{cat.icon}</div>
            <h3 style={{fontFamily:'var(--font-title)',fontSize:28,marginBottom:12}}>Coming Soon!</h3>
            <p style={{color:'var(--gray)'}}>AI is preparing {cat.name} recipes. Back in 30 min!</p>
          </div>
        )}
      </div>
    </section>
    <footer className="footer">
      <div className="container">
        <div className="footer-bottom">
          <Link href="/" style={{color:'var(--olive-l)',textDecoration:'none'}}>🍽️ FoodHive World</Link>
          <span>Auto-published every 30 min · 10 countries · 12 categories</span>
        </div>
      </div>
    </footer>
  </>)
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
