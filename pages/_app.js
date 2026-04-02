import '../styles/globals.css'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

export default function App({ Component, pageProps }) {
  // Scroll animations observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    document.querySelectorAll('.fade-in, .scale-in').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  // Back to top button
  useEffect(() => {
    const backToTop = document.querySelector('.back-to-top')
    if (!backToTop) return

    const handleScroll = () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible')
      } else {
        backToTop.classList.remove('visible')
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <Component {...pageProps} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1A1A1A',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#6BCF7F',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#FF6B35',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  )
}
