// ============================================================
// FoodHive — lib/data.js
// Recipe categories and data management functions
// ============================================================

// ── RECIPE CATEGORIES (12 Categories) ──
export const RECIPE_CATEGORIES = [
  {
    id: 'breakfast',
    name: 'Breakfast Recipes',
    icon: '🍳',
    color: '#FFD93D',
    desc: 'Start your day right with delicious breakfast recipes from pancakes to smoothie bowls.',
    image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'lunch',
    name: 'Lunch Recipes',
    icon: '🥗',
    color: '#6BCF7F',
    desc: 'Quick and healthy lunch ideas perfect for busy weekdays.',
    image: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'dinner',
    name: 'Dinner Recipes',
    icon: '🍽️',
    color: '#FF6B35',
    desc: 'Hearty dinner recipes for family meals and special occasions.',
    image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'desserts',
    name: 'Desserts',
    icon: '🍰',
    color: '#FF8C94',
    desc: 'Sweet treats and desserts to satisfy every craving.',
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'appetizers',
    name: 'Appetizers & Snacks',
    icon: '🥨',
    color: '#FFA07A',
    desc: 'Perfect starters and snacks for any gathering.',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'soups',
    name: 'Soups & Stews',
    icon: '🍲',
    color: '#CD853F',
    desc: 'Warm, comforting soups and stews for every season.',
    image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'pasta',
    name: 'Pasta & Noodles',
    icon: '🍝',
    color: '#F4A460',
    desc: 'Classic pasta dishes and noodle recipes from around the world.',
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'vegetarian',
    name: 'Vegetarian',
    icon: '🥬',
    color: '#90EE90',
    desc: 'Delicious plant-based recipes packed with flavor and nutrition.',
    image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'seafood',
    name: 'Seafood',
    icon: '🦞',
    color: '#87CEEB',
    desc: 'Fresh seafood recipes from simple grills to elegant preparations.',
    image: 'https://images.pexels.com/photos/725992/pexels-photo-725992.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'chicken',
    name: 'Chicken Recipes',
    icon: '🍗',
    color: '#FFB347',
    desc: 'Versatile chicken recipes from quick weeknight dinners to Sunday roasts.',
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'beverages',
    name: 'Beverages & Drinks',
    icon: '🥤',
    color: '#FFE4B5',
    desc: 'Refreshing drinks, smoothies, and beverages for every mood.',
    image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'baking',
    name: 'Baking & Bread',
    icon: '🥖',
    color: '#DEB887',
    desc: 'Homemade breads, pastries, and baked goods fresh from the oven.',
    image: 'https://images.pexels.com/photos/209196/pexels-photo-209196.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
]

// ── READ RECIPE BY SLUG ──
export function getRecipeBySlug(slug) {
  try {
    const fs = require('fs')
    const path = require('path')
    const filePath = path.join(process.cwd(), 'data', 'recipes', `${slug}.json`)
    
    if (!fs.existsSync(filePath)) {
      return null
    }
    
    const rawData = fs.readFileSync(filePath, 'utf8')
    const recipe = JSON.parse(rawData)
    
    // Validate required fields
    if (!recipe.slug || !recipe.title || !recipe.category) {
      console.error(`Invalid recipe data in ${slug}.json`)
      return null
    }
    
    return recipe
  } catch(e) {
    console.error(`Error reading recipe ${slug}:`, e.message)
    return null
  }
}

// ── GET RECIPES BY CATEGORY ──
export function getRecipesByCategory(categoryId) {
  try {
    const fs = require('fs')
    const path = require('path')
    const recipesDir = path.join(process.cwd(), 'data', 'recipes')
    
    if (!fs.existsSync(recipesDir)) {
      return []
    }
    
    const files = fs.readdirSync(recipesDir)
    const recipes = []
    
    for (const file of files) {
      if (!file.endsWith('.json')) continue
      
      try {
        const filePath = path.join(recipesDir, file)
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        
        if (data.category === categoryId) {
          recipes.push(data)
        }
      } catch(e) {
        console.error(`Error reading ${file}:`, e.message)
      }
    }
    
    // Sort by publishedAt date (newest first)
    return recipes.sort((a, b) => {
      const dateA = new Date(a.publishedAt || 0)
      const dateB = new Date(b.publishedAt || 0)
      return dateB - dateA
    })
  } catch(e) {
    console.error('Error getting recipes by category:', e.message)
    return []
  }
}

// ── GET ALL RECIPES ──
export function getAllRecipes() {
  try {
    const fs = require('fs')
    const path = require('path')
    const recipesDir = path.join(process.cwd(), 'data', 'recipes')
    
    if (!fs.existsSync(recipesDir)) {
      return []
    }
    
    const files = fs.readdirSync(recipesDir)
    const recipes = []
    
    for (const file of files) {
      if (!file.endsWith('.json')) continue
      
      try {
        const filePath = path.join(recipesDir, file)
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        recipes.push(data)
      } catch(e) {
        console.error(`Error reading ${file}:`, e.message)
      }
    }
    
    // Sort by publishedAt date (newest first)
    return recipes.sort((a, b) => {
      const dateA = new Date(a.publishedAt || 0)
      const dateB = new Date(b.publishedAt || 0)
      return dateB - dateA
    })
  } catch(e) {
    console.error('Error getting all recipes:', e.message)
    return []
  }
}

// ── GET ALL RECIPE SLUGS (for static paths) ──
export function getAllRecipeSlugs() {
  try {
    const fs = require('fs')
    const path = require('path')
    const recipesDir = path.join(process.cwd(), 'data', 'recipes')
    
    if (!fs.existsSync(recipesDir)) {
      return []
    }
    
    const files = fs.readdirSync(recipesDir)
    return files
      .filter(f => f.endsWith('.json'))
      .map(f => ({ params: { slug: f.replace('.json', '') } }))
  } catch(e) {
    console.error('Error getting recipe slugs:', e.message)
    return []
  }
}

// ── SEARCH RECIPES ──
export function searchRecipes(query) {
  if (!query || query.trim().length === 0) {
    return []
  }
  
  const allRecipes = getAllRecipes()
  const searchTerm = query.toLowerCase().trim()
  
  return allRecipes.filter(recipe => {
    const titleMatch = recipe.title?.toLowerCase().includes(searchTerm)
    const categoryMatch = recipe.categoryName?.toLowerCase().includes(searchTerm)
    const tagsMatch = recipe.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    const cuisineMatch = recipe.cuisine?.toLowerCase().includes(searchTerm)
    
    return titleMatch || categoryMatch || tagsMatch || cuisineMatch
  })
}

// ── GET TRENDING RECIPES (most recent 12) ──
export function getTrendingRecipes(limit = 12) {
  const allRecipes = getAllRecipes()
  return allRecipes.slice(0, limit)
}

// ── SAMPLE RECIPE (fallback for empty data/) ──
export const SAMPLE_RECIPE = {
  slug: 'fluffy-pancakes',
  title: 'Fluffy Pancakes',
  category: 'breakfast',
  categoryName: 'Breakfast Recipes',
  categoryIcon: '🍳',
  prepTime: '10 min',
  cookTime: '15 min',
  totalTime: '25 min',
  servings: 4,
  difficulty: 'Easy',
  cuisine: 'American',
  image1: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800',
  image2: 'https://images.pexels.com/photos/101533/pexels-photo-101533.jpeg?auto=compress&cs=tinysrgb&w=800',
  description: 'Light, fluffy, and golden pancakes perfect for a weekend breakfast. Serve with maple syrup and fresh berries for the ultimate morning treat.',
  ingredients: [
    { item: 'All-purpose flour', amount: '2 cups', notes: 'sifted' },
    { item: 'Sugar', amount: '2 tbsp', notes: '' },
    { item: 'Baking powder', amount: '2 tsp', notes: '' },
    { item: 'Salt', amount: '1/2 tsp', notes: '' },
    { item: 'Milk', amount: '1 3/4 cups', notes: 'whole milk works best' },
    { item: 'Eggs', amount: '2 large', notes: 'room temperature' },
    { item: 'Butter', amount: '4 tbsp', notes: 'melted and cooled' },
    { item: 'Vanilla extract', amount: '1 tsp', notes: '' }
  ],
  instructions: [
    { step: 1, title: 'Mix dry ingredients', text: 'In a large bowl, whisk together flour, sugar, baking powder, and salt.', time: '2 min' },
    { step: 2, title: 'Combine wet ingredients', text: 'In another bowl, whisk milk, eggs, melted butter, and vanilla until smooth.', time: '3 min' },
    { step: 3, title: 'Make batter', text: 'Pour wet ingredients into dry ingredients. Stir until just combined. Do not overmix - lumps are okay!', time: '2 min' },
    { step: 4, title: 'Heat griddle', text: 'Heat a non-stick griddle or pan over medium heat. Lightly grease with butter.', time: '3 min' },
    { step: 5, title: 'Cook pancakes', text: 'Pour 1/4 cup batter for each pancake. Cook until bubbles form on surface (2-3 min), then flip and cook until golden (1-2 min).', time: '15 min' },
    { step: 6, title: 'Serve warm', text: 'Stack pancakes and serve immediately with maple syrup, butter, and fresh berries.', time: '0 min' }
  ],
  nutritionTable: {
    calories: '320 kcal',
    protein: '8g',
    carbs: '45g',
    fat: '12g',
    fiber: '2g',
    sugar: '8g',
    sodium: '450mg',
    cholesterol: '95mg'
  },
  tags: ['breakfast', 'pancakes', 'american', 'easy', 'weekend'],
  tips: [
    'Let the batter rest for 5 minutes before cooking for even fluffier pancakes.',
    'Use a ladle or measuring cup to pour consistent-sized pancakes.',
    'Keep finished pancakes warm in a 200°F oven while cooking the rest.'
  ],
  rating: 4.8,
  reviews: 342,
  publishedAt: new Date().toISOString(),
  article: `## The Story Behind Fluffy Pancakes

American pancakes have been a breakfast staple for generations. Unlike thin European crepes, American pancakes are thick, fluffy, and wonderfully satisfying. The secret to their signature fluffiness? Baking powder and the careful technique of not overmixing the batter.

## Why This Recipe Works

This recipe creates the perfect pancake texture through a few key techniques. First, we separate the dry and wet ingredients to prevent overmixing. Second, we use melted butter (not oil) for rich flavor. Third, we let the batter rest briefly, allowing the flour to hydrate and the baking powder to activate.

The ratio of ingredients is crucial - too much liquid creates thin, flat pancakes, while too little makes them dense. This recipe strikes the perfect balance.

## Chef's Secret Tips

Professional chefs know that the key to restaurant-quality pancakes is temperature control. Medium heat is essential - too hot and the outside burns before the inside cooks; too cool and they turn out pale and dense.

Another secret? Don't press down on pancakes while cooking! This deflates all those beautiful air bubbles that make them fluffy.

## Serving Suggestions

While classic maple syrup and butter are hard to beat, try these variations:
- Fresh berries with whipped cream
- Sliced bananas with honey and walnuts
- Chocolate chips mixed into the batter
- Crispy bacon on the side

## Variations to Try

**Blueberry Pancakes:** Gently fold 1 cup fresh blueberries into batter before cooking.

**Chocolate Chip Pancakes:** Sprinkle chocolate chips onto each pancake right after pouring batter on the griddle.

**Whole Wheat:** Replace half the all-purpose flour with whole wheat for a healthier option.

**Buttermilk:** Substitute buttermilk for regular milk for extra tangy flavor and tenderness.`
}
