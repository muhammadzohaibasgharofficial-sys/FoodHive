// ============================================================
// FoodHive World — pages/api/sb-comments.js
// Supabase-backed comments system (NEW — Airtable safe rahega)
// Table: fh_comments
// Fields: id, recipe_slug, name, email, comment, rating, status, created_at
// ============================================================

import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  // ── GET: approved comments for a recipe ──
  if (req.method === 'GET') {
    const { slug } = req.query
    if (!slug) return res.status(400).json({ error: 'slug required' })

    const { data, error } = await supabase
      .from('fh_comments')
      .select('id, name, comment, rating, created_at')
      .eq('recipe_slug', slug)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) return res.status(500).json({ error: error.message })

    return res.status(200).json({
      comments: data.map(c => ({
        id:      c.id,
        name:    c.name,
        comment: c.comment,
        rating:  c.rating,
        date:    c.created_at,
      }))
    })
  }

  // ── POST: add new comment ──
  if (req.method === 'POST') {
    const { slug, name, email, comment, rating } = req.body || {}

    if (!slug || !name || !comment)
      return res.status(400).json({ error: 'slug, name, comment required' })

    if (comment.length > 1000)
      return res.status(400).json({ error: 'Comment too long (max 1000 chars)' })

    const safeRating = Math.min(5, Math.max(1, parseInt(rating) || 5))

    const { data, error } = await supabase
      .from('fh_comments')
      .insert({
        recipe_slug: slug,
        name:        name.slice(0, 100),
        email:       (email || '').slice(0, 200),
        comment:     comment.slice(0, 1000),
        rating:      safeRating,
        status:      'approved', // 'pending' kar do agar moderation chahiye
      })
      .select('id')
      .single()

    if (error) return res.status(500).json({ error: error.message })

    return res.status(201).json({ success: true, id: data.id })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
