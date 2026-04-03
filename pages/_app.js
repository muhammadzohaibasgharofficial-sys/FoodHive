// ============================================================
// FoodHive World — _app.js
// ============================================================
import '../styles/globals.css'
import { useEffect, useRef } from 'react'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  const cursorRef = useRef(null)
  const followerRef = useRef(null)
  const progressRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const follower = followerRef.current
    let fx = 0, fy = 0, cx = 0, cy = 0

    const move = (e) => {
      cx = e.clientX; cy = e.clientY
      if (cursor) { cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px' }
    }
    const animate = () => {
      fx += (cx - fx) * 0.12; fy += (cy - fy) * 0.12
      if (follower) { follower.style.left = fx + 'px'; follower.style.top = fy + 'px' }
      requestAnimationFrame(animate)
    }
    const hover = () => { if (cursor) { cursor.style.width = '24px'; cursor.style.height = '24px'; cursor.style.background = 'var(--gold-light)' } }
    const unhover = () => { if (cursor) { cursor.style.width = '12px'; cursor.style.height = '12px'; cursor.style.background = 'var(--gold)' } }

    document.addEventListener('mousemove', move)
    document.querySelectorAll('a,button,[role="button"]').forEach(el => { el.addEventListener('mouseenter', hover); el.addEventListener('mouseleave', unhover) })
    animate()

    // Scroll progress
    const onScroll = () => {
      if (!progressRef.current) return
      const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      progressRef.current.style.width = Math.min(pct, 100) + '%'
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Intersection observer for fade-up
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(el => { if (el.isIntersecting) { el.target.style.opacity = '1'; el.target.style.transform = 'translateY(0)'; } })
    }, { threshold: 0.1 })
    document.querySelectorAll('.fade-up').forEach(el => {
      el.style.opacity = '0'; el.style.transform = 'translateY(30px)'; el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
      observer.observe(el)
    })

    return () => { document.removeEventListener('mousemove', move); window.removeEventListener('scroll', onScroll) }
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#C8842A" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍽️</text></svg>" />
      </Head>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-follower" ref={followerRef} />
      <div className="scroll-progress" ref={progressRef} />
      <Component {...pageProps} />
    </>
  )
}
