export const menuCategories = [
  {
    id: "breakfast",
    name: "Breakfast",
    description: "Start your day with traditional flavors",
  },
  { id: "lunch", name: "Lunch", description: "Hearty midday meals" },
  {
    id: "dinner",
    name: "Dinner",
    description: "Evening feasts and special dishes",
  },
  {
    id: "afternoon",
    name: "Afternoon Tea",
    description: "Light bites and beverages",
  },
  {
    id: "desserts",
    name: "Desserts",
    description: "Sweet endings to your meal",
  },
  {
    id: "specials",
    name: "KULAN Specialties",
    description: "Our signature creations",
  },
  {
    id: "beverages",
    name: "Beverages",
    description: "Traditional drinks and more",
  },
];

export const menuItems = {
  breakfast: [
    {
      id: 1,
      name: "Malawah (Somali Pancakes)",
      description: "Thin, sweet pancakes served with honey and ghee",
      price: 8,
      image:
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3",
      popular: true,
      tags: ["Vegetarian", "Sweet"],
    },
    {
      id: 2,
      name: "Mandazi (Swahili Donuts)",
      description: "Sweet, fluffy triangular donuts with cardamom",
      price: 6,
      image:
        "https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-4.0.3",
      popular: true,
      tags: ["Vegetarian"],
    },
    {
      id: 3,
      name: "Mahamri & Maharagwe",
      description: "Coconut donuts with spicy kidney bean curry",
      price: 12,
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3",
      popular: false,
      tags: ["Spicy", "Traditional"],
    },
    {
      id: 4,
      name: "Chapati & Beans",
      description: "Fresh chapati with Kenyan-style bean stew",
      price: 10,
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3",
      popular: true,
      tags: ["Vegetarian"],
    },
  ],

  lunch: [
    {
      id: 5,
      name: "Bariis Iskukaris (Somali Rice)",
      description: "Fragrant basmati rice with meat, raisins and spices",
      price: 18,
      image:
        "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-4.0.3",
      popular: true,
      tags: ["Traditional", "Spicy"],
    },
    {
      id: 6,
      name: "Nyama Choma",
      description: "Grilled meat with kachumbari salad and ugali",
      price: 22,
      image:
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3",
      popular: true,
      tags: ["Grilled", "Traditional"],
    },
    {
      id: 7,
      name: "Sukuma Wiki & Ugali",
      description: "Collard greens with maize flour porridge",
      price: 14,
      image:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3",
      popular: false,
      tags: ["Vegetarian", "Healthy"],
    },
    {
      id: 8,
      name: "Kachumbari Salad",
      description: "Fresh tomato and onion salad with lime dressing",
      price: 9,
      image:
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3",
      popular: false,
      tags: ["Vegetarian", "Gluten Free"],
    },
  ],

  dinner: [
    {
      id: 9,
      name: "Hilib Ari (Goat Meat)",
      description: "Slow-cooked goat meat with Somali spices and rice",
      price: 24,
      image:
        "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-4.0.3",
      popular: true,
      tags: ["Traditional", "Spicy"],
    },
    {
      id: 10,
      name: "Pilau",
      description: "Spiced rice with tender meat and caramelized onions",
      price: 20,
      image:
        "https://images.unsplash.com/photo-1563379091339-03246963d96c?ixlib=rb-4.0.3",
      popular: true,
      tags: ["Traditional"],
    },
    {
      id: 11,
      name: "Mukimo",
      description: "Mashed potatoes, peas, corn and pumpkin leaves",
      price: 16,
      image:
        "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3",
      popular: false,
      tags: ["Vegetarian", "Traditional"],
    },
    {
      id: 12,
      name: "Samaki Wa Kupaka",
      description: "Grilled fish in coconut curry sauce",
      price: 26,
      image:
        "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?ixlib=rb-4.0.3",
      popular: true,
      tags: ["Seafood", "Spicy"],
    },
  ],

  afternoon: [
    {
      id: 13,
      name: "Sambusa",
      description: "Crispy triangular pastries with spiced meat or vegetables",
      price: 8,
      image:
        "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3",
      popular: true,
      tags: ["Snack"],
    },
    {
      id: 14,
      name: "Viazi Karai",
      description: "Deep-fried potatoes in spiced batter",
      price: 7,
      image:
        "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3",
      popular: false,
      tags: ["Vegetarian", "Snack"],
    },
    {
      id: 15,
      name: "Bhajia",
      description: "Spiced potato slices deep-fried in gram flour batter",
      price: 7,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3",
      popular: true,
      tags: ["Vegetarian"],
    },
  ],

  desserts: [
    {
      id: 16,
      name: "Halwa",
      description:
        "Traditional Somali sweet made with sugar, cornstarch and cardamom",
      price: 8,
      image:
        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3",
      popular: true,
      tags: ["Vegetarian", "Sweet"],
    },
    {
      id: 17,
      name: "Kashata",
      description: "Coconut and peanut candy",
      price: 6,
      image:
        "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?ixlib=rb-4.0.3",
      popular: false,
      tags: ["Vegetarian"],
    },
    {
      id: 18,
      name: "Mahalabiya",
      description: "Middle Eastern milk pudding with rose water",
      price: 7,
      image:
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3",
      popular: true,
      tags: ["Vegetarian"],
    },
  ],

  specials: [
    {
      id: 19,
      name: "KULAN Signature Platter",
      description:
        "Sampler of our best dishes: Bariis, Hilib Ari, Sambusa, and Kachumbari",
      price: 35,
      image:
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3",
      popular: true,
      tags: ["Chef's Special", "Best Seller"],
    },
    {
      id: 20,
      name: "Coastal Fusion Rice",
      description: "Our special rice blend with seafood and Swahili spices",
      price: 28,
      image:
        "https://images.unsplash.com/photo-1563379091339-03246963d96c?ixlib=rb-4.0.3",
      popular: true,
      tags: ["Fusion", "Seafood"],
    },
    {
      id: 21,
      name: "Spiced Camel Meat",
      description:
        "Tender camel meat slow-cooked with traditional Somali herbs",
      price: 32,
      image:
        "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-4.0.3",
      popular: false,
      tags: ["Exotic", "Traditional"],
    },
    {
      id: 22,
      name: "Mandhi Lamb",
      description: "Yemeni-style lamb with fragrant rice and special sauces",
      price: 30,
      image:
        "https://images.unsplash.com/photo-1546964124-0cce460f38ef?ixlib=rb-4.0.3",
      popular: true,
      tags: ["Specialty", "Spicy"],
    },
    // ADDED: Specials from your Specials page
    {
      id: 27,
      name: "KULAN Grand Platter",
      description:
        "A feast for 4: Bariis Iskukaris, Hilib Ari, Nyama Choma, Sambusa, Kachumbari, and traditional sauces",
      price: 75,
      image:
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3",
      popular: true,
      tags: ["Family Style", "Best Seller", "Traditional"],
    },
    {
      id: 28,
      name: "Coastal Fusion Seafood Feast",
      description:
        "Samaki Wa Kupaka, grilled prawns, calamari, and coconut rice with Swahili spices",
      price: 42,
      image:
        "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?ixlib=rb-4.0.3",
      popular: true,
      tags: ["Seafood", "Fusion", "Coastal"],
    },
    {
      id: 29,
      name: "Sultan's Camel Feast",
      description:
        "Tender camel meat slow-cooked for 8 hours with traditional Somali herbs and spices",
      price: 55,
      image:
        "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-4.0.3",
      popular: true,
      tags: ["Exotic", "Premium", "Traditional"],
    },
    {
      id: 30,
      name: "Mandhi Experience",
      description:
        "Yemeni-style lamb marinated for 24 hours, served with fragrant rice and special sauces",
      price: 38,
      image:
        "https://images.unsplash.com/photo-1546964124-0cce460f38ef?ixlib=rb-4.0.3",
      popular: true,
      tags: ["Marinated", "Specialty", "Aromatic"],
    },
    {
      id: 31,
      name: "Vegetarian Delight Platter",
      description:
        "Sukuma Wiki, Mukimo, Vegetarian Pilau, Bhajia, and fresh salads",
      price: 28,
      image:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3",
      popular: true,
      tags: ["Vegetarian", "Healthy", "Traditional"],
    },
    {
      id: 32,
      name: "Sweet Endings Platter",
      description: "Halwa, Kashata, Mahalabiya, and Mandazi with Somali Shaah",
      price: 22,
      image:
        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3",
      popular: true,
      tags: ["Dessert", "Sweet", "Traditional"],
    },
  ],

  beverages: [
    {
      id: 23,
      name: "Somali Shaah (Spiced Tea)",
      description: "Traditional black tea with cardamom, cinnamon and cloves",
      price: 4,
      image:
        "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?ixlib=rb-4.0.3",
      popular: true,
      tags: ["Hot", "Traditional"],
    },
    {
      id: 24,
      name: "Kenyan Coffee",
      description: "Freshly brewed premium Kenyan coffee",
      price: 5,
      image:
        "https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3",
      popular: true,
      tags: ["Hot"],
    },
    {
      id: 25,
      name: "Mango Lassi",
      description: "Refreshing yogurt drink with fresh mango",
      price: 6,
      image:
        "https://images.unsplash.com/photo-1570197788417-0e82375c9371?ixlib=rb-4.0.3",
      popular: false,
      tags: ["Cold", "Vegetarian"],
    },
    {
      id: 26,
      name: "Fresh Sugarcane Juice",
      description: "Freshly pressed sugarcane with lime and ginger",
      price: 5,
      image:
        "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?ixlib=rb-4.0.3",
      popular: true,
      tags: ["Cold", "Fresh"],
    },
  ],
};

// Featured items for homepage
export const featuredItems = [
  menuItems.specials[0], // KULAN Signature Platter
  menuItems.dinner[3], // Samaki Wa Kupaka
  menuItems.breakfast[0], // Malawah
  menuItems.lunch[1], // Nyama Choma
  menuItems.beverages[0], // Somali Shaah
  menuItems.desserts[0], // Halwa
];
