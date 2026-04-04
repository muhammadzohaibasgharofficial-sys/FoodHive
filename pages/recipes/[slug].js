// ============================================================
// FoodHive World — pages/recipes/[slug].js  (UPDATED v3)
// ✅ Animated Star Rating
// ✅ Animated Likes Button
// ✅ Comments — email field removed, fully animated
// ✅ Share Menu — animated dropdown with copy + socials
// ✅ Copy Button — Ingredients section
// ✅ Copy Button — Instructions section
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
// ⭐ ANIMATED STAR RATING
// ══════════════════════════════════════════════
function StarRating({ value = 5, interactive = false, onRate }) {
  const [hover, setHover] = useState(0)
  const [selected, setSelected] = useState(value)
  const [burst, setBurst] = useState(0)
  const display = hover || selected

  const handleRate = (s) => {
    setSelected(s)
    setBurst(s)
    setTimeout(() => setBurst(0), 600)
    onRate?.(s)
  }

  return (
    <div style={{ display: 'flex', gap: interactive ? 5 : 3 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span
          key={s}
          style={{
            fontSize:    interactive ? 30 : 18,
            color:       s <= display ? '#E8873A' : '#E0D5C8',
            cursor:      interactive ? 'pointer' : 'default',
            transition:  'color .15s, transform .2s',
            display:     'inline-block',
            transform:   interactive && hover === s ? 'scale(1.35) rotate(-8deg)' : burst === s ? 'scale(1.5)' : 'scale(1)',
            filter:      s <= display ? 'drop-shadow(0 2px 4px rgba(232,135,58,.4))' : 'none',
            userSelect:  'none',
          }}
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && handleRate(s)}
        >★</span>
      ))}
    </div>
  )
}

// ══════════════════════════════════════════════
// ❤️ ANIMATED LIKES BUTTON
// ══════════════════════════════════════════════
function LikesButton({ slug }) {
  const [count,     setCount]     = useState(0)
  const [liked,     setLiked]     = useState(false)
  const [animating, setAnimating] = useState(false)
  const [particles, setParticles] = useState([])

  useEffect(() => {
    fetch(`/api/likes?slug=${slug}`)
      .then(r => r.json())
      .then(d => setCount(d.count || 0))
      .catch(() => {})
    const likedSet = JSON.parse(localStorage.getItem('fh_liked') || '[]')
    setLiked(likedSet.includes(slug))
  }, [slug])

  const spawnParticles = () => {
    const emojis = ['❤️','✨','💖','🌟','💕']
    const p = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      emoji: emojis[i % emojis.length],
      x: (Math.random() - 0.5) * 80,
      y: -(30 + Math.random() * 50),
    }))
    setParticles(p)
    setTimeout(() => setParticles([]), 900)
  }

  const toggleLike = async () => {
    if (liked) return
    setAnimating(true)
    spawnParticles()
    const likedSet = JSON.parse(localStorage.getItem('fh_liked') || '[]')
    likedSet.push(slug)
    localStorage.setItem('fh_liked', JSON.stringify(likedSet))
    setLiked(true)
    try {
      const r = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      const d = await r.json()
      setCount(d.count || count + 1)
    } catch { setCount(c => c + 1) }
    setTimeout(() => setAnimating(false), 700)
  }

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      {/* Floating particles */}
      {particles.map(p => (
        <span key={p.id} style={{
          position: 'absolute', left: '50%', top: 0,
          fontSize: 16, pointerEvents: 'none', zIndex: 100,
          animation: 'particleFly .8s ease-out forwards',
          '--px': p.x + 'px', '--py': p.y + 'px',
        }}>{p.emoji}</span>
      ))}
      <button
        onClick={toggleLike}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: liked ? '#FFF0F4' : 'white',
          border: `2px solid ${liked ? '#E8526A' : '#E8D5BA'}`,
          color: liked ? '#E8526A' : '#7A6A5A',
          fontSize: 14, fontWeight: 700,
          padding: '12px 22px', borderRadius: 9999,
          cursor: liked ? 'default' : 'pointer',
          transition: 'all .3s cubic-bezier(.34,1.56,.64,1)',
          boxShadow: liked ? '0 4px 20px rgba(232,82,106,.2)' : '0 4px 20px rgba(44,24,16,.08)',
          transform: animating ? 'scale(1.12)' : 'scale(1)',
          fontFamily: 'inherit',
        }}
        title={liked ? 'Liked!' : 'Like this recipe'}
      >
        <span style={{
          fontSize: 22,
          display: 'inline-block',
          transition: 'transform .4s cubic-bezier(.34,1.56,.64,1)',
          transform: animating ? 'scale(1.6) rotate(-20deg)' : 'scale(1)',
        }}>{liked ? '❤️' : '🤍'}</span>
        <span style={{
          fontFamily: 'Caveat, cursive', fontSize: 22, fontWeight: 700,
          transition: 'all .3s',
        }}>{count}</span>
        <span style={{ fontSize: 13 }}>{liked ? 'Liked!' : 'Like'}</span>
      </button>
    </div>
  )
}

// ══════════════════════════════════════════════
// 🔗 ANIMATED SHARE BUTTON
// ══════════════════════════════════════════════
function ShareButton({ title, slug, description }) {
  const [copied,   setCopied]   = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const url       = `https://foodhive.vercel.app/recipes/${slug}`
  const shareText = `${title} — Authentic recipe on FoodHive World!\n${url}`

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true); setShowMenu(false)
      setTimeout(() => setCopied(false), 2500)
    })
  }
  const copyRecipeText = () => {
    const text = `🍽️ ${title}\n\n${description || ''}\n\n📖 Full Recipe:\n${url}\n\n— FoodHive World`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true); setShowMenu(false)
      setTimeout(() => setCopied(false), 2500)
    })
  }
  const shareWhatsApp  = () => { window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`,'_blank'); setShowMenu(false) }
  const shareTwitter   = () => { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&hashtags=FoodHive,Recipe`,'_blank'); setShowMenu(false) }
  const shareFacebook  = () => { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,'_blank'); setShowMenu(false) }

  const handleMainClick = () => {
    if (navigator.share) { navigator.share({ title, text: shareText, url }).catch(() => {}) }
    else setShowMenu(prev => !prev)
  }

  useEffect(() => {
    if (!showMenu) return
    const close = () => setShowMenu(false)
    document.addEventListener('click', close, { once: true })
    return () => document.removeEventListener('click', close)
  }, [showMenu])

  const menuItems = [
    { icon: '🔗', label: 'Link Copy Karein',   action: copyLink,       color: '#3D9E8C' },
    { icon: '📋', label: 'Recipe Text Copy',   action: copyRecipeText, color: '#8B9E6B' },
    { icon: '💬', label: 'WhatsApp pe Share',  action: shareWhatsApp,  color: '#25D366' },
    { icon: '🐦', label: 'Twitter / X',        action: shareTwitter,   color: '#1DA1F2' },
    { icon: '📘', label: 'Facebook',           action: shareFacebook,  color: '#1877F2' },
  ]

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }} onClick={e => e.stopPropagation()}>
      <button onClick={handleMainClick} style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: copied ? '#E8F5F3' : 'white',
        border: `2px solid ${copied ? '#3D9E8C' : '#E8D5BA'}`,
        color: copied ? '#3D9E8C' : '#7A6A5A',
        fontSize: 14, fontWeight: 700,
        padding: '12px 22px', borderRadius: 9999,
        cursor: 'pointer', transition: 'all .25s',
        boxShadow: '0 4px 20px rgba(44,24,16,.08)',
        fontFamily: 'inherit',
      }}>
        <span style={{ fontSize: 18 }}>{copied ? '✅' : '🔗'}</span>
        {copied ? 'Copy Ho Gaya!' : 'Share'}
      </button>

      {showMenu && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 10px)', left: 0,
          background: 'white', borderRadius: 20,
          boxShadow: '0 12px 50px rgba(44,24,16,.18)',
          padding: 8, minWidth: 220, zIndex: 200,
          border: '1px solid #F0E8D6',
          animation: 'menuSlideIn .22s cubic-bezier(.34,1.56,.64,1)',
        }}>
          {menuItems.map((item, i) => (
            <button
              key={item.label}
              onClick={item.action}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                width: '100%', padding: '11px 16px', border: 'none',
                background: 'none', cursor: 'pointer', borderRadius: 12,
                fontSize: 13, fontWeight: 600, color: '#2C1810',
                fontFamily: 'inherit', transition: 'all .15s', textAlign: 'left',
                animationDelay: `${i * 40}ms`,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FAF6EE'; e.currentTarget.style.transform = 'translateX(4px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.transform = 'none' }}
            >
              <span style={{
                width: 34, height: 34, borderRadius: 10,
                background: item.color + '18', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
              }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════
// 📋 COPY BUTTON (inline, small)
// ══════════════════════════════════════════════
function CopyBtn({ getText, label = 'Copy' }) {
  const [state, setState] = useState('idle') // idle | copying | done

  const handleCopy = async () => {
    setState('copying')
    const text = getText()
    try {
      await navigator.clipboard.writeText(text)
      setState('done')
      setTimeout(() => setState('idle'), 2000)
    } catch {
      setState('idle')
    }
  }

  const icons = { idle: '📋', copying: '⏳', done: '✅' }
  const labels = { idle: label, copying: '...', done: 'Copied!' }
  const colors = { idle: '#7A6A5A', copying: '#8B9E6B', done: '#3D9E8C' }

  return (
    <button
      onClick={handleCopy}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        background: state === 'done' ? '#E8F5F3' : '#FAF6EE',
        border: `1.5px solid ${state === 'done' ? '#3D9E8C' : '#E8D5BA'}`,
        color: colors[state], fontSize: 11, fontWeight: 700,
        padding: '5px 12px', borderRadius: 9999,
        cursor: 'pointer', transition: 'all .25s cubic-bezier(.34,1.56,.64,1)',
        fontFamily: 'inherit',
        transform: state === 'done' ? 'scale(1.06)' : 'scale(1)',
      }}
    >
      <span style={{ fontSize: 13, transition: 'transform .3s', display: 'inline-block', transform: state === 'done' ? 'rotate(360deg)' : 'none' }}>
        {icons[state]}
      </span>
      {labels[state]}
    </button>
  )
}

// ══════════════════════════════════════════════
// 💬 ANIMATED COMMENTS SECTION
// ══════════════════════════════════════════════
function CommentsSection({ slug }) {
  const [comments,   setComments]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)
  const [error,      setError]      = useState('')
  const [form, setForm] = useState({ name: '', comment: '', rating: 5 })

  useEffect(() => {
    fetch(`/api/comments?slug=${slug}`)
      .then(r => r.json())
      .then(d => { setComments(d.comments || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [slug])

  const submit = async e => {
    e.preventDefault()
    if (!form.name.trim() || !form.comment.trim()) {
      setError('Naam aur comment dono required hain.')
      return
    }
    setSubmitting(true); setError('')
    try {
      const r = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, ...form }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Failed')
      setSubmitted(true)
      setComments(prev => [{
        id: d.id, name: form.name,
        comment: form.comment, rating: form.rating,
        date: new Date().toISOString(),
      }, ...prev])
      setForm({ name: '', comment: '', rating: 5 })
    } catch (err) { setError(err.message) }
    setSubmitting(false)
  }

  const ratingLabels = { 1: 'Kharab 😞', 2: 'Theek Hai 😐', 3: 'Acha Hai 🙂', 4: 'Bahut Acha 😊', 5: 'Zabardast! 🤩' }

  return (
    <section style={{ background: 'var(--cream)', padding: '80px 0', borderTop: '1px solid var(--cream2)' }}>
      <div className="container">
        <div style={{ marginBottom: 48 }}>
          <div className="section-eyebrow">💬 Community</div>
          <h2 style={{
            fontFamily: 'Caveat, cursive', fontSize: 'clamp(28px,3.5vw,44px)',
            fontWeight: 700, color: 'var(--dark)', marginBottom: 8,
          }}>Reviews & Comments</h2>
          <p style={{ fontSize: 14, color: 'var(--gray)' }}>
            {comments.length} review{comments.length !== 1 ? 's' : ''} — Apna experience share karein! ✍️
          </p>
        </div>

        {/* ── FORM ── */}
        {!submitted ? (
          <form onSubmit={submit} style={{
            background: 'white', borderRadius: 28, padding: 36,
            boxShadow: '0 8px 40px rgba(44,24,16,.10)',
            borderTop: '4px solid var(--teal)',
            marginBottom: 48,
            animation: 'fadeUp .5s ease both',
          }}>
            <h3 style={{ fontFamily: 'Caveat, cursive', fontSize: 26, fontWeight: 700, color: 'var(--dark)', marginBottom: 24 }}>
              Apna Review Dein
            </h3>

            {/* Star Rating */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14,
              background: 'var(--cream)', borderRadius: 16, padding: '14px 20px',
              marginBottom: 22, width: 'fit-content',
              boxShadow: 'inset 0 2px 8px rgba(44,24,16,.06)',
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray)' }}>Rating:</span>
              <StarRating
                value={form.rating} interactive
                onRate={v => setForm(p => ({ ...p, rating: v }))}
              />
              {form.rating > 0 && (
                <span style={{
                  fontSize: 13, fontWeight: 700, color: 'var(--teal)',
                  animation: 'fadeUp .3s ease',
                }}>{ratingLabels[form.rating]}</span>
              )}
            </div>

            {/* Name only (no email) */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                fontSize: 11, fontWeight: 700, color: 'var(--gray)',
                textTransform: 'uppercase', letterSpacing: '.5px',
                display: 'block', marginBottom: 6,
              }}>Naam *</label>
              <input
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Aapka naam likhein"
                maxLength={100} required
                style={{
                  width: '100%', maxWidth: 360,
                  border: '2px solid var(--cream2)', borderRadius: 14,
                  padding: '12px 16px', fontSize: 14,
                  fontFamily: 'inherit', color: 'var(--dark)',
                  background: 'var(--cream)', outline: 'none',
                  transition: 'border-color .2s, box-shadow .2s',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--teal)'; e.target.style.boxShadow = '0 0 0 3px rgba(61,158,140,.12)' }}
                onBlur={e => { e.target.style.borderColor = 'var(--cream2)'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            {/* Comment */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                fontSize: 11, fontWeight: 700, color: 'var(--gray)',
                textTransform: 'uppercase', letterSpacing: '.5px',
                display: 'block', marginBottom: 6,
              }}>Comment *</label>
              <textarea
                value={form.comment}
                onChange={e => setForm(p => ({ ...p, comment: e.target.value }))}
                placeholder="Is recipe ke baare mein apna experience share karein..."
                rows={4} maxLength={1000} required
                style={{
                  width: '100%',
                  border: '2px solid var(--cream2)', borderRadius: 14,
                  padding: '12px 16px', fontSize: 14,
                  fontFamily: 'inherit', color: 'var(--dark)',
                  background: 'var(--cream)', outline: 'none', resize: 'vertical',
                  transition: 'border-color .2s, box-shadow .2s',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--teal)'; e.target.style.boxShadow = '0 0 0 3px rgba(61,158,140,.12)' }}
                onBlur={e => { e.target.style.borderColor = 'var(--cream2)'; e.target.style.boxShadow = 'none' }}
              />
              <div style={{ fontSize: 11, color: 'var(--gray-l)', textAlign: 'right', marginTop: 4 }}>
                {form.comment.length}/1000
              </div>
            </div>

            {error && (
              <div style={{
                background: '#FFF0F0', color: '#C0392B',
                border: '1px solid #FDC', borderRadius: 12,
                padding: '10px 16px', fontSize: 13, marginBottom: 14,
                animation: 'fadeUp .3s ease',
              }}>⚠️ {error}</div>
            )}

            <button type="submit" disabled={submitting} style={{
              background: submitting ? 'var(--gray-l)' : 'var(--teal)',
              color: 'white', fontSize: 14, fontWeight: 700,
              padding: '14px 36px', borderRadius: 9999, border: 'none',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              transition: 'all .3s cubic-bezier(.34,1.56,.64,1)',
              boxShadow: submitting ? 'none' : '0 6px 20px rgba(61,158,140,.4)',
              transform: submitting ? 'none' : undefined,
            }}
            onMouseEnter={e => !submitting && (e.target.style.transform = 'translateY(-2px) scale(1.02)')}
            onMouseLeave={e => (e.target.style.transform = 'none')}
            >
              {submitting ? '⏳ Post ho raha hai...' : '✉️ Review Submit Karein'}
            </button>
          </form>
        ) : (
          <div style={{
            background: 'white', borderRadius: 28, padding: '48px 36px',
            textAlign: 'center', boxShadow: '0 8px 40px rgba(44,24,16,.10)',
            borderTop: '4px solid var(--teal)', marginBottom: 48,
            animation: 'scaleIn .4s cubic-bezier(.34,1.56,.64,1)',
          }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
            <h3 style={{ fontFamily: 'Caveat, cursive', fontSize: 28, fontWeight: 700, color: 'var(--dark)', marginBottom: 8 }}>Shukriya!</h3>
            <p style={{ color: 'var(--gray)', fontSize: 14, marginBottom: 20 }}>Aapka review successfully post ho gaya.</p>
            <button onClick={() => setSubmitted(false)} style={{
              background: 'var(--teal)', color: 'white', fontSize: 13, fontWeight: 700,
              padding: '12px 28px', borderRadius: 9999, border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(61,158,140,.35)',
            }}>Aur Review Likhein</button>
          </div>
        )}

        {/* ── COMMENTS LIST ── */}
        {loading ? (
          <div style={{
            textAlign: 'center', padding: 48, color: 'var(--gray)',
            background: 'white', borderRadius: 24, boxShadow: '0 4px 20px rgba(44,24,16,.08)',
          }}>
            <div style={{ fontSize: 32, marginBottom: 8, animation: 'spin 1s linear infinite' }}>⏳</div>
            Reviews load ho rahe hain...
          </div>
        ) : comments.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: 48,
            background: 'white', borderRadius: 24, boxShadow: '0 4px 20px rgba(44,24,16,.08)',
          }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>✍️</div>
            <p style={{ color: 'var(--gray)', fontSize: 14 }}>Abhi tak koi review nahi. Pehle aap likhein!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {comments.map((c, i) => (
              <div key={c.id || i} style={{
                background: 'white', borderRadius: 20, padding: '22px 26px',
                boxShadow: '0 4px 20px rgba(44,24,16,.08)',
                borderLeft: '4px solid var(--olive-l)',
                animation: `fadeUp .5s ease ${i * 80}ms both`,
                transition: 'transform .2s, box-shadow .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(44,24,16,.14)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(44,24,16,.08)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--olive), var(--teal))',
                    color: 'white', fontFamily: 'Caveat, cursive',
                    fontSize: 22, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>{(c.name || 'A')[0].toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--dark)' }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-l)', marginTop: 2 }}>
                      {new Date(c.date).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                  <StarRating value={c.rating || 5} />
                </div>
                <p style={{ fontSize: 14, color: 'var(--gray)', lineHeight: 1.8, margin: 0 }}>{c.comment}</p>
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
          <div className="rc-circle"><img src={recipe.image2 || recipe.image1} alt={recipe.title} loading="lazy"/></div>
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
  const [servings,      setServings]      = useState(recipe?.servings || 4)
  const [activeTab,     setActiveTab]     = useState('instructions')
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
      <h1 style={{ fontFamily: 'Caveat, cursive', fontSize: 48, marginBottom: 16 }}>Recipe Not Found</h1>
      <Link href="/recipes" className="btn-primary">← Browse All Recipes</Link>
    </div>
  )

  const mult     = servings / (recipe.servings || 4)
  const scaleAmt = amt => {
    const n = parseFloat(amt)
    if (isNaN(n)) return amt
    return amt.replace(/[\d.]+/, (n * mult).toFixed(n % 1 !== 0 ? 1 : 0))
  }

  // Text for copying ingredients
  const getIngredientsText = () => {
    const title = `📝 ${recipe.title} — Ingredients (${servings} servings)\n\n`
    const list = (recipe.ingredients || [])
      .map(ing => `• ${scaleAmt(ing.amount)} ${ing.item}${ing.notes ? ` (${ing.notes})` : ''}`)
      .join('\n')
    return title + list + `\n\n📖 Full Recipe: https://foodhive.vercel.app/recipes/${recipe.slug}`
  }

  // Text for copying instructions
  const getInstructionsText = () => {
    const title = `👨‍🍳 ${recipe.title} — Instructions\n\n`
    const steps = (recipe.instructions || [])
      .map(s => `Step ${s.step}: ${s.title}\n${s.text}${s.time ? `\n⏱ ${s.time}` : ''}`)
      .join('\n\n')
    return title + steps + `\n\n📖 Full Recipe: https://foodhive.vercel.app/recipes/${recipe.slug}`
  }

  const miniTabs = ['breakfast', 'lunch', 'dinner']

  return (
    <>
      <Head>
        <title>{recipe.title} — {recipe.countryName} {recipe.categoryName} | FoodHive World</title>
        <meta name="description" content={`${recipe.description} Authentic ${recipe.countryName} recipe.`}/>
        <meta property="og:title"       content={`${recipe.title} | FoodHive World`}/>
        <meta property="og:description" content={recipe.description}/>
        <meta property="og:image"       content={recipe.image1}/>
        <meta property="og:type"        content="article"/>
        <link rel="canonical" href={`https://foodhive.vercel.app/recipes/${recipe.slug}`}/>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'Recipe',
          name: recipe.title, description: recipe.description,
          image: [recipe.image1, recipe.image2].filter(Boolean),
          author: { '@type': 'Organization', name: 'FoodHive World' },
          datePublished: recipe.publishedAt,
          prepTime: `PT${(recipe.prepTime || '15 min').replace(/\D/g,'')}M`,
          cookTime: `PT${(recipe.cookTime || '30 min').replace(/\D/g,'')}M`,
          totalTime: `PT${(recipe.totalTime || '45 min').replace(/\D/g,'')}M`,
          recipeYield: `${recipe.servings} servings`,
          recipeCategory: recipe.categoryName, recipeCuisine: recipe.cuisine,
          keywords: (recipe.tags || []).join(', '),
          aggregateRating: { '@type': 'AggregateRating', ratingValue: recipe.rating || 4.8, reviewCount: recipe.reviews || 100 },
          nutrition: { '@type': 'NutritionInformation', calories: recipe.nutritionTable?.calories },
          recipeIngredient: (recipe.ingredients || []).map(i => `${i.amount} ${i.item}`),
          recipeInstructions: (recipe.instructions || []).map(s => ({ '@type': 'HowToStep', name: s.title, text: s.text })),
        })}}/>
      </Head>

      <div className="scroll-bar"/>

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="navbar-inner">
          <button className="rd-back" onClick={() => router.back()}>←</button>
          <div className="rd-mini-nav">
            {miniTabs.map(t => (
              <button key={t} className={`rd-mini-link${activeMiniTab === t ? ' active' : ''}`}
                onClick={() => setActiveMiniTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <Link href="/" className="logo" style={{ fontSize: 18 }}>
            <span>🍽️</span>
            <span style={{ fontFamily: 'Caveat, cursive', fontWeight: 700 }}>FoodHive</span>
          </Link>
        </div>
      </nav>

      {/* ── RECIPE HERO ── */}
      <section className="rd-hero">
        <div className="rd-hero-blob"/>
        <div className="rd-hero-inner">
          <div className="fade-up">
            <div className="rd-tags">
              <span className="rd-tag rd-tag-country">{recipe.countryFlag} {recipe.countryName}</span>
              <span className="rd-tag rd-tag-cat">{recipe.categoryIcon} {recipe.categoryName}</span>
              <span className="rd-tag rd-tag-diff">⚡ {recipe.difficulty}</span>
            </div>
            <h1 className="rd-title">{recipe.title}</h1>
            <p className="rd-desc">{recipe.description}</p>

            <div className="rd-rating-row">
              <StarRating value={Math.round(recipe.rating || 5)}/>
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

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginTop: 24 }}>
              <button className="rd-cta"
                onClick={() => bodyRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                📖 View Full Recipe
              </button>
              <LikesButton slug={recipe.slug}/>
              <ShareButton title={recipe.title} slug={recipe.slug} description={recipe.description}/>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24, alignItems: 'center', color: 'var(--gray-l)', fontSize: 12, fontWeight: 600 }}>
              <div className="rd-arrow" onClick={() => bodyRef.current?.scrollIntoView({ behavior: 'smooth' })}>↓</div>
              <span>Scroll for full recipe</span>
            </div>
          </div>

          {/* RIGHT — Orbit */}
          <div className="rd-orbit">
            <div className="rd-orbit-ring" style={{ width: 400, height: 400 }}/>
            <div className="rd-orbit-main" style={{ width: 260, height: 260 }}>
              <img src={recipe.image1} alt={recipe.title}/>
            </div>
            {relatedRecipes.slice(0, 5).map((r, i) => {
              const p = SAT_POS[i]
              return (
                <Link key={r.slug || i} href={`/recipes/${r.slug}`}>
                  <div className="rd-sat" style={{
                    top: p.top, left: p.left, width: p.size, height: p.size,
                    transform: `translate(${p.tx},-50%)`, animationDelay: p.delay,
                  }}>
                    <img src={r.image2 || r.image1} alt={r.title}/>
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
              {/* Ingredients header + copy btn */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div className="rd-box-head" style={{ marginBottom: 0 }}>🥘 Ingredients</div>
                <CopyBtn getText={getIngredientsText} label="Copy"/>
              </div>

              <div className="serv-row">
                <button className="serv-btn" onClick={() => setServings(Math.max(1, servings - 1))}>−</button>
                <span className="serv-num">{servings}</span>
                <button className="serv-btn" onClick={() => setServings(servings + 1)}>+</button>
                <span style={{ fontSize: 12, color: 'var(--gray)', marginLeft: 4 }}>servings</span>
              </div>

              {(recipe.ingredients || []).map((ing, i) => (
                <div key={i} className="ing-row">
                  <div className="ing-dot"/>
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
                      <div key={k} style={{
                        background: 'var(--cream)', borderRadius: 12,
                        padding: '10px 12px', border: '1px solid var(--cream2)',
                      }}>
                        <div style={{ fontFamily: 'Caveat, cursive', fontSize: 17, fontWeight: 700, color: 'var(--orange)' }}>{v}</div>
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
                  { id: 'article',      label: '📖 About' },
                ].map(t => (
                  <button key={t.id}
                    className={`tab-btn${activeTab === t.id ? ' active' : ''}`}
                    onClick={() => setActiveTab(t.id)}>
                    {t.label}
                  </button>
                ))}
              </div>

              {activeTab === 'instructions' && (
                <div style={{ background: 'white', borderRadius: 'var(--r-xl)', padding: 28, boxShadow: 'var(--sh-soft)' }}>
                  {/* Instructions header + copy btn */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                    <div className="rd-box-head" style={{ marginBottom: 0 }}>Step by Step</div>
                    <CopyBtn getText={getInstructionsText} label="Copy Steps"/>
                  </div>

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
                      .replace(/\n\n/g, '</p><p>').replace(/^/, '<p>').replace(/$/, '</p>')
                  }}/>
                </div>
              )}

              {recipe.tags && (
                <div style={{ marginTop: 28 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Tags</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {recipe.tags.map(t => (
                      <span key={t} style={{
                        background: 'var(--cream2)', color: 'var(--gray)',
                        fontSize: 12, fontWeight: 600, padding: '6px 14px',
                        borderRadius: 'var(--r-full)', border: '1px solid var(--cream3)',
                      }}>{t}</span>
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
                  <RecipeCard recipe={r}/>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── COMMENTS ── */}
      <CommentsSection slug={recipe.slug}/>

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

      {/* ── GLOBAL STYLES ── */}
      <style jsx global>{`
        @keyframes particleFly {
          0%   { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(var(--px), var(--py)) scale(.4); }
        }
        @keyframes menuSlideIn {
          from { opacity: 0; transform: translateY(-8px) scale(.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(.9); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <style jsx>{`
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

        @media (max-width: 640px) {
          .rd-hero-inner { grid-template-columns: 1fr !important; }
          .rd-orbit      { display: none; }
          .rd-body-grid  { grid-template-columns: 1fr !important; }
          .rd-sidebar-card { position: static; }
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
