// ============================================================
// FoodHive World — pages/recipes/[slug].js  REDESIGNED
// Clean hero: one big image + info side by side
// Font: DM Serif Display + DM Sans
// Zero orbit, zero satellites, zero animations
// Image appears ONLY in hero — not repeated below
// ============================================================
import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  getRecipeBySlug, getAllRecipeSlugs, getAllRecipes,
  RECIPE_CATEGORIES, COUNTRIES, SAMPLE_RECIPE,
} from '../../lib/data'

// ── Star Rating ──
function StarRating({ value = 5, interactive = false, onRate }) {
  const [hover, setHover] = useState(0)
  const [selected, setSelected] = useState(value)
  const display = hover || selected
  const handleRate = (s) => { setSelected(s); onRate?.(s) }
  return (
    <div style={{ display: 'flex', gap: interactive ? 6 : 3, alignItems: 'center' }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{
          fontSize: interactive ? 26 : 15,
          color: s <= display ? '#E07B39' : '#DDD0C0',
          cursor: interactive ? 'pointer' : 'default',
          transition: 'color .15s',
          userSelect: 'none',
        }}
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && handleRate(s)}>★</span>
      ))}
    </div>
  )
}

// ── Likes Button ──
function LikesButton({ slug }) {
  const [count, setCount] = useState(0)
  const [liked, setLiked] = useState(false)
  useEffect(() => {
    fetch(`/api/likes?slug=${slug}`).then(r => r.json()).then(d => setCount(d.count || 0)).catch(() => {})
    const ls = JSON.parse(localStorage.getItem('fh_liked') || '[]')
    setLiked(ls.includes(slug))
  }, [slug])
  const toggleLike = async () => {
    if (liked) return
    const ls = JSON.parse(localStorage.getItem('fh_liked') || '[]')
    ls.push(slug); localStorage.setItem('fh_liked', JSON.stringify(ls)); setLiked(true)
    try {
      const r = await fetch('/api/likes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug }) })
      const d = await r.json(); setCount(d.count || count + 1)
    } catch { setCount(c => c + 1) }
  }
  return (
    <button onClick={toggleLike} className={`action-btn ${liked ? 'liked' : ''}`}>
      <span>{liked ? '❤️' : '🤍'}</span>
      <span>{count}</span>
    </button>
  )
}

// ── Share Button ──
function ShareButton({ title, slug, description }) {
  const [copied, setCopied] = useState(false)
  const url = `https://food-hive-one.vercel.app/recipes/${slug}`
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title, text: description, url }).catch(() => {})
    } else {
      navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
    }
  }
  return (
    <button onClick={handleShare} className={`action-btn ${copied ? 'copied' : ''}`}>
      <span>{copied ? '✅' : '🔗'}</span>
      <span>{copied ? 'Copied!' : 'Share'}</span>
    </button>
  )
}

// ── Copy Button ──
function CopyBtn({ getText, label = 'Copy' }) {
  const [done, setDone] = useState(false)
  return (
    <button onClick={async () => {
      try { await navigator.clipboard.writeText(getText()); setDone(true); setTimeout(() => setDone(false), 2000) } catch {}
    }} className="copy-btn">
      {done ? '✅ Copied' : `📋 ${label}`}
    </button>
  )
}

// ── Comments ──
function CommentsSection({ slug }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', comment: '', rating: 5 })
  useEffect(() => {
    fetch(`/api/comments?slug=${slug}`).then(r => r.json()).then(d => { setComments(d.comments || []); setLoading(false) }).catch(() => setLoading(false))
  }, [slug])
  const submit = async e => {
    e.preventDefault()
    if (!form.name.trim() || !form.comment.trim()) { setError('Name aur comment dono required hain.'); return }
    setSubmitting(true); setError('')
    try {
      const r = await fetch('/api/comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, ...form }) })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Failed')
      setSubmitted(true)
      setComments(prev => [{ id: d.id, name: form.name, comment: form.comment, rating: form.rating, date: new Date().toISOString() }, ...prev])
      setForm({ name: '', comment: '', rating: 5 })
    } catch (err) { setError(err.message) }
    setSubmitting(false)
  }
  return (
    <section className="comments-section">
      <div className="container">
        <div className="section-label">💬 Community Reviews</div>
        <h2 className="comments-title">What People Are Saying</h2>
        <p className="comments-sub">{comments.length} review{comments.length !== 1 ? 's' : ''}</p>

        {!submitted ? (
          <form onSubmit={submit} className="comment-form">
            <h3>Leave a Review</h3>
            <div className="rating-row">
              <span>Your Rating:</span>
              <StarRating value={form.rating} interactive onRate={v => setForm(p => ({ ...p, rating: v }))} />
            </div>
            <div className="form-row">
              <label>Name *</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" maxLength={100} required className="form-input" />
            </div>
            <div className="form-row">
              <label>Comment *</label>
              <textarea value={form.comment} onChange={e => setForm(p => ({ ...p, comment: e.target.value }))} placeholder="Share your experience with this recipe..." rows={4} maxLength={1000} required className="form-textarea" />
              <div className="char-count">{form.comment.length}/1000</div>
            </div>
            {error && <div className="form-error">⚠️ {error}</div>}
            <button type="submit" disabled={submitting} className="submit-btn">
              {submitting ? 'Posting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <div className="comment-success">
            <div style={{ fontSize: 48 }}>🎉</div>
            <h3>Thank you for your review!</h3>
            <button onClick={() => setSubmitted(false)} className="submit-btn" style={{ marginTop: 16 }}>Write Another</button>
          </div>
        )}

        {loading ? (
          <div className="comments-loading">Loading reviews...</div>
        ) : comments.length === 0 ? (
          <div className="comments-empty">
            <div style={{ fontSize: 40, marginBottom: 8 }}>✍️</div>
            <p>Be the first to review this recipe!</p>
          </div>
        ) : (
          <div className="comments-list">
            {comments.map((c, i) => (
              <div key={c.id || i} className="comment-card">
                <div className="comment-header">
                  <div className="comment-avatar">{(c.name || 'A')[0].toUpperCase()}</div>
                  <div>
                    <div className="comment-name">{c.name}</div>
                    <div className="comment-date">{new Date(c.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
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

// ══════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════
export default function RecipeDetail({ recipe, relatedRecipes }) {
  const [servings, setServings] = useState(recipe?.servings || 4)
  const [activeTab, setActiveTab] = useState('instructions')
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
    <div className="not-found">
      <div style={{ fontSize: 64, marginBottom: 16 }}>🍽️</div>
      <h1>Recipe Not Found</h1>
      <Link href="/recipes" className="btn-primary">← Browse All Recipes</Link>
    </div>
  )

  const mult = servings / (recipe.servings || 4)
  const scaleAmt = amt => {
    const n = parseFloat(amt)
    if (isNaN(n)) return amt
    return amt.replace(/[\d.]+/, (n * mult).toFixed(n % 1 !== 0 ? 1 : 0))
  }
  const getIngredientsText = () =>
    `${recipe.title} — Ingredients (${servings} servings)\n\n` +
    (recipe.ingredients || []).map(ing => `• ${scaleAmt(ing.amount)} ${ing.item}${ing.notes ? ` (${ing.notes})` : ''}`).join('\n') +
    `\n\nFull Recipe: https://food-hive-one.vercel.app/recipes/${recipe.slug}`
  const getInstructionsText = () =>
    `${recipe.title} — Instructions\n\n` +
    (recipe.instructions || []).map(s => `Step ${s.step}: ${s.title}\n${s.text}${s.time ? `\n⏱ ${s.time}` : ''}`).join('\n\n') +
    `\n\nFull Recipe: https://food-hive-one.vercel.app/recipes/${recipe.slug}`

  return (
    <>
      <Head>
        <title>{recipe.title} — {recipe.countryName} {recipe.categoryName} | FoodHive World</title>
        <meta name="description" content={recipe.description} />
        <meta property="og:title" content={`${recipe.title} | FoodHive World`} />
        <meta property="og:description" content={recipe.description} />
        <meta property="og:image" content={recipe.image1} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`https://food-hive-one.vercel.app/recipes/${recipe.slug}`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'Recipe',
          name: recipe.title, description: recipe.description,
          image: [recipe.image1].filter(Boolean),
          author: { '@type': 'Organization', name: 'FoodHive World' },
          datePublished: recipe.publishedAt,
          recipeYield: `${recipe.servings} servings`,
          recipeCategory: recipe.categoryName,
          recipeCuisine: recipe.cuisine,
          aggregateRating: { '@type': 'AggregateRating', ratingValue: recipe.rating || 4.8, reviewCount: recipe.reviews || 100 },
          nutrition: { '@type': 'NutritionInformation', calories: recipe.nutritionTable?.calories },
          recipeIngredient: (recipe.ingredients || []).map(i => `${i.amount} ${i.item}`),
          recipeInstructions: (recipe.instructions || []).map(s => ({ '@type': 'HowToStep', name: s.title, text: s.text })),
        }) }} />
      </Head>

      <div className="scroll-bar" />

      {/* ── NAVBAR ── */}
      <nav className="rd-navbar">
        <div className="rd-navbar-inner">
          <button className="rd-back-btn" onClick={() => router.back()}>←</button>
          <Link href="/" className="rd-logo">🍽️ FoodHive</Link>
          <div className="rd-nav-links">
            <Link href="/#categories" className="rd-nav-link">Categories</Link>
            <Link href="/recipes" className="rd-nav-link">All Recipes</Link>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          HERO — Left: info | Right: one big image
          ══════════════════════════════════════════ */}
      <section className="rd-hero">
        {/* LEFT — Recipe Info */}
        <div className="rd-hero-left">

          {/* Breadcrumb tags */}
          <div className="rd-tags">
            <Link href={`/countries/${recipe.country}`} className="rd-tag">
              {recipe.countryFlag} {recipe.countryName}
            </Link>
            <Link href={`/categories/${recipe.category}`} className="rd-tag rd-tag-accent">
              {recipe.categoryIcon} {recipe.categoryName}
            </Link>
            <span className="rd-tag">{recipe.difficulty}</span>
          </div>

          {/* Title */}
          <h1 className="rd-title">{recipe.title}</h1>

          {/* Rating */}
          <div className="rd-rating-row">
            <StarRating value={Math.round(recipe.rating || 5)} />
            <span className="rd-rating-num">{recipe.rating}</span>
            <span className="rd-rating-cnt">({recipe.reviews} reviews)</span>
          </div>

          {/* Description */}
          <p className="rd-desc">{recipe.description}</p>

          {/* Stats */}
          <div className="rd-stats-grid">
            <div className="rd-stat-item">
              <span className="rd-stat-icon">⏱</span>
              <span className="rd-stat-val">{recipe.prepTime}</span>
              <span className="rd-stat-lbl">Prep</span>
            </div>
            <div className="rd-stat-divider" />
            <div className="rd-stat-item">
              <span className="rd-stat-icon">🔥</span>
              <span className="rd-stat-val">{recipe.cookTime}</span>
              <span className="rd-stat-lbl">Cook</span>
            </div>
            <div className="rd-stat-divider" />
            <div className="rd-stat-item">
              <span className="rd-stat-icon">⏰</span>
              <span className="rd-stat-val">{recipe.totalTime}</span>
              <span className="rd-stat-lbl">Total</span>
            </div>
            <div className="rd-stat-divider" />
            <div className="rd-stat-item">
              <span className="rd-stat-icon">👥</span>
              <span className="rd-stat-val">{recipe.servings}</span>
              <span className="rd-stat-lbl">Serves</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="rd-actions">
            <button className="rd-cta-btn" onClick={() => bodyRef.current?.scrollIntoView({ behavior: 'smooth' })}>
              📖 View Recipe
            </button>
            <LikesButton slug={recipe.slug} />
            <ShareButton title={recipe.title} slug={recipe.slug} description={recipe.description} />
          </div>
        </div>

        {/* RIGHT — Single Big Image */}
        <div className="rd-hero-right">
          <div className="rd-image-frame">
            <img
              src={recipe.image1}
              alt={recipe.title}
              className="rd-hero-image"
              loading="eager"
            />
            {/* Cuisine badge overlay */}
            <div className="rd-image-badge">
              <span className="rd-badge-flag">{recipe.countryFlag}</span>
              <div>
                <div className="rd-badge-cuisine">{recipe.cuisine}</div>
                <div className="rd-badge-cat">{recipe.categoryIcon} {recipe.categoryName}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          RECIPE BODY
          ══════════════════════════════════════════ */}
      <section className="rd-body" ref={bodyRef}>
        <div className="container">
          <div className="rd-body-grid">

            {/* ── SIDEBAR ── */}
            <aside className="rd-sidebar">
              {/* Ingredients */}
              <div className="rd-card">
                <div className="rd-card-header">
                  <span className="rd-card-title">🥘 Ingredients</span>
                  <CopyBtn getText={getIngredientsText} label="Copy" />
                </div>
                <div className="serv-row">
                  <button className="serv-btn" onClick={() => setServings(Math.max(1, servings - 1))}>−</button>
                  <span className="serv-num">{servings}</span>
                  <button className="serv-btn" onClick={() => setServings(servings + 1)}>+</button>
                  <span className="serv-label">servings</span>
                </div>
                {(recipe.ingredients || []).map((ing, i) => (
                  <div key={i} className="ing-row">
                    <div className="ing-dot" />
                    <div>
                      <div className="ing-line">
                        <span className="ing-amt">{scaleAmt(ing.amount)}</span>
                        <span className="ing-name">{ing.item}</span>
                      </div>
                      {ing.notes && <div className="ing-note">{ing.notes}</div>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tips */}
              {recipe.tips?.length > 0 && (
                <div className="rd-card" style={{ marginTop: 20 }}>
                  <div className="rd-card-title">💡 Chef Tips</div>
                  {recipe.tips.map((tip, i) => (
                    <div key={i} className="tip-row">
                      <span className="tip-dot">✦</span>
                      <span className="tip-text">{tip}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Nutrition */}
              {recipe.nutritionTable && (
                <div className="rd-card" style={{ marginTop: 20 }}>
                  <div className="rd-card-title">📊 Nutrition</div>
                  <div className="nutr-grid">
                    {Object.entries(recipe.nutritionTable).slice(0, 6).map(([k, v]) => (
                      <div key={k} className="nutr-cell">
                        <div className="nutr-val">{v}</div>
                        <div className="nutr-lbl">{k}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>

            {/* ── MAIN CONTENT ── */}
            <main>
              <div className="tab-row">
                {[
                  { id: 'instructions', label: '👨‍🍳 Instructions' },
                  { id: 'nutrition', label: '📊 Full Nutrition' },
                  { id: 'article', label: '📖 About' },
                ].map(t => (
                  <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
                    {t.label}
                  </button>
                ))}
              </div>

              {activeTab === 'instructions' && (
                <div className="rd-card">
                  <div className="rd-card-header">
                    <span className="rd-card-title">Step by Step</span>
                    <CopyBtn getText={getInstructionsText} label="Copy Steps" />
                  </div>
                  {(recipe.instructions || []).map((step, i) => (
                    <div key={i} className="step-row">
                      <div className="step-num">{step.step}</div>
                      <div>
                        <div className="step-title">{step.title}</div>
                        <div className="step-text">{step.text}</div>
                        {step.time && <div className="step-time">⏱ {step.time}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'nutrition' && recipe.nutritionTable && (
                <div className="rd-card">
                  <div className="rd-card-title">📊 Full Nutrition per Serving</div>
                  <div className="nutr-grid-full">
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
                <div className="rd-card">
                  <div className="article-body" dangerouslySetInnerHTML={{ __html: recipe.article
                    .replace(/## (.+)/g, '<h2>$1</h2>')
                    .replace(/\n\n/g, '</p><p>')
                    .replace(/^/, '<p>').replace(/$/, '</p>') }} />
                </div>
              )}

              {/* Tags */}
              {recipe.tags && (
                <div className="tags-section">
                  <div className="tags-label">Tags</div>
                  <div className="tags-wrap">
                    {recipe.tags.map(t => <span key={t} className="tag-pill">{t}</span>)}
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      {/* Related Recipes */}
      {relatedRecipes.length > 0 && (
        <section className="related-section">
          <div className="container">
            <div className="section-label">{recipe.countryFlag} More from {recipe.countryName}</div>
            <h2 className="related-title">You Might Also Like</h2>
            <div className="related-grid">
              {relatedRecipes.slice(0, 3).map((r, i) => (
                <Link key={r.slug || i} href={`/recipes/${r.slug}`} className="related-card">
                  <div className="related-img-wrap">
                    <img src={r.image1} alt={r.title} className="related-img" loading="lazy" />
                  </div>
                  <div className="related-body">
                    <div className="related-cat">{r.categoryIcon} {r.categoryName}</div>
                    <div className="related-name">{r.title}</div>
                    <div className="related-meta">⏱ {r.totalTime} · ⭐ {r.rating}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CommentsSection slug={recipe.slug} />

      {/* Footer */}
      <footer className="rd-footer">
        <div className="container">
          <div className="rd-footer-inner">
            <Link href="/" className="rd-footer-logo">🍽️ FoodHive World</Link>
            <span className="rd-footer-copy">10 Countries · 12 Categories · Updated Every 30 Min</span>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════════
          ALL STYLES
          ══════════════════════════════════════════ */}
      <style jsx global>{`
        /* ── Base Font Override for Recipe Page ── */
        .rd-hero, .rd-body, .rd-navbar, .related-section, .comments-section, .rd-footer {
          font-family: 'DM Sans', sans-serif;
        }
        .rd-title, .related-title, .comments-title {
          font-family: 'DM Serif Display', serif;
        }

        /* ── Scroll Bar ── */
        .scroll-bar {
          position: fixed; top: 68px; left: 0; height: 3px;
          background: linear-gradient(90deg, #E07B39, #C9563B);
          z-index: 999; transition: width .1s linear; width: 0;
        }

        /* ── Not Found ── */
        .not-found {
          padding: 120px 24px; text-align: center;
          min-height: 100vh; background: #FAF6EE;
          font-family: 'DM Sans', sans-serif;
        }
        .not-found h1 {
          font-family: 'DM Serif Display', serif;
          font-size: 42px; margin-bottom: 20px;
        }

        /* ══════════ NAVBAR ══════════ */
        /* Override globals.css .navbar fixed positioning for this page */
        .navbar { display: none !important; }
        .rd-navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          height: 68px; background: rgba(250,246,238,0.97);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(224,123,57,0.12);
        }
        .rd-navbar-inner {
          max-width: 1300px; margin: 0 auto; padding: 0 32px;
          height: 100%; display: flex; align-items: center; gap: 16px;
        }
        .rd-back-btn {
          width: 40px; height: 40px; border-radius: 50%;
          border: 1.5px solid #E8DCC8; background: white;
          font-size: 18px; cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          color: #2C1810; transition: border-color .2s;
        }
        .rd-back-btn:hover { border-color: #E07B39; color: #E07B39; }
        .rd-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 20px; font-weight: 400; color: #2C1810;
          text-decoration: none; margin-right: auto;
        }
        .rd-nav-links { display: flex; gap: 4px; }
        .rd-nav-link {
          font-size: 14px; font-weight: 500; color: #7A6A5A;
          padding: 7px 16px; border-radius: 999px; text-decoration: none;
          transition: all .2s;
        }
        .rd-nav-link:hover { background: #F0E8D6; color: #2C1810; }

        /* ══════════ HERO ══════════ */
        .rd-hero {
          min-height: calc(100vh - 68px);
          background: #FAF6EE;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 0;
          overflow: hidden;
        }

        /* LEFT */
        .rd-hero-left {
          padding: 60px 48px 60px 60px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .rd-tags {
          display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px;
        }
        .rd-tag {
          font-size: 11px; font-weight: 600; padding: 5px 14px;
          border-radius: 999px; background: #F0E8D6; color: #6B5744;
          text-transform: uppercase; letter-spacing: .6px;
          text-decoration: none; transition: background .2s;
        }
        .rd-tag:hover { background: #E8DCC8; }
        .rd-tag-accent { background: rgba(224,123,57,.12); color: #C25A1E; }
        .rd-tag-accent:hover { background: rgba(224,123,57,.2); }

        .rd-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(34px, 4.5vw, 64px);
          font-weight: 400;
          color: #1A0F08;
          line-height: 1.08;
          letter-spacing: -.5px;
          margin: 0 0 16px;
        }
        .rd-rating-row {
          display: flex; align-items: center; gap: 10px; margin-bottom: 18px;
        }
        .rd-rating-num {
          font-family: 'DM Serif Display', serif;
          font-size: 22px; color: #E07B39;
        }
        .rd-rating-cnt { font-size: 13px; color: #9A8878; }

        .rd-desc {
          font-size: 15px; color: #6B5744;
          line-height: 1.75; margin-bottom: 28px;
          max-width: 460px;
        }

        /* Stats */
        .rd-stats-grid {
          display: flex; align-items: stretch;
          background: white; border-radius: 16px;
          padding: 16px 24px; gap: 0;
          box-shadow: 0 2px 16px rgba(44,24,16,.07);
          border: 1px solid #F0E8D6;
          margin-bottom: 28px;
          width: fit-content;
        }
        .rd-stat-item {
          display: flex; flex-direction: column; align-items: center;
          padding: 0 20px; gap: 4px;
        }
        .rd-stat-divider {
          width: 1px; background: #F0E8D6; align-self: stretch;
        }
        .rd-stat-icon { font-size: 18px; }
        .rd-stat-val {
          font-family: 'DM Serif Display', serif;
          font-size: 18px; color: #E07B39; font-weight: 400;
          white-space: nowrap;
        }
        .rd-stat-lbl {
          font-size: 10px; color: #9A8878; font-weight: 600;
          text-transform: uppercase; letter-spacing: .8px;
        }

        /* Actions */
        .rd-actions { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
        .rd-cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: #E07B39; color: white;
          font-size: 14px; font-weight: 600;
          padding: 13px 28px; border-radius: 999px; border: none;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: background .2s, transform .2s;
          box-shadow: 0 4px 16px rgba(224,123,57,.35);
        }
        .rd-cta-btn:hover { background: #C25A1E; transform: translateY(-1px); }
        .action-btn {
          display: inline-flex; align-items: center; gap: 7px;
          background: white; border: 1.5px solid #E8DCC8;
          color: #4A3728; font-size: 13px; font-weight: 600;
          padding: 10px 18px; border-radius: 999px; cursor: pointer;
          font-family: 'DM Sans', sans-serif; transition: all .2s;
        }
        .action-btn:hover { border-color: #E07B39; }
        .action-btn.liked { border-color: #E8526A; color: #E8526A; background: #FFF0F4; }
        .action-btn.copied { border-color: #3D9E8C; color: #3D9E8C; background: #E8F5F3; }

        /* RIGHT — IMAGE */
        .rd-hero-right {
          height: calc(100vh - 68px);
          min-height: 580px;
          position: relative;
          background: #EFE4D4;
        }
        .rd-image-frame {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
        }
        .rd-hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }
        /* Gradient overlay — bottom fade */
        .rd-image-frame::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 35%;
          background: linear-gradient(to top, rgba(26,15,8,.45) 0%, transparent 100%);
          pointer-events: none;
        }
        /* Badge bottom-left */
        .rd-image-badge {
          position: absolute;
          bottom: 28px; left: 28px;
          background: rgba(255,255,255,.92);
          backdrop-filter: blur(12px);
          border-radius: 14px;
          padding: 12px 18px;
          display: flex; align-items: center; gap: 12px;
          z-index: 2;
          box-shadow: 0 4px 20px rgba(0,0,0,.15);
        }
        .rd-badge-flag { font-size: 28px; }
        .rd-badge-cuisine {
          font-family: 'DM Serif Display', serif;
          font-size: 15px; color: #1A0F08; font-weight: 400;
        }
        .rd-badge-cat { font-size: 12px; color: #7A6A5A; margin-top: 2px; }

        /* ══════════ RECIPE BODY ══════════ */
        .rd-body { background: #FAF6EE; padding: 72px 0; }
        .container { max-width: 1300px; margin: 0 auto; padding: 0 40px; }
        .rd-body-grid {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 36px;
          align-items: start;
        }

        /* Sidebar */
        .rd-sidebar { position: sticky; top: 84px; }
        .rd-card {
          background: white; border-radius: 20px;
          padding: 28px; box-shadow: 0 2px 16px rgba(44,24,16,.07);
          border: 1px solid #F0E8D6;
        }
        .rd-card-header {
          display: flex; align-items: center;
          justify-content: space-between; margin-bottom: 20px;
        }
        .rd-card-title {
          font-family: 'DM Serif Display', serif;
          font-size: 20px; color: #1A0F08; font-weight: 400;
          margin-bottom: 18px; display: block;
        }
        .rd-card-header .rd-card-title { margin-bottom: 0; }

        /* Servings */
        .serv-row {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 20px; background: #FAF6EE;
          border-radius: 999px; padding: 8px 16px;
          border: 1px solid #F0E8D6; width: fit-content;
        }
        .serv-btn {
          width: 30px; height: 30px; border-radius: 50%;
          border: 1.5px solid #E8DCC8; background: white;
          font-size: 16px; font-weight: 700; color: #E07B39;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all .2s;
        }
        .serv-btn:hover { background: #E07B39; color: white; border-color: #E07B39; }
        .serv-num {
          font-family: 'DM Serif Display', serif;
          font-size: 22px; color: #1A0F08; min-width: 28px; text-align: center;
        }
        .serv-label { font-size: 12px; color: #9A8878; }

        /* Ingredients */
        .ing-row {
          display: flex; gap: 12px; padding: 9px 0;
          border-bottom: 1px dashed #F0E8D6; align-items: flex-start;
        }
        .ing-row:last-child { border-bottom: none; }
        .ing-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #E07B39; margin-top: 7px; flex-shrink: 0;
        }
        .ing-line { display: flex; gap: 8px; align-items: baseline; }
        .ing-amt { font-size: 13px; font-weight: 700; color: #E07B39; min-width: 58px; }
        .ing-name { font-size: 13px; color: #2C1810; }
        .ing-note { font-size: 11px; color: #9A8878; font-style: italic; margin-top: 2px; }

        /* Tips */
        .tip-row { display: flex; gap: 10px; padding: 9px 0; border-bottom: 1px dashed #F0E8D6; }
        .tip-row:last-child { border-bottom: none; }
        .tip-dot { color: #E07B39; font-size: 12px; margin-top: 2px; flex-shrink: 0; }
        .tip-text { font-size: 13px; color: #5A4A3A; line-height: 1.65; }

        /* Nutrition */
        .nutr-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .nutr-grid-full { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .nutr-cell {
          background: #FAF6EE; border-radius: 12px; padding: 12px 14px;
          border: 1px solid #F0E8D6;
        }
        .nutr-val {
          font-family: 'DM Serif Display', serif;
          font-size: 18px; color: #E07B39;
        }
        .nutr-lbl { font-size: 10px; color: #9A8878; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; }

        /* Copy button */
        .copy-btn {
          font-size: 11px; font-weight: 600; padding: 5px 12px;
          border-radius: 999px; border: 1.5px solid #E8DCC8;
          background: #FAF6EE; color: #7A6A5A; cursor: pointer;
          font-family: 'DM Sans', sans-serif; transition: all .2s;
        }
        .copy-btn:hover { border-color: #E07B39; color: #E07B39; }

        /* Tabs */
        .tab-row { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
        .tab-btn {
          padding: 9px 22px; border-radius: 999px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          border: 1.5px solid #E8DCC8; background: transparent;
          color: #7A6A5A; transition: all .2s;
          font-family: 'DM Sans', sans-serif;
        }
        .tab-btn:hover { border-color: #E07B39; color: #2C1810; }
        .tab-btn.active { background: #E07B39; color: white; border-color: #E07B39; }

        /* Steps */
        .step-row {
          display: flex; gap: 18px; padding: 20px 0;
          border-bottom: 1px solid #F0E8D6;
        }
        .step-row:last-child { border-bottom: none; }
        .step-num {
          width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
          background: #1A0F08; color: white;
          font-family: 'DM Serif Display', serif; font-size: 18px;
          display: flex; align-items: center; justify-content: center;
        }
        .step-title {
          font-family: 'DM Serif Display', serif;
          font-size: 18px; color: #1A0F08; margin-bottom: 6px;
        }
        .step-text { font-size: 13px; color: #6B5744; line-height: 1.8; }
        .step-time { font-size: 11px; color: #E07B39; font-weight: 600; margin-top: 6px; }

        /* Article */
        .article-body h2 {
          font-family: 'DM Serif Display', serif;
          font-size: 24px; color: #1A0F08;
          margin: 28px 0 12px;
        }
        .article-body p { font-size: 14px; color: #6B5744; line-height: 1.9; margin-bottom: 14px; }

        /* Tags */
        .tags-section { margin-top: 28px; }
        .tags-label { font-size: 11px; font-weight: 700; color: #9A8878; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
        .tags-wrap { display: flex; gap: 8px; flex-wrap: wrap; }
        .tag-pill {
          background: #F0E8D6; color: #6B5744;
          font-size: 12px; font-weight: 500;
          padding: 5px 14px; border-radius: 999px;
          border: 1px solid #E8DCC8;
        }

        /* ══════════ RELATED RECIPES ══════════ */
        .related-section { background: #F0E8D6; padding: 80px 0; }
        .section-label {
          font-size: 11px; font-weight: 700; color: #E07B39;
          text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;
        }
        .related-title {
          font-family: 'DM Serif Display', serif;
          font-size: 36px; color: #1A0F08; margin-bottom: 36px;
        }
        .related-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .related-card {
          background: white; border-radius: 16px; overflow: hidden;
          text-decoration: none; border: 1px solid #F0E8D6;
          transition: transform .2s, box-shadow .2s;
        }
        .related-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(44,24,16,.12); }
        .related-img-wrap { height: 180px; overflow: hidden; }
        .related-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .3s; }
        .related-card:hover .related-img { transform: scale(1.04); }
        .related-body { padding: 16px 18px 20px; }
        .related-cat { font-size: 11px; color: #E07B39; font-weight: 600; text-transform: uppercase; letter-spacing: .6px; margin-bottom: 6px; }
        .related-name {
          font-family: 'DM Serif Display', serif;
          font-size: 18px; color: #1A0F08; line-height: 1.2; margin-bottom: 8px;
        }
        .related-meta { font-size: 12px; color: #9A8878; }

        /* ══════════ COMMENTS ══════════ */
        .comments-section { background: #FAF6EE; padding: 80px 0; border-top: 1px solid #F0E8D6; }
        .comments-title {
          font-family: 'DM Serif Display', serif;
          font-size: 36px; color: #1A0F08; margin-bottom: 4px;
        }
        .comments-sub { font-size: 14px; color: #9A8878; margin-bottom: 36px; }
        .comment-form {
          background: white; border-radius: 20px; padding: 32px;
          box-shadow: 0 2px 16px rgba(44,24,16,.07);
          border-top: 3px solid #E07B39; margin-bottom: 40px;
        }
        .comment-form h3 {
          font-family: 'DM Serif Display', serif;
          font-size: 24px; color: #1A0F08; margin-bottom: 20px;
        }
        .rating-row { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; font-size: 13px; color: #7A6A5A; }
        .form-row { margin-bottom: 16px; }
        .form-row label { font-size: 11px; font-weight: 700; color: #9A8878; text-transform: uppercase; letter-spacing: .5px; display: block; margin-bottom: 6px; }
        .form-input, .form-textarea {
          width: 100%; border: 1.5px solid #E8DCC8; border-radius: 12px;
          padding: 12px 16px; font-size: 14px; font-family: 'DM Sans', sans-serif;
          color: #1A0F08; background: #FAF6EE; outline: none; transition: border-color .2s;
        }
        .form-input:focus, .form-textarea:focus { border-color: #E07B39; background: white; }
        .form-textarea { resize: vertical; }
        .char-count { font-size: 11px; color: #B5A898; text-align: right; margin-top: 4px; }
        .form-error { background: #FFF0F0; color: #C0392B; border: 1px solid #FCC; border-radius: 10px; padding: 10px 16px; font-size: 13px; margin-bottom: 14px; }
        .submit-btn {
          background: #1A0F08; color: white; font-size: 14px; font-weight: 600;
          padding: 14px 32px; border-radius: 999px; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; transition: background .2s;
        }
        .submit-btn:hover { background: #E07B39; }
        .submit-btn:disabled { background: #C0B0A0; cursor: not-allowed; }
        .comment-success {
          background: white; border-radius: 20px; padding: 48px 32px;
          text-align: center; margin-bottom: 40px;
          box-shadow: 0 2px 16px rgba(44,24,16,.07);
        }
        .comment-success h3 { font-family: 'DM Serif Display', serif; font-size: 24px; color: #1A0F08; margin-top: 12px; }
        .comments-loading, .comments-empty { text-align: center; padding: 48px; color: #9A8878; }
        .comments-list { display: flex; flex-direction: column; gap: 16px; }
        .comment-card {
          background: white; border-radius: 16px; padding: 22px 26px;
          box-shadow: 0 2px 12px rgba(44,24,16,.06); border-left: 3px solid #E07B39;
        }
        .comment-header { display: flex; align-items: center; gap: 14px; margin-bottom: 12px; }
        .comment-avatar {
          width: 42px; height: 42px; border-radius: 50%;
          background: linear-gradient(135deg, #E07B39, #C25A1E);
          color: white; font-family: 'DM Serif Display', serif;
          font-size: 20px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .comment-name { font-weight: 700; font-size: 15px; color: #1A0F08; }
        .comment-date { font-size: 12px; color: #B5A898; margin-top: 2px; }
        .comment-text { font-size: 14px; color: #6B5744; line-height: 1.75; }

        /* ══════════ FOOTER ══════════ */
        .rd-footer { background: #1A0F08; padding: 32px 0; }
        .rd-footer-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .rd-footer-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 20px; color: white; text-decoration: none;
        }
        .rd-footer-copy { font-size: 12px; color: rgba(255,255,255,.4); }

        /* ══════════ RESPONSIVE ══════════ */
        @media (max-width: 1100px) {
          .rd-hero { grid-template-columns: 1fr; min-height: auto; }
          .rd-hero-left { padding: 96px 24px 40px; }
          .rd-hero-right { height: 55vw; min-height: 320px; }
          .rd-body-grid { grid-template-columns: 1fr; }
          .rd-sidebar { position: static; }
          .related-grid { grid-template-columns: 1fr 1fr; }
          .nutr-grid-full { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .container { padding: 0 20px; }
          .rd-navbar-inner { padding: 0 20px; }
          .rd-nav-links { display: none; }
          .rd-title { font-size: clamp(28px, 8vw, 48px); }
          .rd-stats-grid { flex-wrap: wrap; gap: 12px; padding: 14px 16px; }
          .rd-stat-divider { display: none; }
          .rd-stat-item { padding: 0 12px; }
          .related-grid { grid-template-columns: 1fr; }
          .nutr-grid-full { grid-template-columns: repeat(2, 1fr); }
          .rd-hero-right { height: 70vw; }
        }
        @media (max-width: 480px) {
          .rd-hero-right { height: 80vw; }
          .rd-title { font-size: 28px; }
        }

        /* ── btn-primary for not-found ── */
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: #E07B39; color: white; font-size: 14px; font-weight: 600;
          padding: 13px 28px; border-radius: 999px; text-decoration: none;
          font-family: 'DM Sans', sans-serif;
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
  const related = all.filter(r => r.slug !== recipe.slug && r.country === recipe.country).slice(0, 3)
  return { props: { recipe, relatedRecipes: related }, revalidate: 60 }
}
