// FoodHive World — Country Page — Image 2 exact style
import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { COUNTRIES, RECIPE_CATEGORIES, getCountryById, getAllRecipes, SAMPLE_RECIPE } from '../../lib/data'

function RecipeCard({ recipe }) {
  return (
    <Link href={`/recipes/${recipe.slug}`}>
      <div className="recipe-card">
        <div className="rc-img-wrap">
          <div className="rc-circle"><img src={recipe.image2||recipe.image1} alt={recipe.title} loading="lazy"/></div>
          <span className="rc-tag-cat">{recipe.categoryIcon}</span>
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

export default function CountryPage({ country, allCountryRecipes, recipesByCategory }) {
  const [activeCat, setActiveCat] = useState(null)
  if (!country) return null

  const displayed = activeCat ? (recipesByCategory[activeCat]||[]) : allCountryRecipes.slice(0,12)
  const catCount = id => (recipesByCategory[id]||[]).length

  return (<>
    <Head>
      <title>{country.flag} {country.name} Recipes — All 12 Categories | FoodHive World</title>
      <meta name="description" content={`Authentic ${country.name} cuisine: breakfast, lunch, dinner, desserts, appetizers, soups, pasta, vegetarian, seafood, chicken, beverages and baking.`}/>
      <link rel="canonical" href={`https://foodhive.vercel.app/countries/${country.id}`}/>
    </Head>

    {/* NAVBAR */}
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="logo">FoodHive <span>World</span></Link>
        <div className="nav-links">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/#countries" className="nav-link">Countries</Link>
          <Link href="/recipes" className="nav-link">All Recipes</Link>
        </div>
        <Link href="/#countries" className="nav-btn">← Countries</Link>
      </div>
    </nav>

    {/* HERO — Image 2 style */}
    <section className="cp-hero">
      <div className="cp-hero-inner container">
        {/* Breadcrumb */}
        <div style={{fontSize:13,color:'var(--gray)',marginBottom:20,display:'flex',gap:8,alignItems:'center'}}>
          <Link href="/" style={{color:'var(--gray)'}}>Home</Link>
          <span style={{color:'var(--gray-l)'}}>›</span>
          <Link href="/#countries" style={{color:'var(--gray)'}}>Countries</Link>
          <span style={{color:'var(--gray-l)'}}>›</span>
          <span style={{color:country.color,fontWeight:700}}>{country.name}</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:36,flexWrap:'wrap'}}>
          {/* Big flag circle */}
          <div style={{
            width:120,height:120,borderRadius:'50%',
            background:country.bgColor,border:`4px solid white`,
            boxShadow:'var(--sh-float)',display:'flex',alignItems:'center',
            justifyContent:'center',fontSize:60,flexShrink:0,
            animation:'rdMainFloat 4s ease-in-out infinite'
          }}>{country.flag}</div>
          <div className="fade-up">
            <div className="section-eyebrow" style={{color:country.color}}>{country.name} Cuisine</div>
            <h1 style={{fontFamily:'var(--font-title)',fontSize:'clamp(32px,5vw,58px)',fontWeight:700,color:'var(--dark)',letterSpacing:-.5,lineHeight:1.05,marginBottom:12}}>
              {country.name} <span style={{color:'var(--orange)',fontStyle:'italic'}}>Recipes</span>
            </h1>
            <p style={{fontSize:14,color:'var(--gray)',maxWidth:480,lineHeight:1.8,marginBottom:20}}>{country.desc}</p>
            <div style={{display:'flex',gap:28,flexWrap:'wrap'}}>
              {[{v:allCountryRecipes.length||'12+',l:'Recipes'},{v:'12',l:'Categories'},{v:'30m',l:'Updates'}].map(s=>(
                <div key={s.l}>
                  <div style={{fontFamily:'var(--font-title)',fontSize:26,fontWeight:700,color:country.color}}>{s.v}</div>
                  <div style={{fontSize:10,color:'var(--gray)',fontWeight:700,textTransform:'uppercase',letterSpacing:1}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* STICKY CATEGORY TABS */}
    <div className="cat-tabs">
      <div className="cat-tabs-scroll">
        <button className={`cat-tab${!activeCat?' active':''}`} onClick={()=>setActiveCat(null)}
          style={!activeCat?{background:country.color,borderColor:country.color}:{}}>
          🌐 All ({allCountryRecipes.length})
        </button>
        {RECIPE_CATEGORIES.map(cat=>(
          <button key={cat.id}
            className={`cat-tab${activeCat===cat.id?' active':''}`}
            style={activeCat===cat.id?{background:country.color,borderColor:country.color}:{}}
            onClick={()=>setActiveCat(cat.id===activeCat?null:cat.id)}>
            {cat.icon} {cat.name} ({catCount(cat.id)})
          </button>
        ))}
      </div>
    </div>

    {/* CATEGORY CARDS — Image 2 circular style (shown when no filter) */}
    {!activeCat && (
      <section className="section" style={{background:'var(--cream2)'}}>
        <div className="container">
          <div style={{marginBottom:48}} className="fade-up">
            <div className="section-eyebrow" style={{color:country.color}}>{country.flag} {country.name}</div>
            <h2 className="section-title">Choose a Category</h2>
          </div>
          <div className="cat-grid">
            {RECIPE_CATEGORIES.map((cat,i)=>(
              <div key={cat.id} className="cat-item fade-up" style={{animationDelay:`${i*45}ms`,borderTop:`3px solid ${country.color}`,cursor:'pointer'}} onClick={()=>setActiveCat(cat.id)}>
                {/* Circular food image placeholder — will show emoji if no image */}
                <div className="cat-circle" style={{borderColor:country.bgColor}}>
                  <div style={{width:'100%',height:'100%',background:country.bgColor,display:'flex',alignItems:'center',justifyContent:'center',fontSize:36}}>
                    {cat.icon}
                  </div>
                </div>
                <div className="cat-name">{cat.name}</div>
                <div className="cat-count" style={{color:country.color}}>
                  {catCount(cat.id)>0 ? `${catCount(cat.id)} recipes` : 'Coming soon →'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )}

    {/* RECIPE GRID */}
    {(activeCat || allCountryRecipes.length>0) && (
      <section className="section" style={{background:activeCat?'var(--cream2)':'var(--cream)'}}>
        <div className="container">
          {activeCat&&(
            <div style={{marginBottom:48}} className="fade-up">
              <div className="section-eyebrow" style={{color:country.color}}>{country.flag} {country.name}</div>
              <h2 className="section-title">{RECIPE_CATEGORIES.find(c=>c.id===activeCat)?.icon} {RECIPE_CATEGORIES.find(c=>c.id===activeCat)?.name}</h2>
            </div>
          )}
          {!activeCat&&allCountryRecipes.length>0&&(
            <div style={{marginBottom:48}} className="fade-up">
              <div className="section-eyebrow">Latest</div>
              <h2 className="section-title">Recent {country.name} Recipes</h2>
            </div>
          )}
          {displayed.length>0 ? (
            <div className="recipes-grid">
              {displayed.map((r,i)=>(
                <div key={r.slug||i} className="fade-up" style={{animationDelay:`${i*60}ms`}}><RecipeCard recipe={r}/></div>
              ))}
            </div>
          ) : (
            <div style={{textAlign:'center',padding:'80px 40px',background:'white',borderRadius:'var(--r-xl)',boxShadow:'var(--sh-soft)'}}>
              <div style={{fontSize:64,marginBottom:16}}>{country.flag}</div>
              <h3 style={{fontFamily:'var(--font-title)',fontSize:28,marginBottom:12}}>Coming Soon!</h3>
              <p style={{color:'var(--gray)'}}>AI is cooking {country.name} {RECIPE_CATEGORIES.find(c=>c.id===activeCat)?.name} recipes. Back in 30 min!</p>
            </div>
          )}
        </div>
      </section>
    )}

    {/* OTHER COUNTRIES */}
    <section className="section" style={{background:'var(--dark)'}}>
      <div className="container">
        <div style={{marginBottom:48,textAlign:'center'}} className="fade-up">
          <div className="section-eyebrow" style={{color:'var(--olive-l)'}}>Explore More</div>
          <h2 className="section-title" style={{color:'white'}}>Other Cuisines</h2>
        </div>
        <div style={{display:'flex',gap:12,flexWrap:'wrap',justifyContent:'center'}}>
          {COUNTRIES.filter(c=>c.id!==country.id).map(c=>(
            <Link key={c.id} href={`/countries/${c.id}`}>
              <div style={{
                background:'rgba(255,255,255,.06)',borderRadius:'var(--r-lg)',
                padding:'16px 22px',textAlign:'center',cursor:'pointer',minWidth:105,
                border:'1px solid rgba(197,212,160,.2)',transition:'all .2s',
              }}
                onMouseOver={e=>{e.currentTarget.style.background='rgba(232,135,58,.15)';e.currentTarget.style.transform='translateY(-3px)'}}
                onMouseOut={e=>{e.currentTarget.style.background='rgba(255,255,255,.06)';e.currentTarget.style.transform='none'}}
              >
                <div style={{fontSize:28}}>{c.flag}</div>
                <div style={{fontSize:12,fontWeight:700,color:'rgba(255,255,255,.75)',marginTop:5}}>{c.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    <footer className="footer">
      <div className="container">
        <div className="footer-bottom">
          <Link href="/" style={{color:'var(--olive-l)',textDecoration:'none'}}>🍽️ FoodHive World</Link>
          <span>10 Countries · 12 Categories · Updated Every 30 Min</span>
        </div>
      </div>
    </footer>
  </>)
}

export async function getStaticPaths() {
  return { paths: COUNTRIES.map(c=>({params:{country:c.id}})), fallback:false }
}
export async function getStaticProps({ params }) {
  const country = getCountryById(params.country)
  if (!country) return { notFound:true }
  const all = getAllRecipes()
  const countryRecipes = all.filter(r=>r.country===params.country)
  const byCategory = {}
  for (const cat of RECIPE_CATEGORIES) byCategory[cat.id] = countryRecipes.filter(r=>r.category===cat.id)
  return { props:{ country, allCountryRecipes:countryRecipes, recipesByCategory:byCategory }, revalidate:60 }
}
