// FoodHive World — Homepage — Design Clone (Biryani / Warm Beige)
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { COUNTRIES, RECIPE_CATEGORIES, getAllRecipes, SAMPLE_RECIPE } from '../lib/data'

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

export default function HomePage({ latestRecipes }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const heroImg = 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800'

  return (
    <>
      <Head>
        <title>FoodHive World — Authentic Recipes from 10 Countries</title>
        <meta name="description" content="Explore authentic recipes from 10 world cuisines." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://foodhive.vercel.app" />
      </Head>

      {/* NAVBAR */}
      <nav className={`fh-nav${scrolled ? ' fh-nav--scrolled' : ''}`}>
        <div className="fh-nav__inner">
          <Link href="/" className="fh-logo">
            <span className="fh-logo__icon">🍽️</span>
            <span className="fh-logo__text">FoodHive<span className="fh-logo__accent"> World</span></span>
          </Link>
          <div className={`fh-nav__links${mobileMenuOpen ? ' fh-nav__links--open' : ''}`}>
            <Link href="/#countries" className="fh-nav__link" onClick={() => setMobileMenuOpen(false)}>Countries</Link>
            <Link href="/recipes" className="fh-nav__link" onClick={() => setMobileMenuOpen(false)}>Recipes</Link>
            <Link href="/recipes" className="fh-nav__link" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
            <Link href="/recipes" className="fh-nav__link" onClick={() => setMobileMenuOpen(false)}>Stories</Link>
          </div>
          <div className="fh-nav__right">
            <button className="fh-nav__icon-btn" aria-label="Search">🔍</button>
            <button className="fh-nav__icon-btn" aria-label="Account">👤</button>
            <Link href="/#countries" className="fh-nav__cta">🌍 Explore</Link>
            <button className="fh-nav__hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="fh-hero">
        <div className="fh-hero__blob" />
        <div className="fh-hero__deco fh-hero__deco--1">✿</div>
        <div className="fh-hero__deco fh-hero__deco--2">❧</div>
        <div className="fh-hero__inner">
          <div className="fh-hero__left">
            <p className="fh-hero__tagline">A · 20 Jul — 1920</p>
            <h1 className="fh-hero__title">Mutton<br /><em>Biryani</em></h1>
            <p className="fh-hero__desc">
              A harmony of aromatic basmati rice, tender mutton, and hand-ground spices — slow-cooked to perfection.
              Explore authentic recipes from 10 world cuisines.
            </p>
            <div className="fh-hero__cta-row">
              <Link href="/#countries" className="fh-btn fh-btn--order">Order Now</Link>
            </div>
          </div>
          <div className="fh-hero__right">
            <div className="fh-hero__img-ring">
              <img src={heroImg} alt="Mutton Biryani" className="fh-hero__img" />
            </div>
            <div className="fh-hero__badge fh-hero__badge--top">
              <span>⭐</span>
              <div><div className="fh-hero__badge-val">4.9</div><div className="fh-hero__badge-lbl">Top Rated</div></div>
            </div>
            <div className="fh-hero__badge fh-hero__badge--btm">
              <span>🕐</span>
              <div><div className="fh-hero__badge-val">45 min</div><div className="fh-hero__badge-lbl">Cook Time</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED DISHES */}
      <section className="fh-featured">
        <div className="fh-container">
          <div className="fh-section-head">
            <span className="fh-eyebrow">🍛 — Austin Biryani</span>
            <h2 className="fh-section-title">Popular Dishes</h2>
            <p className="fh-section-desc">Hand-picked crowd favourites from our world kitchen, updated daily.</p>
          </div>
          <div className="fh-featured__grid">
            {[
              { img:'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400', tag:'BEST', tagC:'#E8873A', name:'Vegetable Dum Biryani', price:'₹320', stars:5, desc:'Fragrant basmati with seasonal vegetables and saffron.', ings:['Basmati Rice','Vegetables','Saffron'] },
              { img:'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400', tag:'NEW', tagC:'#8B9E6B', name:'Chicken Nizami', price:'₹890', stars:5, desc:'Slow-cooked in clay pot with Nizami spice blend.', ings:['Chicken','Spices','Yoghurt'] },
              { img:'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=400', tag:'HOT', tagC:'#C94040', name:'Haleem Dawat', price:'₹499', stars:4, desc:'Rich wheat and lentil slow-cooked with lamb shank.', ings:['Lentils','Wheat','Lamb'] },
            ].map((d, i) => (
              <div key={i} className="fh-dish-card">
                <div className="fh-dish-card__img-wrap">
                  <div className="fh-dish-card__circle">
                    <img src={d.img} alt={d.name} loading="lazy" />
                  </div>
                  <span className="fh-dish-card__tag" style={{background:d.tagC}}>{d.tag}</span>
                </div>
                <div className="fh-dish-card__body">
                  <h3 className="fh-dish-card__name">{d.name}</h3>
                  <p className="fh-dish-card__desc">{d.desc}</p>
                  <div className="fh-dish-card__ings">{d.ings.map((g,j)=><span key={j} className="fh-dish-card__ing">{g}</span>)}</div>
                  <div className="fh-dish-card__footer">
                    <span className="fh-dish-card__stars">{'★'.repeat(d.stars)}</span>
                    <span className="fh-dish-card__price">{d.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MENU CHOICES */}
      <section className="fh-menu">
        <div className="fh-container">
          <div className="fh-section-head">
            <span className="fh-eyebrow">— Mixed Food Choices</span>
          </div>
          <div className="fh-menu__grid">
            {[
              { img:'https://images.pexels.com/photos/2087748/pexels-photo-2087748.jpeg?auto=compress&cs=tinysrgb&w=400', emoji:'🌶️', name:'Chicken Tikka', tagline:'In Restaurants', priceOld:'₹3.19', priceNew:'₹2.09', badge:'POPULAR' },
              { img:'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=400', emoji:'🍗', name:'Grilled Cheese', tagline:null, priceOld:'8.15', priceNew:'14.19', badge:'NEW' },
              { img:'https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=400', emoji:'🍚', name:'Khao Neow Bio', tagline:null, priceOld:null, priceNew:'₹9.00', badge:'ORGANIC' },
            ].map((item,i)=>(
              <div key={i} className="fh-menu__card">
                <div className="fh-menu__card-img">
                  <img src={item.img} alt={item.name} loading="lazy" />
                  <span className="fh-menu__card-badge">{item.badge}</span>
                </div>
                <div className="fh-menu__card-body">
                  <span className="fh-menu__card-emoji">{item.emoji}</span>
                  <h3 className="fh-menu__card-name">{item.name}</h3>
                  {item.tagline && <p className="fh-menu__card-tagline">{item.tagline}</p>}
                  <div className="fh-menu__card-price">
                    {item.priceOld && <s className="fh-menu__card-price-old">{item.priceOld}</s>}
                    <strong className="fh-menu__card-price-new">{item.priceNew}</strong>
                  </div>
                  <Link href="/recipes" className="fh-btn fh-btn--order">Add to Cart</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COUNTRIES — ONLY section on homepage */}
      <section id="countries" className="fh-countries">
        <div className="fh-container">
          <div className="fh-section-head fh-section-head--center">
            <span className="fh-eyebrow">🌍 — 10 World Cuisines</span>
            <h2 className="fh-section-title">Choose Your Cuisine</h2>
            <p className="fh-section-desc fh-section-desc--wide">Click any country to explore all 12 recipe categories — from breakfast to baking.</p>
          </div>
          <div className="fh-countries__grid">
            {COUNTRIES.map((c, i) => (
              <Link key={c.id} href={`/countries/${c.id}`}>
                <div className="fh-country-card fh-fade-up" style={{animationDelay:`${i*55}ms`}}>
                  <div className="fh-country-card__img">
                    <img src={c.image} alt={c.name} loading="lazy" />
                    <div className="fh-country-card__overlay">
                      <span className="fh-country-card__flag">{c.flag}</span>
                      <span className="fh-country-card__name">{c.name}</span>
                    </div>
                    <div className="fh-country-card__bar" style={{background:c.color}} />
                  </div>
                  <div className="fh-country-card__body">
                    <p className="fh-country-card__desc">{c.desc}</p>
                    <div className="fh-country-card__footer">
                      <div className="fh-country-card__cats">
                        {RECIPE_CATEGORIES.slice(0,4).map(cat=>(
                          <span key={cat.id} className="fh-country-card__cat-dot">{cat.icon}</span>
                        ))}
                      </div>
                      <span className="fh-country-card__cta">Browse →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST RECIPES */}
      <section className="fh-recipes">
        <div className="fh-container">
          <div className="fh-recipes__head">
            <div>
              <span className="fh-eyebrow">— Just Published</span>
              <h2 className="fh-section-title">Latest Recipes</h2>
            </div>
            <Link href="/recipes" className="fh-btn fh-btn--outline">View All →</Link>
          </div>
          <div className="fh-recipes__grid">
            {latestRecipes.slice(0,6).map((r,i)=>(
              <div key={r.slug||i} className="fh-fade-up" style={{animationDelay:`${i*70}ms`}}>
                <RecipeCard recipe={r}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="fh-footer">
        <div className="fh-container">
          <div className="fh-footer__grid">
            <div>
              <div className="fh-footer__logo">🍽️ FoodHive World</div>
              <p className="fh-footer__desc">Authentic recipes from 10 world cuisines, auto-published every 30 minutes by AI.</p>
            </div>
            <div>
              <div className="fh-footer__col-title">Countries</div>
              {COUNTRIES.slice(0,5).map(c=><Link key={c.id} href={`/countries/${c.id}`} className="fh-footer__link">{c.flag} {c.name}</Link>)}
            </div>
            <div>
              <div className="fh-footer__col-title">More</div>
              {COUNTRIES.slice(5).map(c=><Link key={c.id} href={`/countries/${c.id}`} className="fh-footer__link">{c.flag} {c.name}</Link>)}
            </div>
            <div>
              <div className="fh-footer__col-title">Categories</div>
              {RECIPE_CATEGORIES.slice(0,6).map(c=><Link key={c.id} href={`/categories/${c.id}`} className="fh-footer__link">{c.icon} {c.name}</Link>)}
            </div>
          </div>
          <div className="fh-footer__bottom">
            <span>© 2026 FoodHive World</span>
            <span>10 Countries · 12 Categories · Updated Every 30 Min</span>
          </div>
        </div>
      </footer>
    </>
  )
}

export async function getStaticProps() {
  const all = getAllRecipes()
  const latest = all.length > 0 ? all.slice(0,12) : Array(6).fill(SAMPLE_RECIPE)
  return { props:{ latestRecipes:latest }, revalidate:60 }
}
