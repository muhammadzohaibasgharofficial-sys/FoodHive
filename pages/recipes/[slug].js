// ============================================================
// FoodHive World — pages/recipes/[slug].js
// ✅ Same original design kept
// ✅ English only
// ✅ Professional like button with subtle animation
// ✅ Rating with score + bar breakdown (AllRecipes style)
// ✅ Clean share dropdown
// ✅ Supabase likes + comments
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

// ── Star Rating — display only ──
function StarRating({ value = 5, size = 15 }) {
  return (
    <div style={{ display: 'flex', gap: 1 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ fontSize: size, color: s <= Math.round(value) ? '#f59e0b' : '#d1d5db', lineHeight: 1 }}>★</span>
      ))}
    </div>
  )
}

// ── Interactive Star Rating — for form ──
function StarRatingInput({ value = 5, onRate }) {
  const [hover, setHover] = useState(0)
  const display = hover || value
  return (
    <div style={{ display: 'flex', gap: 3, cursor: 'pointer' }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span
          key={s}
          style={{ fontSize: 22, color: s <= display ? '#f59e0b' : '#d1d5db', lineHeight: 1, transition: 'color .1s' }}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onRate?.(s)}
        >★</span>
      ))}
    </div>
  )
}

// ── Rating Display — AllRecipes style with score + bars ──
function RatingDisplay({ rating = 4.8, reviews = 0 }) {
  const bars = [
    { star: 5, pct: 75 },
    { star: 4, pct: 15 },
    { star: 3, pct: 6 },
    { star: 2, pct: 2 },
    { star: 1, pct: 2 },
  ]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', margin: '0 0 28px' }}>
      {/* Big score */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 42, fontWeight: 700, color: 'var(--dark)', lineHeight: 1, fontFamily: 'var(--font-serif)' }}>{rating}</div>
        <StarRating value={rating} size={13} />
        <div style={{ fontSize: 11, color: 'var(--gray)', marginTop: 3 }}>{reviews} ratings</div>
      </div>
      {/* Divider */}
      <div style={{ width: 1, height: 60, background: 'var(--cream2)' }} />
      {/* Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {bars.map(b => (
          <div key={b.star} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--gray)', width: 8, textAlign: 'right' }}>{b.star}</span>
            <span style={{ fontSize: 11, color: '#f59e0b' }}>★</span>
            <div style={{ width: 80, height: 6, background: 'var(--cream2)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: b.pct + '%', height: '100%', background: '#f59e0b', borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Like Button — professional with subtle animation ──
function LikeButton({ slug }) {
  const [count, setCount] = useState(0)
  const [liked, setLiked] = useState(false)
  const [pop, setPop] = useState(false)

  useEffect(() => {
    fetch(`/api/sb-likes?slug=${slug}`)
      .then(r => r.json()).then(d => setCount(d.count || 0)).catch(() => {})
    const likedSet = JSON.parse(localStorage.getItem('fh_liked') || '[]')
    setLiked(likedSet.includes(slug))
  }, [slug])

  const handleLike = async () => {
    if (liked) return
    setPop(true)
    setTimeout(() => setPop(false), 400)
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
    <>
      <style>{`
        @keyframes heartPop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.35); }
          70%  { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .like-icon-pop { animation: heartPop 0.4s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
      <button
        onClick={handleLike}
        disabled={liked}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          background: liked ? '#fff5f5' : 'white',
          border: liked ? '1.5px solid #fca5a5' : '1.5px solid var(--cream3)',
          color: liked ? '#dc2626' : 'var(--gray)',
          fontSize: 13, fontWeight: 600,
          padding: '9px 18px', borderRadius: 8,
          cursor: liked ? 'default' : 'pointer',
          transition: 'border-color .2s, color .2s, background .2s',
          fontFamily: 'var(--font-body)',
        }}
      >
        <span
          className={pop ? 'like-icon-pop' : ''}
          style={{ display: 'inline-flex', lineHeight: 1 }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24"
            fill={liked ? '#dc2626' : 'none'}
            stroke={liked ? '#dc2626' : 'currentColor'}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </span>
        <span>{liked ? 'Liked' : 'Like'}</span>
        {count > 0 && (
          <span style={{
            background: liked ? '#fca5a5' : 'var(--cream2)',
            color: liked ? '#7f1d1d' : 'var(--gray)',
            fontSize: 11, fontWeight: 600,
            padding: '1px 7px', borderRadius: 20,
            transition: 'all .2s',
          }}>{count}</span>
        )}
      </button>
    </>
  )
}

// ── Share Button — clean dropdown ──
function ShareButton({ title, slug, description }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const url = `https://food-hive-one.vercel.app/recipes/${slug}`

  const copy = () => { navigator.clipboard.writeText(url).then(() => { setCopied(true); setOpen(false); setTimeout(() => setCopied(false), 2000) }) }
  const copyText = () => { navigator.clipboard.writeText(`${title}\n\n${description || ''}\n\n${url}`).then(() => { setCopied(true); setOpen(false); setTimeout(() => setCopied(false), 2000) }) }
  const whatsapp = () => { window.open(`https://wa.me/?text=${encodeURIComponent(title + '\n' + url)}`, '_blank'); setOpen(false) }
  const twitter  = () => { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&hashtags=FoodHive,Recipe`, '_blank'); setOpen(false) }
  const facebook = () => { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank'); setOpen(false) }

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    document.addEventListener('click', close, { once: true })
    return () => document.removeEventListener('click', close)
  }, [open])

  const menuItems = [
    { icon: '🔗', label: 'Copy link',         fn: copy      },
    { icon: '📋', label: 'Copy recipe text',   fn: copyText  },
    { icon: '💬', label: 'Share on WhatsApp',  fn: whatsapp  },
    { icon: '𝕏',  label: 'Share on Twitter',   fn: twitter   },
    { icon: '📘', label: 'Share on Facebook',  fn: facebook  },
  ]

  return (
    <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
      <button
        onClick={() => { if (navigator.share) { navigator.share({ title, url }).catch(() => {}) } else { setOpen(p => !p) } }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          background: 'white', border: '1.5px solid var(--cream3)',
          color: 'var(--gray)', fontSize: 13, fontWeight: 600,
          padding: '9px 18px', borderRadius: 8,
          cursor: 'pointer', fontFamily: 'var(--font-body)',
          transition: 'border-color .2s, color .2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--olive)'; e.currentTarget.style.color = 'var(--dark)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cream3)'; e.currentTarget.style.color = 'var(--gray)' }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        {copied ? 'Copied!' : 'Share'}
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0,
          background: 'white', border: '1px solid var(--cream2)',
          borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          padding: 4, minWidth: 190, zIndex: 200,
        }}>
          {menuItems.map(item => (
            <button key={item.label} onClick={item.fn} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '8px 12px', border: 'none',
              background: 'none', cursor: 'pointer', borderRadius: 7,
              fontSize: 13, fontWeight: 500, color: 'var(--dark)',
              fontFamily: 'var(--font-body)', textAlign: 'left',
              transition: 'background .15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--cream)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <span style={{ fontSize: 14, width: 20, textAlign: 'center', fontStyle: 'normal' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Comments Section — clean English ──
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
      if (!r.ok) throw new Error(d.error || 'Something went wrong')
      setSubmitted(true)
      setComments(prev => [{ id: d.id, name: form.name, comment: form.comment, rating: form.rating, date: new Date().toISOString() }, ...prev])
      setForm({ name: '', email: '', comment: '', rating: 5 })
    } catch (err) { setError(err.message) }
    setSubmitting(false)
  }

  return (
    <section className="comments-section">
      <div className="container">
        <h2 className="comments-title">
          Reviews &amp; Comments
          <span className="comments-badge">{comments.length}</span>
        </h2>

        {/* Write a Review form */}
        {!submitted ? (
          <form className="comment-form" onSubmit={submit}>
            <h3 className="cf-heading">Write a Review</h3>
            <div className="cf-rating-row">
              <span className="cf-label">Your Rating</span>
              <StarRatingInput value={form.rating} onRate={v => setForm(p => ({ ...p, rating: v }))} />
            </div>
            <div className="cf-row">
              <div className="cf-field">
                <label className="cf-label">Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Your name"
                  maxLength={100} required
                />
              </div>
              <div className="cf-field">
                <label className="cf-label">Email <span className="cf-optional">(optional, not shown)</span></label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div className="cf-field">
              <label className="cf-label">Comment *</label>
              <textarea
                value={form.comment}
                onChange={e => setForm(p => ({ ...p, comment: e.target.value }))}
                placeholder="Did you try this recipe? Share your experience..."
                rows={4} maxLength={1000} required
              />
              <span className="cf-char">{form.comment.length} / 1000</span>
            </div>
            {error && <p className="cf-error">⚠ {error}</p>}
            <button type="submit" className="cf-submit" disabled={submitting}>
              {submitting ? 'Posting...' : 'Post Review'}
            </button>
          </form>
        ) : (
          <div className="cf-success">
            <span className="cf-check">✓</span>
            <div>
              <p className="cf-success-title">Review posted!</p>
              <p className="cf-success-sub">Thank you for sharing your experience.</p>
            </div>
            <button onClick={() => setSubmitted(false)} className="cf-link-btn">Write another</button>
          </div>
        )}

        {/* Reviews list */}
        {loading ? (
          <p className="comments-empty">Loading reviews...</p>
        ) : comments.length === 0 ? (
          <div className="comments-empty-box">
            <p className="comments-empty-title">No reviews yet</p>
            <p className="comments-empty-sub">Be the first to share your experience with this recipe!</p>
          </div>
        ) : (
          <div className="comments-list">
            {comments.map((c, i) => (
              <div key={c.id || i} className="comment-card">
                <div className="comment-header">
                  <div className="comment-avatar">{(c.name || 'A')[0].toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                      <p className="comment-name">{c.name}</p>
                      <StarRating value={c.rating || 5} size={13} />
                    </div>
                    <p className="comment-date">{new Date(c.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
                <p className="comment-text">{c.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .comments-section { background: #f9fafb; padding: 72px 0; border-top: 1px solid var(--cream2); }
        .comments-title {
          font-family: var(--font-title); font-size: clamp(26px, 3vw, 38px);
          font-weight: 700; color: var(--dark); margin-bottom: 36px;
          display: flex; align-items: center; gap: 12px;
        }
        .comments-badge {
          background: var(--olive); color: white; font-size: 14px; font-weight: 700;
          padding: 2px 10px; border-radius: 20px; font-family: var(--font-body);
        }
        .comment-form {
          background: white; border-radius: 14px; padding: 28px 32px;
          border: 1px solid var(--cream2); margin-bottom: 44px;
        }
        .cf-heading {
          font-family: var(--font-title); font-size: 22px; font-weight: 700;
          color: var(--dark); margin-bottom: 20px;
        }
        .cf-rating-row {
          display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
          padding: 12px 16px; background: var(--cream); border-radius: 8px;
          width: fit-content;
        }
        .cf-label {
          font-size: 11px; font-weight: 700; color: var(--gray);
          text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;
        }
        .cf-optional { font-weight: 400; text-transform: none; letter-spacing: 0; color: var(--gray-l); }
        .cf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        .cf-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        .cf-field input, .cf-field textarea {
          border: 1.5px solid var(--cream2); border-radius: 8px;
          padding: 10px 14px; font-size: 14px; font-family: var(--font-body);
          color: var(--dark); background: var(--cream); outline: none;
          transition: border-color .2s; resize: vertical;
        }
        .cf-field input:focus, .cf-field textarea:focus { border-color: var(--teal); background: white; }
        .cf-char { font-size: 11px; color: var(--gray-l); float: right; margin-top: 4px; }
        .cf-error { color: #dc2626; font-size: 13px; margin-bottom: 12px; }
        .cf-submit {
          background: var(--teal); color: white; font-size: 13px; font-weight: 700;
          padding: 11px 28px; border-radius: 8px; border: none; cursor: pointer;
          font-family: var(--font-body); transition: background .2s, transform .15s;
        }
        .cf-submit:hover { background: var(--teal-d); transform: translateY(-1px); }
        .cf-submit:disabled { opacity: .6; cursor: not-allowed; transform: none; }
        .cf-success {
          background: white; border: 1px solid #d1fae5; border-radius: 12px;
          padding: 20px 24px; margin-bottom: 44px;
          display: flex; align-items: center; gap: 14px;
        }
        .cf-check {
          width: 36px; height: 36px; border-radius: 50%; background: #d1fae5;
          color: #065f46; font-size: 18px; font-weight: 700;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .cf-success-title { font-size: 15px; font-weight: 700; color: var(--dark); margin: 0 0 2px; }
        .cf-success-sub { font-size: 13px; color: var(--gray); margin: 0; }
        .cf-link-btn {
          margin-left: auto; background: none; border: none; color: var(--teal);
          font-size: 13px; font-weight: 600; cursor: pointer; font-family: var(--font-body);
          text-decoration: underline; flex-shrink: 0;
        }
        .comments-empty { color: var(--gray-l); font-size: 14px; padding: 24px 0; }
        .comments-empty-box {
          background: white; border: 1px solid var(--cream2); border-radius: 12px;
          padding: 40px; text-align: center; margin-bottom: 32px;
        }
        .comments-empty-title { font-family: var(--font-title); font-size: 22px; color: var(--dark); margin-bottom: 6px; font-weight: 700; }
        .comments-empty-sub { font-size: 14px; color: var(--gray); margin: 0; }
        .comments-list { display: flex; flex-direction: column; gap: 14px; }
        .comment-card {
          background: white; border-radius: 12px; padding: 20px 24px;
          border: 1px solid var(--cream2); transition: border-color .2s;
        }
        .comment-card:hover { border-color: var(--cream3); }
        .comment-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 10px; }
        .comment-avatar {
          width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
          background: var(--olive); color: white;
          font-family: var(--font-title); font-size: 17px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
        }
        .comment-name { font-weight: 700; font-size: 14px; color: var(--dark); margin: 0 0 2px; }
        .comment-date { font-size: 12px; color: var(--gray-l); margin: 0; }
        .comment-text { font-size: 14px; color: #4b5563; line-height: 1.75; margin: 0; }
        @media (max-width: 640px) {
          .cf-row { grid-template-columns: 1fr; }
          .comment-form { padding: 20px; }
        }
      `}</style>
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

// ══════════════════════════
// MAIN PAGE
// ══════════════════════════
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
    <div style={{ padding: '100px 24px', textAlign: 'center', minHeight: '100vh', background: 'var(--cream)' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🍽️</div>
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

      {/* HERO — same original design */}
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

            {/* Rating — professional AllRecipes style */}
            <RatingDisplay rating={recipe.rating || 4.8} reviews={recipe.reviews || 0} />

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

            {/* Action row */}
            <div className="rd-action-row">
              <button className="rd-cta" onClick={() => bodyRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                View Full Recipe
              </button>
              <LikeButton slug={recipe.slug} />
              <ShareButton title={recipe.title} slug={recipe.slug} description={recipe.description} />
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24, alignItems: 'center', color: 'var(--gray-l)', fontSize: 12, fontWeight: 600 }}>
              <div className="rd-arrow" onClick={() => bodyRef.current?.scrollIntoView({ behavior: 'smooth' })}>↓</div>
              <span>Scroll for full recipe</span>
            </div>
          </div>

          {/* RIGHT — orbit same as original */}
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

            {/* MAIN */}
            <div>
              <div className="tab-row">
                {[
                  { id: 'instructions', label: '👨‍🍳 Instructions' },
                  { id: 'nutrition',    label: '📊 Full Nutrition' },
                  { id: 'article',      label: '📖 About' },
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
                  <div className="article-body" dangerouslySetInnerHTML={{ __html:
                    recipe.article
                      .replace(/## (.+)/g, '<h2>$1</h2>')
                      .replace(/\n\n/g, '</p><p>')
                      .replace(/^/, '<p>').replace(/$/, '</p>')
                  }} />
                </div>
              )}

              {recipe.tags && (
                <div style={{ marginTop: 28 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Tags</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {recipe.tags.map(t => (
                      <span key={t} style={{ background: 'var(--cream2)', color: 'var(--gray)', fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 'var(--r-full)', border: '1px solid var(--cream3)' }}>{t}</span>
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
        .rd-action-row { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-top: 24px; }

        .rd-sat {
          position: absolute; border-radius: 50%; overflow: hidden;
          border: 3px solid white; box-shadow: var(--sh-card);
          cursor: pointer; z-index: 5;
          transition: transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s;
          animation: rdSatFloat 3s ease-in-out infinite;
        }
        .rd-sat:hover { transform: scale(1.18) !important; box-shadow: var(--sh-float); z-index: 20; }
        .rd-sat img { width: 100%; height: 100%; object-fit: cover; }
        @keyframes rdSatFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
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
