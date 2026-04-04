// ============================================================
// FoodHive World — pages/recipes/[slug].js  (UPDATED)
// ✅ LikesButton     → /api/sb-likes    (Supabase)
// ✅ CommentsSection → /api/sb-comments (Supabase)
// ✅ ShareButton     → Link + Text + WhatsApp + Twitter + Facebook
// ✅ Purana Airtable code safe hai
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

// ══════════════════════════════════════════════
// ⭐ STAR RATING COMPONENT
// ══════════════════════════════════════════════
function StarRating({ value = 5, interactive = false, onRate }) {
  const [hover, setHover] = useState(0)
  const display = hover || value
  return (
    <div style={{ display: 'flex', gap: 3, cursor: interactive ? 'pointer' : 'default' }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span
          key={s}
          style={{
            fontSize:   interactive ? 26 : 18,
            color:      s <= display ? '#E8873A' : '#ddd',
            transition: 'color .15s',
            lineHeight: 1,
          }}
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate?.(s)}
        >
          ★
        </span>
      ))}
    </div>
  )
}

// ══════════════════════════════════════════════
// ❤️ LIKES BUTTON — Supabase /api/sb-likes
// ══════════════════════════════════════════════
function LikesButton({ slug }) {
  const [count,     setCount]     = useState(0)
  const [liked,     setLiked]     = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    // Supabase se count lao
    fetch(`/api/sb-likes?slug=${slug}`)
      .then(r => r.json())
      .then(d => setCount(d.count || 0))
      .catch(() => {})

    // localStorage se liked status check karo
    const likedSet = JSON.parse(localStorage.getItem('fh_liked') || '[]')
    setLiked(likedSet.includes(slug))
  }, [slug])

  const toggleLike = async () => {
    if (liked) return // already liked — prevent double
    setAnimating(true)

    // localStorage update
    const likedSet = JSON.parse(localStorage.getItem('fh_liked') || '[]')
    likedSet.push(slug)
    localStorage.setItem('fh_liked', JSON.stringify(likedSet))
    setLiked(true)

    try {
      const r = await fetch('/api/sb-likes', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ slug }),
      })
      const d = await r.json()
      setCount(d.count || count + 1)
    } catch {
      setCount(c => c + 1)
    }

    setTimeout(() => setAnimating(false), 600)
  }

  return (
    <button
      onClick={toggleLike}
      className={`likes-btn${liked ? ' liked' : ''}${animating ? ' animating' : ''}`}
      title={liked ? 'Liked!' : 'Like this recipe'}
    >
      <span className="likes-heart">{liked ? '❤️' : '🤍'}</span>
      <span className="likes-count">{count}</span>
      <span className="likes-label">{liked ? 'Liked' : 'Like'}</span>
    </button>
  )
}

// ══════════════════════════════════════════════
// 🔗 SHARE BUTTON — Link + Text + WhatsApp + Twitter + Facebook
// ══════════════════════════════════════════════
function ShareButton({ title, slug, description }) {
  const [copied,   setCopied]   = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const url       = `https://foodhive.vercel.app/recipes/${slug}`
  const shareText = `${title} — Authentic recipe on FoodHive World!\n${url}`

  // Link copy
  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setShowMenu(false)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  // Recipe text copy (title + description + link)
  const copyRecipeText = () => {
    const text = `🍽️ ${title}\n\n${description || ''}\n\n📖 Full Recipe:\n${url}\n\n— FoodHive World`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setShowMenu(false)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  // WhatsApp
  const shareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      '_blank'
    )
    setShowMenu(false)
  }

  // Twitter / X
  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title + ' — Authentic recipe!')}&url=${encodeURIComponent(url)}&hashtags=FoodHive,Recipe`,
      '_blank'
    )
    setShowMenu(false)
  }

  // Facebook
  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank'
    )
    setShowMenu(false)
  }

  // Main button click
  const handleMainClick = () => {
    if (navigator.share) {
      // Mobile native share sheet
      navigator.share({ title, text: shareText, url }).catch(() => {})
    } else {
      // Desktop dropdown
      setShowMenu(prev => !prev)
    }
  }

  // Bahar click pe menu band karo
  useEffect(() => {
    if (!showMenu) return
    const close = () => setShowMenu(false)
    document.addEventListener('click', close, { once: true })
    return () => document.removeEventListener('click', close)
  }, [showMenu])

  const menuItems = [
    { icon: '🔗', label: 'Link Copy Karein',  action: copyLink       },
    { icon: '📋', label: 'Recipe Text Copy',  action: copyRecipeText },
    { icon: '💬', label: 'WhatsApp pe Share', action: shareWhatsApp  },
    { icon: '🐦', label: 'Twitter / X',       action: shareTwitter   },
    { icon: '📘', label: 'Facebook',          action: shareFacebook  },
  ]

  return (
    <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
      <button onClick={handleMainClick} className="share-btn">
        {copied ? '✅ Copy Ho Gaya!' : '🔗 Share'}
      </button>

      {showMenu && (
        <div className="share-dropdown">
          {menuItems.map(item => (
            <button
              key={item.label}
              onClick={item.action}
              className="share-dropdown-item"
            >
              <span className="share-dropdown-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════
// 💬 COMMENTS SECTION — Supabase /api/sb-comments
// ══════════════════════════════════════════════
function CommentsSection({ slug }) {
  const [comments,   setComments]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)
  const [error,      setError]      = useState('')
  const [form, setForm] = useState({ name: '', email: '', comment: '', rating: 5 })

  useEffect(() => {
    fetch(`/api/sb-comments?slug=${slug}`)
      .then(r => r.json())
      .then(d => { setComments(d.comments || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [slug])

  const submit = async e => {
    e.preventDefault()
    if (!form.name.trim() || !form.comment.trim()) {
      setError('Naam aur comment required hain.')
      return
    }
    setSubmitting(true)
    setError('')

    try {
      const r = await fetch('/api/sb-comments', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ slug, ...form }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Failed')

      setSubmitted(true)
      setComments(prev => [{
        id:      d.id,
        name:    form.name,
        comment: form.comment,
        rating:  form.rating,
        date:    new Date().toISOString(),
      }, ...prev])
      setForm({ name: '', email: '', comment: '', rating: 5 })
    } catch (err) {
      setError(err.message)
    }
    setSubmitting(false)
  }

  return (
    <section className="comments-section">
      <div className="container">
        <h2 className="comments-title">💬 Reviews & Comments</h2>
        <p className="comments-sub">
          {comments.length} review{comments.length !== 1 ? 's' : ''} — Powered by Supabase ⚡
        </p>

        {/* ── Comment Form ── */}
        {!submitted ? (
          <form className="comment-form" onSubmit={submit}>
            <h3 className="cf-title">Apna Review Dein</h3>

            <div className="cf-rating-row">
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray)', marginRight: 10 }}>
                Rating:
              </span>
              <StarRating
                value={form.rating}
                interactive
                onRate={v => setForm(p => ({ ...p, rating: v }))}
              />
            </div>

            <div className="cf-row">
              <div className="cf-field">
                <label>Naam *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Aapka naam"
                  maxLength={100}
                  required
                />
              </div>
              <div className="cf-field">
                <label>Email <span style={{ color: 'var(--gray-l)' }}>(optional)</span></label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="cf-field">
              <label>Comment *</label>
              <textarea
                value={form.comment}
                onChange={e => setForm(p => ({ ...p, comment: e.target.value }))}
                placeholder="Is recipe ke baare mein apna experience share karein..."
                rows={4}
                maxLength={1000}
                required
              />
              <span style={{ fontSize: 11, color: 'var(--gray-l)', float: 'right' }}>
                {form.comment.length}/1000
              </span>
            </div>

            {error && <div className="cf-error">⚠️ {error}</div>}

            <button type="submit" className="cf-submit" disabled={submitting}>
              {submitting ? '⏳ Post ho raha hai...' : '✉️ Review Submit Karein'}
            </button>
          </form>
        ) : (
          <div className="cf-success">
            <div style={{ fontSize: 48 }}>🎉</div>
            <h3>Shukriya!</h3>
            <p>Aapka review successfully post ho gaya.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="cf-submit"
              style={{ marginTop: 12 }}
            >
              Aur Review Likhein
            </button>
          </div>
        )}

        {/* ── Comments List ── */}
        {loading ? (
          <div className="comments-loading">Reviews load ho rahe hain...</div>
        ) : comments.length === 0 ? (
          <div className="comments-empty">
            <div style={{ fontSize: 40, marginBottom: 8 }}>✍️</div>
            <p>Abhi tak koi review nahi. Pehle aap likhein!</p>
          </div>
        ) : (
          <div className="comments-list">
            {comments.map((c, i) => (
              <div key={c.id || i} className="comment-card">
                <div className="comment-header">
                  <div className="comment-avatar">{(c.name || 'A')[0].toUpperCase()}</div>
                  <div>
                    <div className="comment-name">{c.name}</div>
                    <div className="comment-date">
                      {new Date(c.date).toLocaleDateString('en-PK', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <StarRating value={c.rating || 5} />
                  </div>
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
// 🃏 TINY RECIPE CARD
// ══════════════════════════════════════════════
function RecipeCard({ recipe }) {
  return (
    <Link href={`/recipes/${recipe.slug}`}>
      <div className="recipe-card">
        <div className="rc-img-wrap">
          <div className="rc-circle">
            <img src={recipe.image2 || recipe.image1} alt={recipe.title} loading="lazy" />
          </div>
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

// ══════════════════════════════════════════════
// 📄 MAIN PAGE
// ══════════════════════════════════════════════
export default function RecipeDetail({ recipe, relatedRecipes }) {
  const [servings,     setServings]     = useState(recipe?.servings || 4)
  const [activeTab,    setActiveTab]    = useState('instructions')
  const [activeMiniTab, setActiveMiniTab] = useState(recipe?.category || 'breakfast')
  const bodyRef = useRef(null)
  const router  = useRouter()

  useEffect(() => { window.scrollTo(0, 0) }, [recipe?.slug])

  useEffect(() => {
    const bar = document.querySelector('.scroll-bar')
    if (!bar) return
    const fn = () => {
      bar.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%'
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  if (!recipe) return (
    <div style={{ padding: '100px 24px', textAlign: 'center', minHeight: '100vh', background: 'var(--cream)' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🍽️</div>
      <h1 style={{ fontFamily: 'var(--font-title)', fontSize: 48, marginBottom: 16 }}>Recipe Not Found</h1>
      <Link href="/recipes" className="btn-primary">← Browse All Recipes</Link>
    </div>
  )

  const mult     = servings / (recipe.servings || 4)
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
        <meta property="og:title"       content={`${recipe.title} | FoodHive World`} />
        <meta property="og:description" content={recipe.description} />
        <meta property="og:image"       content={recipe.image1} />
        <meta property="og:type"        content="article" />
        <link rel="canonical" href={`https://foodhive.vercel.app/recipes/${recipe.slug}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context':       'https://schema.org',
            '@type':          'Recipe',
            name:             recipe.title,
            description:      recipe.description,
            image:            [recipe.image1, recipe.image2].filter(Boolean),
            author:           { '@type': 'Organization', name: 'FoodHive World' },
            datePublished:    recipe.publishedAt,
            prepTime:         `PT${(recipe.prepTime  || '15 min').replace(/\D/g, '')}M`,
            cookTime:         `PT${(recipe.cookTime  || '30 min').replace(/\D/g, '')}M`,
            totalTime:        `PT${(recipe.totalTime || '45 min').replace(/\D/g, '')}M`,
            recipeYield:      `${recipe.servings} servings`,
            recipeCategory:   recipe.categoryName,
            recipeCuisine:    recipe.cuisine,
            keywords:         (recipe.tags || []).join(', '),
            aggregateRating:  { '@type': 'AggregateRating', ratingValue: recipe.rating || 4.8, reviewCount: recipe.reviews || 100 },
            nutrition:        { '@type': 'NutritionInformation', calories: recipe.nutritionTable?.calories, proteinContent: recipe.nutritionTable?.protein, carbohydrateContent: recipe.nutritionTable?.carbs, fatContent: recipe.nutritionTable?.fat },
            recipeIngredient: (recipe.ingredients   || []).map(i => `${i.amount} ${i.item}`),
            recipeInstructions:(recipe.instructions || []).map(s => ({ '@type': 'HowToStep', name: s.title, text: s.text })),
          })}}
        />
      </Head>

      <div className="scroll-bar" />

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="navbar-inner">
          <button className="rd-back" onClick={() => router.back()} aria-label="Go back">←</button>
          <div className="rd-mini-nav">
            {miniTabs.map(t => (
              <button
                key={t}
                className={`rd-mini-link${activeMiniTab === t ? ' active' : ''}`}
                onClick={() => setActiveMiniTab(t)}
              >
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

      {/* ── RECIPE HERO ── */}
      <section className="rd-hero">
        <div className="rd-hero-blob" />
        <div className="rd-hero-inner">

          {/* LEFT — Recipe Info */}
          <div className="fade-up">
            <div className="rd-tags">
              <span className="rd-tag rd-tag-country">{recipe.countryFlag} {recipe.countryName}</span>
              <span className="rd-tag rd-tag-cat">{recipe.categoryIcon} {recipe.categoryName}</span>
              <span className="rd-tag rd-tag-diff">⚡ {recipe.difficulty}</span>
            </div>

            <h1 className="rd-title">{recipe.title}</h1>
            <p className="rd-desc">{recipe.description}</p>

            <div className="rd-rating-row">
              <StarRating value={Math.round(recipe.rating || 5)} />
              <span className="rd-rating-num">{recipe.rating}</span>
              <span className="rd-rating-cnt">({recipe.reviews} reviews)</span>
            </div>

            <div className="rd-stats">
              {[
                { v: recipe.prepTime,                  l: 'Prep'   },
                { v: recipe.cookTime,                  l: 'Cook'   },
                { v: recipe.totalTime,                 l: 'Total'  },
                { v: (recipe.servings || 4) + ' ppl',  l: 'Serves' },
              ].map(s => (
                <div key={s.l} className="rd-stat">
                  <div className="rd-stat-val">{s.v}</div>
                  <div className="rd-stat-lbl">{s.l}</div>
                </div>
              ))}
            </div>

            {/* ── Action Buttons ── */}
            <div className="rd-action-row">
              <button
                className="rd-cta"
                onClick={() => bodyRef.current?.scrollIntoView({ behavior: 'smooth' })}
              >
                📖 View Full Recipe
              </button>

              {/* ❤️ Supabase Likes */}
              <LikesButton slug={recipe.slug} />

              {/* 🔗 Full Share Menu */}
              <ShareButton
                title={recipe.title}
                slug={recipe.slug}
                description={recipe.description}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24, alignItems: 'center', color: 'var(--gray-l)', fontSize: 12, fontWeight: 600 }}>
              <div className="rd-arrow" onClick={() => bodyRef.current?.scrollIntoView({ behavior: 'smooth' })}>↓</div>
              <span>Scroll for full recipe</span>
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
                  <div
                    className="rd-sat"
                    style={{
                      top:       p.top,
                      left:      p.left,
                      width:     p.size,
                      height:    p.size,
                      transform: `translate(${p.tx},-50%)`,
                      animationDelay: p.delay,
                    }}
                  >
                    <img src={r.image2 || r.image1} alt={r.title} />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── RECIPE BODY ── */}
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
                  <div className="rd-box-head" style={{ marginTop: 28 }}>💡 Chef Tips</div>
                  {recipe.tips.map((tip, i) => (
                    <div key={i} className="tip-row">
                      <span className="tip-icon">✨</span>
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
                      <div key={k} style={{ background: 'var(--cream)', borderRadius: 12, padding: '10px 12px', border: '1px solid var(--cream2)' }}>
                        <div style={{ fontFamily: 'var(--font-title)', fontSize: 17, fontWeight: 700, color: 'var(--orange)' }}>{v}</div>
                        <div style={{ fontSize: 10, color: 'var(--gray)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: .5 }}>{k}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* MAIN CONTENT */}
            <div>
              <div className="tab-row">
                {[
                  { id: 'instructions', label: '👨‍🍳 Instructions' },
                  { id: 'nutrition',    label: '📊 Full Nutrition' },
                  { id: 'article',      label: '📖 About'          },
                ].map(t => (
                  <button
                    key={t.id}
                    className={`tab-btn${activeTab === t.id ? ' active' : ''}`}
                    onClick={() => setActiveTab(t.id)}
                  >
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
                  <div className="rd-box-head">📊 Full Nutrition per Serving</div>
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
                  <div
                    className="article-body"
                    dangerouslySetInnerHTML={{ __html:
                      recipe.article
                        .replace(/## (.+)/g, '<h2>$1</h2>')
                        .replace(/\n\n/g, '</p><p>')
                        .replace(/^/, '<p>')
                        .replace(/$/, '</p>')
                    }}
                  />
                </div>
              )}

              {recipe.tags && (
                <div style={{ marginTop: 28 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Tags</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {recipe.tags.map(t => (
                      <span key={t} style={{ background: 'var(--cream2)', color: 'var(--gray)', fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 'var(--r-full)', border: '1px solid var(--cream3)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── RELATED RECIPES ── */}
      {relatedRecipes.length > 0 && (
        <section className="section" style={{ background: 'var(--cream2)' }}>
          <div className="container">
            <div style={{ marginBottom: 48 }} className="fade-up">
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

      {/* ── 💬 SUPABASE COMMENTS ── */}
      <CommentsSection slug={recipe.slug} />

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-logo-txt">🍽️ FoodHive World</div>
              <p className="footer-desc">Authentic recipes from 10 world cuisines, auto-published every 30 minutes.</p>
            </div>
            <div>
              <div className="footer-col-title">Countries</div>
              {COUNTRIES.slice(0, 5).map(c => (
                <Link key={c.id} href={`/countries/${c.id}`} className="footer-link">{c.flag} {c.name}</Link>
              ))}
            </div>
            <div>
              <div className="footer-col-title">More</div>
              {COUNTRIES.slice(5).map(c => (
                <Link key={c.id} href={`/countries/${c.id}`} className="footer-link">{c.flag} {c.name}</Link>
              ))}
            </div>
            <div>
              <div className="footer-col-title">Categories</div>
              {RECIPE_CATEGORIES.slice(0, 6).map(c => (
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

      {/* ── STYLES ── */}
      <style jsx>{`

        /* ── Action row ── */
        .rd-action-row {
          display: flex; gap: 12px; align-items: center;
          flex-wrap: wrap; margin-top: 24px;
        }

        /* ── Likes button ── */
        .likes-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: white; border: 2px solid var(--cream2);
          color: var(--gray); font-size: 14px; font-weight: 700;
          padding: 12px 22px; border-radius: var(--r-full);
          cursor: pointer; transition: all .25s; box-shadow: var(--sh-soft);
          font-family: var(--font-body);
        }
        .likes-btn:hover        { border-color: #e74c6b; color: #e74c6b; transform: translateY(-1px); }
        .likes-btn.liked        { border-color: #e74c6b; color: #e74c6b; background: #fff0f3; }
        .likes-btn.animating .likes-heart { animation: heartPop .5s cubic-bezier(.34,1.56,.64,1); }
        .likes-heart  { font-size: 18px; }
        .likes-count  { font-family: var(--font-title); font-size: 18px; }
        .likes-label  { font-size: 13px; }
        @keyframes heartPop {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.6); }
          100% { transform: scale(1); }
        }

        /* ── Share button ── */
        .share-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: white; border: 2px solid var(--cream2);
          color: var(--gray); font-size: 14px; font-weight: 700;
          padding: 12px 22px; border-radius: var(--r-full);
          cursor: pointer; transition: all .2s; box-shadow: var(--sh-soft);
          font-family: var(--font-body);
        }
        .share-btn:hover { border-color: var(--teal); color: var(--teal); transform: translateY(-1px); }

        /* ── Share dropdown ── */
        .share-dropdown {
          position: absolute; top: 110%; left: 0;
          background: white; border-radius: 18px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.18);
          padding: 8px; min-width: 215px; z-index: 200;
          border: 1px solid var(--cream2);
          animation: fadeUp .2s ease both;
        }
        .share-dropdown-item {
          display: flex; align-items: center; gap: 10px;
          width: 100%; padding: 11px 14px; border: none;
          background: none; cursor: pointer; border-radius: 12px;
          font-size: 13px; font-weight: 600; color: var(--dark);
          font-family: var(--font-body); transition: background .15s; text-align: left;
        }
        .share-dropdown-item:hover { background: var(--cream); }
        .share-dropdown-icon { font-size: 20px; width: 28px; text-align: center; }

        /* ── Orbit satellites ── */
        .rd-sat {
          position: absolute; border-radius: 50%; overflow: hidden;
          border: 3px solid white; box-shadow: var(--sh-card);
          cursor: pointer; z-index: 5;
          transition: transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s;
          animation: rdSatFloat 3s ease-in-out infinite;
        }
        .rd-sat:hover { transform: scale(1.18) !important; box-shadow: var(--sh-float); z-index: 20; }
        .rd-sat img   { width: 100%; height: 100%; object-fit: cover; }
        @keyframes rdSatFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

        /* ══════════════════════════════════
           COMMENTS SECTION
           ══════════════════════════════════ */
        .comments-section {
          background: var(--cream); padding: 80px 0;
          border-top: 1px solid var(--cream2);
        }
        .comments-title {
          font-family: var(--font-title); font-size: clamp(28px,3.5vw,44px);
          font-weight: 700; color: var(--dark); margin-bottom: 6px;
        }
        .comments-sub { font-size: 14px; color: var(--gray); margin-bottom: 40px; }

        /* Comment form */
        .comment-form {
          background: white; border-radius: var(--r-xl); padding: 32px;
          box-shadow: var(--sh-soft); margin-bottom: 48px;
          border-top: 4px solid var(--teal);
        }
        .cf-title {
          font-family: var(--font-title); font-size: 24px; font-weight: 700;
          color: var(--dark); margin-bottom: 16px;
        }
        .cf-rating-row {
          display: flex; align-items: center; gap: 10px; margin-bottom: 20px;
          background: var(--cream); border-radius: var(--r-full); padding: 12px 20px;
          width: fit-content;
        }
        .cf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        .cf-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        .cf-field label {
          font-size: 12px; font-weight: 700; color: var(--gray);
          text-transform: uppercase; letter-spacing: .5px;
        }
        .cf-field input, .cf-field textarea {
          border: 2px solid var(--cream2); border-radius: var(--r-md);
          padding: 11px 16px; font-size: 14px; font-family: var(--font-body);
          color: var(--dark); background: var(--cream); outline: none;
          transition: border-color .2s; resize: vertical;
        }
        .cf-field input:focus, .cf-field textarea:focus {
          border-color: var(--teal); background: white;
        }
        .cf-error {
          background: #fff0f0; color: #c0392b; border: 1px solid #fdc;
          border-radius: var(--r-md); padding: 10px 16px; font-size: 13px; margin-bottom: 12px;
        }
        .cf-submit {
          background: var(--teal); color: white; font-size: 14px; font-weight: 700;
          padding: 14px 32px; border-radius: var(--r-full); border: none; cursor: pointer;
          font-family: var(--font-body); transition: all .25s;
          box-shadow: 0 6px 20px rgba(61,158,140,.35);
        }
        .cf-submit:hover    { background: var(--teal-d); transform: translateY(-1px); }
        .cf-submit:disabled { opacity: .6; cursor: not-allowed; transform: none; }
        .cf-success {
          background: white; border-radius: var(--r-xl); padding: 48px 32px;
          text-align: center; box-shadow: var(--sh-soft); border-top: 4px solid var(--teal);
          margin-bottom: 48px;
        }
        .cf-success h3 { font-family: var(--font-title); font-size: 26px; margin: 12px 0 8px; color: var(--dark); }
        .cf-success p  { color: var(--gray); font-size: 14px; }

        /* Comments list */
        .comments-loading, .comments-empty {
          text-align: center; padding: 48px; color: var(--gray); font-size: 14px;
          background: white; border-radius: var(--r-xl); box-shadow: var(--sh-soft);
        }
        .comments-list   { display: flex; flex-direction: column; gap: 20px; }
        .comment-card {
          background: white; border-radius: var(--r-xl); padding: 24px 28px;
          box-shadow: var(--sh-soft); border-left: 4px solid var(--olive-l);
          transition: transform .2s, box-shadow .2s;
        }
        .comment-card:hover { transform: translateY(-2px); box-shadow: var(--sh-card); }
        .comment-header {
          display: flex; align-items: center; gap: 14px; margin-bottom: 14px;
        }
        .comment-avatar {
          width: 44px; height: 44px; border-radius: 50%;
          background: var(--olive); color: white;
          font-family: var(--font-title); font-size: 20px; font-weight: 700;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .comment-name { font-weight: 700; font-size: 15px; color: var(--dark); }
        .comment-date { font-size: 12px; color: var(--gray-l); margin-top: 2px; }
        .comment-text { font-size: 14px; color: var(--gray); line-height: 1.75; }

        /* Responsive */
        @media (max-width: 640px) {
          .cf-row          { grid-template-columns: 1fr; }
          .rd-action-row   { flex-direction: column; align-items: flex-start; }
          .comment-header  { flex-wrap: wrap; }
          .share-dropdown  { min-width: 185px; }
        }
      `}</style>
    </>
  )
}

// ══════════════════════════════════════════════
// DATA FETCHING
// ══════════════════════════════════════════════
export async function getStaticPaths() {
  return { paths: getAllRecipeSlugs(), fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  let recipe = getRecipeBySlug(params.slug)
  if (!recipe) recipe = SAMPLE_RECIPE

  const all     = getAllRecipes()
  const related = all.filter(r => r.slug !== recipe.slug && r.country === recipe.country).slice(0, 5)

  return { props: { recipe, relatedRecipes: related }, revalidate: 60 }
}
