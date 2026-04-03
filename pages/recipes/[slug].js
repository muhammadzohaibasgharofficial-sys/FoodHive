// FoodHive World — Recipe Detail — Image exact clone
// Cream left / taupe blob right, circular orbit of related recipes
// Orange price tag, "Add to Cart" CTA button, Breakfast|Lunch|Dinner mini nav
import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getRecipeBySlug, getAllRecipeSlugs, getAllRecipes, RECIPE_CATEGORIES, COUNTRIES, SAMPLE_RECIPE } from '../../lib/data'

// Orbit positions — 5 satellites exactly like image
const SAT_POS = [
  { top:'2%',  left:'50%', size:86, tx:'-50%', delay:'0s'   },
  { top:'22%', left:'88%', size:72, tx:'0',     delay:'.3s'  },
  { top:'68%', left:'82%', size:78, tx:'0',     delay:'.6s'  },
  { top:'72%', left:'14%', size:72, tx:'0',     delay:'.9s'  },
  { top:'22%', left:'4%',  size:80, tx:'0',     delay:'1.2s' },
]

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
          <div className="rc-meta">
            <span className="rc-stars">{'★'.repeat(Math.round(recipe.rating||5))}</span>
            <span className="rc-time">⏱ {recipe.totalTime}</span>
          </div>
          <div className="rc-btn">View →</div>
        </div>
      </div>
    </Link>
  )
}

export default function RecipeDetail({ recipe, relatedRecipes }) {
  const [servings, setServings] = useState(recipe?.servings||4)
  const [activeTab, setActiveTab] = useState('instructions')
  const [activeMiniTab, setActiveMiniTab] = useState(recipe?.category||'breakfast')
  const bodyRef = useRef(null)
  const router = useRouter()

  useEffect(() => { window.scrollTo(0,0) }, [recipe?.slug])

  useEffect(() => {
    const bar = document.querySelector('.scroll-bar')
    if (!bar) return
    const fn = () => { bar.style.width=(window.scrollY/(document.body.scrollHeight-window.innerHeight)*100)+'%' }
    window.addEventListener('scroll',fn,{passive:true})
    return ()=>window.removeEventListener('scroll',fn)
  },[])

  if (!recipe) return (
    <div style={{padding:'100px 24px',textAlign:'center',minHeight:'100vh',background:'var(--cream)'}}>
      <div style={{fontSize:64,marginBottom:16}}>🍽️</div>
      <h1 style={{fontFamily:'var(--font-title)',fontSize:48,marginBottom:16}}>Recipe Not Found</h1>
      <Link href="/recipes" className="btn-order">← Browse All Recipes</Link>
    </div>
  )

  const mult = servings/(recipe.servings||4)
  const scaleAmt = amt => {
    const n = parseFloat(amt)
    if (isNaN(n)) return amt
    return amt.replace(/[\d.]+/, (n*mult).toFixed(n%1!==0?1:0))
  }

  const country = COUNTRIES.find(c=>c.id===recipe.country)
  const miniTabs = ['breakfast','lunch','dinner']

  // Price: use recipe calories or fallback to static for display
  const displayPrice = recipe.price || `$${Math.floor(Math.random()*20+12)}`

  return (<>
    <Head>
      <title>{recipe.title} — {recipe.countryName} {recipe.categoryName} | FoodHive World</title>
      <meta name="description" content={`${recipe.description} Authentic ${recipe.countryName} recipe on FoodHive World.`}/>
      <meta property="og:title" content={`${recipe.title} | FoodHive World`}/>
      <meta property="og:description" content={recipe.description}/>
      <meta property="og:image" content={recipe.image1}/>
      <meta property="og:type" content="article"/>
      <link rel="canonical" href={`https://foodhive.vercel.app/recipes/${recipe.slug}`}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({
        "@context":"https://schema.org","@type":"Recipe",
        "name":recipe.title,"description":recipe.description,
        "image":[recipe.image1,recipe.image2].filter(Boolean),
        "author":{"@type":"Organization","name":"FoodHive World"},
        "datePublished":recipe.publishedAt,
        "prepTime":`PT${(recipe.prepTime||'15 min').replace(/\D/g,'')}M`,
        "cookTime":`PT${(recipe.cookTime||'30 min').replace(/\D/g,'')}M`,
        "totalTime":`PT${(recipe.totalTime||'45 min').replace(/\D/g,'')}M`,
        "recipeYield":`${recipe.servings} servings`,
        "recipeCategory":recipe.categoryName,"recipeCuisine":recipe.cuisine,
        "keywords":(recipe.tags||[]).join(', '),
        "aggregateRating":{"@type":"AggregateRating","ratingValue":recipe.rating,"reviewCount":recipe.reviews},
        "nutrition":{"@type":"NutritionInformation","calories":recipe.nutritionTable?.calories,"proteinContent":recipe.nutritionTable?.protein,"carbohydrateContent":recipe.nutritionTable?.carbs,"fatContent":recipe.nutritionTable?.fat},
        "recipeIngredient":(recipe.ingredients||[]).map(i=>`${i.amount} ${i.item}`),
        "recipeInstructions":(recipe.instructions||[]).map(s=>({"@type":"HowToStep","name":s.title,"text":s.text}))
      })}}/>
    </Head>

    <div className="scroll-bar"/>

    {/* NAVBAR — exact image style: back arrow circle + Breakfast|Lunch|Dinner + cart icon */}
    <nav className="navbar">
      <div className="navbar-inner">
        <button className="rd-back" onClick={()=>router.back()}>←</button>
        <div className="rd-mini-nav">
          {miniTabs.map(t=>(
            <button key={t} className={`rd-mini-link${activeMiniTab===t?' active':''}`}
              onClick={()=>setActiveMiniTab(t)}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>
        <div className="rd-cart" title="Save Recipe">🛍️</div>
      </div>
    </nav>

    {/* RECIPE HERO — cream left + taupe blob right — exact image clone */}
    <section className="rd-hero">
      <div className="rd-hero-blob"/>
      <div className="rd-hero-inner">

        {/* LEFT — price, title, desc, stats, "Add to Cart" CTA */}
        <div className="fade-up">

          {/* Orange price — exactly like image "$32" */}
          <div className="rd-price">{displayPrice}</div>

          {/* Title — big Caveat font like image */}
          <h1 className="rd-title">{recipe.title}</h1>
          <p className="rd-desc">{recipe.description}</p>

          {/* Rating row */}
          <div className="rd-rating-row">
            <span className="rd-stars">{'★'.repeat(Math.round(recipe.rating||5))}</span>
            <span className="rd-rating-num">{recipe.rating}</span>
            <span className="rd-rating-cnt">({recipe.reviews} reviews)</span>
          </div>

          {/* Quick stats */}
          <div className="rd-stats">
            {[{v:recipe.prepTime,l:'Prep'},{v:recipe.cookTime,l:'Cook'},{v:recipe.totalTime,l:'Total'},{v:recipe.servings+' ppl',l:'Serves'}].map(s=>(
              <div key={s.l} className="rd-stat"><div className="rd-stat-val">{s.v}</div><div className="rd-stat-lbl">{s.l}</div></div>
            ))}
          </div>

          {/* "Add to Cart" button — exact orange pill button from image */}
          <button className="rd-add-to-cart" onClick={()=>bodyRef.current?.scrollIntoView({behavior:'smooth'})}>
            Add to Cart
          </button>

          {/* Scroll down indicator — image shows down arrow */}
          <div style={{display:'flex',gap:10,marginTop:28,alignItems:'center',color:'var(--gray-l)',fontSize:12,fontWeight:600}}>
            <div className="rd-arrow" onClick={()=>bodyRef.current?.scrollIntoView({behavior:'smooth'})}>↓</div>
            <span>Scroll for full recipe</span>
          </div>
        </div>

        {/* RIGHT — Circular orbit — main image center + 5 satellite related recipe images */}
        <div className="rd-orbit">
          {/* Dashed orbit ring */}
          <div className="rd-orbit-ring" style={{width:400,height:400}}/>
          {/* Center main recipe image */}
          <div className="rd-orbit-main" style={{width:260,height:260}}>
            <img src={recipe.image1} alt={recipe.title}/>
          </div>
          {/* 5 Satellite related recipe circular images */}
          {relatedRecipes.slice(0,5).map((r,i)=>{
            const p = SAT_POS[i]
            return (
              <Link key={r.slug||i} href={`/recipes/${r.slug}`}>
                <div className="rd-sat" style={{
                  top:p.top,left:p.left,
                  width:p.size,height:p.size,
                  transform:`translate(${p.tx},-50%)`,
                  animationDelay:p.delay
                }}>
                  <img src={r.image2||r.image1} alt={r.title}/>
                </div>
              </Link>
            )
          })}
        </div>

      </div>
    </section>

    {/* RECIPE BODY — scroll down */}
    <section className="rd-body section" ref={bodyRef}>
      <div className="container">
        <div className="rd-body-grid">

          {/* SIDEBAR — ingredients + servings + tips */}
          <div className="rd-sidebar-card">
            <div className="rd-box-head">🥘 Ingredients</div>
            <div className="serv-row">
              <button className="serv-btn" onClick={()=>setServings(Math.max(1,servings-1))}>−</button>
              <span className="serv-num">{servings}</span>
              <button className="serv-btn" onClick={()=>setServings(servings+1)}>+</button>
              <span style={{fontSize:12,color:'var(--gray)',marginLeft:4}}>servings</span>
            </div>
            {(recipe.ingredients||[]).map((ing,i)=>(
              <div key={i} className="ing-row">
                <div className="ing-dot"/>
                <div style={{flex:1}}>
                  <div style={{display:'flex',gap:8,alignItems:'baseline'}}>
                    <span className="ing-amt">{scaleAmt(ing.amount)}</span>
                    <span className="ing-name">{ing.item}</span>
                  </div>
                  {ing.notes&&<div className="ing-note">{ing.notes}</div>}
                </div>
              </div>
            ))}

            {recipe.tips?.length>0&&(<>
              <div className="rd-box-head" style={{marginTop:28}}>💡 Chef Tips</div>
              {recipe.tips.map((tip,i)=>(
                <div key={i} className="tip-row">
                  <span className="tip-icon">✨</span>
                  <span className="tip-text">{tip}</span>
                </div>
              ))}
            </>)}
          </div>

          {/* MAIN CONTENT */}
          <div>
            <div className="tab-row">
              {[
                {id:'instructions',label:'👨‍🍳 Instructions'},
                {id:'nutrition',   label:'📊 Nutrition'},
                {id:'article',     label:'📖 About'},
              ].map(t=>(
                <button key={t.id} className={`tab-btn${activeTab===t.id?' active':''}`} onClick={()=>setActiveTab(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>

            {activeTab==='instructions'&&(
              <div style={{background:'white',borderRadius:'var(--r-xl)',padding:28,boxShadow:'var(--sh-soft)'}}>
                <div className="rd-box-head">Step by Step</div>
                {(recipe.instructions||[]).map((step,i)=>(
                  <div key={i} className="step-row">
                    <div className="step-num-circle">{step.step}</div>
                    <div style={{flex:1}}>
                      <div className="step-title">{step.title}</div>
                      <div className="step-text">{step.text}</div>
                      {step.time&&<div className="step-time">⏱ {step.time}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab==='nutrition'&&recipe.nutritionTable&&(
              <div style={{background:'white',borderRadius:'var(--r-xl)',padding:28,boxShadow:'var(--sh-soft)'}}>
                <div className="rd-box-head">📊 Nutrition per Serving</div>
                <div className="nutr-grid">
                  {Object.entries(recipe.nutritionTable).map(([k,v])=>(
                    <div key={k} className="nutr-cell">
                      <div className="nutr-val">{v}</div>
                      <div className="nutr-lbl">{k}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab==='article'&&recipe.article&&(
              <div style={{background:'white',borderRadius:'var(--r-xl)',padding:28,boxShadow:'var(--sh-soft)'}}>
                <div className="article-body" dangerouslySetInnerHTML={{__html:
                  recipe.article
                    .replace(/## (.+)/g,'<h2>$1</h2>')
                    .replace(/\n\n/g,'</p><p>')
                    .replace(/^/,'<p>').replace(/$/,'</p>')
                }}/>
              </div>
            )}

            {recipe.tags&&(
              <div style={{marginTop:28}}>
                <div style={{fontSize:11,fontWeight:700,color:'var(--gray)',letterSpacing:1,textTransform:'uppercase',marginBottom:10}}>Tags</div>
                <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                  {recipe.tags.map(t=>(
                    <span key={t} style={{background:'var(--cream2)',color:'var(--gray)',fontSize:12,fontWeight:600,padding:'6px 14px',borderRadius:'var(--r-full)',border:'1px solid var(--cream3)'}}>{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>

    {/* RELATED RECIPES */}
    {relatedRecipes.length>0&&(
      <section className="section" style={{background:'var(--cream2)'}}>
        <div className="container">
          <div style={{marginBottom:48}} className="fade-up">
            <div className="section-eyebrow">{recipe.countryFlag} More {recipe.countryName}</div>
            <h2 className="section-title">You Might Also Like</h2>
          </div>
          <div className="recipes-grid">
            {relatedRecipes.slice(0,3).map((r,i)=>(
              <div key={r.slug||i} className="fade-up" style={{animationDelay:`${i*80}ms`}}><RecipeCard recipe={r}/></div>
            ))}
          </div>
        </div>
      </section>
    )}

    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo-txt">🍽️ FoodHive World</div>
            <p className="footer-desc">Authentic recipes from 10 world cuisines, auto-published every 30 minutes.</p>
          </div>
          <div>
            <div className="footer-col-title">Countries</div>
            {COUNTRIES.slice(0,5).map(c=><Link key={c.id} href={`/countries/${c.id}`} className="footer-link">{c.flag} {c.name}</Link>)}
          </div>
          <div>
            <div className="footer-col-title">More</div>
            {COUNTRIES.slice(5).map(c=><Link key={c.id} href={`/countries/${c.id}`} className="footer-link">{c.flag} {c.name}</Link>)}
          </div>
          <div>
            <div className="footer-col-title">Categories</div>
            {RECIPE_CATEGORIES.slice(0,6).map(c=><Link key={c.id} href={`/categories/${c.id}`} className="footer-link">{c.icon} {c.name}</Link>)}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 FoodHive World</span>
          <span>10 Countries · 12 Categories · Updated Every 30 Min</span>
        </div>
      </div>
    </footer>
  </>)
}

export async function getStaticPaths() {
  return { paths: getAllRecipeSlugs(), fallback:'blocking' }
}
export async function getStaticProps({ params }) {
  let recipe = getRecipeBySlug(params.slug)
  if (!recipe) recipe = SAMPLE_RECIPE
  const all = getAllRecipes()
  const related = all.filter(r=>r.slug!==recipe.slug&&r.country===recipe.country).slice(0,5)
  return { props:{ recipe, relatedRecipes:related }, revalidate:60 }
}
