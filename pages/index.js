// FoodHive World — Homepage — Image 1 exact style
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { COUNTRIES, RECIPE_CATEGORIES, getAllRecipes, SAMPLE_RECIPE } from '../lib/data'

function RecipeCard({ recipe }) {
  const ings = recipe.ingredients?.slice(0,3).map(i=>i.item) || []
  return (
    <Link href={`/recipes/${recipe.slug}`}>
      <div className="recipe-card">
        <div className="rc-img-wrap">
          <div className="rc-circle">
            <img src={recipe.image2||recipe.image1} alt={recipe.title} loading="lazy"/>
          </div>
          <span className="rc-tag-cat">{recipe.categoryIcon} {recipe.categoryName}</span>
          <span className="rc-tag-country">{recipe.countryFlag} {recipe.countryName}</span>
        </div>
        <div className="rc-body">
          <h3 className="rc-title">{recipe.title}</h3>
          <p className="rc-desc">{recipe.description}</p>
          {ings.length>0&&<div className="rc-ings">{ings.map((g,i)=><span key={i} className="rc-ing-tag">{g}</span>)}</div>}
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

export default function HomePage({ latestRecipes, recipesByCountry }) {
  const [searchQ, setSearchQ] = useState('')
  useEffect(() => {
    const bar = document.querySelector('.scroll-bar')
    if (!bar) return
    const fn = () => { bar.style.width = (window.scrollY/(document.body.scrollHeight-window.innerHeight)*100)+'%' }
    window.addEventListener('scroll',fn,{passive:true})
    return ()=>window.removeEventListener('scroll',fn)
  },[])
  const handleSearch = e => { e.preventDefault(); if(searchQ.trim()) window.location.href=`/search?q=${encodeURIComponent(searchQ)}` }
  const heroImg = latestRecipes[0]?.image1||'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'

  return (<>
    <Head>
      <title>FoodHive World — Authentic Recipes from 10 Countries</title>
      <meta name="description" content="Explore authentic recipes from 10 world cuisines. New recipes every 30 minutes."/>
      <link rel="canonical" href="https://foodhive.vercel.app"/>
    </Head>
    <div className="scroll-bar"/>

    {/* NAVBAR */}
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="logo">FoodHive <span>World</span></Link>
        <div className="nav-links">
          <Link href="/#countries" className="nav-link">Countries</Link>
          <Link href="/#categories" className="nav-link">Categories</Link>
          <Link href="/recipes" className="nav-link">All Recipes</Link>
        </div>
        <form onSubmit={handleSearch}>
          <div className="nav-search">
            <span style={{fontSize:15,opacity:.5}}>🔍</span>
            <input type="text" placeholder="Search recipes..." value={searchQ} onChange={e=>setSearchQ(e.target.value)}/>
          </div>
        </form>
        <Link href="/#countries" className="nav-btn">Explore →</Link>
      </div>
    </nav>

    {/* HERO */}
    <section className="hero">
      <div className="hero-inner">
        <div className="fade-up">
          <div className="hero-eyebrow">🍽️ Updated Every 30 Minutes · 10 Countries</div>
          <h1 className="hero-title">Discover<br/><em>World</em><br/>Recipes</h1>
          <p className="hero-desc">Authentic recipes from 10 cuisines — Asian, European, Chinese, Korean, Indian, Mexican, Japanese, Italian, Middle Eastern & American. 12 categories, AI-crafted.</p>
          <div className="hero-cta-row">
            <Link href="/#countries" className="btn-order">🌍 Explore Countries</Link>
            <Link href="/recipes" className="btn-outline">All Recipes →</Link>
          </div>
          <div className="hero-stats">
            {[{n:'10',l:'Cuisines'},{n:'12',l:'Categories'},{n:'30m',l:'Updates'},{n:'1200+',l:'Recipes'}].map(s=>(
              <div key={s.l}><div className="hero-stat-num">{s.n}</div><div className="hero-stat-label">{s.l}</div></div>
            ))}
          </div>
        </div>
        <div className="hero-right scale-in">
          <div className="hero-img-circle"><img src={heroImg} alt="World Cuisine"/></div>
          {latestRecipes[0]&&(
            <div className="hero-float-badge">
              <span className="badge-icon">🔥</span>
              <div>
                <div style={{fontSize:10,color:'var(--gray)',fontWeight:600,textTransform:'uppercase',letterSpacing:1}}>Latest</div>
                <div style={{fontSize:13,fontWeight:700,color:'var(--dark)',maxWidth:140,lineHeight:1.3}}>{latestRecipes[0].title}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>

    {/* COUNTRIES */}
    <section id="countries" className="section" style={{background:'var(--cream2)'}}>
      <div className="container">
        <div style={{marginBottom:52}} className="fade-up">
          <div className="section-eyebrow">10 World Cuisines</div>
          <h2 className="section-title">Choose Your Cuisine</h2>
          <p className="section-desc">Click any country to browse all 12 recipe categories from breakfast to baking.</p>
        </div>
        <div className="countries-grid">
          {COUNTRIES.map((c,i)=>(
            <Link key={c.id} href={`/countries/${c.id}`}>
              <div className="country-card fade-up" style={{animationDelay:`${i*55}ms`}}>
                <div className="cc-img">
                  <img src={c.image} alt={c.name} loading="lazy"/>
                  <div className="cc-overlay"><div className="cc-flag">{c.flag}</div><div className="cc-name">{c.name}</div></div>
                </div>
                <div className="cc-body" style={{borderTop:`3px solid ${c.color}`}}>
                  <p className="cc-desc">{c.desc}</p>
                  <div className="cc-footer">
                    <div className="cc-cat-icons">{RECIPE_CATEGORIES.slice(0,4).map(cat=><div key={cat.id} className="cc-cat-icon">{cat.icon}</div>)}</div>
                    <span className="cc-cta">{(recipesByCountry[c.id]||[]).length||'12 cats'} →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* 12 CATEGORIES */}
    <section id="categories" className="section" style={{background:'var(--cream)'}}>
      <div className="container">
        <div style={{marginBottom:52}} className="fade-up">
          <div className="section-eyebrow">Browse by Type</div>
          <h2 className="section-title">All 12 Categories</h2>
        </div>
        <div className="cat-grid">
          {RECIPE_CATEGORIES.map((cat,i)=>(
            <Link key={cat.id} href={`/categories/${cat.id}`}>
              <div className="cat-item fade-up" style={{animationDelay:`${i*40}ms`}}>
                <div className="cat-icon-emoji">{cat.icon}</div>
                <div className="cat-name">{cat.name}</div>
                <div className="cat-count">{cat.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* LATEST RECIPES */}
    <section className="section" style={{background:'var(--cream2)'}}>
      <div className="container">
        <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:52,flexWrap:'wrap',gap:16}} className="fade-up">
          <div><div className="section-eyebrow">Just Published</div><h2 className="section-title">Latest Recipes</h2></div>
          <Link href="/recipes" className="btn-order" style={{fontSize:13,padding:'11px 26px'}}>View All →</Link>
        </div>
        <div className="recipes-grid">
          {latestRecipes.slice(0,6).map((r,i)=>(
            <div key={r.slug||i} className="fade-up" style={{animationDelay:`${i*70}ms`}}><RecipeCard recipe={r}/></div>
          ))}
        </div>
      </div>
    </section>

    {/* FOOTER */}
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo-txt">🍽️ FoodHive World</div>
            <p className="footer-desc">Authentic recipes from 10 world cuisines, auto-published every 30 minutes by Gemini AI.</p>
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

export async function getStaticProps() {
  const all = getAllRecipes()
  const latest = all.length>0 ? all.slice(0,12) : Array(6).fill(SAMPLE_RECIPE)
  const byCountry = {}
  for (const r of all) { if(!byCountry[r.country]) byCountry[r.country]=[]; byCountry[r.country].push(r) }
  return { props:{ latestRecipes:latest, recipesByCountry:byCountry }, revalidate:60 }
}
