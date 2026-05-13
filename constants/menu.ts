export type MenuCategory = 'starters' | 'mains' | 'drinks' | 'desserts';

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  emoji: string;
  tags: string[];
  sizes?: { label: string; priceModifier: number }[];
};

export const CATEGORIES: { id: MenuCategory; label: string; emoji: string }[] = [
  { id: 'starters', label: 'Starters', emoji: '🥗' },
  { id: 'mains', label: 'Mains', emoji: '🍽️' },
  { id: 'drinks', label: 'Drinks', emoji: '🥂' },
  { id: 'desserts', label: 'Desserts', emoji: '🍰' },
];

export const MENU: MenuItem[] = [
  // Starters
  {
    id: 'S1',
    name: 'Truffle Arancini',
    description: 'Crispy risotto balls with black truffle and parmesan',
    price: 12,
    category: 'starters',
    emoji: '🧆',
    tags: ['popular', 'vegetarian'],
  },
  {
    id: 'S2',
    name: 'Spicy Tuna Tartare',
    description: 'Fresh tuna with sriracha aioli and wonton crisps',
    price: 16,
    category: 'starters',
    emoji: '🐟',
    tags: ['spicy', 'gluten-free'],
  },
  {
    id: 'S3',
    name: 'Burrata & Heirloom Tomato',
    description: 'Creamy burrata, heirloom tomatoes, basil oil',
    price: 14,
    category: 'starters',
    emoji: '🍅',
    tags: ['vegetarian', 'gluten-free'],
  },
  {
    id: 'S4',
    name: 'Garlic Bread Trio',
    description: 'Classic, cheese, and herb-infused garlic breads',
    price: 9,
    category: 'starters',
    emoji: '🥖',
    tags: ['vegetarian'],
  },

  // Mains
  {
    id: 'M1',
    name: 'Wagyu Smash Burger',
    description: 'Double wagyu patty, aged cheddar, house sauce, brioche bun',
    price: 24,
    category: 'mains',
    emoji: '🍔',
    tags: ['popular', 'bestseller'],
  },
  {
    id: 'M2',
    name: 'Spicy Chicken Sandwich',
    description: 'Crispy fried chicken, Nashville hot sauce, pickles, coleslaw',
    price: 18,
    category: 'mains',
    emoji: '🌶️',
    tags: ['spicy', 'popular'],
  },
  {
    id: 'M3',
    name: 'Mushroom Risotto',
    description: 'Wild mushroom, arborio rice, white wine, aged parmesan',
    price: 19,
    category: 'mains',
    emoji: '🍄',
    tags: ['vegetarian', 'gluten-free'],
  },
  {
    id: 'M4',
    name: 'Pan-Seared Salmon',
    description: 'Atlantic salmon, lemon beurre blanc, seasonal vegetables',
    price: 26,
    category: 'mains',
    emoji: '🍣',
    tags: ['gluten-free', 'healthy'],
  },
  {
    id: 'M5',
    name: 'Truffle Pasta',
    description: 'Fresh tagliatelle, black truffle, parmesan, chives',
    price: 22,
    category: 'mains',
    emoji: '🍝',
    tags: ['vegetarian', 'popular'],
  },
  {
    id: 'M6',
    name: 'BBQ Short Rib',
    description: '12-hour smoked beef short rib, smoked mash, pickled slaw',
    price: 32,
    category: 'mains',
    emoji: '🥩',
    tags: ['bestseller', 'gluten-free'],
  },

  // Drinks
  {
    id: 'D1',
    name: 'Still Water',
    description: 'Filtered still water',
    price: 3,
    category: 'drinks',
    emoji: '💧',
    tags: [],
    sizes: [
      { label: 'Small', priceModifier: 0 },
      { label: 'Large', priceModifier: 2 },
    ],
  },
  {
    id: 'D2',
    name: 'Sparkling Water',
    description: 'San Pellegrino sparkling water',
    price: 4,
    category: 'drinks',
    emoji: '🫧',
    tags: [],
    sizes: [
      { label: 'Small', priceModifier: 0 },
      { label: 'Large', priceModifier: 2 },
    ],
  },
  {
    id: 'D3',
    name: 'Fresh Lemonade',
    description: 'Freshly squeezed lemonade with mint',
    price: 6,
    category: 'drinks',
    emoji: '🍋',
    tags: ['popular', 'vegan'],
  },
  {
    id: 'D4',
    name: 'Craft Cola',
    description: 'House-made cola with vanilla and cinnamon',
    price: 5,
    category: 'drinks',
    emoji: '🥤',
    tags: ['vegan'],
  },
  {
    id: 'D5',
    name: 'Espresso Martini',
    description: 'Vodka, espresso, coffee liqueur, vanilla',
    price: 14,
    category: 'drinks',
    emoji: '🍸',
    tags: ['popular', 'alcoholic'],
  },

  // Desserts
  {
    id: 'DS1',
    name: 'Chocolate Lava Cake',
    description: 'Warm dark chocolate cake with vanilla gelato',
    price: 11,
    category: 'desserts',
    emoji: '🍫',
    tags: ['popular', 'vegetarian'],
  },
  {
    id: 'DS2',
    name: 'Crème Brûlée',
    description: 'Classic French vanilla custard with caramelized sugar',
    price: 10,
    category: 'desserts',
    emoji: '🍮',
    tags: ['vegetarian', 'gluten-free'],
  },
  {
    id: 'DS3',
    name: 'Tiramisu',
    description: 'Mascarpone cream, espresso-soaked ladyfingers, cocoa',
    price: 12,
    category: 'desserts',
    emoji: '☕',
    tags: ['vegetarian', 'bestseller'],
  },
];

export const TAG_LABELS: Record<string, { label: string; emoji: string }> = {
  popular: { label: 'Popular', emoji: '⭐' },
  bestseller: { label: 'Bestseller', emoji: '🏆' },
  vegetarian: { label: 'Vegetarian', emoji: '🌿' },
  vegan: { label: 'Vegan', emoji: '🌱' },
  spicy: { label: 'Spicy', emoji: '🌶️' },
  'gluten-free': { label: 'Gluten Free', emoji: '🌾' },
  healthy: { label: 'Healthy', emoji: '🥗' },
  alcoholic: { label: '21+', emoji: '🍷' },
};
