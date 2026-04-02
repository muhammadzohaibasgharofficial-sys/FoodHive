// ============================================================
// FoodHive — Recipe Detail Page
// Full recipe with ingredients, instructions, nutrition, tips
// ============================================================

import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { getRecipeBySlug, getAllRecipeSlugs, RECIPE_CATEGORIES, SAMPLE_RECIPE } from '../../lib/data'

export default function RecipeDetailPage({ recipe }) {
  const [servings, setServings] = useState(recipe?.servings || 4)
  
  if (!recipe) {
    return (
      <div style={{ padding: '100px 24px', textAlign: 'center', minHeight: '100vh' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', marginBottom: '16px' }}>Recipe Not Found</h1>
        <Link href="/recipes" className="btn-primary">← Browse All Recipes</Link>
      </div>
    )
  }

  const category = RECIPE_CATEGORIES.find(c => c.id === recipe.category)
  const servingMultiplier = servings / (recipe.servings || 4)

  return (
    <>
      <Head>
        <title>{recipe.title} — FoodHive Recipe</title>
        <meta name="description" content={recipe.description} />
        <meta property="og:title" content={recipe.title} />
        <meta property="og:description" content={recipe.description} />
        <meta property="og:image" content={recipe.image1} />
        <meta property="og:type" content="article" />
      </Head>

      <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-inner">
            <Link href="/" className="logo">
              <div className="logo-icon">🍳</div>
              <span>FoodHive</span>
            </Link>
            <div className="nav-links">
              <Link href="/recipes" className="nav-link">All Recipes</Link>
              <Link href="/#categories" className="nav-link">Categories</Link>
            </div>
            <Link href="/recipes" className="btn-primary">← All Recipes</Link>
          </div>
        </nav>

        {/* Recipe Header */}
        <section style={{ background: 'white', padding: '60px 0' }}>
          <div className="container">
            <div className="breadcrumb">
              <Link href="/">Home</Link>
              <span className="breadcrumb-separator">›</span>
              <Link href="/recipes">Recipes</Link>
              <span className="breadcrumb-separator">›</span>
              <Link href={`/categories/${recipe.category}`}>{recipe.categoryName}</Link>
              <span className="breadcrumb-separator">›</span>
              <span style={{ color: 'var(--orange)' }}>{recipe.title}</span>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,107,53,0.1)', color: 'var(--orange)', padding: '8px 18px', borderRadius: 'var(--r-full)', fontSize: '14px', fontWeight: '600' }}>
                {category?.icon} {recipe.categoryName}
              </div>
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: '800', color: 'var(--black)', lineHeight: '1.2', marginBottom: '20px' }}>
              {recipe.title}
            </h1>

            <p style={{ fontSize: '18px', color: 'var(--gray)', lineHeight: '1.7', maxWidth: '800px', marginBottom: '32px' }}>
              {recipe.description}
            </p>

            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', paddingBottom: '32px', borderBottom: '2px solid var(--gray-light)' }}>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '4px' }}>Prep Time</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--orange)' }}>⏱️ {recipe.prepTime}</div>
              </div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '4px' }}>Cook Time</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--orange)' }}>🍳 {recipe.cookTime}</div>
              </div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '4px' }}>Total Time</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--orange)' }}>⏰ {recipe.totalTime}</div>
              </div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '4px' }}>Servings</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button onClick={() => setServings(Math.max(1, servings - 1))} style={{ width: '32px', height: '32px', background: 'var(--orange)', color: 'white', borderRadius: '50%', fontSize: '18px', fontWeight: '700' }}>−</button>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--orange)', minWidth: '40px', textAlign: 'center' }}>👥 {servings}</div>
                  <button onClick={() => setServings(servings + 1)} style={{ width: '32px', height: '32px', background: 'var(--orange)', color: 'white', borderRadius: '50%', fontSize: '18px', fontWeight: '700' }}>+</button>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '4px' }}>Difficulty</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--orange)' }}>📊 {recipe.difficulty}</div>
              </div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '4px' }}>Rating</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--yellow)' }}>⭐ {recipe.rating}/5</div>
              </div>
            </div>
          </div>
        </section>

        {/* Recipe Images */}
        <section style={{ background: 'white', paddingBottom: '60px' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '40px' }}>
              <div style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden' }}>
                <img src={recipe.image1} alt={recipe.title} style={{ width: '100%', height: '500px', objectFit: 'cover' }} />
              </div>
              {recipe.image2 && (
                <div style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden' }}>
                  <img src={recipe.image2} alt={recipe.title} style={{ width: '100%', height: '500px', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Recipe Content (2 columns) */}
        <section style={{ padding: '60px 0' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '60px' }}>
              {/* Left Column - Ingredients & Instructions */}
              <div>
                {/* Ingredients */}
                <div style={{ background: 'white', borderRadius: 'var(--r-xl)', padding: '40px', marginBottom: '32px', boxShadow: 'var(--shadow-soft)' }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: '800', color: 'var(--black)', marginBottom: '24px' }}>
                    🥘 Ingredients
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {recipe.ingredients?.map((ing, i) => (
                      <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px', background: 'var(--cream)', borderRadius: 'var(--r-md)' }}>
                        <div style={{ width: '24px', height: '24px', background: 'var(--orange)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>
                          {i + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', color: 'var(--black)' }}>
                            {ing.item}
                          </div>
                          <div style={{ fontSize: '14px', color: 'var(--orange)', fontWeight: '700' }}>
                            {ing.amount && (servingMultiplier !== 1 
                              ? `${(parseFloat(ing.amount) * servingMultiplier).toFixed(1)} ${ing.amount.replace(/[0-9.]/g, '').trim()}`
                              : ing.amount)}
                          </div>
                          {ing.notes && (
                            <div style={{ fontSize: '13px', color: 'var(--gray)', marginTop: '4px' }}>
                              {ing.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div style={{ background: 'white', borderRadius: 'var(--r-xl)', padding: '40px', marginBottom: '32px', boxShadow: 'var(--shadow-soft)' }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: '800', color: 'var(--black)', marginBottom: '24px' }}>
                    👨‍🍳 Instructions
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {recipe.instructions?.map((inst, i) => (
                      <div key={i} style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, var(--orange), var(--orange-light))', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '800', flexShrink: 0 }}>
                          {inst.step}
                        </div>
                        <div style={{ flex: 1 }}>
                          {inst.title && (
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--black)', marginBottom: '8px' }}>
                              {inst.title}
                            </h3>
                          )}
                          <p style={{ fontSize: '15px', color: 'var(--gray)', lineHeight: '1.7', marginBottom: '8px' }}>
                            {inst.text}
                          </p>
                          {inst.time && (
                            <div style={{ fontSize: '13px', color: 'var(--orange)', fontWeight: '600' }}>
                              ⏱️ {inst.time}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chef's Tips */}
                {recipe.tips && recipe.tips.length > 0 && (
                  <div style={{ background: 'linear-gradient(135deg, #FFF8E7, #FFE4CC)', borderRadius: 'var(--r-xl)', padding: '40px', marginBottom: '32px', border: '2px solid var(--orange)' }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '800', color: 'var(--black)', marginBottom: '20px' }}>
                      💡 Chef's Tips
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {recipe.tips.map((tip, i) => (
                        <div key={i} style={{ display: 'flex', gap: '12px', fontSize: '15px', color: 'var(--black)', lineHeight: '1.7' }}>
                          <span style={{ color: 'var(--orange)', fontWeight: '700', flexShrink: 0 }}>•</span>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Sidebar */}
              <div>
                {/* Nutrition Table */}
                {recipe.nutritionTable && (
                  <div style={{ background: 'white', borderRadius: 'var(--r-xl)', padding: '32px', marginBottom: '24px', boxShadow: 'var(--shadow-soft)', position: 'sticky', top: '100px' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: '800', color: 'var(--black)', marginBottom: '20px' }}>
                      📊 Nutrition Facts
                    </h3>
                    <div style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '16px' }}>
                      Per serving ({servings} servings total)
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--gray-light)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
                      {Object.entries(recipe.nutritionTable).map(([key, value], i) => (
                        <div key={i} style={{ background: 'white', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '14px', color: 'var(--gray)', textTransform: 'capitalize' }}>{key}</span>
                          <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--black)' }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {recipe.tags && recipe.tags.length > 0 && (
                  <div style={{ background: 'white', borderRadius: 'var(--r-xl)', padding: '32px', marginBottom: '24px', boxShadow: 'var(--shadow-soft)' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: '800', color: 'var(--black)', marginBottom: '16px' }}>
                      🏷️ Tags
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {recipe.tags.map((tag, i) => (
                        <span key={i} style={{ background: 'var(--cream)', color: 'var(--orange)', padding: '6px 14px', borderRadius: 'var(--r-full)', fontSize: '13px', fontWeight: '600' }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-bottom">
              © 2026 FoodHive. All rights reserved.
            </div>
          </div>
        </footer>

        <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
      </div>
    </>
  )
}

export async function getStaticPaths() {
  const paths = getAllRecipeSlugs()
  
  // Add sample recipe as fallback
  const allPaths = [...paths, { params: { slug: SAMPLE_RECIPE.slug } }]
  
  return {
    paths: allPaths,
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params }) {
  let recipe = getRecipeBySlug(params.slug)
  
  // Fallback to sample recipe
  if (!recipe && params.slug === SAMPLE_RECIPE.slug) {
    recipe = SAMPLE_RECIPE
  }
  
  if (!recipe) {
    return { notFound: true }
  }
  
  return {
    props: { recipe },
    revalidate: 3600
  }
}
