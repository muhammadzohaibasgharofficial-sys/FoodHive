// ============================================================
// FoodHive World — lib/data.js (FIXED VERSION - VERCEL SAFE)
// ============================================================

// ── 10 COUNTRIES ──
export const COUNTRIES = [
  { id: 'asian', name: 'Asian', flag: '🌏', cuisine: 'Asian', color: '#FF6B35', bgColor: '#FFF3EE', desc: 'Diverse flavors from East & Southeast Asia.', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg' },
  { id: 'european', name: 'European', flag: '🌍', cuisine: 'European', color: '#4A90D9', bgColor: '#EEF5FF', desc: 'Classic European cuisine.', image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg' },
  { id: 'chinese', name: 'Chinese', flag: '🇨🇳', cuisine: 'Chinese', color: '#D32F2F', bgColor: '#FFEEEE', desc: 'Traditional Chinese flavors.', image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg' },
  { id: 'korean', name: 'Korean', flag: '🇰🇷', cuisine: 'Korean', color: '#7B3FA0', bgColor: '#F5EEFF', desc: 'Spicy Korean dishes.', image: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg' },
  { id: 'indian', name: 'Indian', flag: '🇮🇳', cuisine: 'Indian', color: '#F57C00', bgColor: '#FFF8EE', desc: 'Rich Indian spices.', image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg' },
  { id: 'mexican', name: 'Mexican', flag: '🇲🇽', cuisine: 'Mexican', color: '#2E7D32', bgColor: '#EEFFF0', desc: 'Vibrant Mexican food.', image: 'https://images.pexels.com/photos/2087748/pexels-photo-2087748.jpeg' },
  { id: 'japanese', name: 'Japanese', flag: '🇯🇵', cuisine: 'Japanese', color: '#C62828', bgColor: '#FFF0EE', desc: 'Sushi & ramen.', image: 'https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg' },
  { id: 'italian', name: 'Italian', flag: '🇮🇹', cuisine: 'Italian', color: '#1565C0', bgColor: '#EEF4FF', desc: 'Pizza & pasta.', image: 'https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg' },
  { id: 'middleeastern', name: 'Middle Eastern', flag: '🌙', cuisine: 'Middle Eastern', color: '#795548', bgColor: '#FFF5EE', desc: 'Shawarma & hummus.', image: 'https://images.pexels.com/photos/2282532/pexels-photo-2282532.jpeg' },
  { id: 'american', name: 'American', flag: '🇺🇸', cuisine: 'American', color: '#1976D2', bgColor: '#EEF5FF', desc: 'Classic comfort food.', image: 'https://images.pexels.com/photos/3616956/pexels-photo-3616956.jpeg' }
]

// ── 12 RECIPE CATEGORIES ──
export const RECIPE_CATEGORIES = [
  { id: 'breakfast', name: 'Breakfast', icon: '🍳' },
  { id: 'lunch', name: 'Lunch', icon: '🥗' },
  { id: 'dinner', name: 'Dinner', icon: '🍽️' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' },
  { id: 'appetizers', name: 'Appetizers', icon: '🥨' },
  { id: 'soups', name: 'Soups', icon: '🍲' },
  { id: 'pasta', name: 'Pasta', icon: '🍝' },
  { id: 'vegetarian', name: 'Vegetarian', icon: '🥬' },
  { id: 'seafood', name: 'Seafood', icon: '🦞' },
  { id: 'chicken', name: 'Chicken', icon: '🍗' },
  { id: 'beverages', name: 'Beverages', icon: '🥤' },
  { id: 'baking', name: 'Baking', icon: '🥖' }
]

// ── STATIC RECIPES (NO FS - SAFE) ──
export const RECIPES = [
  {
    slug: 'butter-chicken',
    title: 'Butter Chicken',
    country: 'indian',
    category: 'chicken',
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg',
    publishedAt: new Date().toISOString()
  }
]

// ── HELPERS ──
export function getCountryById(id) {
  return COUNTRIES.find(c => c.id === id) || null
}

export function getAllRecipes() {
  return RECIPES
}

export function getRecipeBySlug(slug) {
  return RECIPES.find(r => r.slug === slug) || null
}

export function getRecipesByCountry(countryId) {
  return RECIPES.filter(r => r.country === countryId)
}

export function getRecipesByCountryAndCategory(countryId, categoryId) {
  return RECIPES.filter(r => r.country === countryId && r.category === categoryId)
}

// ── UNIQUE SLUGS (NO DUPLICATE ERROR) ──
export function getAllRecipeSlugs() {
  const unique = [...new Set(RECIPES.map(r => r.slug))]

  return unique.map(slug => ({
    params: { slug }
  }))
}
