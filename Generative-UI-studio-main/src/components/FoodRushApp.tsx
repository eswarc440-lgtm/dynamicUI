import React, { useState, useEffect } from 'react';
import {
  Utensils,
  Search,
  ShoppingBag,
  Tag,
  User,
  MapPin,
  Star,
  Clock,
  Heart,
  Plus,
  Minus,
  Check,
  ChevronRight,
  ArrowLeft,
  X,
  CreditCard,
  Phone,
  MessageSquare,
  Sparkles,
  Percent,
  ShieldCheck,
  Navigation,
  CheckCircle,
  Clock3
} from 'lucide-react';
import { getTopicImageUrl } from '../utils/imageResolver';

interface FoodItem {
  id: string;
  name: string;
  price: number;
  description: string;
  isVeg: boolean;
  rating: number;
  imageUrl: string;
  category: string;
  isBestseller?: boolean;
}

interface CartItem {
  item: FoodItem;
  qty: number;
}

interface OrderHistoryItem {
  id: string;
  restaurantName: string;
  status: string;
  itemsSummary: string;
  totalAmount: number;
  date: string;
}

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  reviewsCount: string;
  deliveryTime: string;
  distance: string;
  priceForTwo: string;
  offerBadge: string;
  imageUrl: string;
  menu: FoodItem[];
}

const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: "r1",
    name: "The Artisan Pizza Project",
    cuisine: "Italian • Woodfired Pizza • Gourmet Pasta",
    rating: 4.9,
    reviewsCount: "1.8k+",
    deliveryTime: "20-25 mins",
    distance: "1.2 km",
    priceForTwo: "$18",
    offerBadge: "50% OFF UP TO $10",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
    menu: [
      { id: "m1", name: "Woodfired Neapolitan Margherita", price: 15.99, description: "San Marzano tomato sauce, fresh buffalo mozzarella, virgin olive oil, and sweet basil leaves.", isVeg: true, rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80", category: "Pizzas", isBestseller: true },
      { id: "m2", name: "Double Pepperoni & Hot Honey", price: 18.50, description: "Loaded artisan pepperoni, chili flakes, mozzarella, drizzled with spicy wildflower honey.", isVeg: false, rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop&q=80", category: "Pizzas", isBestseller: true },
      { id: "m3", name: "Truffle Mushroom Fettuccine", price: 17.25, description: "Handmade fettuccine, wild forest mushrooms, cream sauce, and shaved black truffle.", isVeg: true, rating: 4.7, imageUrl: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=400&auto=format&fit=crop&q=80", category: "Pastas" }
    ]
  },
  {
    id: "r2",
    name: "Royal Hyderabadi Biryani House",
    cuisine: "Hyderabadi • Mughlai • Authentic Kebabs",
    rating: 4.8,
    reviewsCount: "4.2k+",
    deliveryTime: "25-30 mins",
    distance: "2.4 km",
    priceForTwo: "$22",
    offerBadge: "FREE EXPRESS DELIVERY",
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
    menu: [
      { id: "m4", name: "Special Chicken Dum Biryani Handi", price: 16.99, description: "Slow-cooked basmati rice with marinated chicken, saffron, mint raita & mirchi salan.", isVeg: false, rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80", category: "Biryani", isBestseller: true },
      { id: "m5", name: "Mutton Galouti Kebab (4 Pcs)", price: 14.50, description: "Melt-in-your-mouth spiced minced lamb patties served with mint chutney & flaky paratha.", isVeg: false, rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400&auto=format&fit=crop&q=80", category: "Starters", isBestseller: true }
    ]
  },
  {
    id: "r3",
    name: "Burger Craft & Milkshake Bar",
    cuisine: "American • Angus Burgers • Craft Shakes",
    rating: 4.7,
    reviewsCount: "950+",
    deliveryTime: "15-20 mins",
    distance: "0.8 km",
    priceForTwo: "$15",
    offerBadge: "FLAT 20% OFF",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
    menu: [
      { id: "m6", name: "Smokey Angus Truffle Burger", price: 13.99, description: "Double Angus beef patty, aged cheddar, caramelized onions, black truffle aioli on brioche.", isVeg: false, rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80", category: "Burgers", isBestseller: true },
      { id: "m7", name: "Crispy Peri Peri Chicken Burger", price: 11.99, description: "Crispy fried chicken breast, spicy peri peri glaze, slaw, and chipotle mayo.", isVeg: false, rating: 4.7, imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&auto=format&fit=crop&q=80", category: "Burgers" }
    ]
  }
];

export const FoodRushApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'restaurant' | 'cart' | 'checkout' | 'tracking' | 'offers' | 'orders' | 'profile'>('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>(MOCK_RESTAURANTS[0]);
  const [selectedItemModal, setSelectedItemModal] = useState<FoodItem | null>(null);
  const [cart, setCart] = useState<Record<string, CartItem>>(() => {
    try {
      const saved = localStorage.getItem('foodrush_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    }
    return {};
  });

  const [ordersHistory, setOrdersHistory] = useState<OrderHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('foodrush_orders_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load orders history from localStorage', e);
    }
    return [
      {
        id: "FR-94821",
        restaurantName: "The Artisan Pizza Project",
        status: "Delivered",
        itemsSummary: "1x Woodfired Neapolitan Margherita, 1x Double Pepperoni",
        totalAmount: 34.49,
        date: "Yesterday, 8:30 PM"
      }
    ];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('foodrush_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('foodrush_orders_history', JSON.stringify(ordersHistory));
    } catch (e) {
      console.error('Failed to save orders history to localStorage', e);
    }
  }, [ordersHistory]);

  const addToCart = (item: FoodItem, delta = 1) => {
    setCart(prev => {
      const existing = prev[item.id];
      const newQty = (existing?.qty || 0) + delta;
      if (newQty <= 0) {
        const copy = { ...prev };
        delete copy[item.id];
        return copy;
      }
      return { ...prev, [item.id]: { item, qty: newQty } };
    });
  };

  const cartList = Object.values(cart) as CartItem[];
  const subtotal = cartList.reduce<number>((sum, c) => sum + c.item.price * c.qty, 0);
  const discount = appliedCoupon === 'FOODRUSH50' ? Math.min(10, subtotal * 0.5) : 0;
  const deliveryFee = subtotal > 0 ? 2.50 : 0;
  const taxes = subtotal > 0 ? subtotal * 0.08 : 0;
  const grandTotal = Math.max(0, subtotal - discount + deliveryFee + taxes);
  const totalCartCount = cartList.reduce<number>((sum, c) => sum + c.qty, 0);

  return (
    <div className="w-full h-full bg-[#f8f9fa] dark:bg-[#0c0f17] text-zinc-900 dark:text-zinc-100 flex flex-col justify-between overflow-hidden font-sans relative selection:bg-amber-500 selection:text-white">
      
      {/* 1. Header Desktop / Mobile Bar */}
      <header className="bg-white dark:bg-[#111622] border-b border-zinc-200/80 dark:border-zinc-800 px-4 py-3 flex items-center justify-between shrink-0 shadow-2xs z-30">
        <div className="flex items-center gap-4">
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center font-extrabold shadow-md group-hover:scale-105 transition-transform">
              <Utensils className="w-5 h-5" />
            </div>
            <span className="text-lg font-black tracking-tight bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              FoodRush
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300">
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate max-w-[180px]">Deliver to Home • 123 Green Park</span>
            <ChevronRight className="w-3 h-3 text-zinc-400" />
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold">
          <button onClick={() => setActiveTab('home')} className={`hover:text-amber-500 transition-colors cursor-pointer ${activeTab === 'home' ? 'text-amber-600' : 'text-zinc-500'}`}>Home</button>
          <button onClick={() => setActiveTab('search')} className={`hover:text-amber-500 transition-colors cursor-pointer ${activeTab === 'search' ? 'text-amber-600' : 'text-zinc-500'}`}>Search</button>
          <button onClick={() => setActiveTab('offers')} className={`hover:text-amber-500 transition-colors cursor-pointer ${activeTab === 'offers' ? 'text-amber-600' : 'text-zinc-500'}`}>Offers</button>
          <button onClick={() => setActiveTab('orders')} className={`hover:text-amber-500 transition-colors cursor-pointer ${activeTab === 'orders' ? 'text-amber-600' : 'text-zinc-500'}`}>Orders</button>
          <button onClick={() => setActiveTab('profile')} className={`hover:text-amber-500 transition-colors cursor-pointer ${activeTab === 'profile' ? 'text-amber-600' : 'text-zinc-500'}`}>Profile</button>
        </nav>

        {/* Cart Icon & User */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('cart')}
            className="relative p-2 rounded-xl bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white transition-all cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900">
                {totalCartCount}
              </span>
            )}
          </button>

          <div 
            onClick={() => setActiveTab('profile')}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700 text-zinc-900 dark:text-zinc-100 font-bold text-xs flex items-center justify-center cursor-pointer border border-zinc-300 dark:border-zinc-700"
          >
            M
          </div>
        </div>
      </header>

      {/* 2. Main Content Viewport */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">
        
        {/* VIEW 1: HOME PAGE */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Search Input Bar */}
            <div 
              onClick={() => setActiveTab('search')}
              className="relative w-full cursor-pointer group"
            >
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-amber-500 transition-colors" />
              <input
                type="text"
                readOnly
                placeholder="Search for restaurants, dishes or cuisines..."
                className="w-full bg-white dark:bg-[#111622] border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-xs shadow-2xs group-hover:border-amber-500/50 transition-all cursor-pointer"
              />
            </div>

            {/* Hero Offer Banner Carousel */}
            <div className="relative rounded-3xl overflow-hidden shadow-md bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-6 sm:p-8 flex flex-col justify-between aspect-[21/9]">
              <div className="max-w-md space-y-2 z-10">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border border-white/30">
                  FOODRUSH FEAST • UP TO 50% OFF
                </span>
                <h2 className="text-xl sm:text-3xl font-black leading-tight drop-shadow-sm">
                  Craving Gourmet Pizza or Biryani?
                </h2>
                <p className="text-xs text-white/90">
                  Order from 2000+ top rated local restaurants with guaranteed 20-minute delivery.
                </p>
              </div>

              <div className="z-10 pt-4">
                <button 
                  onClick={() => setActiveTab('offers')}
                  className="bg-white text-orange-600 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-lg hover:bg-zinc-100 transition-all cursor-pointer"
                >
                  Claim Offer Now
                </button>
              </div>

              {/* Background Food Art Overlay */}
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 bg-cover bg-center pointer-events-none" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800)` }} />
            </div>

            {/* Food Categories Grid */}
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-black text-zinc-900 dark:text-zinc-100">
                What's on your mind?
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {[
                  { name: "Pizza", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200" },
                  { name: "Burgers", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200" },
                  { name: "Biryani", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200" },
                  { name: "Chinese", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200" },
                  { name: "Desserts", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=200" },
                  { name: "South Indian", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200" },
                  { name: "North Indian", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200" },
                  { name: "Healthy", img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200" }
                ].map(cat => (
                  <div
                    key={cat.name}
                    onClick={() => setActiveTab('search')}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white dark:bg-[#111622] border border-zinc-200/80 dark:border-zinc-800 hover:border-amber-500 hover:-translate-y-1 transition-all cursor-pointer group text-center"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden p-0.5 bg-amber-50 border border-amber-200/50">
                      <img src={cat.img} alt={cat.name} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-amber-500 transition-colors">
                      {cat.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Restaurants Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-black text-zinc-900 dark:text-zinc-100">
                  Top Restaurants Near You
                </h3>
                <span onClick={() => setActiveTab('search')} className="text-xs font-bold text-amber-600 hover:underline cursor-pointer">
                  See All
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_RESTAURANTS.map(rest => (
                  <div
                    key={rest.id}
                    onClick={() => {
                      setSelectedRestaurant(rest);
                      setActiveTab('restaurant');
                    }}
                    className="bg-white dark:bg-[#111622] border border-zinc-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                      <img src={rest.imageUrl} alt={rest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                      <div className="absolute bottom-2 left-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md">
                        {rest.offerBadge}
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-amber-500 transition-colors">
                          {rest.name}
                        </h4>
                        <div className="flex items-center gap-1 bg-emerald-600 text-white font-bold text-[11px] px-1.5 py-0.5 rounded shadow-2xs">
                          <span>{rest.rating}</span>
                          <Star className="w-3 h-3 fill-white" />
                        </div>
                      </div>

                      <p className="text-xs text-zinc-500 truncate">
                        {rest.cuisine}
                      </p>

                      <div className="flex items-center justify-between text-[11px] font-medium pt-2 border-t border-zinc-100 dark:border-zinc-800 text-zinc-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-500" />
                          <span>{rest.deliveryTime} • {rest.distance}</span>
                        </div>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">{rest.priceForTwo} for two</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: SEARCH PAGE */}
        {activeTab === 'search' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for restaurants, dishes or cuisines (e.g. Pizza, Biryani, Burger)..."
                className="w-full bg-white dark:bg-[#111622] border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm shadow-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
              <button className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-white shadow-2xs">All Results</button>
              <button className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-amber-500">Rating 4.0+</button>
              <button className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-amber-500">Pure Veg</button>
              <button className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-amber-500">Offers & Deals</button>
              <button className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-amber-500">Express Delivery (&lt;25m)</button>
            </div>

            {/* Search Results */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">
                Matching Restaurants & Dishes
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MOCK_RESTAURANTS.map(rest => (
                  <div
                    key={rest.id}
                    onClick={() => {
                      setSelectedRestaurant(rest);
                      setActiveTab('restaurant');
                    }}
                    className="bg-white dark:bg-[#111622] border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl flex gap-4 cursor-pointer hover:border-amber-500 transition-all"
                  >
                    <img src={rest.imageUrl} alt={rest.name} className="w-24 h-24 rounded-xl object-cover shrink-0" />
                    <div className="space-y-1 min-w-0 flex-1">
                      <h4 className="text-sm font-extrabold truncate">{rest.name}</h4>
                      <p className="text-xs text-zinc-500 truncate">{rest.cuisine}</p>
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                        <Star className="w-3.5 h-3.5 fill-emerald-600" />
                        <span>{rest.rating} • {rest.deliveryTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: RESTAURANT DETAILS PAGE */}
        {activeTab === 'restaurant' && selectedRestaurant && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-amber-600 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>

            {/* Restaurant Cover Header */}
            <div className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-md">
              <img src={selectedRestaurant.imageUrl} alt={selectedRestaurant.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <h2 className="text-2xl font-black">{selectedRestaurant.name}</h2>
                <p className="text-xs text-zinc-200">{selectedRestaurant.cuisine}</p>
                <div className="flex items-center gap-3 text-xs font-bold pt-1">
                  <span className="bg-emerald-600 px-2 py-0.5 rounded flex items-center gap-1">
                    {selectedRestaurant.rating} <Star className="w-3 h-3 fill-white" />
                  </span>
                  <span>{selectedRestaurant.deliveryTime}</span>
                  <span>{selectedRestaurant.distance}</span>
                  <span>{selectedRestaurant.priceForTwo} for two</span>
                </div>
              </div>
            </div>

            {/* Menu List */}
            <div className="space-y-4">
              <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100 border-b pb-2 border-zinc-200 dark:border-zinc-800">
                Recommended Bestsellers ({selectedRestaurant.menu?.length || 0})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedRestaurant.menu?.map(item => {
                  const qty = cart[item.id]?.qty || 0;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItemModal(item)}
                      className="bg-white dark:bg-[#111622] border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-2xs flex justify-between gap-4 cursor-pointer hover:border-amber-500 transition-all"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-3.5 h-3.5 border-2 flex items-center justify-center p-0.5 rounded ${item.isVeg ? 'border-emerald-600' : 'border-rose-600'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                          </div>
                          {item.isBestseller && (
                            <span className="text-[9px] font-extrabold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">Bestseller</span>
                          )}
                        </div>
                        <h4 className="text-xs font-extrabold">{item.name}</h4>
                        <div className="text-xs font-black text-zinc-900 dark:text-zinc-100">${item.price.toFixed(2)}</div>
                        <p className="text-[11px] text-zinc-500 line-clamp-2">{item.description}</p>
                      </div>

                      <div className="flex flex-col items-center justify-between shrink-0 space-y-2">
                        <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                        {qty === 0 ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(item, 1);
                            }}
                            className="w-20 bg-white border-2 border-emerald-600 text-emerald-600 font-extrabold text-xs py-1 rounded-xl shadow-2xs hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
                          >
                            ADD +
                          </button>
                        ) : (
                          <div className="w-20 bg-emerald-600 text-white font-extrabold text-xs py-1 rounded-xl shadow-md flex items-center justify-between px-2">
                            <button onClick={(e) => { e.stopPropagation(); addToCart(item, -1); }}><Minus className="w-3 h-3" /></button>
                            <span>{qty}</span>
                            <button onClick={(e) => { e.stopPropagation(); addToCart(item, 1); }}><Plus className="w-3 h-3" /></button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: CART PAGE */}
        {activeTab === 'cart' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-black">Your FoodRush Checkout Cart</h2>

            {cartList.length === 0 ? (
              <div className="bg-white dark:bg-[#111622] border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl text-center space-y-3">
                <ShoppingBag className="w-12 h-12 text-zinc-400 mx-auto" />
                <h3 className="text-sm font-bold">Your cart is empty</h3>
                <p className="text-xs text-zinc-500">Good food is always cooking! Add items from a restaurant to start your order.</p>
                <button onClick={() => setActiveTab('home')} className="bg-amber-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl cursor-pointer">Explore Restaurants</button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Cart Items */}
                <div className="bg-white dark:bg-[#111622] border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl space-y-3">
                  {cartList.map(({ item, qty }) => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-3 border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-3">
                        <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <h4 className="text-xs font-bold">{item.name}</h4>
                          <span className="text-xs font-extrabold text-amber-600">${item.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-lg">
                        <button onClick={() => addToCart(item, -1)}><Minus className="w-3 h-3" /></button>
                        <span className="text-xs font-bold">{qty}</span>
                        <button onClick={() => addToCart(item, 1)}><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Input */}
                <div className="bg-white dark:bg-[#111622] border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl flex gap-2">
                  <Tag className="w-4 h-4 text-amber-500 my-auto" />
                  <input
                    type="text"
                    placeholder="Enter Coupon Code (e.g. FOODRUSH50)"
                    defaultValue={appliedCoupon || ''}
                    className="flex-1 bg-transparent text-xs font-bold focus:outline-none"
                  />
                  <button 
                    onClick={() => setAppliedCoupon('FOODRUSH50')}
                    className="bg-amber-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                {/* Bill Details Breakdown */}
                <div className="bg-white dark:bg-[#111622] border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl space-y-2 text-xs font-medium">
                  <div className="flex justify-between text-zinc-500"><span>Item Total</span><span>${subtotal.toFixed(2)}</span></div>
                  {appliedCoupon && <div className="flex justify-between text-emerald-600 font-bold"><span>Coupon Discount (50% OFF)</span><span>-${discount.toFixed(2)}</span></div>}
                  <div className="flex justify-between text-zinc-500"><span>Delivery Fee</span><span>${deliveryFee.toFixed(2)}</span></div>
                  <div className="flex justify-between text-zinc-500"><span>Taxes & Service</span><span>${taxes.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm font-black pt-2 border-t border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">
                    <span>Grand Total</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab('checkout')}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Proceed to Checkout (${grandTotal.toFixed(2)})
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 6: CHECKOUT PAGE */}
        {activeTab === 'checkout' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-black">Delivery & Payment Options</h2>

            <div className="bg-white dark:bg-[#111622] border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl space-y-3">
              <h3 className="text-xs font-extrabold uppercase text-zinc-400">1. Delivery Address</h3>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 rounded-xl flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300">Home • Ch. Mounika</h4>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400">123 Green Park, Sector 4, New Delhi - 110016</p>
                </div>
                <CheckCircle className="w-5 h-5 text-amber-600" />
              </div>
            </div>

            <div className="bg-white dark:bg-[#111622] border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl space-y-3">
              <h3 className="text-xs font-extrabold uppercase text-zinc-400">2. Select Payment Method</h3>
              <div className="space-y-2 text-xs font-bold">
                {['FoodRush Pay Wallet ($45.50)', 'UPI / Instant Pay', 'Credit / Debit Card', 'Cash on Delivery'].map((pm, i) => (
                  <label key={pm} className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:border-amber-500">
                    <input type="radio" name="payment" defaultChecked={i === 0} />
                    <span>{pm}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                if (cartList.length > 0) {
                  const newOrder: OrderHistoryItem = {
                    id: `FR-${Math.floor(10000 + Math.random() * 90000)}`,
                    restaurantName: selectedRestaurant.name,
                    status: 'On the Way',
                    itemsSummary: cartList.map(c => `${c.qty}x ${c.item.name}`).join(', '),
                    totalAmount: grandTotal,
                    date: 'Just now'
                  };
                  setOrdersHistory(prev => [newOrder, ...prev]);
                  setCart({});
                }
                setOrderPlaced(true);
                setActiveTab('tracking');
              }}
              className="w-full bg-emerald-600 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-md hover:bg-emerald-700 transition-all cursor-pointer"
            >
              Place Order (${grandTotal.toFixed(2)})
            </button>
          </div>
        )}

        {/* VIEW 7: ORDER TRACKING PAGE */}
        {activeTab === 'tracking' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="bg-white dark:bg-[#111622] border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b pb-3 border-zinc-100 dark:border-zinc-800">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-600 uppercase">LIVE TRACKING • #FR-94821</span>
                  <h3 className="text-base font-black">Arriving in 18 Minutes</h3>
                </div>
                <div className="p-2 rounded-full bg-amber-50 text-amber-600"><Clock3 className="w-5 h-5 animate-spin" /></div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-3 pt-2">
                {[
                  { step: "Order Confirmed", done: true },
                  { step: "Restaurant Preparing Food", done: true },
                  { step: "Picked Up by Delivery Partner", done: true },
                  { step: "On the Way to your location", active: true },
                  { step: "Delivered", done: false }
                ].map((s, idx) => (
                  <div key={s.step} className="flex items-center gap-3 text-xs font-bold">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${s.active ? 'bg-amber-500 text-white animate-bounce' : s.done ? 'bg-emerald-600 text-white' : 'bg-zinc-200 text-zinc-500'}`}>
                      {s.done ? '✓' : idx + 1}
                    </div>
                    <span className={s.active ? 'text-amber-600 font-extrabold' : s.done ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400'}>{s.step}</span>
                  </div>
                ))}
              </div>

              {/* Delivery Driver Profile */}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center">RK</div>
                  <div>
                    <h4 className="text-xs font-bold">Rajesh Kumar</h4>
                    <p className="text-[10px] text-zinc-500">Delivery Partner • 4.9 ★ (1,420 orders)</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-emerald-600 text-white rounded-xl"><Phone className="w-4 h-4" /></button>
                  <button className="p-2 bg-amber-500 text-white rounded-xl"><MessageSquare className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 8: OFFERS PAGE */}
        {activeTab === 'offers' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <h2 className="text-xl font-black">FoodRush Daily Offers & Coupons</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { code: "FOODRUSH50", title: "Flat 50% OFF", desc: "Valid on orders above $15 up to $10 discount.", exp: "Expires in 3 days" },
                { code: "FREEDEL", title: "Free Express Delivery", desc: "No minimum order requirement for all Rush members.", exp: "Active today" },
                { code: "WELCOME100", title: "Flat $5 Cashback", desc: "Use FoodRush Pay Wallet for instant cashback.", exp: "Valid on first 3 orders" }
              ].map(off => (
                <div key={off.code} className="bg-white dark:bg-[#111622] border border-amber-500/40 p-4 rounded-2xl space-y-2 shadow-2xs">
                  <div className="flex justify-between items-center">
                    <span className="bg-amber-50 text-amber-600 font-extrabold text-xs px-2.5 py-1 rounded-md border border-amber-200">{off.code}</span>
                    <button onClick={() => setAppliedCoupon(off.code)} className="text-xs font-extrabold text-emerald-600 hover:underline">Apply</button>
                  </div>
                  <h4 className="text-sm font-black">{off.title}</h4>
                  <p className="text-xs text-zinc-500">{off.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 9: PROFILE PAGE */}
        {activeTab === 'profile' && (
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="bg-white dark:bg-[#111622] border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 text-white font-black text-xl flex items-center justify-center shadow-md">CM</div>
              <div>
                <h3 className="text-base font-black">Ch. Mounika</h3>
                <p className="text-xs text-zinc-500">Premium FoodRush Member • 150 Coins</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#111622] border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800 text-xs font-bold">
              <button onClick={() => setActiveTab('orders')} className="w-full p-4 flex justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/40"><span>Past Orders & Reorders</span><ChevronRight className="w-4 h-4" /></button>
              <button onClick={() => setActiveTab('offers')} className="w-full p-4 flex justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/40"><span>Saved Coupons & Wallet</span><ChevronRight className="w-4 h-4" /></button>
              <button onClick={() => setActiveTab('home')} className="w-full p-4 flex justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/40"><span>Saved Delivery Addresses</span><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}

        {/* VIEW 10: ORDERS PAGE */}
        {activeTab === 'orders' && (
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-xl font-black">Your Order History</h2>
            {ordersHistory.length === 0 ? (
              <p className="text-xs text-zinc-500">No past orders found.</p>
            ) : (
              ordersHistory.map(ord => (
                <div key={ord.id} className="bg-white dark:bg-[#111622] border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    <div>
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{ord.restaurantName}</span>
                      <span className="text-[10px] text-zinc-400 block">{ord.id} • {ord.date}</span>
                    </div>
                    <span className={`text-xs font-extrabold px-2 py-0.5 rounded ${ord.status === 'Delivered' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' : 'text-amber-600 bg-amber-50 dark:bg-amber-950/40'}`}>
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">{ord.itemsSummary}</p>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs font-black">${ord.totalAmount.toFixed(2)}</span>
                    <button onClick={() => setActiveTab('cart')} className="bg-amber-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl cursor-pointer hover:bg-amber-600 transition-colors">Reorder</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* 3. Mobile Bottom Navigation */}
      <footer className="lg:hidden bg-white dark:bg-[#111622] border-t border-zinc-200 dark:border-zinc-800 px-4 py-2 flex items-center justify-around text-[10px] font-bold z-30">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-amber-600' : 'text-zinc-400'}`}><Utensils className="w-5 h-5" /><span>Home</span></button>
        <button onClick={() => setActiveTab('search')} className={`flex flex-col items-center gap-1 ${activeTab === 'search' ? 'text-amber-600' : 'text-zinc-400'}`}><Search className="w-5 h-5" /><span>Search</span></button>
        <button onClick={() => setActiveTab('offers')} className={`flex flex-col items-center gap-1 ${activeTab === 'offers' ? 'text-amber-600' : 'text-zinc-400'}`}><Tag className="w-5 h-5" /><span>Offers</span></button>
        <button onClick={() => setActiveTab('cart')} className={`flex flex-col items-center gap-1 relative ${activeTab === 'cart' ? 'text-amber-600' : 'text-zinc-400'}`}><ShoppingBag className="w-5 h-5" /><span>Cart</span></button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-amber-600' : 'text-zinc-400'}`}><User className="w-5 h-5" /><span>Profile</span></button>
      </footer>

      {/* 4. Food Item Detail Modal Popup */}
      {selectedItemModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111622] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl space-y-4 p-6 relative animate-in fade-in zoom-in-95">
            <button onClick={() => setSelectedItemModal(null)} className="absolute top-4 right-4 p-2 bg-black/40 text-white rounded-full"><X className="w-4 h-4" /></button>
            <img src={selectedItemModal.imageUrl} alt={selectedItemModal.name} className="w-full h-48 rounded-2xl object-cover" />
            <div className="space-y-2">
              <h3 className="text-base font-black">{selectedItemModal.name}</h3>
              <div className="text-sm font-black text-amber-600">${selectedItemModal.price.toFixed(2)}</div>
              <p className="text-xs text-zinc-500">{selectedItemModal.description}</p>
            </div>
            <button
              onClick={() => {
                addToCart(selectedItemModal, 1);
                setSelectedItemModal(null);
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold text-xs py-3 rounded-xl shadow-md cursor-pointer"
            >
              Add to Order (${selectedItemModal.price.toFixed(2)})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
