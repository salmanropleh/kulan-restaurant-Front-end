const API_BASE_URL = "http://localhost:8000/api/menu";

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return "/api/placeholder/300/200";
  if (imagePath.startsWith("http")) return imagePath;
  return `http://localhost:8000${imagePath}`;
};

// Fallback data (2 items per category)
const fallbackData = {
  categories: [
    {
      id: "breakfast",
      name: "Breakfast",
      description: "Start your day with traditional flavors",
    },
    {
      id: "lunch",
      name: "Lunch",
      description: "Hearty midday meals",
    },
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
  ],
  items: {
    breakfast: [
      {
        id: 1,
        name: "Malawah (Somali Pancakes)",
        description: "Thin, sweet pancakes served with honey and ghee",
        detailed_description:
          "Traditional Somali malawah are thin, layered pancakes that are slightly sweet and perfectly crispy around the edges. Served with authentic honey and clarified butter (ghee), this breakfast delight is a perfect start to your day.",
        price: "8.00",
        image:
          "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3",
        popular: true,
        prep_time: "10-15 min",
        serves: "1-2 People",
        ingredients: [
          "Wheat flour",
          "Sugar",
          "Eggs",
          "Milk",
          "Cardamom",
          "Honey",
          "Ghee",
        ],
        calories: "320",
        protein: "8g",
        carbs: "45g",
        fat: "12g",
        rating: "4.7",
        tags: ["Vegetarian", "Sweet"],
        spice_level: "mild",
        spice_level_display: "Mild",
        customizable_spice: true,
        extra_toppings: [
          { name: "Extra Honey Drizzle", price: "1.00" },
          { name: "Fresh Berries", price: "2.00" },
        ],
      },
      {
        id: 2,
        name: "Mandazi (Swahili Donuts)",
        description: "Sweet, fluffy triangular donuts with cardamom",
        detailed_description:
          "Soft, fluffy triangular donuts infused with the aromatic flavors of cardamom and coconut. These Swahili-style mandazi are lightly sweetened and perfect with your morning tea or coffee.",
        price: "6.00",
        image:
          "https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-4.0.3",
        popular: true,
        prep_time: "15-20 min",
        serves: "2-3 People",
        ingredients: [
          "All-purpose flour",
          "Coconut milk",
          "Sugar",
          "Cardamom",
          "Yeast",
          "Vegetable oil",
        ],
        calories: "280",
        protein: "5g",
        carbs: "38g",
        fat: "12g",
        rating: "4.5",
        tags: ["Vegetarian"],
        spice_level: "mild",
        spice_level_display: "Mild",
        customizable_spice: false,
        extra_toppings: [
          { name: "Coconut Glaze", price: "1.00" },
          { name: "Chocolate Dip", price: "1.50" },
        ],
      },
    ],
    lunch: [
      {
        id: 5,
        name: "Bariis Iskukaris (Somali Rice)",
        description: "Fragrant basmati rice with meat, raisins and spices",
        detailed_description:
          "Aromatic basmati rice cooked with tender meat, sweet raisins, and a blend of traditional Somali spices including cumin, cardamom, and cinnamon. This one-pot dish is a staple in Somali cuisine and represents the rich culinary heritage of the Horn of Africa.",
        price: "18.00",
        image:
          "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-4.0.3",
        popular: true,
        prep_time: "30-40 min",
        serves: "2-3 People",
        ingredients: [
          "Basmati rice",
          "Beef or goat meat",
          "Raisins",
          "Onions",
          "Garlic",
          "Cumin",
          "Cardamom",
          "Cinnamon",
          "Cloves",
        ],
        calories: "450",
        protein: "22g",
        carbs: "65g",
        fat: "15g",
        rating: "4.8",
        tags: ["Traditional", "Spicy"],
        spice_level: "medium",
        spice_level_display: "Medium",
        customizable_spice: true,
        extra_toppings: [
          { name: "Extra Raisins & Nuts", price: "1.50" },
          { name: "Fried Onions", price: "1.00" },
        ],
      },
      {
        id: 6,
        name: "Nyama Choma",
        description: "Grilled meat with kachumbari salad and ugali",
        detailed_description:
          "Tender, perfectly grilled meat marinated in traditional Kenyan spices, served with fresh kachumbari salad and soft ugali. This iconic East African dish is a celebration of simple, robust flavors cooked to perfection.",
        price: "22.00",
        image:
          "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3",
        popular: true,
        prep_time: "25-35 min",
        serves: "2 People",
        ingredients: [
          "Beef or goat meat",
          "Tomatoes",
          "Onions",
          "Cilantro",
          "Lime",
          "Maize flour",
          "African spices",
        ],
        calories: "520",
        protein: "35g",
        carbs: "42g",
        fat: "25g",
        rating: "4.9",
        tags: ["Grilled", "Traditional"],
        spice_level: "medium",
        spice_level_display: "Medium",
        customizable_spice: true,
        extra_toppings: [
          { name: "Extra Kachumbari", price: "2.00" },
          { name: "Avocado Salad", price: "3.00" },
        ],
      },
    ],
    dinner: [
      {
        id: 9,
        name: "Hilib Ari (Goat Meat)",
        description: "Slow-cooked goat meat with Somali spices and rice",
        detailed_description:
          "Tender goat meat slow-cooked to perfection with a blend of traditional Somali spices, served with fragrant basmati rice. This celebratory dish is known for its rich, deep flavors and melt-in-your-mouth texture.",
        price: "24.00",
        image:
          "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-4.0.3",
        popular: true,
        prep_time: "45-60 min",
        serves: "2-3 People",
        ingredients: [
          "Goat meat",
          "Basmati rice",
          "Onions",
          "Garlic",
          "Ginger",
          "Cumin",
          "Coriander",
          "Turmeric",
          "Black pepper",
        ],
        calories: "480",
        protein: "28g",
        carbs: "52g",
        fat: "18g",
        rating: "4.7",
        tags: ["Traditional", "Spicy"],
        spice_level: "hot",
        spice_level_display: "Hot",
        customizable_spice: true,
        extra_toppings: [
          { name: "Extra Goat Meat", price: "6.00" },
          { name: "Fried Liver", price: "4.00" },
        ],
      },
      {
        id: 10,
        name: "Pilau",
        description: "Spiced rice with tender meat and caramelized onions",
        detailed_description:
          "Fragrant rice dish cooked with tender meat, caramelized onions, and a special blend of spices including cumin, cardamom, and cloves. Each grain of rice is infused with rich, aromatic flavors that make this dish truly special.",
        price: "20.00",
        image:
          "https://images.unsplash.com/photo-1563379091339-03246963d96c?ixlib=rb-4.0.3",
        popular: true,
        prep_time: "35-45 min",
        serves: "3-4 People",
        ingredients: [
          "Basmati rice",
          "Beef or chicken",
          "Onions",
          "Garlic",
          "Cumin seeds",
          "Cardamom pods",
          "Cloves",
          "Cinnamon",
          "Bay leaves",
        ],
        calories: "420",
        protein: "20g",
        carbs: "60g",
        fat: "12g",
        rating: "4.6",
        tags: ["Traditional"],
        spice_level: "medium",
        spice_level_display: "Medium",
        customizable_spice: true,
        extra_toppings: [
          { name: "Extra Caramelized Onions", price: "1.50" },
          { name: "Raisins & Almonds", price: "2.00" },
        ],
      },
    ],
    afternoon: [
      {
        id: 13,
        name: "Sambusa",
        description:
          "Crispy triangular pastries with spiced meat or vegetables",
        detailed_description:
          "Golden-brown, crispy triangular pastries filled with your choice of spiced meat or vegetables. These savory treats are perfect for afternoon tea and are a popular snack throughout East Africa and the Middle East.",
        price: "8.00",
        image:
          "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3",
        popular: true,
        prep_time: "15-20 min",
        serves: "2-3 People",
        ingredients: [
          "Pastry dough",
          "Ground meat or lentils",
          "Onions",
          "Garlic",
          "Cumin",
          "Coriander",
          "Green peas",
          "Vegetable oil",
        ],
        calories: "180",
        protein: "7g",
        carbs: "22g",
        fat: "8g",
        rating: "4.5",
        tags: ["Snack"],
        spice_level: "medium",
        spice_level_display: "Medium",
        customizable_spice: true,
        extra_toppings: [
          { name: "Extra Mint Chutney", price: "1.00" },
          { name: "Tamarind Sauce", price: "1.00" },
        ],
      },
      {
        id: 14,
        name: "Viazi Karai",
        description: "Deep-fried potatoes in spiced batter",
        detailed_description:
          "Crispy potato chunks coated in a flavorful spiced gram flour batter and deep-fried to golden perfection. These addictive snacks are a street food favorite across East Africa.",
        price: "7.00",
        image:
          "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3",
        popular: false,
        prep_time: "20-25 min",
        serves: "2 People",
        ingredients: [
          "Potatoes",
          "Gram flour",
          "Turmeric",
          "Chili powder",
          "Cumin seeds",
          "Coriander",
          "Vegetable oil",
        ],
        calories: "220",
        protein: "5g",
        carbs: "35g",
        fat: "8g",
        rating: "4.2",
        tags: ["Vegetarian", "Snack"],
        spice_level: "mild",
        spice_level_display: "Mild",
        customizable_spice: true,
        extra_toppings: [
          { name: "Extra Spicy Coating", price: "1.00" },
          { name: "Mango Chutney", price: "1.50" },
        ],
      },
    ],
    desserts: [
      {
        id: 16,
        name: "Halwa",
        description:
          "Traditional Somali sweet made with sugar, cornstarch and cardamom",
        detailed_description:
          "A rich, dense traditional Somali sweet confection made from sugar, cornstarch, ghee, and cardamom. This luxurious dessert has a unique gelatinous texture and is often served during special occasions and celebrations.",
        price: "8.00",
        image:
          "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3",
        popular: true,
        prep_time: "30-40 min",
        serves: "4-6 People",
        ingredients: [
          "Sugar",
          "Cornstarch",
          "Ghee",
          "Cardamom",
          "Nutmeg",
          "Water",
          "Food coloring",
        ],
        calories: "280",
        protein: "1g",
        carbs: "45g",
        fat: "12g",
        rating: "4.6",
        tags: ["Vegetarian", "Sweet"],
        spice_level: "mild",
        spice_level_display: "Mild",
        customizable_spice: false,
        extra_toppings: [
          { name: "Pistachio Sprinkle", price: "1.50" },
          { name: "Rose Petals", price: "1.00" },
        ],
      },
      {
        id: 17,
        name: "Kashata",
        description: "Coconut and peanut candy",
        detailed_description:
          "A traditional East African candy made from coconut and peanuts bound together with sugar. These sweet, chewy treats are a popular street food and perfect for satisfying your sweet tooth.",
        price: "6.00",
        image:
          "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?ixlib=rb-4.0.3",
        popular: false,
        prep_time: "20-25 min",
        serves: "4-6 People",
        ingredients: ["Coconut", "Peanuts", "Sugar", "Cardamom", "Water"],
        calories: "220",
        protein: "4g",
        carbs: "32g",
        fat: "10g",
        rating: "4.3",
        tags: ["Vegetarian"],
        spice_level: "mild",
        spice_level_display: "Mild",
        customizable_spice: false,
        extra_toppings: [
          { name: "Chocolate Coating", price: "2.00" },
          { name: "Sesame Coating", price: "1.00" },
        ],
      },
    ],
    specials: [
      {
        id: 19,
        name: "KULAN Signature Platter",
        description:
          "Sampler of our best dishes: Bariis, Hilib Ari, Sambusa, and Kachumbari",
        detailed_description:
          "Experience the ultimate KULAN journey with our signature platter featuring all our best-selling dishes. This generous spread includes aromatic Bariis Iskukaris, tender Hilib Ari, crispy Sambusa, and fresh Kachumbari salad - perfect for sharing and experiencing the full spectrum of our flavors.",
        price: "35.00",
        image:
          "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3",
        popular: true,
        prep_time: "40-50 min",
        serves: "3-4 People",
        ingredients: [
          "Basmati rice",
          "Goat meat",
          "Ground beef",
          "Pastry dough",
          "Tomatoes",
          "Onions",
          "Traditional spices",
          "Fresh herbs",
        ],
        calories: "680",
        protein: "32g",
        carbs: "85g",
        fat: "25g",
        rating: "4.9",
        tags: ["Chef's Special", "Best Seller"],
        spice_level: "medium",
        spice_level_display: "Medium",
        customizable_spice: true,
        extra_toppings: [
          { name: "Extra Sambusa", price: "3.00" },
          { name: "Additional Kachumbari", price: "2.00" },
        ],
      },
      {
        id: 20,
        name: "Coastal Fusion Rice",
        description: "Our special rice blend with seafood and Swahili spices",
        detailed_description:
          "A beautiful fusion of coastal flavors featuring our special rice blend cooked with fresh seafood and authentic Swahili spices. This dish captures the essence of the East African coastline with its aromatic spices and fresh ocean flavors.",
        price: "28.00",
        image:
          "https://images.unsplash.com/photo-1563379091339-03246963d96c?ixlib=rb-4.0.3",
        popular: true,
        prep_time: "35-45 min",
        serves: "2-3 People",
        ingredients: [
          "Basmati rice",
          "Shrimp",
          "Calamari",
          "Fish",
          "Coconut milk",
          "Swahili spices",
          "Lime",
          "Fresh herbs",
        ],
        calories: "420",
        protein: "26g",
        carbs: "58g",
        fat: "12g",
        rating: "4.7",
        tags: ["Fusion", "Seafood"],
        spice_level: "medium",
        spice_level_display: "Medium",
        customizable_spice: true,
        extra_toppings: [
          { name: "Extra Grilled Prawns", price: "5.00" },
          { name: "Coconut Chips", price: "1.50" },
        ],
      },
    ],
    beverages: [
      {
        id: 23,
        name: "Somali Shaah (Spiced Tea)",
        description: "Traditional black tea with cardamom, cinnamon and cloves",
        detailed_description:
          "Aromatic traditional Somali tea brewed with black tea leaves, cardamom, cinnamon, and cloves. This fragrant and soothing beverage is a staple in Somali households and is perfect for any time of day.",
        price: "4.00",
        image:
          "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?ixlib=rb-4.0.3",
        popular: true,
        prep_time: "10 min",
        serves: "1 Person",
        ingredients: [
          "Black tea leaves",
          "Cardamom",
          "Cinnamon",
          "Cloves",
          "Sugar",
          "Water",
        ],
        calories: "15",
        protein: "0g",
        carbs: "3g",
        fat: "0g",
        rating: "4.5",
        tags: ["Hot", "Traditional"],
        spice_level: "mild",
        spice_level_display: "Mild",
        customizable_spice: true,
        extra_toppings: [
          { name: "Extra Cardamom", price: "0.50" },
          { name: "Fresh Mint", price: "0.50" },
        ],
      },
      {
        id: 24,
        name: "Kenyan Coffee",
        description: "Freshly brewed premium Kenyan coffee",
        detailed_description:
          "Rich and bold premium Kenyan coffee beans freshly brewed to perfection. Known for its bright acidity and full body, our Kenyan coffee offers a truly authentic East African coffee experience.",
        price: "5.00",
        image:
          "https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3",
        popular: true,
        prep_time: "5 min",
        serves: "1 Person",
        ingredients: [
          "Kenyan coffee beans",
          "Water",
          "Sugar",
          "Milk (optional)",
        ],
        calories: "5",
        protein: "0g",
        carbs: "1g",
        fat: "0g",
        rating: "4.6",
        tags: ["Hot"],
        spice_level: "mild",
        spice_level_display: "Mild",
        customizable_spice: true,
        extra_toppings: [
          { name: "Extra Strong Brew", price: "1.00" },
          { name: "Cardamom", price: "0.50" },
        ],
      },
    ],
  },
};

export const menuApi = {
  // Get all categories
  getCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      return data.results || data;
    } catch (error) {
      console.error("API Error - using fallback categories:", error);
      return fallbackData.categories;
    }
  },

  // Get items by category
  getItemsByCategory: async (categoryId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/category/${categoryId}/`);
      if (!response.ok) throw new Error("Failed to fetch category items");
      let data = await response.json();

      // Process image URLs
      if (Array.isArray(data)) {
        data = data.map((item) => ({
          ...item,
          image: getImageUrl(item.image),
        }));
      }

      return data;
    } catch (error) {
      console.error("API Error - using fallback items:", error);
      return fallbackData.items[categoryId] || [];
    }
  },

  // Get featured items
  getFeaturedItems: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/featured/`);
      if (!response.ok) throw new Error("Failed to fetch featured items");
      let data = await response.json();

      // Process image URLs
      if (Array.isArray(data)) {
        data = data.map((item) => ({
          ...item,
          image: getImageUrl(item.image),
        }));
      }

      return data;
    } catch (error) {
      console.error("API Error - using fallback featured items:", error);
      // Return first 3 popular items from fallback data
      const allItems = Object.values(fallbackData.items).flat();
      return allItems.filter((item) => item.popular).slice(0, 3);
    }
  },

  // Get popular items
  getPopularItems: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/popular/`);
      if (!response.ok) throw new Error("Failed to fetch popular items");
      let data = await response.json();

      // Process image URLs
      if (Array.isArray(data)) {
        data = data.map((item) => ({
          ...item,
          image: getImageUrl(item.image),
        }));
      }

      return data;
    } catch (error) {
      console.error("API Error - using fallback popular items:", error);
      // Return all popular items from fallback data
      const allItems = Object.values(fallbackData.items).flat();
      return allItems.filter((item) => item.popular);
    }
  },

  // Get single item by ID
  getItemById: async (itemId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/items/${itemId}/`);
      if (!response.ok) throw new Error("Failed to fetch item");
      let data = await response.json();

      // Process image URL
      data.image = getImageUrl(data.image);

      return data;
    } catch (error) {
      console.error("API Error - using fallback item:", error);
      // Find item in fallback data
      const allItems = Object.values(fallbackData.items).flat();
      return allItems.find((item) => item.id === parseInt(itemId)) || null;
    }
  },
};

// Export fallback data for components that need it
export const { categories: fallbackCategories, items: fallbackItems } =
  fallbackData;
