// ============================================================
// FoodHive World — pages/api/sb-likes.js
// Supabase-backed likes counter (NEW — Airtable safe rahega)
// Table: fh_likes
// Fields: id, recipe_slug (unique), count, created_at
// ============================================================

import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const slug = req.method === 'GET'
    ? req.query.slug
    : req.body?.slug

  if (!slug) return res.status(400).json({ error: 'slug required' })

  // ── GET: current like count ──
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('fh_likes')
      .select('count')
      .eq('recipe_slug', slug)
      .maybeSingle()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ count: data?.count || 0 })
  }

  // ── POST: increment like count ──
  if (req.method === 'POST') {
    const { data: existing, error: fetchError } = await supabase
      .from('fh_likes')
      .select('id, count')
      .eq('recipe_slug', slug)
      .maybeSingle()

    if (fetchError) return res.status(500).json({ error: fetchError.message })

    if (existing) {
      // Record exist karta hai — count badhao
      const { data, error } = await supabase
        .from('fh_likes')
        .update({ count: existing.count + 1 })
        .eq('recipe_slug', slug)
        .select('count')
        .single()

      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json({ count: data?.count || 0 })
    } else {
      // Naya record banao
      const { data, error } = await supabase
        .from('fh_likes')
        .insert({ recipe_slug: slug, count: 1 })
        .select('count')
        .single()

      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json({ count: data?.count || 0 })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
