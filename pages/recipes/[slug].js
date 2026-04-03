// ============================================================
// FoodHive World — Recipe Detail [slug].js
// Premium design: circle orbit, ingredients, steps, nutrition
// FoodHive World watermark on every post
// ============================================================
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { getRecipeBySlug, getAllRecipeSlugs, getAllRecipes, RECIPE_CATEGORIES, COUNTRIES, SAMPLE_RECIPE } from '../../lib/data'

// Related orbit positions
const RELATED_POS = [
  { top: '2%',  left: '50%', size: 88, tx: '-50%' },
  { top: '24%', left: '90%', size: 72, tx: '0' },
  { top: '70%', left: '84%', size: 78, tx: '0' },
  { top: '74%', left: '10%', size: 72, tx: '0' },
  { top: '24%', left: '2%',  size: 80, tx: '0' },
]

export default function RecipeDetail({ recipe, relatedRecipes }) {
  const [servings, setServings] = useState(recipe?.servings || 4)
  const [activeTab, setActiveTab] = useState('ingredients')

  useEffect(() => { window.scrollTo(0,0) }, [recipe?.slug])

  if (!recipe) return (
    <div style={{ padding:'100px 24px', textAlign:'center', minHeight:'100vh', background:'var(--cream)' }}>
      <div style={{ fontSize:'64px', marginBottom:'16px' }}>🍽️</div>
      <h1 style={{ fontFamily:'var(--font-display)', fontSize:'48px', marginBottom:'16px' }}>Recipe Not Found</h1>
      <Link href="/recipes" className="btn-primary">← Browse All Recipes</Link>
    </div>
  )

  const mult = servings / (recipe.servings || 4)
  const country = COUNTRIES.find(c => c.id === recipe.country)
  const scaleAmount = (amt) => {
    const num = parseFloat(amt)
    if (isNaN(num)) return amt
    const scaled = (num * mult).toFixed(num % 1 !== 0 ? 1 : 0)
    return amt.replace(/[\d.]+/, scaled)
  }

  return (
    <>
      <Head>
        <title>{recipe.title} — {recipe.countryName} {recipe.categoryName} | FoodHive World</title>
        <meta name="description" content={`${recipe.description} | Authentic ${recipe.countryName} recipe on FoodHive World.`} />
        <meta property="og:title" content={`${recipe.title} | FoodHive World`} />
        <meta property="og:description" content={recipe.description} />
        <meta property="og:image" content={recipe.image1} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`https://foodhive.vercel.app/recipes/${recipe.slug}`} />
        {/* Recipe Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context":"https://schema.org",
          "@type":"Recipe",
          "name": recipe.title,
          "description": recipe.description,
          "image": [recipe.image1, recipe.image2].filter(Boolean),
          "author": { "@type":"Organization", "name":"FoodHive World" },
          "datePublished": recipe.publishedAt,
          "prepTime": `PT${recipe.prepTime?.replace(/\D/g,'')}M`,
          "cookTime": `PT${recipe.cookTime?.replace(/\D/g,'')}M`,
          "totalTime": `PT${recipe.totalTime?.replace(/\D/g,'')}M`,
          "recipeYield": `${recipe.servings} servings`,
          "recipeCategory": recipe.categoryName,
          "recipeCuisine": recipe.cuisine,
          "keywords": (recipe.tags||[]).join(', '),
          "aggregateRating": { "@type":"AggregateRating", "ratingValue": recipe.rating, "reviewCount": recipe.reviews },
          "nutrition": {
            "@type":"NutritionInformation",
            "calories": recipe.nutritionTable?.calories,
            "proteinContent": recipe.nutritionTable?.protein,
            "carbohydrateContent": recipe.nutritionTable?.carbs,
            "fatContent": recipe.nutritionTable?.fat,
          },
          "recipeIngredient": (recipe.ingredients||[]).map(i=>`${i.amount} ${i.item}`),
          "recipeInstructions": (recipe.instructions||[]).map(s=>({ "@type":"HowToStep", "name":s.title, "text":s.text })),
        })}} />
      </Head>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="logo">🍽️ FoodHive <span className="logo-badge">WORLD</span></Link>
          <div className="nav-links">
            <Link href="/#countries" className="nav-link">Countries</Link>
            {recipe.country && <Link href={`/countries/${recipe.country}`} className="nav-link">{recipe.countryFlag} {recipe.countryName}</Link>}
            <Link href="/recipes" className="nav-link">All Recipes</Link>
          </div>
          <Link href={recipe.country ? `/countries/${recipe.country}` : '/recipes'} className="btn-secondary" style={{ fontSize:'13px', padding:'10px 22px' }}>
            ← {recipe.countryName || 'All'} Recipes
          </Link>
        </div>
      </nav>

      {/* RECIPE HERO */}
      <section className="recipe-hero">
        <div className="container">
          <div className="recipe-hero-inner">
            {/* Left */}
            <div className="recipe-hero-left fade-up">
              {/* Breadcrumb */}
              <div className="recipe-breadcrumb">
                <Link href="/">Home</Link>
                <span className="recipe-breadcrumb-sep">›</span>
                {recipe.country && <><Link href={`/countries/${recipe.country}`}>{recipe.countryFlag} {recipe.countryName}</Link><span className="recipe-breadcrumb-sep">›</span></>}
                <span style={{ color:'var(--gold)', fontWeight:700 }}>{recipe.title}</span>
              </div>

              {/* Tags */}
              <div className="recipe-hero-tags">
                {country && <span className="recipe-hero-tag" style={{ background: country.bgColor, color: country.color }}>{recipe.countryFlag} {recipe.countryName}</span>}
                <span className="recipe-hero-tag" style={{ background:'rgba(200,132,42,0.1)', color:'var(--gold)' }}>{recipe.categoryIcon} {recipe.categoryName}</span>
                <span className="recipe-hero-tag" style={{ background:'var(--cream-dark)', color:'var(--text-muted)' }}>⚡ {recipe.difficulty}</span>
                {/* WEBSITE WATERMARK on every post */}
                <span className="site-watermark">🍽️ FoodHive World</span>
              </div>

              <h1 className="recipe-hero-title">{recipe.title}</h1>
              <p className="recipe-hero-desc">{recipe.description}</p>

              {/* Quick stats */}
              <div className="recipe-quick-stats">
                {[
                  { val: recipe.prepTime,  label: 'Prep' },
                  { val: recipe.cookTime,  label: 'Cook' },
                  { val: recipe.totalTime, label: 'Total' },
                  { val: recipe.servings + ' ppl', label: 'Serves' },
                ].map(s => (
                  <div key={s.label} className="recipe-stat">
                    <div className="recipe-stat-val">{s.val}</div>
                    <div className="recipe-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Rating */}
              <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'24px' }}>
                <div style={{ display:'flex', gap:'4px' }}>
                  {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize:'20px', color: s<=Math.round(recipe.rating) ? 'var(--gold)' : 'var(--beige)' }}>★</span>)}
                </div>
                <span style={{ fontFamily:'var(--font-display)', fontSize:'22px', fontWeight:700, color:'var(--gold)' }}>{recipe.rating}</span>
                <span style={{ fontSize:'14px', color:'var(--text-muted)' }}>({recipe.reviews} reviews)</span>
              </div>
            </div>

            {/* Right — orbit of related recipes */}
            <div className="recipe-orbit">
              <div className="recipe-orbit-ring" style={{ width:420, height:420 }} />
              {/* Center = current recipe */}
              <div className="recipe-orbit-center">
                <img src={recipe.image1} alt={recipe.title} />
              </div>
              {/* Related recipe satellites */}
              {RELATED_POS.map((pos, i) => {
                const rel = relatedRecipes[i]
                if (!rel) return null
                return (
                  <Link key={i} href={`/recipes/${rel.slug}`}>
                    <div className="recipe-orbit-item" style={{
                      top: pos.top, left: pos.left,
                      width: pos.size, height: pos.size,
                      transform: `translateX(${pos.tx})`,
                      animation: `orbitFloat ${3.5 + i*0.3}s ease-in-out ${i*0.3}s infinite`,
                    }} title={rel.title}>
                      <img src={rel.image2 || rel.image1} alt={rel.title} loading="lazy" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* RECIPE BODY */}
      <section className="recipe-body section">
        <div className="container">
          <div className="recipe-body-grid">
            {/* SIDEBAR */}
            <div className="recipe-sidebar">
              {/* Servings control */}
              <div className="recipe-card-box">
                <div className="recipe-box-title">🍽️ Servings</div>
                <div className="servings-control">
                  <button className="servings-btn" onClick={() => setServings(Math.max(1, servings-1))}>−</button>
                  <span className="servings-num">{servings}</span>
                  <button className="servings-btn" onClick={() => setServings(servings+1)}>+</button>
                  <span style={{ fontSize:'13px', color:'var(--text-muted)', marginLeft:'4px' }}>people</span>
                </div>

                {/* Ingredients */}
                <div className="recipe-box-title" style={{ marginTop:'8px' }}>🥘 Ingredients</div>
                {(recipe.ingredients || []).map((ing, i) => (
                  <div key={i} className="ingredient-row">
                    <div className="ingredient-dot" />
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', gap:'8px', alignItems:'baseline' }}>
                        <span className="ingredient-amount">{scaleAmount(ing.amount)}</span>
                        <span className="ingredient-name">{ing.item}</span>
                      </div>
                      {ing.notes && <div className="ingredient-note">{ing.notes}</div>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chef Tips */}
              {recipe.tips && recipe.tips.length > 0 && (
                <div className="recipe-card-box">
                  <div className="recipe-box-title">💡 Chef Tips</div>
                  {recipe.tips.map((tip, i) => (
                    <div key={i} className="tip-item">
                      <span className="tip-icon">✨</span>
                      <span className="tip-text">{tip}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* MAIN CONTENT */}
            <div>
              {/* Tab switcher */}
              <div style={{ display:'flex', gap:'8px', marginBottom:'40px' }}>
                {[
                  { id:'instructions', label:'👨‍🍳 Instructions' },
                  { id:'nutrition',    label:'📊 Nutrition' },
                  { id:'article',      label:'📖 About' },
                ].map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                    padding:'12px 24px', borderRadius:'var(--r-full)',
                    border:'1.5px solid', fontWeight:700, fontSize:'14px', cursor:'pointer',
                    transition:'all 0.2s',
                    borderColor: activeTab===t.id ? 'var(--gold)' : 'var(--beige)',
                    background: activeTab===t.id ? 'var(--gold)' : 'transparent',
                    color: activeTab===t.id ? 'white' : 'var(--text)',
                  }}>{t.label}</button>
                ))}
              </div>

              {/* INSTRUCTIONS */}
              {activeTab==='instructions' && (
                <div className="recipe-card-box">
                  <div className="recipe-box-title">Step by Step</div>
                  {(recipe.instructions || []).map((step, i) => (
                    <div key={i} className="step-item">
                      <div className="step-num-wrap">
                        <div className="step-num">{step.step}</div>
                      </div>
                      <div style={{ flex:1 }}>
                        <div className="step-title">{step.title}</div>
                        <div className="step-text">{step.text}</div>
                        {step.time && <div className="step-time">⏱ {step.time}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* NUTRITION */}
              {activeTab==='nutrition' && recipe.nutritionTable && (
                <div className="recipe-card-box">
                  <div className="recipe-box-title">📊 Nutrition per Serving</div>
                  <div className="nutrition-grid">
                    {Object.entries(recipe.nutritionTable).map(([k, v]) => (
                      <div key={k} className="nutrition-item">
                        <div className="nutrition-val">{v}</div>
                        <div className="nutrition-label">{k}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ARTICLE */}
              {activeTab==='article' && recipe.article && (
                <div className="recipe-card-box">
                  <div
                    className="article-body"
                    dangerouslySetInnerHTML={{ __html: recipe.article
                      .replace(/## (.+)/g, '<h2>$1</h2>')
                      .replace(/\n\n/g, '</p><p>')
                      .replace(/^/, '<p>')
                      .replace(/$/, '</p>')
                    }}
                  />
                </div>
              )}

              {/* Tags */}
              {recipe.tags && (
                <div style={{ marginTop:'32px' }}>
                  <div style={{ fontSize:'12px', fontWeight:700, color:'var(--text-muted)', letterSpacing:'1px', textTransform:'uppercase', marginBottom:'12px' }}>Tags</div>
                  <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                    {recipe.tags.map(t => (
                      <span key={t} style={{
                        background:'var(--cream-dark)', color:'var(--text-muted)',
                        fontSize:'12px', fontWeight:600, padding:'6px 14px',
                        borderRadius:'var(--r-full)', border:'1px solid var(--beige)'
                      }}>#{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* RELATED RECIPES */}
      {relatedRecipes.length > 0 && (
        <section className="section" style={{ background:'var(--cream-dark)' }}>
          <div className="container">
            <div className="section-header fade-up">
              <div className="section-eyebrow">{recipe.countryFlag} More {recipe.countryName}</div>
              <h2 className="section-title">You Might <em>Also Like</em></h2>
            </div>
            <div className="recipes-grid">
              {relatedRecipes.slice(0,3).map((r,i) => (
                <Link key={r.slug||i} href={`/recipes/${r.slug}`}>
                  <div className="recipe-card fade-up" style={{ animationDelay:`${i*80}ms` }}>
                    <div className="recipe-card-top">
                      <img src={r.image1} alt={r.title} loading="lazy" />
                      <div className="recipe-card-top-overlay"/>
                      <div className="recipe-card-badges">
                        <span className="recipe-badge-cat">{r.categoryIcon} {r.categoryName}</span>
                      </div>
                    </div>
                    <div className="recipe-card-circle">
                      <img className="recipe-card-circle-img" src={r.image2||r.image1} alt={r.title} loading="lazy"/>
                    </div>
                    <div className="recipe-card-body">
                      <h3 className="recipe-card-title">{r.title}</h3>
                      <div className="recipe-card-footer">
                        <div className="recipe-rating">⭐ {r.rating}</div>
                        <span className="recipe-view-btn">View →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">🍽️ FoodHive World</div>
              <p className="footer-desc">Authentic recipes from 10 world cuisines. AI-published every 30 minutes.</p>
            </div>
            <div>
              <div className="footer-col-title">Countries</div>
              {COUNTRIES.slice(0,5).map(c=>(
                <Link key={c.id} href={`/countries/${c.id}`} className="footer-link">{c.flag} {c.name}</Link>
              ))}
            </div>
            <div>
              <div className="footer-col-title">More</div>
              {COUNTRIES.slice(5).map(c=>(
                <Link key={c.id} href={`/countries/${c.id}`} className="footer-link">{c.flag} {c.name}</Link>
              ))}
            </div>
            <div>
              <div className="footer-col-title">Categories</div>
              {RECIPE_CATEGORIES.slice(0,6).map(c=>(
                <Link key={c.id} href={`/categories/${c.id}`} className="footer-link">{c.icon} {c.name}</Link>
              ))}
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 FoodHive World</span>
            <span>10 Countries · 12 Categories · Updated Every 30 Min</span>
          </div>
        </div>
      </footer>
    </>
  )
}

export async function getStaticPaths() {
  const slugs = getAllRecipeSlugs()
  return { paths: slugs, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  let recipe = getRecipeBySlug(params.slug)
  if (!recipe) recipe = SAMPLE_RECIPE

  // Related: same country, different recipe
  const all = getAllRecipes()
  const related = all.filter(r => r.slug !== recipe.slug && r.country === recipe.country).slice(0, 5)

  return { props: { recipe, relatedRecipes: related }, revalidate: 60 }
}
