// ============================================================
// FoodHive World — lib/data.js
// 10 Countries × 12 Categories
// FIXED: getAllRecipes() now filters broken/empty recipe files
// ============================================================

// ── 10 COUNTRIES ──
export const COUNTRIES = [
  {
    id: 'asian',
    name: 'Asian',
    flag: '🌏',
    cuisine: 'Asian',
    color: '#FF6B35',
    bgColor: '#FFF3EE',
    desc: 'Diverse flavors from East & Southeast Asia — bold, fragrant, and irresistible.',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'european',
    name: 'European',
    flag: '🌍',
    cuisine: 'European',
    color: '#4A90D9',
    bgColor: '#EEF5FF',
    desc: 'Classic European cuisine from French bistros to Italian trattorias.',
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'chinese',
    name: 'Chinese',
    flag: '🇨🇳',
    cuisine: 'Chinese',
    color: '#D32F2F',
    bgColor: '#FFEEEE',
    desc: 'Ancient recipes from China\'s eight great culinary traditions.',
    image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'korean',
    name: 'Korean',
    flag: '🇰🇷',
    cuisine: 'Korean',
    color: '#7B3FA0',
    bgColor: '#F5EEFF',
    desc: 'Bold Korean flavors — fermented, spicy, and deeply satisfying.',
    image: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'indian',
    name: 'Indian',
    flag: '🇮🇳',
    cuisine: 'Indian',
    color: '#F57C00',
    bgColor: '#FFF8EE',
    desc: 'Rich spices and aromatic curries from across the Indian subcontinent.',
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'mexican',
    name: 'Mexican',
    flag: '🇲🇽',
    cuisine: 'Mexican',
    color: '#2E7D32',
    bgColor: '#EEFFF0',
    desc: 'Vibrant Mexican street food and traditional home-cooked classics.',
    image: 'https://images.pexels.com/photos/2087748/pexels-photo-2087748.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'japanese',
    name: 'Japanese',
    flag: '🇯🇵',
    cuisine: 'Japanese',
    color: '#C62828',
    bgColor: '#FFF0EE',
    desc: 'Precision and harmony — from sushi to ramen and everything between.',
    image: 'https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'italian',
    name: 'Italian',
    flag: '🇮🇹',
    cuisine: 'Italian',
    color: '#1565C0',
    bgColor: '#EEF4FF',
    desc: 'La dolce vita on a plate — pasta, pizza, and Mediterranean magic.',
    image: 'https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'middleeastern',
    name: 'Middle Eastern',
    flag: '🌙',
    cuisine: 'Middle Eastern',
    color: '#795548',
    bgColor: '#FFF5EE',
    desc: 'Ancient spice routes meet modern kitchens — hummus, shawarma, and beyond.',
    image: 'https://images.pexels.com/photos/2282532/pexels-photo-2282532.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'american',
    name: 'American',
    flag: '🇺🇸',
    cuisine: 'American',
    color: '#1976D2',
    bgColor: '#EEF5FF',
    desc: 'Classic American comfort food from coast to coast.',
    image: 'https://images.pexels.com/photos/3616956/pexels-photo-3616956.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
]

// ── 12 RECIPE CATEGORIES ──
export const RECIPE_CATEGORIES = [
  { id: 'breakfast',   name: 'Breakfast',       icon: '🍳', desc: 'Start your day with something delicious.' },
  { id: 'lunch',       name: 'Lunch',            icon: '🥗', desc: 'Quick midday meals full of flavor.' },
  { id: 'dinner',      name: 'Dinner',           icon: '🍽️', desc: 'Hearty dinners for the whole family.' },
  { id: 'desserts',    name: 'Desserts',         icon: '🍰', desc: 'Sweet endings to every meal.' },
  { id: 'appetizers',  name: 'Appetizers',       icon: '🥨', desc: 'Perfect starters and snacks.' },
  { id: 'soups',       name: 'Soups & Stews',    icon: '🍲', desc: 'Warm, comforting bowls.' },
  { id: 'pasta',       name: 'Pasta & Noodles',  icon: '🍝', desc: 'World noodle dishes in one place.' },
  { id: 'vegetarian',  name: 'Vegetarian',       icon: '🥬', desc: 'Plant-based recipes bursting with flavor.' },
  { id: 'seafood',     name: 'Seafood',          icon: '🦞', desc: 'Fresh catch from ocean to plate.' },
  { id: 'chicken',     name: 'Chicken',          icon: '🍗', desc: 'Versatile chicken recipes for any day.' },
  { id: 'beverages',   name: 'Beverages',        icon: '🥤', desc: 'Refreshing drinks from around the world.' },
  { id: 'baking',      name: 'Baking & Bread',   icon: '🥖', desc: 'Fresh baked goods from your oven.' }
]

// ── GET COUNTRY BY ID ──
export function getCountryById(id) {
  return COUNTRIES.find(c => c.id === id) || null
}

// ── VALIDATE RECIPE (filter broken/incomplete records) ──
function isValidRecipe(data) {
  return (
    data &&
    typeof data.slug === 'string' && data.slug.trim() !== '' &&
    typeof data.title === 'string' && data.title.trim() !== '' &&
    typeof data.image1 === 'string' && data.image1.trim() !== '' &&
    typeof data.category === 'string' && data.category.trim() !== '' &&
    typeof data.country === 'string' && data.country.trim() !== ''
  )
}

// ── READ ALL RECIPES ──
export function getAllRecipes() {
  try {
    const fs = require('fs')
    const path = require('path')
    const recipesDir = path.join(process.cwd(), 'data', 'recipes')
    if (!fs.existsSync(recipesDir)) return []
    const files = fs.readdirSync(recipesDir)
    const recipes = []
    for (const file of files) {
      if (!file.endsWith('.json')) continue
      // Skip files with no slug in filename (e.g. ".json")
      const filenameSlug = file.replace('.json', '')
      if (!filenameSlug || filenameSlug.trim() === '') continue
      try {
        const data = JSON.parse(fs.readFileSync(path.join(recipesDir, file), 'utf8'))
        // Only include valid, complete recipes
        if (isValidRecipe(data)) {
          recipes.push(data)
        }
      } catch (e) {
        // Skip malformed JSON files silently
        console.warn(`Skipping malformed recipe file: ${file}`)
      }
    }
    return recipes.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))
  } catch (e) { return [] }
}

// ── GET RECIPE BY SLUG ──
export function getRecipeBySlug(slug) {
  try {
    if (!slug || slug.trim() === '') return null
    const fs = require('fs')
    const path = require('path')
    const filePath = path.join(process.cwd(), 'data', 'recipes', `${slug}.json`)
    if (!fs.existsSync(filePath)) return null
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    return isValidRecipe(data) ? data : null
  } catch (e) { return null }
}

// ── GET RECIPES BY COUNTRY ──
export function getRecipesByCountry(countryId) {
  return getAllRecipes().filter(r => r.country === countryId)
}

// ── GET RECIPES BY COUNTRY + CATEGORY ──
export function getRecipesByCountryAndCategory(countryId, categoryId) {
  return getAllRecipes().filter(r => r.country === countryId && r.category === categoryId)
}

// ── GET ALL SLUGS ──
export function getAllRecipeSlugs() {
  try {
    const fs = require('fs')
    const path = require('path')
    const recipesDir = path.join(process.cwd(), 'data', 'recipes')
    if (!fs.existsSync(recipesDir)) return []
    return fs.readdirSync(recipesDir)
      .filter(f => {
        if (!f.endsWith('.json')) return false
        const slug = f.replace('.json', '')
        return slug && slug.trim() !== '' // Skip empty-named files like ".json"
      })
      .map(f => ({ params: { slug: f.replace('.json', '') } }))
  } catch (e) { return [] }
}

// ── SAMPLE RECIPE FALLBACK ──
export const SAMPLE_RECIPE = {
  slug: 'sample-butter-chicken',
  title: 'Butter Chicken',
  country: 'indian',
  countryName: 'Indian',
  countryFlag: '🇮🇳',
  category: 'chicken',
  categoryName: 'Chicken',
  categoryIcon: '🍗',
  prepTime: '20 min',
  cookTime: '40 min',
  totalTime: '60 min',
  servings: 4,
  difficulty: 'Medium',
  cuisine: 'Indian',
  image1: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800',
  image2: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800',
  description: 'Creamy, rich, and aromatic — Butter Chicken is the crown jewel of Indian cuisine. Tender marinated chicken in a silky tomato-cream sauce.',
  ingredients: [
    { item: 'Chicken thighs', amount: '800g', notes: 'boneless, cubed' },
    { item: 'Yogurt', amount: '1 cup', notes: 'for marinade' },
    { item: 'Tomato puree', amount: '2 cups', notes: '' },
    { item: 'Heavy cream', amount: '1/2 cup', notes: '' },
    { item: 'Butter', amount: '4 tbsp', notes: '' },
    { item: 'Garam masala', amount: '2 tsp', notes: '' },
    { item: 'Cumin', amount: '1 tsp', notes: '' },
    { item: 'Garlic paste', amount: '2 tbsp', notes: '' }
  ],
  instructions: [
    { step: 1, title: 'Marinate chicken', text: 'Mix chicken with yogurt and spices. Marinate for at least 1 hour.', time: '5 min + 1hr rest' },
    { step: 2, title: 'Cook chicken', text: 'Grill or pan-fry marinated chicken until charred. Set aside.', time: '15 min' },
    { step: 3, title: 'Make sauce', text: 'Melt butter, add garlic, tomato puree, and spices. Simmer 15 minutes.', time: '20 min' },
    { step: 4, title: 'Combine & finish', text: 'Add chicken to sauce, stir in cream. Simmer gently for 10 minutes.', time: '10 min' }
  ],
  nutritionTable: { calories: '480 kcal', protein: '38g', carbs: '14g', fat: '28g', fiber: '3g', sugar: '9g', sodium: '680mg', cholesterol: '145mg' },
  tags: ['Indian', 'Chicken', 'Curry', 'Creamy', 'Traditional'],
  tips: ['Marinate overnight for deeper flavor.', 'Char the chicken well — it adds authentic smokiness.', 'Add kasuri methi (dried fenugreek) at the end for restaurant taste.'],
  rating: 4.9,
  reviews: 521,
  publishedAt: new Date().toISOString(),
  article: '## History of Butter Chicken\n\nButter Chicken was created in the 1950s at Moti Mahal restaurant in Delhi. The chef accidentally mixed leftover tandoori chicken into a tomato-butter sauce, and a legend was born.\n\n## Why It Works\n\nThe magic lies in the balance of tangy tomatoes, rich cream, and aromatic spices. The marinade tenderizes the chicken while adding deep flavor layers.'
}
