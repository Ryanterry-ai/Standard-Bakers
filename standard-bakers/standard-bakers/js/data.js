const SITE = {
  name: "Standard Bakers",
  tagline: "Fresh baked. Daily. Mathura.",
  phone: "918923963286",
  outlets: [
    {
      id: "tantura",
      name: "Tantura",
      address: "04, Tantura, Mathura – 281001",
      hours: "8:00 AM – 9:00 PM",
      phone: "918923963286",
      whatsapp: "918923963286",
      maps: "https://maps.google.com/?q=Standard+Bakers+Tantura+Mathura",
      swiggy: "https://www.swiggy.com/restaurants/standard-bakers-balajipuram",
      zomato: "https://www.zomato.com/mathura/standard-bakers-balaji-puram"
    },
    {
      id: "balajipuram",
      name: "Balaji Puram",
      address: "Balajipuram, Aurangabad Bangar, Mathura – 281001",
      hours: "8:00 AM – 9:00 PM",
      phone: "918923963286",
      whatsapp: "918923963286",
      maps: "https://maps.google.com/?q=Standard+Bakers+Balaji+Puram+Mathura",
      swiggy: "https://www.swiggy.com/restaurants/standard-bakers-balajipuram",
      zomato: "https://www.zomato.com/mathura/standard-bakers-balaji-puram"
    }
  ],
  offer: {
    active: true,
    text: "Free delivery on orders above ₹300 on Swiggy today",
    expires: "2026-12-31"
  }
};

const PRODUCTS = [
  { id: 1,  name: "Black Forest Cake",    price: 420, original: 500, category: "cakes",    badge: "popular", outlets: ["tantura","balajipuram"], emoji: "🎂" },
  { id: 2,  name: "Pineapple Pastry",     price: 60,  original: null, category: "pastries", badge: "quick",   outlets: ["tantura","balajipuram"], emoji: "🍰" },
  { id: 3,  name: "Blueberry Cake",       price: 350, original: null, category: "cakes",    badge: "popular", outlets: ["tantura","balajipuram"], emoji: "🫐" },
  { id: 4,  name: "Bread Loaf",           price: 40,  original: null, category: "snacks",   badge: "quick",   outlets: ["tantura","balajipuram"], emoji: "🍞" },
  { id: 5,  name: "Strawberry Pastry",    price: 80,  original: null, category: "pastries", badge: "new",     outlets: ["tantura","balajipuram"], emoji: "🍓" },
  { id: 6,  name: "Red Velvet Cake",      price: 650, original: 750, category: "cakes",    badge: "popular", outlets: ["tantura","balajipuram"], emoji: "🎂" },
  { id: 7,  name: "Butter Croissant",     price: 45,  original: null, category: "pastries", badge: "quick",   outlets: ["tantura","balajipuram"], emoji: "🥐" },
  { id: 8,  name: "Chocolate Truffle",    price: 550, original: 620, category: "cakes",    badge: "popular", outlets: ["tantura","balajipuram"], emoji: "🍫" },
  { id: 9,  name: "Veg Puff",             price: 20,  original: null, category: "snacks",   badge: "quick",   outlets: ["tantura","balajipuram"], emoji: "🥧" },
  { id: 10, name: "Birthday Cake (1kg)",  price: 480, original: null, category: "cakes",    badge: "popular", outlets: ["tantura","balajipuram"], emoji: "🎂" },
  { id: 11, name: "Kaju Katli Cake",      price: 750, original: null, category: "cakes",    badge: "new",     outlets: ["tantura"],               emoji: "🎂" },
  { id: 12, name: "Banana Bread",         price: 120, original: null, category: "breads",   badge: "new",     outlets: ["tantura","balajipuram"], emoji: "🍌" },
  { id: 13, name: "Cream Roll",           price: 35,  original: null, category: "pastries", badge: "quick",   outlets: ["tantura","balajipuram"], emoji: "🥐" },
  { id: 14, name: "Garlic Bread",         price: 60,  original: null, category: "breads",   badge: "popular", outlets: ["tantura","balajipuram"], emoji: "🥖" },
  { id: 15, name: "Custom Wedding Cake",  price: 2500, original: null, category: "custom",  badge: "popular", outlets: ["tantura","balajipuram"], emoji: "💍" },
  { id: 16, name: "Anniversary Cake",     price: 800, original: null, category: "custom",   badge: "popular", outlets: ["tantura","balajipuram"], emoji: "💐" }
];

const CATEGORIES = [
  { id: "all",      label: "All" },
  { id: "cakes",    label: "Birthday Cakes" },
  { id: "pastries", label: "Pastries" },
  { id: "snacks",   label: "Snacks" },
  { id: "breads",   label: "Breads" },
  { id: "custom",   label: "Custom Order" }
];

const PRICE_FILTERS = [
  { id: "all",      label: "All prices",     fn: () => true },
  { id: "under200", label: "Under ₹200",     fn: p => p.price < 200 },
  { id: "popular",  label: "Popular",         fn: p => p.badge === "popular" },
  { id: "quick",    label: "Quick Delivery",  fn: p => p.badge === "quick" }
];
