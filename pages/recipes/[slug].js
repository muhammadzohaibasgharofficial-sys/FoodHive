// ============================================================
// FoodHive World — pages/recipes/[slug].js
// Clean, simple UI — Likes + Comments + Share (English)
// ============================================================
import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  getRecipeBySlug,
  getAllRecipeSlugs,
  getAllRecipes,
  RECIPE_CATEGORIES,
  COUNTRIES,
  SAMPLE_RECIPE,
} from '../../lib/data'

const SAT_POS = [
  { top: '2%',  left: '50%', size: 86, tx: '-50%', delay: '0s'   },
  { top: '22%', left: '88%', size: 72, tx: '0',    delay: '.3s'  },
  { top: '68%', left: '82%', size: 78, tx: '0',    delay: '.6s'  },
  { top: '72%', left: '14%', size: 72, tx: '0',    delay: '.9s'  },
  { top: '22%', left: '4%',  size: 80, tx: '0',    delay: '1.2s' },
]

// ── Star Rating ──
function StarRating({ value = 5, interactive = false, onRate }) {
  const [hover, setHover] = useState(0)
  const display = hover || value
  return (
    <div style={{ display: 'flex', gap: 2, cursor: interactive ? 'pointer' : 'default' }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span
          key={s}
          style={{ fontSize: interactive ? 22 : 15, color: s <= display ? '#f59e0b' : '#d1d5db', lineHeight: 1 }}
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate?.(s)}
        >★</span>
      ))}
    </div>
  )
}

// ── Like Button — simple style ──
function LikeButton({ slug }) {
  const [count, setCount] = useState(0)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    fetch(`/api/sb-likes?slug=${slug}`)
      .then(r => r.json()).then(d => setCount(d.count || 0)).catch(() => {})
    const likedSet = JSON.parse(localStorage.getItem('fh_liked') || '[]')
    setLiked(likedSet.includes(slug))
  }, [slug])

  const handleLike = async () => {
    if (liked) return
    const likedSet = JSON.parse(localStorage.getItem('fh_liked') || '[]')
    likedSet.push(slug)
    localStorage.setItem('fh_liked', JSON.stringify(likedSet))
    setLiked(true)
    try {
      const r = await fetch('/api/sb-likes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug }) })
      const d = await r.json()
      setCount(d.count || count + 1)
    } catch { setCount(c => c + 1) }
  }

  return (
    <button onClick={handleLike} className={`action-btn${liked ? ' action-btn-active' : ''}`}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      {liked ? 'Liked' : 'Like'} {count > 0 && <span className="action-count">{count}</span>}
    </button>
  )
}

// ── Share Button — simple dropdown ──
function ShareButton({ title, slug, description }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const url = `https://food-hive-one.vercel.app/recipes/${slug}`

  const copy = () => {
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setOpen(false); setTimeout(() => setCopied(false), 2000) })
  }
  const copyText = () => {
    navigator.clipboard.writeText(`${title}\n\n${description || ''}\n\n${url}`).then(() => { setCopied(true); setOpen(false); setTimeout(() => setCopied(false), 2000) })
  }
  const whatsapp = () => { window.open(`https://wa.me/?text=${encodeURIComponent(title + '\n' + url)}`, '_blank'); setOpen(false) }
  const twitter  = () => { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank'); setOpen(false) }
  const facebook = () => { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank'); setOpen(false) }

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    document.addEventListener('click', close, { once: true })
    return () => document.removeEventListener('click', close)
  }, [open])

  return (
    <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
      <button onClick={() => setOpen(p => !p)} className="action-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        {copied ? 'Copied!' : 'Share'}
      </button>
      {open && (
        <div className="share-menu">
          {[
            { label: 'Copy link', icon: '🔗', fn: copy },
            { label: 'Copy recipe text', icon: '📋', fn: copyText },
            { label: 'WhatsApp', icon: '💬', fn: whatsapp },
            { label: 'Twitter / X', icon: '𝕏', fn: twitter },
            { label: 'Facebook', icon: 'f', fn: facebook },
          ].map(item => (
            <button key={item.label} onClick={item.fn} className="share-menu-item">
              <span className="share-menu-icon">{item.icon}</span> {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Comments Section — clean ──
function CommentsSection({ slug }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', comment: '', rating: 5 })

  useEffect(() => {
    fetch(`/api/sb-comments?slug=${slug}`)
      .then(r => r.json())
      .then(d => { setComments(d.comments || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [slug])

  const submit = async e => {
    e.preventDefault()
    if (!form.name.trim() || !form.comment.trim()) { setError('Name and comment are required.'); return }
    setSubmitting(true); setError('')
    try {
      const r = await fetch('/api/sb-comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, ...form }) })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Failed')
      setSubmitted(true)
      setComments(prev => [{ id: d.id, name: form.name, comment: form.comment, rating: form.rating, date: new Date().toISOString() }, ...prev])
      setForm({ name: '', email: '', comment: '', rating: 5 })
    } catch (err) { setError(err.message) }
    setSubmitting(false)
  }

  return (
    <section className="comments-wrap">
      <div className="container">
        <h2 className="comments-heading">Reviews <span className="comments-count">({comments.length})</span></h2>

        {/* Form */}
        {!submitted ? (
          <form className="comment-form" onSubmit={submit}>
            <div className="cf-rating-row">
              <span className="cf-label">Your rating</span>
              <StarRating value={form.rating} interactive onRate={v => setForm(p => ({ ...p, rating: v }))} />
            </div>
            <div className="cf-grid">
              <div className="cf-field">
                <label className="cf-label">Name *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" maxLength={100} required />
              </div>
              <div className="cf-field">
                <label className="cf-label">Email <span className="cf-optional">(optional)</span></label>
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="your@email.com" />
              </div>
            </div>
            <div className="cf-field">
              <label className="cf-label">Comment *</label>
              <textarea value={form.comment} onChange={e => setForm(p => ({ ...p, comment: e.target.value }))} placeholder="Share your experience with this recipe..." rows={4} maxLength={1000} required />
              <span className="cf-char">{form.comment.length}/1000</span>
            </div>
            {error && <p className="cf-error">{error}</p>}
            <button type="submit" className="cf-btn" disabled={submitting}>
              {submitting ? 'Posting...' : 'Post Review'}
            </button>
          </form>
        ) : (
          <div className="cf-success">
            <p>✓ Your review was posted successfully.</p>
            <button onClick={() => setSubmitted(false)} className="cf-btn-ghost">Write another</button>
          </div>
        )}

        {/* List */}
        {loading ? (
          <p className="comments-empty">Loading reviews...</p>
        ) : comments.length === 0 ? (
          <p className="comments-empty">No reviews yet. Be the first!</p>
        ) : (
          <div className="comments-list">
            {comments.map((c, i) => (
              <div key={c.id || i} className="comment-item">
                <div className="comment-meta">
                  <div className="comment-avatar">{(c.name || 'A')[0].toUpperCase()}</div>
                  <div>
                    <p className="comment-name">{c.name}</p>
                    <p className="comment-date">{new Date(c.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div style={{ marginLeft: 'auto' }}><StarRating value={c.rating || 5} /></div>
                </div>
                <p className="comment-text">{c.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ── Small Recipe Card ──
function RecipeCard({ recipe }) {
  return (
    <Link href={`/recipes/${recipe.slug}`}>
      <div className="recipe-card">
        <div className="rc-img-wrap">
          <div className="rc-circle"><img src={recipe.image2 || recipe.image1} alt={recipe.title} loading="lazy" /></div>
          <span className="rc-tag-cat">{recipe.categoryIcon}</span>
        </div>
        <div className="rc-body">
          <h3 className="rc-title">{recipe.title}</h3>
          <div className="rc-meta">
            <span className="rc-stars">{'★'.repeat(Math.round(recipe.rating || 5))}</span>
            <span className="rc-time">⏱ {recipe.totalTime}</span>
          </div>
          <div className="rc-btn">View →</div>
        </div>
      </div>
    </Link>
  )
}

// ── Main Page ──
export default function RecipeDetail({ recipe, relatedRecipes }) {
  const [servings, setServings] = useState(recipe?.servings || 4)
  const [activeTab, setActiveTab] = useState('instructions')
  const [activeMiniTab, setActiveMiniTab] = useState(recipe?.category || 'breakfast')
  const bodyRef = useRef(null)
  const router = useRouter()

  useEffect(() => { window.scrollTo(0, 0) }, [recipe?.slug])

  useEffect(() => {
    const bar = document.querySelector('.scroll-bar')
    if (!bar) return
    const fn = () => { bar.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%' }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  if (!recipe) return (
    <div style={{ padding: '100px 24px', textAlign: 'center', minHeight: '100vh' }}>
      <h1 style={{ fontFamily: 'var(--font-title)', fontSize: 48, marginBottom: 16 }}>Recipe Not Found</h1>
      <Link href="/recipes" className="btn-primary">← Browse All Recipes</Link>
    </div>
  )

  const mult = servings / (recipe.servings || 4)
  const scaleAmt = amt => {
    const n = parseFloat(amt)
    if (isNaN(n)) return amt
    return amt.replace(/[\d.]+/, (n * mult).toFixed(n % 1 !== 0 ? 1 : 0))
  }

  const miniTabs = ['breakfast', 'lunch', 'dinner']

  return (
    <>
      <Head>
        <title>{recipe.title} — {recipe.countryName} {recipe.categoryName} | FoodHive World</title>
        <meta name="description" content={`${recipe.description} Authentic ${recipe.countryName} recipe.`} />
        <meta property="og:title" content={`${recipe.title} | FoodHive World`} />
        <meta property="og:description" content={recipe.description} />
        <meta property="og:image" content={recipe.image1} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`https://food-hive-one.vercel.app/recipes/${recipe.slug}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'Recipe',
          name: recipe.title, description: recipe.description,
          image: [recipe.image1, recipe.image2].filter(Boolean),
          author: { '@type': 'Organization', name: 'FoodHive World' },
          datePublished: recipe.publishedAt,
          prepTime: `PT${(recipe.prepTime || '15 min').replace(/\D/g, '')}M`,
          cookTime: `PT${(recipe.cookTime || '30 min').replace(/\D/g, '')}M`,
          totalTime: `PT${(recipe.totalTime || '45 min').replace(/\D/g, '')}M`,
          recipeYield: `${recipe.servings} servings`,
          recipeCategory: recipe.categoryName, recipeCuisine: recipe.cuisine,
          keywords: (recipe.tags || []).join(', '),
          aggregateRating: { '@type': 'AggregateRating', ratingValue: recipe.rating || 4.8, reviewCount: recipe.reviews || 100 },
          nutrition: { '@type': 'NutritionInformation', calories: recipe.nutritionTable?.calories, proteinContent: recipe.nutritionTable?.protein, carbohydrateContent: recipe.nutritionTable?.carbs, fatContent: recipe.nutritionTable?.fat },
          recipeIngredient: (recipe.ingredients || []).map(i => `${i.amount} ${i.item}`),
          recipeInstructions: (recipe.instructions || []).map(s => ({ '@type': 'HowToStep', name: s.title, text: s.text })),
        })}} />
      </Head>

      <div className="scroll-bar" />

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-inner">
          <button className="rd-back" onClick={() => router.back()} aria-label="Go back">←</button>
          <div className="rd-mini-nav">
            {miniTabs.map(t => (
              <button key={t} className={`rd-mini-link${activeMiniTab === t ? ' active' : ''}`} onClick={() => setActiveMiniTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <Link href="/" className="logo" style={{ fontSize: 18 }}>
            <span>🍽️</span>
            <span style={{ fontFamily: 'var(--font-title)', fontWeight: 700 }}>FoodHive</span>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="rd-hero">
        <div className="rd-hero-blob" />
        <div className="rd-hero-inner">

          {/* LEFT */}
          <div className="fade-up">
            <div className="rd-tags">
              <span className="rd-tag rd-tag-country">{recipe.countryFlag} {recipe.countryName}</span>
              <span className="rd-tag rd-tag-cat">{recipe.categoryIcon} {recipe.categoryName}</span>
              <span className="rd-tag rd-tag-diff">⚡ {recipe.difficulty}</span>
            </div>

            <h1 className="rd-title">{recipe.title}</h1>
            <p className="rd-desc">{recipe.description}</p>

            {/* Rating — simple */}
            <div className="rd-rating-row">
              <StarRating value={Math.round(recipe.rating || 5)} />
              <span style={{ fontSize: 14, color: 'var(--gray)', marginLeft: 6 }}>{recipe.rating} ({recipe.reviews} reviews)</span>
            </div>

            <div className="rd-stats">
              {[
                { v: recipe.prepTime, l: 'Prep' },
                { v: recipe.cookTime, l: 'Cook' },
                { v: recipe.totalTime, l: 'Total' },
                { v: (recipe.servings || 4) + ' ppl', l: 'Serves' },
              ].map(s => (
                <div key={s.l} className="rd-stat">
                  <div className="rd-stat-val">{s.v}</div>
                  <div className="rd-stat-lbl">{s.l}</div>
                </div>
              ))}
            </div>

            {/* Action row — clean simple buttons */}
            <div className="rd-action-row">
              <button className="rd-cta" onClick={() => bodyRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                View Recipe
              </button>
              <LikeButton slug={recipe.slug} />
              <ShareButton title={recipe.title} slug={recipe.slug} description={recipe.description} />
            </div>
          </div>

          {/* RIGHT — Orbit */}
          <div className="rd-orbit">
            <div className="rd-orbit-ring" style={{ width: 400, height: 400 }} />
            <div className="rd-orbit-main" style={{ width: 260, height: 260 }}>
              <img src={recipe.image1} alt={recipe.title} />
            </div>
            {relatedRecipes.slice(0, 5).map((r, i) => {
              const p = SAT_POS[i]
              return (
                <Link key={r.slug || i} href={`/recipes/${r.slug}`}>
                  <div className="rd-sat" style={{ top: p.top, left: p.left, width: p.size, height: p.size, transform: `translate(${p.tx},-50%)`, animationDelay: p.delay }}>
                    <img src={r.image2 || r.image1} alt={r.title} />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="rd-body section" ref={bodyRef}>
        <div className="container">
          <div className="rd-body-grid">

            {/* SIDEBAR */}
            <div className="rd-sidebar-card">
              <div className="rd-box-head">🥘 Ingredients</div>
              <div className="serv-row">
                <button className="serv-btn" onClick={() => setServings(Math.max(1, servings - 1))}>−</button>
                <span className="serv-num">{servings}</span>
                <button className="serv-btn" onClick={() => setServings(servings + 1)}>+</button>
                <span style={{ fontSize: 12, color: 'var(--gray)', marginLeft: 4 }}>servings</span>
              </div>
              {(recipe.ingredients || []).map((ing, i) => (
                <div key={i} className="ing-row">
                  <div className="ing-dot" />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                      <span className="ing-amt">{scaleAmt(ing.amount)}</span>
                      <span className="ing-name">{ing.item}</span>
                    </div>
                    {ing.notes && <div className="ing-note">{ing.notes}</div>}
                  </div>
                </div>
              ))}
              {recipe.tips?.length > 0 && (
                <>
                  <div className="rd-box-head" style={{ marginTop: 28 }}>💡 Tips</div>
                  {recipe.tips.map((tip, i) => (
                    <div key={i} className="tip-row">
                      <span className="tip-icon">✓</span>
                      <span className="tip-text">{tip}</span>
                    </div>
                  ))}
                </>
              )}
              {recipe.nutritionTable && (
                <div style={{ marginTop: 28 }}>
                  <div className="rd-box-head">📊 Nutrition</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {Object.entries(recipe.nutritionTable).slice(0, 6).map(([k, v]) => (
                      <div key={k} style={{ background: 'var(--cream)', borderRadius: 10, padding: '8px 12px', border: '1px solid var(--cream2)' }}>
                        <div style={{ fontFamily: 'var(--font-title)', fontSize: 16, fontWeight: 700, color: 'var(--orange)' }}>{v}</div>
                        <div style={{ fontSize: 10, color: 'var(--gray)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: .5 }}>{k}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* MAIN */}
            <div>
              <div className="tab-row">
                {[
                  { id: 'instructions', label: 'Instructions' },
                  { id: 'nutrition', label: 'Nutrition' },
                  { id: 'article', label: 'About' },
                ].map(t => (
                  <button key={t.id} className={`tab-btn${activeTab === t.id ? ' active' : ''}`} onClick={() => setActiveTab(t.id)}>
                    {t.label}
                  </button>
                ))}
              </div>

              {activeTab === 'instructions' && (
                <div style={{ background: 'white', borderRadius: 'var(--r-xl)', padding: 28, boxShadow: 'var(--sh-soft)' }}>
                  <div className="rd-box-head">Step by Step</div>
                  {(recipe.instructions || []).map((step, i) => (
                    <div key={i} className="step-row">
                      <div className="step-num-circle">{step.step}</div>
                      <div style={{ flex: 1 }}>
                        <div className="step-title">{step.title}</div>
                        <div className="step-text">{step.text}</div>
                        {step.time && <div className="step-time">⏱ {step.time}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'nutrition' && recipe.nutritionTable && (
                <div style={{ background: 'white', borderRadius: 'var(--r-xl)', padding: 28, boxShadow: 'var(--sh-soft)' }}>
                  <div className="rd-box-head">📊 Nutrition per Serving</div>
                  <div className="nutr-grid">
                    {Object.entries(recipe.nutritionTable).map(([k, v]) => (
                      <div key={k} className="nutr-cell">
                        <div className="nutr-val">{v}</div>
                        <div className="nutr-lbl">{k}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'article' && recipe.article && (
                <div style={{ background: 'white', borderRadius: 'var(--r-xl)', padding: 28, boxShadow: 'var(--sh-soft)' }}>
                  <div className="article-body" dangerouslySetInnerHTML={{ __html:
                    recipe.article
                      .replace(/## (.+)/g, '<h2>$1</h2>')
                      .replace(/\n\n/g, '</p><p>')
                      .replace(/^/, '<p>').replace(/$/, '</p>')
                  }} />
                </div>
              )}

              {recipe.tags && (
                <div style={{ marginTop: 24 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Tags</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {recipe.tags.map(t => (
                      <span key={t} style={{ background: 'var(--cream2)', color: 'var(--gray)', fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 'var(--r-full)', border: '1px solid var(--cream3)' }}>{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* RELATED */}
      {relatedRecipes.length > 0 && (
        <section className="section" style={{ background: 'var(--cream2)' }}>
          <div className="container">
            <div style={{ marginBottom: 40 }} className="fade-up">
              <div className="section-eyebrow">{recipe.countryFlag} More {recipe.countryName}</div>
              <h2 className="section-title">You Might Also Like</h2>
            </div>
            <div className="recipes-grid">
              {relatedRecipes.slice(0, 3).map((r, i) => (
                <div key={r.slug || i} className="fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <RecipeCard recipe={r} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* COMMENTS */}
      <CommentsSection slug={recipe.slug} />

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-logo-txt">🍽️ FoodHive World</div>
              <p className="footer-desc">Authentic recipes from 10 world cuisines, auto-published every 30 minutes.</p>
            </div>
            <div>
              <div className="footer-col-title">Countries</div>
              {COUNTRIES.slice(0, 5).map(c => <Link key={c.id} href={`/countries/${c.id}`} className="footer-link">{c.flag} {c.name}</Link>)}
            </div>
            <div>
              <div className="footer-col-title">More</div>
              {COUNTRIES.slice(5).map(c => <Link key={c.id} href={`/countries/${c.id}`} className="footer-link">{c.flag} {c.name}</Link>)}
            </div>
            <div>
              <div className="footer-col-title">Categories</div>
              {RECIPE_CATEGORIES.slice(0, 6).map(c => <Link key={c.id} href={`/categories/${c.id}`} className="footer-link">{c.icon} {c.name}</Link>)}
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 FoodHive World</span>
            <span>10 Countries · 12 Categories · Updated Every 30 Min</span>
          </div>
        </div>
      </footer>

      <style jsx>{`
        /* ── Action buttons — simple clean style ── */
        .rd-action-row {
          display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-top: 24px;
        }
        .action-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: white; border: 1.5px solid #e5e7eb;
          color: #6b7280; font-size: 13px; font-weight: 600;
          padding: 8px 16px; border-radius: 8px;
          cursor: pointer; transition: all .2s; font-family: var(--font-body);
        }
        .action-btn:hover { border-color: #9ca3af; color: #374151; background: #f9fafb; }
        .action-btn-active { border-color: #fca5a5 !important; color: #ef4444 !important; background: #fef2f2 !important; }
        .action-count { font-size: 12px; color: #9ca3af; margin-left: 2px; }

        /* ── Share menu ── */
        .share-menu {
          position: absolute; top: calc(100% + 6px); left: 0;
          background: white; border: 1px solid #e5e7eb; border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          padding: 4px; min-width: 190px; z-index: 200;
        }
        .share-menu-item {
          display: flex; align-items: center; gap: 10px;
          width: 100%; padding: 9px 12px; border: none;
          background: none; cursor: pointer; border-radius: 7px;
          font-size: 13px; font-weight: 500; color: #374151;
          font-family: var(--font-body); text-align: left; transition: background .15s;
        }
        .share-menu-item:hover { background: #f3f4f6; }
        .share-menu-icon { font-size: 14px; width: 20px; text-align: center; font-style: normal; }

        /* ── Orbit satellites ── */
        .rd-sat {
          position: absolute; border-radius: 50%; overflow: hidden;
          border: 3px solid white; box-shadow: var(--sh-card);
          cursor: pointer; z-index: 5;
          transition: transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s;
          animation: rdSatFloat 3s ease-in-out infinite;
        }
        .rd-sat:hover { transform: scale(1.15) !important; box-shadow: var(--sh-float); z-index: 20; }
        .rd-sat img { width: 100%; height: 100%; object-fit: cover; }
        @keyframes rdSatFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

        /* ── Comments section — clean ── */
        .comments-wrap { background: #f9fafb; padding: 64px 0; border-top: 1px solid #e5e7eb; }
        .comments-heading { font-family: var(--font-title); font-size: 28px; font-weight: 700; color: var(--dark); margin-bottom: 32px; }
        .comments-count { font-size: 18px; color: var(--gray); font-weight: 400; }

        .comment-form {
          background: white; border-radius: 12px; padding: 28px;
          border: 1px solid #e5e7eb; margin-bottom: 40px;
        }
        .cf-label { font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: .5px; display: block; margin-bottom: 6px; }
        .cf-optional { font-weight: 400; text-transform: none; letter-spacing: 0; color: #9ca3af; }
        .cf-rating-row { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
        .cf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        .cf-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        .cf-field input, .cf-field textarea {
          border: 1.5px solid #e5e7eb; border-radius: 8px;
          padding: 10px 14px; font-size: 14px; font-family: var(--font-body);
          color: var(--dark); background: white; outline: none;
          transition: border-color .2s; resize: vertical;
        }
        .cf-field input:focus, .cf-field textarea:focus { border-color: var(--teal); }
        .cf-char { font-size: 11px; color: #9ca3af; float: right; margin-top: 4px; }
        .cf-error { color: #dc2626; font-size: 13px; margin-bottom: 12px; }
        .cf-btn {
          background: var(--teal); color: white; font-size: 13px; font-weight: 600;
          padding: 10px 24px; border-radius: 8px; border: none; cursor: pointer;
          font-family: var(--font-body); transition: background .2s;
        }
        .cf-btn:hover { background: var(--teal-d); }
        .cf-btn:disabled { opacity: .6; cursor: not-allowed; }
        .cf-btn-ghost {
          background: none; border: 1.5px solid #e5e7eb; color: var(--gray);
          font-size: 13px; font-weight: 600; padding: 8px 20px; border-radius: 8px;
          cursor: pointer; font-family: var(--font-body); margin-top: 10px; transition: all .2s;
        }
        .cf-btn-ghost:hover { border-color: #9ca3af; color: var(--dark); }
        .cf-success { padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px; margin-bottom: 40px; color: var(--gray); font-size: 14px; }

        .comments-empty { color: #9ca3af; font-size: 14px; padding: 32px 0; }
        .comments-list { display: flex; flex-direction: column; gap: 16px; }
        .comment-item {
          background: white; border-radius: 10px; padding: 20px 24px;
          border: 1px solid #e5e7eb;
        }
        .comment-meta { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .comment-avatar {
          width: 38px; height: 38px; border-radius: 50%;
          background: var(--olive); color: white;
          font-size: 16px; font-weight: 700;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .comment-name { font-weight: 600; font-size: 14px; color: var(--dark); margin: 0; }
        .comment-date { font-size: 12px; color: #9ca3af; margin: 2px 0 0; }
        .comment-text { font-size: 14px; color: #4b5563; line-height: 1.7; margin: 0; }

        @media (max-width: 640px) {
          .cf-grid { grid-template-columns: 1fr; }
          .rd-action-row { gap: 8px; }
          .share-menu { min-width: 170px; }
        }
      `}</style>
    </>
  )
}

export async function getStaticPaths() {
  return { paths: getAllRecipeSlugs(), fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  let recipe = getRecipeBySlug(params.slug)
  if (!recipe) recipe = SAMPLE_RECIPE
  const all = getAllRecipes()
  const related = all.filter(r => r.slug !== recipe.slug && r.country === recipe.country).slice(0, 5)
  return { props: { recipe, relatedRecipes: related }, revalidate: 60 }
}
