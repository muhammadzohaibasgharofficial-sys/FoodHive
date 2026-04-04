// ============================================================
// FoodHive World — pages/recipes/[slug].js  (v4 — Image Match)
// Hero: Taupe blob right, main dish circle center, orbit satellites
// Navigation: Up/Down arrows + 5 dots → next/prev recipe
// Font: Caveat bold (same as reference image)
// No price tag — recipe website adaptation
// Bottom sections: ingredients, instructions, comments SAME
// ============================================================
import { useState, useEffect, useRef, useCallback } from 'react'
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
  const [burst, setBurst] = useState(0)
  const display = hover || selected
  const handleRate = (s) => { setSelected(s); setBurst(s); setTimeout(() => setBurst(0), 600); onRate?.(s) }
  return (
    <div style={{ display: 'flex', gap: interactive ? 5 : 3 }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{
          fontSize: interactive ? 28 : 16,
          color: s <= display ? '#E8873A' : '#D4BFA0',
          cursor: interactive ? 'pointer' : 'default',
          transition: 'color .15s, transform .2s',
          display: 'inline-block',
          transform: interactive && hover === s ? 'scale(1.35) rotate(-8deg)' : burst === s ? 'scale(1.5)' : 'scale(1)',
          filter: s <= display ? 'drop-shadow(0 2px 4px rgba(232,135,58,.4))' : 'none',
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
  const [animating, setAnimating] = useState(false)
  const [particles, setParticles] = useState([])
  useEffect(() => {
    fetch(`/api/likes?slug=${slug}`).then(r => r.json()).then(d => setCount(d.count || 0)).catch(() => {})
    const ls = JSON.parse(localStorage.getItem('fh_liked') || '[]')
    setLiked(ls.includes(slug))
  }, [slug])
  const spawnParticles = () => {
    const emojis = ['❤️','✨','💖','🌟','💕']
    setParticles(Array.from({length:6}, (_, i) => ({ id: Date.now()+i, emoji: emojis[i%emojis.length], x: (Math.random()-.5)*80, y: -(30+Math.random()*50) })))
    setTimeout(() => setParticles([]), 900)
  }
  const toggleLike = async () => {
    if (liked) return
    setAnimating(true); spawnParticles()
    const ls = JSON.parse(localStorage.getItem('fh_liked') || '[]')
    ls.push(slug); localStorage.setItem('fh_liked', JSON.stringify(ls)); setLiked(true)
    try {
      const r = await fetch('/api/likes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug }) })
      const d = await r.json(); setCount(d.count || count + 1)
    } catch { setCount(c => c + 1) }
    setTimeout(() => setAnimating(false), 700)
  }
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      {particles.map(p => (
        <span key={p.id} style={{ position:'absolute', left:'50%', top:0, fontSize:16, pointerEvents:'none', zIndex:100, animation:'particleFly .8s ease-out forwards', '--px': p.x+'px', '--py': p.y+'px' }}>{p.emoji}</span>
      ))}
      <button onClick={toggleLike} style={{
        display:'inline-flex', alignItems:'center', gap:7,
        background: liked ? '#FFF0F4' : 'rgba(255,255,255,0.9)',
        border: `2px solid ${liked ? '#E8526A' : 'rgba(255,255,255,0.6)'}`,
        color: liked ? '#E8526A' : '#5C3A1E',
        fontSize:13, fontWeight:700, padding:'10px 18px', borderRadius:9999,
        cursor: liked ? 'default' : 'pointer',
        transition:'all .3s cubic-bezier(.34,1.56,.64,1)',
        boxShadow:'0 4px 16px rgba(44,24,16,.12)',
        transform: animating ? 'scale(1.12)' : 'scale(1)',
        fontFamily:'Nunito, sans-serif', backdropFilter:'blur(8px)',
      }}>
        <span style={{ fontSize:20, display:'inline-block', transition:'transform .4s cubic-bezier(.34,1.56,.64,1)', transform: animating ? 'scale(1.6) rotate(-20deg)' : 'scale(1)' }}>{liked ? '❤️' : '🤍'}</span>
        <span style={{ fontFamily:'Caveat, cursive', fontSize:20, fontWeight:700 }}>{count}</span>
      </button>
    </div>
  )
}

// ── Share Button ──
function ShareButton({ title, slug, description }) {
  const [copied, setCopied] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const url = `https://foodhive.vercel.app/recipes/${slug}`
  const shareText = `${title} — Authentic recipe on FoodHive World!\n${url}`
  const copyLink = () => { navigator.clipboard.writeText(url).then(() => { setCopied(true); setShowMenu(false); setTimeout(() => setCopied(false), 2500) }) }
  const copyRecipeText = () => { navigator.clipboard.writeText(`🍽️ ${title}\n\n${description||''}\n\n📖 Full Recipe:\n${url}\n\n— FoodHive World`).then(() => { setCopied(true); setShowMenu(false); setTimeout(() => setCopied(false), 2500) }) }
  const shareWhatsApp = () => { window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank'); setShowMenu(false) }
  const shareTwitter = () => { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&hashtags=FoodHive,Recipe`, '_blank'); setShowMenu(false) }
  const shareFacebook = () => { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank'); setShowMenu(false) }
  const handleMainClick = () => { if (navigator.share) { navigator.share({ title, text: shareText, url }).catch(() => {}) } else setShowMenu(p => !p) }
  useEffect(() => {
    if (!showMenu) return
    const close = () => setShowMenu(false)
    document.addEventListener('click', close, { once: true })
    return () => document.removeEventListener('click', close)
  }, [showMenu])
  const menuItems = [
    { icon:'🔗', label:'Link Copy', action:copyLink, color:'#3D9E8C' },
    { icon:'📋', label:'Recipe Text Copy', action:copyRecipeText, color:'#8B9E6B' },
    { icon:'💬', label:'WhatsApp', action:shareWhatsApp, color:'#25D366' },
    { icon:'🐦', label:'Twitter / X', action:shareTwitter, color:'#1DA1F2' },
    { icon:'📘', label:'Facebook', action:shareFacebook, color:'#1877F2' },
  ]
  return (
    <div style={{ position:'relative', display:'inline-flex' }} onClick={e => e.stopPropagation()}>
      <button onClick={handleMainClick} style={{
        display:'inline-flex', alignItems:'center', gap:7,
        background: copied ? 'rgba(61,158,140,0.15)' : 'rgba(255,255,255,0.9)',
        border: `2px solid ${copied ? '#3D9E8C' : 'rgba(255,255,255,0.6)'}`,
        color: copied ? '#3D9E8C' : '#5C3A1E',
        fontSize:13, fontWeight:700, padding:'10px 18px', borderRadius:9999,
        cursor:'pointer', transition:'all .25s',
        boxShadow:'0 4px 16px rgba(44,24,16,.12)',
        fontFamily:'Nunito, sans-serif', backdropFilter:'blur(8px)',
      }}>
        <span style={{ fontSize:16 }}>{copied ? '✅' : '🔗'}</span>
        {copied ? 'Copied!' : 'Share'}
      </button>
      {showMenu && (
        <div style={{ position:'absolute', top:'calc(100% + 10px)', left:0, background:'white', borderRadius:20, boxShadow:'0 12px 50px rgba(44,24,16,.18)', padding:8, minWidth:200, zIndex:300, border:'1px solid #F0E8D6', animation:'menuSlideIn .22s cubic-bezier(.34,1.56,.64,1)' }}>
          {menuItems.map(item => (
            <button key={item.label} onClick={item.action} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'10px 14px', border:'none', background:'none', cursor:'pointer', borderRadius:12, fontSize:13, fontWeight:600, color:'#2C1810', fontFamily:'Nunito, sans-serif', transition:'all .15s', textAlign:'left' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FAF6EE'; e.currentTarget.style.transform = 'translateX(4px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.transform = 'none' }}>
              <span style={{ width:32, height:32, borderRadius:9, background:item.color+'18', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Copy Button ──
function CopyBtn({ getText, label = 'Copy' }) {
  const [state, setState] = useState('idle')
  const handleCopy = async () => {
    setState('copying')
    try { await navigator.clipboard.writeText(getText()); setState('done'); setTimeout(() => setState('idle'), 2000) }
    catch { setState('idle') }
  }
  const icons = { idle:'📋', copying:'⏳', done:'✅' }
  const labels = { idle:label, copying:'...', done:'Copied!' }
  const colors = { idle:'#7A6A5A', copying:'#8B9E6B', done:'#3D9E8C' }
  return (
    <button onClick={handleCopy} style={{
      display:'inline-flex', alignItems:'center', gap:5,
      background: state === 'done' ? '#E8F5F3' : '#FAF6EE',
      border: `1.5px solid ${state === 'done' ? '#3D9E8C' : '#E8D5BA'}`,
      color: colors[state], fontSize:11, fontWeight:700,
      padding:'5px 12px', borderRadius:9999,
      cursor:'pointer', transition:'all .25s cubic-bezier(.34,1.56,.64,1)',
      fontFamily:'Nunito, sans-serif',
      transform: state === 'done' ? 'scale(1.06)' : 'scale(1)',
    }}>
      <span style={{ fontSize:13 }}>{icons[state]}</span>
      {labels[state]}
    </button>
  )
}

// ── Comments Section ──
function CommentsSection({ slug }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name:'', comment:'', rating:5 })
  useEffect(() => {
    fetch(`/api/comments?slug=${slug}`).then(r => r.json()).then(d => { setComments(d.comments || []); setLoading(false) }).catch(() => setLoading(false))
  }, [slug])
  const submit = async e => {
    e.preventDefault()
    if (!form.name.trim() || !form.comment.trim()) { setError('Naam aur comment dono required hain.'); return }
    setSubmitting(true); setError('')
    try {
      const r = await fetch('/api/comments', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ slug, ...form }) })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Failed')
      setSubmitted(true)
      setComments(prev => [{ id:d.id, name:form.name, comment:form.comment, rating:form.rating, date: new Date().toISOString() }, ...prev])
      setForm({ name:'', comment:'', rating:5 })
    } catch (err) { setError(err.message) }
    setSubmitting(false)
  }
  const ratingLabels = { 1:'Kharab 😞', 2:'Theek Hai 😐', 3:'Acha Hai 🙂', 4:'Bahut Acha 😊', 5:'Zabardast! 🤩' }
  return (
    <section style={{ background:'var(--cream)', padding:'80px 0', borderTop:'1px solid var(--cream2)' }}>
      <div className="container">
        <div style={{ marginBottom:48 }}>
          <div className="section-eyebrow">💬 Community</div>
          <h2 style={{ fontFamily:'Caveat, cursive', fontSize:'clamp(28px,3.5vw,44px)', fontWeight:700, color:'var(--dark)', marginBottom:8 }}>Reviews & Comments</h2>
          <p style={{ fontSize:14, color:'var(--gray)' }}>{comments.length} review{comments.length !== 1 ? 's' : ''} — Apna experience share karein! ✍️</p>
        </div>
        {!submitted ? (
          <form onSubmit={submit} style={{ background:'white', borderRadius:28, padding:36, boxShadow:'0 8px 40px rgba(44,24,16,.10)', borderTop:'4px solid var(--teal)', marginBottom:48 }}>
            <h3 style={{ fontFamily:'Caveat, cursive', fontSize:26, fontWeight:700, color:'var(--dark)', marginBottom:24 }}>Apna Review Dein</h3>
            <div style={{ display:'flex', alignItems:'center', gap:14, background:'var(--cream)', borderRadius:16, padding:'14px 20px', marginBottom:22, width:'fit-content' }}>
              <span style={{ fontSize:13, fontWeight:700, color:'var(--gray)' }}>Rating:</span>
              <StarRating value={form.rating} interactive onRate={v => setForm(p => ({ ...p, rating:v }))} />
              {form.rating > 0 && <span style={{ fontSize:13, fontWeight:700, color:'var(--teal)' }}>{ratingLabels[form.rating]}</span>}
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:11, fontWeight:700, color:'var(--gray)', textTransform:'uppercase', letterSpacing:'.5px', display:'block', marginBottom:6 }}>Naam *</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Aapka naam likhein" maxLength={100} required
                style={{ width:'100%', maxWidth:360, border:'2px solid var(--cream2)', borderRadius:14, padding:'12px 16px', fontSize:14, fontFamily:'Nunito, sans-serif', color:'var(--dark)', background:'var(--cream)', outline:'none', transition:'border-color .2s' }}
                onFocus={e => { e.target.style.borderColor = 'var(--teal)'; e.target.style.boxShadow = '0 0 0 3px rgba(61,158,140,.12)' }}
                onBlur={e => { e.target.style.borderColor = 'var(--cream2)'; e.target.style.boxShadow = 'none' }} />
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:11, fontWeight:700, color:'var(--gray)', textTransform:'uppercase', letterSpacing:'.5px', display:'block', marginBottom:6 }}>Comment *</label>
              <textarea value={form.comment} onChange={e => setForm(p => ({ ...p, comment: e.target.value }))} placeholder="Is recipe ke baare mein apna experience share karein..." rows={4} maxLength={1000} required
                style={{ width:'100%', border:'2px solid var(--cream2)', borderRadius:14, padding:'12px 16px', fontSize:14, fontFamily:'Nunito, sans-serif', color:'var(--dark)', background:'var(--cream)', outline:'none', resize:'vertical', transition:'border-color .2s' }}
                onFocus={e => { e.target.style.borderColor = 'var(--teal)'; e.target.style.boxShadow = '0 0 0 3px rgba(61,158,140,.12)' }}
                onBlur={e => { e.target.style.borderColor = 'var(--cream2)'; e.target.style.boxShadow = 'none' }} />
              <div style={{ fontSize:11, color:'var(--gray-l)', textAlign:'right', marginTop:4 }}>{form.comment.length}/1000</div>
            </div>
            {error && <div style={{ background:'#FFF0F0', color:'#C0392B', border:'1px solid #FDC', borderRadius:12, padding:'10px 16px', fontSize:13, marginBottom:14 }}>⚠️ {error}</div>}
            <button type="submit" disabled={submitting} style={{ background: submitting ? 'var(--gray-l)' : 'var(--teal)', color:'white', fontSize:14, fontWeight:700, padding:'14px 36px', borderRadius:9999, border:'none', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily:'Nunito, sans-serif', transition:'all .3s', boxShadow: submitting ? 'none' : '0 6px 20px rgba(61,158,140,.4)' }}
              onMouseEnter={e => !submitting && (e.target.style.transform = 'translateY(-2px) scale(1.02)')}
              onMouseLeave={e => (e.target.style.transform = 'none')}>
              {submitting ? '⏳ Post ho raha hai...' : '✉️ Review Submit Karein'}
            </button>
          </form>
        ) : (
          <div style={{ background:'white', borderRadius:28, padding:'48px 36px', textAlign:'center', boxShadow:'0 8px 40px rgba(44,24,16,.10)', borderTop:'4px solid var(--teal)', marginBottom:48 }}>
            <div style={{ fontSize:56, marginBottom:12 }}>🎉</div>
            <h3 style={{ fontFamily:'Caveat, cursive', fontSize:28, fontWeight:700, color:'var(--dark)', marginBottom:8 }}>Shukriya!</h3>
            <p style={{ color:'var(--gray)', fontSize:14, marginBottom:20 }}>Aapka review successfully post ho gaya.</p>
            <button onClick={() => setSubmitted(false)} style={{ background:'var(--teal)', color:'white', fontSize:13, fontWeight:700, padding:'12px 28px', borderRadius:9999, border:'none', cursor:'pointer', fontFamily:'Nunito, sans-serif', boxShadow:'0 4px 16px rgba(61,158,140,.35)' }}>Aur Review Likhein</button>
          </div>
        )}
        {loading ? (
          <div style={{ textAlign:'center', padding:48, color:'var(--gray)', background:'white', borderRadius:24, boxShadow:'0 4px 20px rgba(44,24,16,.08)' }}>
            <div style={{ fontSize:32, marginBottom:8 }}>⏳</div>Reviews load ho rahe hain...
          </div>
        ) : comments.length === 0 ? (
          <div style={{ textAlign:'center', padding:48, background:'white', borderRadius:24, boxShadow:'0 4px 20px rgba(44,24,16,.08)' }}>
            <div style={{ fontSize:48, marginBottom:10 }}>✍️</div>
            <p style={{ color:'var(--gray)', fontSize:14 }}>Abhi tak koi review nahi. Pehle aap likhein!</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {comments.map((c, i) => (
              <div key={c.id || i} style={{ background:'white', borderRadius:20, padding:'22px 26px', boxShadow:'0 4px 20px rgba(44,24,16,.08)', borderLeft:'4px solid var(--olive-l)', transition:'transform .2s, box-shadow .2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(44,24,16,.14)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(44,24,16,.08)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:12 }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg, var(--olive), var(--teal))', color:'white', fontFamily:'Caveat, cursive', fontSize:22, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{(c.name || 'A')[0].toUpperCase()}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:15, color:'var(--dark)' }}>{c.name}</div>
                    <div style={{ fontSize:12, color:'var(--gray-l)', marginTop:2 }}>{new Date(c.date).toLocaleDateString('en-PK', { year:'numeric', month:'long', day:'numeric' })}</div>
                  </div>
                  <StarRating value={c.rating || 5} />
                </div>
                <p style={{ fontSize:14, color:'var(--gray)', lineHeight:1.8, margin:0 }}>{c.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ── Mini Recipe Card ──
function RecipeCard({ recipe }) {
  return (
    <Link href={`/recipes/${recipe.slug}`}>
      <div className="recipe-card">
        <div className="rc-img-wrap"><div className="rc-circle"><img src={recipe.image2 || recipe.image1} alt={recipe.title} loading="lazy" /></div><span className="rc-tag-cat">{recipe.categoryIcon}</span></div>
        <div className="rc-body"><h3 className="rc-title">{recipe.title}</h3><div className="rc-meta"><span className="rc-stars">{'★'.repeat(Math.round(recipe.rating || 5))}</span><span className="rc-time">⏱ {recipe.totalTime}</span></div><div className="rc-btn">View →</div></div>
      </div>
    </Link>
  )
}

// ══════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════
export default function RecipeDetail({ recipe, relatedRecipes, allRecipes }) {
  const [servings, setServings] = useState(recipe?.servings || 4)
  const [activeTab, setActiveTab] = useState('instructions')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const bodyRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const idx = allRecipes.findIndex(r => r.slug === recipe?.slug)
    setCurrentIdx(idx >= 0 ? idx : 0)
  }, [recipe?.slug, allRecipes])

  useEffect(() => { window.scrollTo(0, 0) }, [recipe?.slug])

  useEffect(() => {
    const bar = document.querySelector('.scroll-bar')
    if (!bar) return
    const fn = () => { bar.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%' }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const navigateToRecipe = useCallback((direction) => {
    if (transitioning || allRecipes.length === 0) return
    setTransitioning(true)
    const newIdx = direction === 'up'
      ? (currentIdx - 1 + allRecipes.length) % allRecipes.length
      : (currentIdx + 1) % allRecipes.length
    setTimeout(() => { router.push(`/recipes/${allRecipes[newIdx].slug}`); setTransitioning(false) }, 300)
  }, [currentIdx, allRecipes, router, transitioning])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowUp') navigateToRecipe('up')
      if (e.key === 'ArrowDown') navigateToRecipe('down')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [navigateToRecipe])

  if (!recipe) return (
    <div style={{ padding:'100px 24px', textAlign:'center', minHeight:'100vh', background:'var(--cream)' }}>
      <div style={{ fontSize:64, marginBottom:16 }}>🍽️</div>
      <h1 style={{ fontFamily:'Caveat, cursive', fontSize:48, marginBottom:16 }}>Recipe Not Found</h1>
      <Link href="/recipes" className="btn-primary">← Browse All Recipes</Link>
    </div>
  )

  const mult = servings / (recipe.servings || 4)
  const scaleAmt = amt => { const n = parseFloat(amt); if (isNaN(n)) return amt; return amt.replace(/[\d.]+/, (n * mult).toFixed(n % 1 !== 0 ? 1 : 0)) }
  const getIngredientsText = () => `📝 ${recipe.title} — Ingredients (${servings} servings)\n\n` + (recipe.ingredients || []).map(ing => `• ${scaleAmt(ing.amount)} ${ing.item}${ing.notes ? ` (${ing.notes})` : ''}`).join('\n') + `\n\n📖 Full Recipe: https://foodhive.vercel.app/recipes/${recipe.slug}`
  const getInstructionsText = () => `👨‍🍳 ${recipe.title} — Instructions\n\n` + (recipe.instructions || []).map(s => `Step ${s.step}: ${s.title}\n${s.text}${s.time ? `\n⏱ ${s.time}` : ''}`).join('\n\n') + `\n\n📖 Full Recipe: https://foodhive.vercel.app/recipes/${recipe.slug}`

  const satelliteRecipes = relatedRecipes.slice(0, 5)
  const totalRecipes = allRecipes.length
  const dotCount = Math.min(5, totalRecipes)
  const halfDot = Math.floor(dotCount / 2)
  const dotIndices = Array.from({ length: dotCount }, (_, i) => {
    let idx = currentIdx - halfDot + i
    if (idx < 0) idx += totalRecipes
    if (idx >= totalRecipes) idx -= totalRecipes
    return idx
  })

  return (
    <>
      <Head>
        <title>{recipe.title} — {recipe.countryName} {recipe.categoryName} | FoodHive World</title>
        <meta name="description" content={`${recipe.description} Authentic ${recipe.countryName} recipe.`} />
        <meta property="og:title" content={`${recipe.title} | FoodHive World`} />
        <meta property="og:description" content={recipe.description} />
        <meta property="og:image" content={recipe.image1} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`https://foodhive.vercel.app/recipes/${recipe.slug}`} />
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
          nutrition: { '@type': 'NutritionInformation', calories: recipe.nutritionTable?.calories },
          recipeIngredient: (recipe.ingredients || []).map(i => `${i.amount} ${i.item}`),
          recipeInstructions: (recipe.instructions || []).map(s => ({ '@type': 'HowToStep', name: s.title, text: s.text })),
        }) }} />
      </Head>

      <div className="scroll-bar" />

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-inner">
          <button className="rd-back" onClick={() => router.back()}>←</button>
          <Link href="/" className="logo">
            <span className="logo-icon">🍽️</span>
            <span style={{ fontFamily:'Caveat, cursive', fontWeight:700, fontSize:22 }}>FoodHive</span>
          </Link>
          <div className="nav-links">
            <Link href="/#categories" className="nav-link">Categories</Link>
            <Link href="/recipes" className="nav-link">All Recipes</Link>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          HERO — IMAGE REFERENCE STYLE
          Left: cream, recipe info with Caveat font
          Right: taupe blob, circular orbit, arrows, dots
          ══════════════════════════════════════════ */}
      <section className={`rh-hero${transitioning ? ' rh-transitioning' : ''}`}>

        {/* LEFT — Recipe Info */}
        <div className="rh-left fade-up">
          <div className="rh-tags">
            <span className="rh-tag">{recipe.countryFlag} {recipe.countryName}</span>
            <span className="rh-tag rh-tag-orange">{recipe.categoryIcon} {recipe.categoryName}</span>
            <span className="rh-tag">⚡ {recipe.difficulty}</span>
          </div>

          {/* Big Caveat title — same as image */}
          <h1 className="rh-title">{recipe.title}</h1>

          <div className="rh-rating-row">
            <StarRating value={Math.round(recipe.rating || 5)} />
            <span className="rh-rating-num">{recipe.rating}</span>
            <span className="rh-rating-cnt">({recipe.reviews} reviews)</span>
          </div>

          <p className="rh-desc">{recipe.description}</p>

          {/* Stats bar */}
          <div className="rh-stats">
            {[
              { icon:'⏱', v: recipe.prepTime, l:'Prep' },
              { icon:'🔥', v: recipe.cookTime, l:'Cook' },
              { icon:'⏰', v: recipe.totalTime, l:'Total' },
              { icon:'👥', v: (recipe.servings || 4) + ' ppl', l:'Serves' },
            ].map(s => (
              <div key={s.l} className="rh-stat">
                <span className="rh-stat-icon">{s.icon}</span>
                <span className="rh-stat-val">{s.v}</span>
                <span className="rh-stat-lbl">{s.l}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="rh-actions">
            <button className="rh-cta" onClick={() => bodyRef.current?.scrollIntoView({ behavior:'smooth' })}>
              📖 View Full Recipe
            </button>
            <LikesButton slug={recipe.slug} />
            <ShareButton title={recipe.title} slug={recipe.slug} description={recipe.description} />
          </div>

          <div className="rh-scroll-hint" onClick={() => bodyRef.current?.scrollIntoView({ behavior:'smooth' })}>
            <span className="rh-scroll-dot" />
            <span style={{ fontSize:12, color:'var(--gray-l)', fontWeight:600 }}>Scroll for full recipe</span>
          </div>
        </div>

        {/* RIGHT — Blob + Orbit + Navigation */}
        <div className="rh-right">
          {/* Taupe organic blob — same as image */}
          <div className="rh-blob" />

          {/* Orbit container — centered */}
          <div className="rh-orbit-wrap">
            {/* Dashed orbit ring */}
            <div className="rh-orbit-ring" />

            {/* Main dish — big floating circle center */}
            <div className="rh-main-circle">
              <img src={recipe.image1} alt={recipe.title} />
            </div>

            {/* 5 satellite recipe circles in upper arc */}
            {satelliteRecipes.map((r, i) => {
              const total = Math.min(satelliteRecipes.length, 5)
              // Arc: spread across top semicircle (like image)
              const startAngle = -55
              const spread = 270
              const angle = startAngle + (spread / Math.max(total - 1, 1)) * i
              const rad = (angle * Math.PI) / 180
              const orbitRadius = 185
              const x = Math.sin(rad) * orbitRadius
              const y = -Math.cos(rad) * orbitRadius
              const sizes = [72, 64, 80, 68, 76]
              const sz = sizes[i % sizes.length]
              return (
                <Link key={r.slug || i} href={`/recipes/${r.slug}`} title={r.title}>
                  <div className="rh-satellite" style={{
                    width: sz, height: sz,
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    animationDelay: `${i * 0.35}s`,
                  }}>
                    <img src={r.image2 || r.image1} alt={r.title} />
                    <div className="rh-sat-tooltip">{r.title}</div>
                  </div>
                </Link>
              )
            })}

            {/* Up arrow — same position as image (center-left of orbit) */}
            <button className="rh-nav-btn rh-nav-up" onClick={() => navigateToRecipe('up')} title="Previous Recipe (↑ key)">↑</button>

            {/* Down arrow */}
            <button className="rh-nav-btn rh-nav-down" onClick={() => navigateToRecipe('down')} title="Next Recipe (↓ key)">↓</button>

            {/* 5 dots — right side of orbit like image */}
            <div className="rh-dots">
              {dotIndices.map((dotIdx, i) => (
                <div key={i}
                  className={`rh-dot${dotIdx === currentIdx ? ' rh-dot-active' : ''}`}
                  onClick={() => {
                    if (dotIdx !== currentIdx && !transitioning) {
                      setTransitioning(true)
                      setTimeout(() => { router.push(`/recipes/${allRecipes[dotIdx].slug}`); setTransitioning(false) }, 300)
                    }
                  }}
                  title={allRecipes[dotIdx]?.title || ''}
                />
              ))}
            </div>
          </div>

          {/* Dish name label floating near bottom */}
          <div className="rh-dish-label">
            <span className="rh-dish-name">{recipe.title}</span>
            <span className="rh-dish-cuisine">{recipe.cuisine} Cuisine</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          RECIPE BODY — SAME AS BEFORE
          ══════════════════════════════════════════ */}
      <section className="rd-body section" ref={bodyRef}>
        <div className="container">
          <div className="rd-body-grid">
            {/* SIDEBAR */}
            <div className="rd-sidebar-card">
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
                <div className="rd-box-head" style={{ marginBottom:0 }}>🥘 Ingredients</div>
                <CopyBtn getText={getIngredientsText} label="Copy" />
              </div>
              <div className="serv-row">
                <button className="serv-btn" onClick={() => setServings(Math.max(1, servings - 1))}>−</button>
                <span className="serv-num">{servings}</span>
                <button className="serv-btn" onClick={() => setServings(servings + 1)}>+</button>
                <span style={{ fontSize:12, color:'var(--gray)', marginLeft:4 }}>servings</span>
              </div>
              {(recipe.ingredients || []).map((ing, i) => (
                <div key={i} className="ing-row">
                  <div className="ing-dot" />
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', gap:8, alignItems:'baseline' }}>
                      <span className="ing-amt">{scaleAmt(ing.amount)}</span>
                      <span className="ing-name">{ing.item}</span>
                    </div>
                    {ing.notes && <div className="ing-note">{ing.notes}</div>}
                  </div>
                </div>
              ))}
              {recipe.tips?.length > 0 && (
                <>
                  <div className="rd-box-head" style={{ marginTop:28 }}>💡 Chef Tips</div>
                  {recipe.tips.map((tip, i) => (
                    <div key={i} className="tip-row"><span className="tip-icon">✨</span><span className="tip-text">{tip}</span></div>
                  ))}
                </>
              )}
              {recipe.nutritionTable && (
                <div style={{ marginTop:28 }}>
                  <div className="rd-box-head">📊 Nutrition</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                    {Object.entries(recipe.nutritionTable).slice(0, 6).map(([k, v]) => (
                      <div key={k} style={{ background:'var(--cream)', borderRadius:12, padding:'10px 12px', border:'1px solid var(--cream2)' }}>
                        <div style={{ fontFamily:'Caveat, cursive', fontSize:17, fontWeight:700, color:'var(--orange)' }}>{v}</div>
                        <div style={{ fontSize:10, color:'var(--gray)', fontWeight:700, textTransform:'uppercase', letterSpacing:.5 }}>{k}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* MAIN */}
            <div>
              <div className="tab-row">
                {[{ id:'instructions', label:'👨‍🍳 Instructions' }, { id:'nutrition', label:'📊 Full Nutrition' }, { id:'article', label:'📖 About' }].map(t => (
                  <button key={t.id} className={`tab-btn${activeTab === t.id ? ' active' : ''}`} onClick={() => setActiveTab(t.id)}>{t.label}</button>
                ))}
              </div>
              {activeTab === 'instructions' && (
                <div style={{ background:'white', borderRadius:'var(--r-xl)', padding:28, boxShadow:'var(--sh-soft)' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
                    <div className="rd-box-head" style={{ marginBottom:0 }}>Step by Step</div>
                    <CopyBtn getText={getInstructionsText} label="Copy Steps" />
                  </div>
                  {(recipe.instructions || []).map((step, i) => (
                    <div key={i} className="step-row">
                      <div className="step-num-circle">{step.step}</div>
                      <div style={{ flex:1 }}>
                        <div className="step-title">{step.title}</div>
                        <div className="step-text">{step.text}</div>
                        {step.time && <div className="step-time">⏱ {step.time}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'nutrition' && recipe.nutritionTable && (
                <div style={{ background:'white', borderRadius:'var(--r-xl)', padding:28, boxShadow:'var(--sh-soft)' }}>
                  <div className="rd-box-head">📊 Full Nutrition per Serving</div>
                  <div className="nutr-grid">
                    {Object.entries(recipe.nutritionTable).map(([k, v]) => (
                      <div key={k} className="nutr-cell"><div className="nutr-val">{v}</div><div className="nutr-lbl">{k}</div></div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'article' && recipe.article && (
                <div style={{ background:'white', borderRadius:'var(--r-xl)', padding:28, boxShadow:'var(--sh-soft)' }}>
                  <div className="article-body" dangerouslySetInnerHTML={{ __html: recipe.article.replace(/## (.+)/g, '<h2>$1</h2>').replace(/\n\n/g, '</p><p>').replace(/^/, '<p>').replace(/$/, '</p>') }} />
                </div>
              )}
              {recipe.tags && (
                <div style={{ marginTop:28 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'var(--gray)', letterSpacing:1, textTransform:'uppercase', marginBottom:10 }}>Tags</div>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    {recipe.tags.map(t => (
                      <span key={t} style={{ background:'var(--cream2)', color:'var(--gray)', fontSize:12, fontWeight:600, padding:'6px 14px', borderRadius:'var(--r-full)', border:'1px solid var(--cream3)' }}>{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {relatedRecipes.length > 0 && (
        <section className="section" style={{ background:'var(--cream2)' }}>
          <div className="container">
            <div style={{ marginBottom:48 }}>
              <div className="section-eyebrow">{recipe.countryFlag} More {recipe.countryName}</div>
              <h2 className="section-title">You Might Also Like</h2>
            </div>
            <div className="recipes-grid">
              {relatedRecipes.slice(0, 3).map((r, i) => (
                <div key={r.slug || i} className="fade-up" style={{ animationDelay:`${i * 80}ms` }}>
                  <RecipeCard recipe={r} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CommentsSection slug={recipe.slug} />

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div><div className="footer-logo-txt">🍽️ FoodHive World</div><p className="footer-desc">Authentic recipes from 10 world cuisines, auto-published every 30 minutes.</p></div>
            <div><div className="footer-col-title">Countries</div>{COUNTRIES.slice(0, 5).map(c => <Link key={c.id} href={`/countries/${c.id}`} className="footer-link">{c.flag} {c.name}</Link>)}</div>
            <div><div className="footer-col-title">More</div>{COUNTRIES.slice(5).map(c => <Link key={c.id} href={`/countries/${c.id}`} className="footer-link">{c.flag} {c.name}</Link>)}</div>
            <div><div className="footer-col-title">Categories</div>{RECIPE_CATEGORIES.slice(0, 6).map(c => <Link key={c.id} href={`/categories/${c.id}`} className="footer-link">{c.icon} {c.name}</Link>)}</div>
          </div>
          <div className="footer-bottom"><span>© 2026 FoodHive World</span><span>10 Countries · 12 Categories · Updated Every 30 Min</span></div>
        </div>
      </footer>

      {/* Global keyframes */}
      <style jsx global>{`
        @keyframes particleFly { 0% { opacity:1; transform:translate(0,0) scale(1) } 100% { opacity:0; transform:translate(var(--px),var(--py)) scale(.4) } }
        @keyframes menuSlideIn { from { opacity:0; transform:translateY(-8px) scale(.97) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes rhFloat { 0%,100% { transform:translateY(0px) } 50% { transform:translateY(-14px) } }
        @keyframes dotPulse { 0%,100% { transform:scale(1) } 50% { transform:scale(1.3) } }
        @keyframes blobPulse { 0%,100% { border-radius:58% 0 0 58% / 46% 0 0 52% } 50% { border-radius:62% 0 0 54% / 50% 0 0 48% } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(28px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      {/* Hero component styles */}
      <style jsx>{`
        /* ── HERO ── */
        .rh-hero { min-height:100vh; padding-top:68px; background:#FAF6EE; display:grid; grid-template-columns:1fr 1fr; align-items:center; position:relative; overflow:hidden; transition:opacity .3s }
        .rh-hero.rh-transitioning { opacity:0.35; pointer-events:none }

        /* LEFT */
        .rh-left { padding:60px 48px 60px 60px; position:relative; z-index:2 }
        .rh-tags { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:18px }
        .rh-tag { font-size:11px; font-weight:700; padding:5px 14px; border-radius:9999px; background:#F0E8D6; color:#6B7A52; text-transform:uppercase; letter-spacing:.5px }
        .rh-tag-orange { background:rgba(232,135,58,.12); color:#C96B20 }
        .rh-title { font-family:'Caveat',cursive; font-size:clamp(42px,5.5vw,78px); font-weight:700; color:#2C1810; line-height:1.0; letter-spacing:-0.5px; margin-bottom:14px }
        .rh-rating-row { display:flex; align-items:center; gap:10px; margin-bottom:16px }
        .rh-rating-num { font-family:'Caveat',cursive; font-size:22px; font-weight:700; color:#E8873A }
        .rh-rating-cnt { font-size:13px; color:#7A6A5A }
        .rh-desc { font-size:14px; color:#7A6A5A; line-height:1.85; max-width:420px; margin-bottom:28px }
        .rh-stats { display:flex; gap:0; background:white; border-radius:20px; padding:16px 24px; box-shadow:0 4px 20px rgba(44,24,16,.08); margin-bottom:28px; border:1px solid rgba(139,158,107,.15); width:fit-content }
        .rh-stat { display:flex; flex-direction:column; align-items:center; padding:0 18px; border-right:1px solid #F0E8D6; gap:2px }
        .rh-stat:last-child { border-right:none }
        .rh-stat-icon { font-size:16px }
        .rh-stat-val { font-family:'Caveat',cursive; font-size:20px; font-weight:700; color:#E8873A; white-space:nowrap }
        .rh-stat-lbl { font-size:9px; color:#7A6A5A; font-weight:700; text-transform:uppercase; letter-spacing:.5px }
        .rh-actions { display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-bottom:24px }
        .rh-cta { display:inline-flex; align-items:center; gap:8px; background:#E8873A; color:white; font-size:14px; font-weight:700; padding:13px 28px; border-radius:9999px; border:none; cursor:pointer; box-shadow:0 6px 20px rgba(232,135,58,.4); transition:all .3s cubic-bezier(.34,1.56,.64,1); font-family:'Nunito',sans-serif }
        .rh-cta:hover { transform:translateY(-2px) scale(1.02); background:#C96B20 }
        .rh-scroll-hint { display:flex; align-items:center; gap:8px; cursor:pointer; opacity:0.6; transition:opacity .2s }
        .rh-scroll-hint:hover { opacity:1 }
        .rh-scroll-dot { width:8px; height:8px; border-radius:50%; background:#7A6A5A; animation:dotPulse 2s ease-in-out infinite }

        /* RIGHT */
        .rh-right { position:relative; height:100vh; min-height:600px; display:flex; align-items:center; justify-content:center }
        .rh-blob { position:absolute; inset:0; background:radial-gradient(ellipse at 70% 50%,#EBD9C0 0%,#D4BFA0 40%,#C4A882 100%); border-radius:58% 0 0 58% / 46% 0 0 52%; animation:blobPulse 8s ease-in-out infinite; z-index:0 }
        .rh-orbit-wrap { position:relative; z-index:2; width:420px; height:420px; display:flex; align-items:center; justify-content:center }
        .rh-orbit-ring { position:absolute; width:380px; height:380px; border-radius:50%; border:1.5px dashed rgba(92,58,30,.2); pointer-events:none }
        .rh-main-circle { position:absolute; width:220px; height:220px; border-radius:50%; overflow:hidden; border:6px solid rgba(255,255,255,.95); box-shadow:0 20px 60px rgba(44,24,16,.25); z-index:10; animation:rhFloat 4s ease-in-out infinite; background:#F0E8D6 }
        .rh-main-circle img { width:100%; height:100%; object-fit:cover }
        .rh-satellite { position:absolute; top:50%; left:50%; border-radius:50%; overflow:hidden; border:3px solid rgba(255,255,255,.9); box-shadow:0 6px 20px rgba(44,24,16,.18); cursor:pointer; z-index:5; transition:transform .3s cubic-bezier(.34,1.56,.64,1),box-shadow .3s; animation:rhFloat 3s ease-in-out infinite; background:#F0E8D6 }
        .rh-satellite:hover { box-shadow:0 12px 36px rgba(44,24,16,.3); z-index:20 }
        .rh-satellite img { width:100%; height:100%; object-fit:cover; display:block }
        .rh-sat-tooltip { position:absolute; bottom:calc(100% + 8px); left:50%; transform:translateX(-50%); background:rgba(44,24,16,.85); color:white; font-size:10px; font-weight:700; padding:4px 10px; border-radius:8px; white-space:nowrap; opacity:0; pointer-events:none; transition:opacity .2s; font-family:'Nunito',sans-serif }
        .rh-satellite:hover .rh-sat-tooltip { opacity:1 }
        .rh-nav-btn { position:absolute; width:42px; height:42px; border-radius:50%; background:rgba(255,255,255,.9); border:2px solid rgba(255,255,255,.7); color:#5C3A1E; font-size:18px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 16px rgba(44,24,16,.15); transition:all .2s cubic-bezier(.34,1.56,.64,1); z-index:15; backdrop-filter:blur(8px) }
        .rh-nav-btn:hover { background:white; box-shadow:0 8px 24px rgba(44,24,16,.22) }
        .rh-nav-btn:active { transform:scale(0.9) !important }
        .rh-nav-up { left:50%; top:18%; transform:translateX(-50%) }
        .rh-nav-up:hover { transform:translateX(-50%) scale(1.12) }
        .rh-nav-down { left:50%; bottom:18%; transform:translateX(-50%) }
        .rh-nav-down:hover { transform:translateX(-50%) scale(1.12) }
        .rh-dots { position:absolute; right:-28px; top:50%; transform:translateY(-50%); display:flex; flex-direction:column; gap:10px; z-index:15 }
        .rh-dot { width:8px; height:8px; border-radius:50%; background:rgba(92,58,30,.25); cursor:pointer; transition:all .3s cubic-bezier(.34,1.56,.64,1); border:1.5px solid rgba(255,255,255,.6) }
        .rh-dot:hover { background:rgba(92,58,30,.5); transform:scale(1.3) }
        .rh-dot-active { background:#E8873A; width:10px; height:10px; border:2px solid white; box-shadow:0 2px 8px rgba(232,135,58,.5); animation:dotPulse 2s ease-in-out infinite }
        .rh-dish-label { position:absolute; bottom:60px; left:50%; transform:translateX(-55%); text-align:center; z-index:5 }
        .rh-dish-name { display:block; font-family:'Caveat',cursive; font-size:22px; font-weight:700; color:#2C1810; text-shadow:0 1px 3px rgba(255,255,255,.8) }
        .rh-dish-cuisine { display:block; font-size:11px; font-weight:700; color:#7A6A5A; text-transform:uppercase; letter-spacing:1px; margin-top:3px }

        /* RESPONSIVE */
        @media(max-width:1100px) {
          .rh-hero { grid-template-columns:1fr; min-height:auto }
          .rh-left { padding:100px 24px 40px; text-align:center }
          .rh-tags { justify-content:center }
          .rh-desc { margin:0 auto 28px }
          .rh-stats { margin:0 auto 28px }
          .rh-actions { justify-content:center }
          .rh-right { height:500px }
          .rh-blob { border-radius:50% 50% 0 0 / 30% 30% 0 0 }
          .rh-orbit-wrap { width:340px; height:340px }
          .rh-orbit-ring { width:300px; height:300px }
          .rh-main-circle { width:180px; height:180px }
          .rh-dots { right:-18px }
          .rh-dish-label { bottom:20px }
        }
        @media(max-width:640px) {
          .rh-left { padding:90px 20px 30px }
          .rh-title { font-size:clamp(36px,10vw,56px) }
          .rh-stats { flex-wrap:wrap; gap:12px; padding:14px 16px }
          .rh-stat { border-right:none; padding:0 10px }
          .rh-right { height:420px }
          .rh-orbit-wrap { width:280px; height:280px }
          .rh-orbit-ring { width:250px; height:250px }
          .rh-main-circle { width:150px; height:150px; border-width:4px }
          .rh-nav-btn { width:36px; height:36px; font-size:15px }
          .rh-dots { right:-14px; gap:8px }
          .rh-dot { width:6px; height:6px }
          .rh-dot-active { width:8px; height:8px }
          .rh-dish-label { display:none }
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
  return { props: { recipe, relatedRecipes: related, allRecipes: all }, revalidate: 60 }
}
