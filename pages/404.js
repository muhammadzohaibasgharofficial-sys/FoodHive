// ============================================================
// FoodHive World — pages/404.js
// ============================================================

import Head from 'next/head'
import Link from 'next/link'
import { COUNTRIES } from '../lib/data'

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page Not Found — FoodHive World</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FFF8E7, #FFE4CC)',
        padding: '40px 24px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '80px', marginBottom: '16px' }}>🍽️</div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(48px, 8vw, 96px)',
          fontWeight: '900',
          color: 'var(--orange)',
          margin: '0 0 8px'
        }}>404</h1>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '28px',
          fontWeight: '700',
          color: 'var(--black)',
          marginBottom: '12px'
        }}>Recipe Not Found!</h2>
        <p style={{ color: 'var(--gray)', fontSize: '16px', maxWidth: '400px', lineHeight: '1.7', marginBottom: '40px' }}>
          Looks like this dish left the kitchen. Try exploring our world cuisines below.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
          <Link href="/" className="btn-primary">🏠 Go Home</Link>
          <Link href="/recipes" className="btn-secondary">📖 All Recipes</Link>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {COUNTRIES.map(c => (
            <Link key={c.id} href={`/countries/${c.id}`}>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s'
              }}>
                {c.flag} {c.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
