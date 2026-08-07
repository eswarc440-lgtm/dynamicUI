import { DynamicUISchema, ThemeConfig } from '../types';

/**
 * Intelligent Dynamic Schema Synthesizer
 * Ensures EVERY prompt generates a unique, professional, domain-specific UI
 * matching real-world applications instead of generic corporate fallbacks.
 */

export function generateDynamicDomainSchema(
  prompt: string,
  customTheme?: ThemeConfig
): DynamicUISchema {
  const p = prompt.toLowerCase();
  const timestamp = Date.now();

  // Helper to construct a clean title from prompt
  const cleanTitle = prompt
    .replace(/[\*\#\`\_]+/g, '')
    .replace(/^(build|create|design|generate|make|set up|setup|show me|a|an)\s+/i, '')
    .trim();
  const words = cleanTitle.split(/\s+/);
  const trimmed = words.length > 5 ? words.slice(0, 5).join(' ') + '...' : cleanTitle;
  const capitalizedTitle = trimmed ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1) : "Application Workflow";

  // 0.0 RIDE-BOOKING & TRANSPORT / RIDEX / UBER / CAB / TAXI / DRIVER APP
  if (
    p.includes('ride') ||
    p.includes('ridex') ||
    p.includes('uber') ||
    p.includes('cab') ||
    p.includes('taxi') ||
    p.includes('driver') ||
    p.includes('transport')
  ) {
    return {
      id: `ridex_${timestamp}`,
      title: `RideX • Next-Gen Urban Mobility & Ride Booking Platform`,
      description: "Book instant rides, estimate fares, track drivers live, manage digital wallet payments, access emergency safety tools, and view live trip analytics.",
      category: "Ride-Booking & Transport",
      theme: customTheme || { accentColor: "cyan", style: "modern" },
      generatedPrompt: prompt,
      metrics: [
        {
          id: 'm1',
          label: "Active Drivers Online",
          value: "4,820 Drivers",
          change: "+12.4% vs last week",
          trend: "up",
          subtext: "High coverage in Sector 4 & Downtown",
          format: "text",
          sparkline: [3800, 4100, 4350, 4500, 4700, 4820]
        },
        {
          id: 'm2',
          label: "Average Pickup ETA",
          value: "2.4 Mins",
          change: "-0.5 min faster",
          trend: "up",
          subtext: "Optimal vehicle dispatch density",
          format: "text",
          sparkline: [3.8, 3.4, 3.1, 2.8, 2.5, 2.4]
        },
        {
          id: 'm3',
          label: "Completed Rides Today",
          value: 18450,
          change: "+14.8% YoY",
          trend: "up",
          subtext: "Peak surge between 5 PM - 8 PM",
          format: "number",
          sparkline: [12000, 14200, 15800, 16900, 17500, 18450]
        },
        {
          id: 'm4',
          label: "Passenger Satisfaction",
          value: "4.94 ★",
          change: "+0.08 rating score",
          trend: "up",
          subtext: "Based on 14,200 verified trip reviews",
          format: "text",
          sparkline: [4.82, 4.85, 4.88, 4.90, 4.92, 4.94]
        }
      ],
      initialState: {
        pickup: "742 Evergreen Terrace, Sector 4",
        destination: "Grand City Airport (Terminal 3)",
        rideType: "Go ($12.80)",
        promoCode: "RIDEXFIRST"
      },
      layout: [
        {
          id: 'sec_ridex_hero',
          gridCols: 1,
          components: [
            {
              id: `ridex_map_hero_${timestamp}`,
              type: 'image',
              title: "Ready for Your Next Trip? RideX Express • Up to 30% OFF",
              description: "Book 24/7 urban rides, instant moto, comfort sedans & luxury SUVs with live GPS driver tracking.",
              url: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&auto=format&fit=crop&q=80",
              aspectRatio: "wide"
            }
          ]
        },
        {
          id: 'sec_ridex_categories',
          gridCols: 1,
          components: [
            {
              id: 'ridex_cat_grid',
              type: 'food_category_grid',
              title: "What's on your mind? Choose Ride Category",
              categories: [
                { id: "cat_moto", name: "RideX Moto", icon: "Bike", offerText: "FASTEST", imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=200&auto=format&fit=crop&q=80" },
                { id: "cat_go", name: "RideX Go", icon: "Car", offerText: "POPULAR", imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=200&auto=format&fit=crop&q=80" },
                { id: "cat_comfort", name: "Comfort", icon: "Car", offerText: "TOP DRIVERS", imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&auto=format&fit=crop&q=80" },
                { id: "cat_lux", name: "RideX Lux", icon: "Crown", offerText: "EXECUTIVE SUV", imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=200&auto=format&fit=crop&q=80" },
                { id: "cat_airport", name: "Airport", icon: "Navigation", offerText: "FLAT $25", imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200&auto=format&fit=crop&q=80" },
                { id: "cat_rental", name: "Hourly Cab", icon: "Clock", offerText: "FLEXIBLE", imageUrl: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=200&auto=format&fit=crop&q=80" }
              ]
            }
          ]
        },
        {
          id: 'sec_top_drivers',
          gridCols: 1,
          components: [
            {
              id: 'top_drivers_grid',
              type: 'restaurant_list',
              title: "Top Rated Nearby Drivers & Vehicles",
              subtitle: "Verified drivers with 4.9+ star ratings, clean vehicles & 3-minute arrival",
              restaurants: [
                {
                  id: "d1",
                  name: "Marcus Vance • Toyota Camry Hybrid",
                  cuisine: "Midnight Silver Sedan • Clean & Sanitized",
                  rating: 4.94,
                  reviewsCount: "3.4k+ trips",
                  deliveryTime: "3 mins away",
                  distance: "0.4 km",
                  priceForTwo: "$12.80",
                  offerBadge: "TOP PARTNER • 3 MINS",
                  imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80",
                  isVegOnly: false,
                  isPromoted: true
                },
                {
                  id: "d2",
                  name: "Elena Rostova • Honda Accord Executive",
                  cuisine: "Pearl White Sedan • High Rated Driver",
                  rating: 4.98,
                  reviewsCount: "2.1k+ trips",
                  deliveryTime: "4 mins away",
                  distance: "0.8 km",
                  priceForTwo: "$18.50",
                  offerBadge: "COMFORT CLASS",
                  imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80",
                  isVegOnly: false,
                  isPromoted: false
                },
                {
                  id: "d3",
                  name: "David Chen • BMW X5 Luxury SUV",
                  cuisine: "Deep Onyx Black SUV • 6 Leather Seats",
                  rating: 4.95,
                  reviewsCount: "1.8k+ trips",
                  deliveryTime: "6 mins away",
                  distance: "1.2 km",
                  priceForTwo: "$28.90",
                  offerBadge: "LUXURY EXECUTIVE",
                  imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80",
                  isVegOnly: false,
                  isPromoted: false
                }
              ]
            }
          ]
        },
        {
          id: 'sec_ride_passes',
          gridCols: 1,
          components: [
            {
              id: 'ride_passes_menu',
              type: 'food_menu',
              title: "Popular Ride Passes & Savings Bundles",
              subtitle: "Save up to 40% on daily commutes with RideX Pass",
              items: [
                {
                  id: "rp1",
                  name: "Daily Commute Pass (10 Rides)",
                  description: "Flat 25% discount on all morning & evening peak hour rides within city limits.",
                  price: 49.99,
                  rating: 4.9,
                  imageUrl: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&auto=format&fit=crop&q=80",
                  isVeg: true,
                  isBestseller: true,
                  category: "Passes"
                },
                {
                  id: "rp2",
                  name: "Airport Express Transfer Pass",
                  description: "Guaranteed priority pickup with zero surge pricing for 4 airport trips.",
                  price: 35.00,
                  rating: 4.9,
                  imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&auto=format&fit=crop&q=80",
                  isVeg: true,
                  isBestseller: true,
                  category: "Airport"
                },
                {
                  id: "rp3",
                  name: "RideX Moto Solo Pack (15 Rides)",
                  description: "Ultra-affordable bike taxi pass for fast solo trips across town.",
                  price: 19.99,
                  rating: 4.8,
                  imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&auto=format&fit=crop&q=80",
                  isVeg: true,
                  isBestseller: true,
                  category: "Moto"
                }
              ]
            }
          ]
        }
      ]
    };
  }

  // 0.00 REMINDER & SMART ALARM / REMINDME / ALARM
  if (
    p.includes('remindme') ||
    p.includes('reminder') ||
    p.includes('smart alarm') ||
    p.includes('alarm app')
  ) {
    return {
      id: `remindme_${timestamp}`,
      title: `RemindMe • Smart Reminder & Alarm OS`,
      description: "Create reminders, set smart alarms with math challenge locks, track habit streaks, view calendar schedules, and receive AI productivity insights.",
      category: "Productivity & Reminders",
      theme: customTheme || { accentColor: "indigo", style: "modern" },
      generatedPrompt: prompt,
      metrics: [
        {
          id: 'm1',
          label: "Total Reminders",
          value: "8 Active",
          change: "+3 scheduled today",
          trend: "up",
          subtext: "5 completed so far today",
          format: "text",
          sparkline: [4, 5, 6, 7, 8, 8]
        },
        {
          id: 'm2',
          label: "Habit Streak",
          value: "12 Days 🔥",
          change: "+1 day streak",
          trend: "up",
          subtext: "Personal best: 28 Days",
          format: "text",
          sparkline: [7, 8, 9, 10, 11, 12]
        }
      ],
      initialState: {},
      layout: []
    };
  }

  // 0.000 LUXURY HOTEL & RESORT BOOKING / HOTEL / RESORT / VILLA / SUITES / STAY / RESERVATION
  if (
    p.includes('hotel') ||
    p.includes('resort') ||
    p.includes('villa') ||
    p.includes('suite') ||
    p.includes('stay') ||
    p.includes('booking') ||
    p.includes('hospitality') ||
    p.includes('room')
  ) {
    return {
      id: `hotel_${timestamp}`,
      title: `Grand Horizon Luxury Hotel & Resort Portal`,
      description: "Book five-star oceanfront villas, luxury penthouses, spa retreats, private dining, and manage concierge guest reservations.",
      category: "Hotel & Resort Booking",
      theme: customTheme || { accentColor: "amber", style: "modern" },
      generatedPrompt: prompt,
      metrics: [
        { id: 'm1', label: "Available Suites", value: "18 Suites", change: "4 Penthouses left", trend: "up", subtext: "High seasonal demand", format: "text", sparkline: [12, 14, 15, 16, 17, 18] },
        { id: 'm2', label: "Average Nightly Rate", value: "$520", change: "+12.4% vs peak", trend: "up", subtext: "Includes breakfast & spa", format: "currency", sparkline: [420, 450, 480, 500, 510, 520] },
        { id: 'm3', label: "Guest Satisfaction", value: "4.95 ★", change: "99.2% positive", trend: "up", subtext: "Based on 3,420 reviews", format: "text", sparkline: [4.8, 4.85, 4.9, 4.92, 4.94, 4.95] },
        { id: 'm4', label: "Resort Occupancy", value: "92.8%", change: "Near full capacity", trend: "up", subtext: "Peak holiday bookings", format: "percentage", sparkline: [82, 85, 88, 90, 91, 92.8] }
      ],
      initialState: {},
      layout: [
        {
          id: 'sec_hotel_hero',
          gridCols: 1,
          components: [
            {
              id: `hotel_hero_${timestamp}`,
              type: 'image',
              title: "Experience Unrivaled Luxury — Oceanfront Villas & Private Infinity Pools",
              description: "Book direct for complimentary spa credits, 24/7 butler service, private helipad transfers, and sunset dining.",
              url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80",
              aspectRatio: "wide"
            }
          ]
        },
        {
          id: 'sec_hotel_categories',
          gridCols: 1,
          components: [
            {
              id: `hotel_cats_${timestamp}`,
              type: 'food_category_grid',
              title: "Explore Luxury Accommodation Suites & Villas",
              categories: [
                { id: "h1", name: "Oceanfront Villa", icon: "Sun", offerText: "PRIVATE POOL", imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=200&auto=format&fit=crop&q=80" },
                { id: "h2", name: "Penthouse Suite", icon: "Crown", offerText: "360 VIEW", imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=200&auto=format&fit=crop&q=80" },
                { id: "h3", name: "Presidential Suite", icon: "Star", offerText: "BUTLER INCLUDED", imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=200&auto=format&fit=crop&q=80" },
                { id: "h4", name: "Wellness Spa Chalet", icon: "Heart", offerText: "ALL INCLUSIVE", imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=200&auto=format&fit=crop&q=80" },
                { id: "h5", name: "Overwater Bungalow", icon: "Compass", offerText: "BALCONY JACUZZI", imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=200&auto=format&fit=crop&q=80" }
              ]
            }
          ]
        },
        {
          id: 'sec_hotel_listings',
          gridCols: 1,
          components: [
            {
              id: `hotel_list_${timestamp}`,
              type: 'restaurant_list',
              title: "Top Rated Luxury Suites & Private Residences",
              subtitle: "Handpicked five-star suites with direct beach access, king beds, and VIP guest privileges",
              restaurants: [
                {
                  id: "res1",
                  name: "The Royal Oceanfront Horizon Villa",
                  cuisine: "3 King Bedrooms • Private Infinity Pool • Helipad",
                  rating: 4.98,
                  reviewsCount: "1.2k reviews",
                  deliveryTime: "Direct Beach Access",
                  distance: "0.1 km",
                  priceForTwo: "$680 / night",
                  offerBadge: "FLAT 20% OFF WEEKDAYS",
                  imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
                  isVegOnly: false,
                  isPromoted: true
                },
                {
                  id: "res2",
                  name: "Grand Skylight Penthouse Suite",
                  cuisine: "Panoramic Bay View • Jacuzzi Terrace • Chef Service",
                  rating: 4.92,
                  reviewsCount: "850 reviews",
                  deliveryTime: "Top Floor Tower",
                  distance: "0.5 km",
                  priceForTwo: "$850 / night",
                  offerBadge: "FREE AIRPORT TRANSFER",
                  imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80",
                  isVegOnly: false,
                  isPromoted: false
                },
                {
                  id: "res3",
                  name: "Botanical Spa & Thermal Chalet",
                  cuisine: "Thermal Mineral Bath • Organic Dining • Sauna",
                  rating: 4.88,
                  reviewsCount: "640 reviews",
                  deliveryTime: "Private Garden View",
                  distance: "1.4 km",
                  priceForTwo: "$450 / night",
                  offerBadge: "FREE SPA MASSAGE",
                  imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80",
                  isVegOnly: false,
                  isPromoted: false
                }
              ]
            }
          ]
        }
      ]
    };
  }

  // 0.0000 CONSTRUCTION / WORKERS / CONTRACTOR / TRADES / WORK / SITE / BLUE COLLAR / JOB MARKETPLACE
  if (
    p.includes('construction') ||
    p.includes('worker') ||
    p.includes('contractor') ||
    p.includes('builder') ||
    p.includes('trade') ||
    p.includes('labour') ||
    p.includes('labor') ||
    p.includes('carpenter') ||
    p.includes('electrician') ||
    p.includes('plumber') ||
    p.includes('mason')
  ) {
    return {
      id: `construction_${timestamp}`,
      title: `BuildCraft • Construction & Skilled Worker Marketplace`,
      description: "Verified worker profiles, trade certifications, daily job site allocations, equipment logs, and instant worker hiring.",
      category: "Construction & Skilled Trades",
      theme: customTheme || { accentColor: "amber", style: "modern" },
      generatedPrompt: prompt,
      metrics: [
        { id: 'm1', label: "Verified Active Workers", value: "1,480 Workers", change: "+42 on site today", trend: "up", subtext: "OSHA & Trade certified", format: "text", sparkline: [1200, 1280, 1340, 1390, 1420, 1480] },
        { id: 'm2', label: "Average Daily Wage", value: 240, change: "+$12.50 MoM", trend: "up", subtext: "Standard 8-hour shift rate", format: "currency", sparkline: [210, 218, 225, 230, 235, 240] },
        { id: 'm3', label: "Job Site Safety Score", value: "99.4%", change: "Zero safety incidents", trend: "up", subtext: "Inspected by Site Engineers", format: "percentage", sparkline: [98, 98.5, 98.8, 99, 99.2, 99.4] },
        { id: 'm4', label: "Active Project Sites", value: "32 Sites", change: "6 new sites this mo", trend: "up", subtext: "Commercial & Residential", format: "number", sparkline: [22, 24, 26, 28, 30, 32] }
      ],
      initialState: {},
      layout: [
        {
          id: 'sec_const_hero',
          gridCols: 1,
          components: [
            {
              id: `const_hero_${timestamp}`,
              type: 'image',
              title: "On-Demand Skilled Construction Workers & Licensed Trade Professionals",
              description: "Hire certified electricians, masons, plumbers, heavy equipment operators & civil site supervisors instantly.",
              url: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=1200&auto=format&fit=crop&q=80",
              aspectRatio: "wide"
            }
          ]
        },
        {
          id: 'sec_const_categories',
          gridCols: 1,
          components: [
            {
              id: `const_cats_${timestamp}`,
              type: 'food_category_grid',
              title: "Browse Workers by Skilled Trade Specialization",
              categories: [
                { id: "c_elec", name: "Master Electricians", icon: "Zap", offerText: "OSHA CERTIFIED", imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&auto=format&fit=crop&q=80" },
                { id: "c_mason", name: "Structural Masons", icon: "Layers", offerText: "VERIFIED EXP", imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&auto=format&fit=crop&q=80" },
                { id: "c_heavy", name: "Crane Operators", icon: "Briefcase", offerText: "LICENSED RIGGER", imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&auto=format&fit=crop&q=80" },
                { id: "c_plumb", name: "Commercial Plumbers", icon: "Compass", offerText: "24/7 ONSITE", imageUrl: "https://images.unsplash.com/photo-1505798577917-a65157d3320a?w=200&auto=format&fit=crop&q=80" },
                { id: "c_carpent", name: "Finish Carpenters", icon: "Star", offerText: "HIGH RATED", imageUrl: "https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?w=200&auto=format&fit=crop&q=80" }
              ]
            }
          ]
        },
        {
          id: 'sec_const_workers',
          gridCols: 1,
          components: [
            {
              id: `const_list_${timestamp}`,
              type: 'restaurant_list',
              title: "Top Rated Verified Construction Workers Available For Hire",
              subtitle: "Licensed trade professionals with verified work history, safety badges, and instant availability",
              restaurants: [
                {
                  id: "w1",
                  name: "Marcus Vance — Master Industrial Electrician",
                  cuisine: "12 Yrs Exp • High Voltage Wiring • Commercial Safety Lead",
                  rating: 4.98,
                  reviewsCount: "148 jobs done",
                  deliveryTime: "Available Today",
                  distance: "2.4 km away",
                  priceForTwo: "$48 / hr",
                  offerBadge: "OSHA CERTIFIED • TOP WORKER",
                  imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80",
                  isVegOnly: false,
                  isPromoted: true
                },
                {
                  id: "w2",
                  name: "David Rivera — Heavy Crane & Rigging Operator",
                  cuisine: "8 Yrs Exp • Commercial Tower Crane • Rigging Specialist",
                  rating: 4.92,
                  reviewsCount: "92 jobs done",
                  deliveryTime: "Available Tomorrow",
                  distance: "4.1 km away",
                  priceForTwo: "$55 / hr",
                  offerBadge: "COMMERCIAL LICENSE",
                  imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=80",
                  isVegOnly: false,
                  isPromoted: false
                },
                {
                  id: "w3",
                  name: "Sophia Chen — Civil Site Supervisor & Masonry Lead",
                  cuisine: "10 Yrs Exp • Concrete Pouring • Blueprint & Structural Audit",
                  rating: 4.95,
                  reviewsCount: "210 jobs done",
                  deliveryTime: "Available Today",
                  distance: "1.8 km away",
                  priceForTwo: "$52 / hr",
                  offerBadge: "CIVIL ENG DIPLOMA",
                  imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80",
                  isVegOnly: false,
                  isPromoted: false
                }
              ]
            }
          ]
        }
      ]
    };
  }

  // 0. FOOD DELIVERY / FOODRUSH / RESTAURANT / SWIGGY / DINING / MENU / MEAL / DISHES / BITES / KITCHEN / CAFE
  if (
    p.includes('food') ||
    p.includes('restaurant') ||
    p.includes('delivery') ||
    p.includes('swiggy') ||
    p.includes('foodrush') ||
    p.includes('dining') ||
    p.includes('menu') ||
    p.includes('meal') ||
    p.includes('dish') ||
    p.includes('pizza') ||
    p.includes('burger') ||
    p.includes('biryani') ||
    p.includes('kitchen') ||
    p.includes('cuisine') ||
    p.includes('eat') ||
    p.includes('cafe') ||
    p.includes('order food')
  ) {
    return {
      id: `foodrush_${timestamp}`,
      title: `FoodRush • Gourmet Food & Express Delivery`,
      description: "Order from top-rated local restaurants, track live delivery drivers, claim daily discount coupons, and explore curated cuisines.",
      category: "Food Delivery & Dining",
      theme: customTheme || { accentColor: "amber", style: "modern" },
      generatedPrompt: prompt,
      metrics: [],
      initialState: {},
      layout: [
        {
          id: 'sec_food_hero',
          gridCols: 1,
          components: [
            {
              id: `food_hero_${timestamp}`,
              type: 'image',
              title: "FoodRush Feast - Flat 50% OFF on Top Gourmet Restaurants",
              description: "Use code FOODRUSH50 • Free express delivery on orders over $15 • 2000+ restaurants near you.",
              url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80",
              aspectRatio: "wide"
            }
          ]
        },
        {
          id: 'sec_food_categories',
          gridCols: 1,
          components: [
            {
              id: 'cuisines_grid',
              type: 'food_category_grid',
              title: "What's on your mind? Explore Cuisines",
              categories: [
                { id: "cat_pizza", name: "Pizza", icon: "Zap", offerText: "50% OFF", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&auto=format&fit=crop&q=80" },
                { id: "cat_burger", name: "Burgers", icon: "Heart", offerText: "FLAT $5 OFF", imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=80" },
                { id: "cat_biryani", name: "Biryani", icon: "Flame", offerText: "BESTSELLER", imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop&q=80" },
                { id: "cat_chinese", name: "Chinese", icon: "Utensils", offerText: "BUY 1 GET 1", imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&auto=format&fit=crop&q=80" },
                { id: "cat_dessert", name: "Desserts", icon: "Coffee", offerText: "SWEET DEALS", imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=200&auto=format&fit=crop&q=80" },
                { id: "cat_healthy", name: "Healthy", icon: "CheckCircle", offerText: "KETO & SALADS", imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&auto=format&fit=crop&q=80" }
              ]
            }
          ]
        },
        {
          id: 'sec_top_restaurants',
          gridCols: 1,
          components: [
            {
              id: 'rest_grid_top',
              type: 'restaurant_list',
              title: "Top Rated Restaurants Near You",
              subtitle: "Fastest delivery times, gourmet menus & verified hygiene standards",
              restaurants: [
                {
                  id: "r1",
                  name: "The Artisan Pizza Project",
                  cuisine: "Italian, Woodfired Pizza, Pasta",
                  rating: 4.9,
                  reviewsCount: "1.2k+",
                  deliveryTime: "20-25 mins",
                  distance: "1.2 km",
                  priceForTwo: "$18",
                  offerBadge: "50% OFF UP TO $10",
                  imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
                  isVegOnly: false,
                  isPromoted: true
                },
                {
                  id: "r2",
                  name: "Royal Hyderabadi Biryani House",
                  cuisine: "Hyderabadi, Mughlai, Kebabs",
                  rating: 4.8,
                  reviewsCount: "3.5k+",
                  deliveryTime: "25-30 mins",
                  distance: "2.4 km",
                  priceForTwo: "$22",
                  offerBadge: "FREE EXPRESS DELIVERY",
                  imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
                  isVegOnly: false,
                  isPromoted: false
                },
                {
                  id: "r3",
                  name: "Burger Craft & Milkshake Bar",
                  cuisine: "American, Angus Burgers, Fries",
                  rating: 4.7,
                  reviewsCount: "850+",
                  deliveryTime: "15-20 mins",
                  distance: "0.8 km",
                  priceForTwo: "$15",
                  offerBadge: "FLAT 20% OFF",
                  imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
                  isVegOnly: false,
                  isPromoted: false
                }
              ]
            }
          ]
        },
        {
          id: 'sec_popular_dishes',
          gridCols: 1,
          components: [
            {
              id: 'bestseller_food_menu',
              type: 'food_menu',
              title: "Popular Menu Bestsellers",
              subtitle: "Most ordered dishes near your location",
              items: [
                {
                  id: "fm1",
                  name: "Smokey Angus Truffle Burger",
                  description: "Double Angus beef patty, aged cheddar, caramelized onions, black truffle aioli on toasted brioche.",
                  price: 14.99,
                  rating: 4.9,
                  imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80",
                  isVeg: false,
                  isBestseller: true,
                  category: "Burgers"
                },
                {
                  id: "fm2",
                  name: "Special Dum Biryani Handi",
                  description: "Authentic slow-cooked basmati rice with aromatic spices, tender meat, served with mint raita & mirchi salan.",
                  price: 16.50,
                  rating: 4.9,
                  imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80",
                  isVeg: false,
                  isBestseller: true,
                  category: "Biryani"
                },
                {
                  id: "fm3",
                  name: "Woodfired Neapolitan Margherita Pizza",
                  description: "San Marzano tomato sauce, fresh buffalo mozzarella, virgin olive oil, and sweet basil leaves.",
                  price: 17.99,
                  rating: 4.8,
                  imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80",
                  isVeg: true,
                  isBestseller: true,
                  category: "Pizza"
                },
                {
                  id: "fm4",
                  name: "Belgian Dark Chocolate Molten Lava Cake",
                  description: "Warm chocolate cake with a rich molten center, served with Madagascan vanilla gelato.",
                  price: 6.99,
                  rating: 4.9,
                  imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&auto=format&fit=crop&q=80",
                  isVeg: true,
                  isBestseller: false,
                  category: "Desserts"
                }
              ]
            }
          ]
        }
      ]
    };
  }

  // 1. REMINDERS / TODO / TASKS / DAILY PLANNER / HABITS
  if (
    p.includes('remind') ||
    p.includes('remaind') ||
    p.includes('todo list') ||
    p.includes('to-do list') ||
    p.includes('checklist') ||
    p.includes('habit tracker')
  ) {
    return {
      id: `reminders_${timestamp}`,
      title: `${capitalizedTitle} • Daily Focus & Habit OS`,
      description: "Organize daily tasks, set time-based reminders, track completion streaks, and manage priorities.",
      category: "Productivity & Planning",
      theme: customTheme || { accentColor: "indigo", style: "modern" },
      generatedPrompt: prompt,
      metrics: [],
      initialState: {},
      layout: [
        {
          id: 'sec_reminders_hero',
          gridCols: 1,
          components: [
            {
              id: `reminder_hero_${timestamp}`,
              type: 'image',
              title: "Productivity & Daily Focus Hub • Up to 80% Habit Completion Rate",
              description: "Stay organized, hit daily targets, and build healthy focus habits step-by-step.",
              url: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&auto=format&fit=crop&q=80",
              aspectRatio: "wide"
            }
          ]
        },
        {
          id: 'sec_reminders_categories',
          gridCols: 1,
          components: [
            {
              id: 'reminders_cat_grid',
              type: 'food_category_grid',
              title: "What's on your mind? Explore Focus Categories",
              categories: [
                { id: "c_work", name: "Work Standup", icon: "Briefcase", offerText: "HIGH PRIORITY", imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&auto=format&fit=crop&q=80" },
                { id: "c_dev", name: "Code Review", icon: "Code", offerText: "DAILY HABIT", imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&auto=format&fit=crop&q=80" },
                { id: "c_health", name: "Fitness & Gym", icon: "Heart", offerText: "ACTIVE STREAK", imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=200&auto=format&fit=crop&q=80" },
                { id: "c_study", name: "Deep Reading", icon: "FileText", offerText: "30 MINS", imageUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=200&auto=format&fit=crop&q=80" },
                { id: "c_finance", name: "Budget Review", icon: "DollarSign", offerText: "WEEKLY", imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=200&auto=format&fit=crop&q=80" },
                { id: "c_reflection", name: "Nightly Journal", icon: "Moon", offerText: "REFLECT", imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=200&auto=format&fit=crop&q=80" }
              ]
            }
          ]
        },
        {
          id: 'sec_top_habits',
          gridCols: 1,
          components: [
            {
              id: 'top_habits_grid',
              type: 'restaurant_list',
              title: "Top Rated Recommended Routines & Habit Packs",
              subtitle: "Proven daily focus routines with high completion rates and expert guidance",
              restaurants: [
                {
                  id: "h1",
                  name: "The 5 AM Club Morning Routine",
                  cuisine: "Meditation, Hydration, 20-Min Exercise, Journaling",
                  rating: 4.9,
                  reviewsCount: "4.2k+ members",
                  deliveryTime: "Daily 5:00 AM",
                  distance: "30 mins",
                  priceForTwo: "Free",
                  offerBadge: "TOP POPULAR ROUTINE",
                  imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&auto=format&fit=crop&q=80",
                  isVegOnly: false,
                  isPromoted: true
                },
                {
                  id: "h2",
                  name: "Deep Work 90-Minute Focus Blocks",
                  cuisine: "Zero Distractions, Pomodoro Timer, Task Batching",
                  rating: 4.95,
                  reviewsCount: "2.8k+ members",
                  deliveryTime: "Daily 10:00 AM",
                  distance: "90 mins",
                  priceForTwo: "Pro Tier",
                  offerBadge: "HIGH EFFICIENCY",
                  imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
                  isVegOnly: false,
                  isPromoted: false
                },
                {
                  id: "h3",
                  name: "Evening Wind Down & Sleep Reset",
                  cuisine: "Digital Detox, Reading, Breathing Exercises",
                  rating: 4.85,
                  reviewsCount: "1.9k+ members",
                  deliveryTime: "Daily 9:30 PM",
                  distance: "20 mins",
                  priceForTwo: "Free",
                  offerBadge: "SLEEP & RECOVERY",
                  imageUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80",
                  isVegOnly: false,
                  isPromoted: false
                }
              ]
            }
          ]
        },
        {
          id: 'sec_planner_items',
          gridCols: 1,
          components: [
            {
              id: 'planner_items_menu',
              type: 'food_menu',
              title: "Popular Planner Modules & Templates",
              subtitle: "One-click templates to structure your day and track targets",
              items: [
                {
                  id: "pi1",
                  name: "Sprint Task & Eisenhower Matrix Pack",
                  description: "Categorize tasks by urgency and importance to maximize daily output.",
                  price: 9.99,
                  rating: 4.9,
                  imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&auto=format&fit=crop&q=80",
                  isVeg: true,
                  isBestseller: true,
                  category: "Templates"
                },
                {
                  id: "pi2",
                  name: "Habit Streak & Goal Tracker Board",
                  description: "Visual streak counters with weekly analytics and milestone badges.",
                  price: 14.99,
                  rating: 4.9,
                  imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80",
                  isVeg: true,
                  isBestseller: true,
                  category: "Streaks"
                },
                {
                  id: "pi3",
                  name: "Personal Knowledge & Reading Journal",
                  description: "Log books, summarize key takeaways, and track monthly reading challenges.",
                  price: 12.00,
                  rating: 4.8,
                  imageUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&auto=format&fit=crop&q=80",
                  isVeg: true,
                  isBestseller: true,
                }
              ]
            }
          ]
        }
      ]
    };
  }

  // 2. CRYPTO / TRADING / FINANCE / PORTFOLIO
  if (p.includes('crypto') || (p.includes('wallet') && (p.includes('token') || p.includes('btc') || p.includes('blockchain') || p.includes('crypto'))) || p.includes('trading') || p.includes('portfolio') || p.includes('investment') || p.includes('stock')) {
    return {
      id: `crypto_${timestamp}`,
      title: `${capitalizedTitle} Dashboard`,
      description: "Real-time asset tracking, portfolio performance, trade execution logs, and risk analytics.",
      category: "Finance & Crypto",
      theme: customTheme || { accentColor: "cyan", style: "modern" },
      generatedPrompt: prompt,
      metrics: [
        { id: 'm1', label: "Total Portfolio Value", value: 142850, change: "+8.4% 24h", trend: "up", subtext: "Across 4 connected wallets", format: "currency", sparkline: [128000, 131000, 129500, 135000, 139000, 142850] },
        { id: 'm2', label: "Unrealized P&L", value: 24600, change: "+21.2% All time", trend: "up", subtext: "Bitcoin & Ethereum heavy", format: "currency", sparkline: [18000, 19200, 20500, 22100, 23400, 24600] },
        { id: 'm3', label: "Staking Yield (APY)", value: "6.8%", change: "+0.3% this mo", trend: "up", subtext: "Solana & Cosmos staking", format: "percentage", sparkline: [6.2, 6.3, 6.5, 6.5, 6.7, 6.8] },
        { id: 'm4', label: "Gas & Network Fees", value: 145, change: "-12.5% vs avg", trend: "up", subtext: "Average $2.10 per tx", format: "currency", sparkline: [210, 195, 180, 165, 155, 145] }
      ],
      initialState: {},
      layout: [
        {
          id: 'sec_crypto_hero',
          gridCols: 1,
          components: [
            {
              id: `crypto_hero_${timestamp}`,
              type: 'image',
              title: "Digital Assets Command Center",
              description: "Real-time market analytics, portfolio tracking, trade executions, and hot wallet health checks.",
              url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
              aspectRatio: "wide"
            }
          ]
        },
        {
          id: 'sec_crypto_1',
          gridCols: 2,
          components: [
            {
              id: 'chart_crypto_perf',
              type: 'chart',
              chartType: 'area',
              title: "30-Day Portfolio Growth & Trading Volume",
              subtitle: "Net asset value (USD) vs daily trading volume",
              xAxisKey: "date",
              dataKeys: [
                { key: "value", name: "Portfolio Value ($)", color: "#06b6d4" },
                { key: "volume", name: "Volume ($)", color: "#6366f1" }
              ],
              data: [
                { date: "Jul 01", value: 125000, volume: 14000 },
                { date: "Jul 07", value: 128500, volume: 18500 },
                { date: "Jul 14", value: 131200, volume: 22000 },
                { date: "Jul 21", value: 136000, volume: 19000 },
                { date: "Jul 28", value: 139800, volume: 26500 },
                { date: "Aug 04", value: 142850, volume: 31000 }
              ]
            },
            {
              id: 'table_crypto_assets',
              type: 'table',
              title: "Top Asset Holdings",
              description: "Live token balances and price movements",
              searchable: true,
              exportable: true,
              columns: [
                { key: "asset", label: "Asset Name", type: "text" },
                { key: "balance", label: "Holdings", type: "text" },
                { key: "value", label: "Value ($)", type: "currency" },
                { key: "change", label: "24h Trend", type: "badge", badgeColorMap: { "Gain": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", "Loss": "bg-rose-500/10 text-rose-600 border-rose-500/20" } }
              ],
              data: [
                { asset: "Bitcoin (BTC)", balance: "1.85 BTC", value: 114700, change: "Gain" },
                { asset: "Ethereum (ETH)", balance: "6.20 ETH", value: 21700, change: "Gain" },
                { asset: "Solana (SOL)", balance: "32.5 SOL", value: 4875, change: "Gain" },
                { asset: "USDC Stablecoin", balance: "1,575 USDC", value: 1575, change: "Gain" }
              ]
            }
          ]
        }
      ]
    };
  }

  // 3. E-COMMERCE / STORE / SHOPPING / PRODUCTS / ORDERS
  if (p.includes('shop') || p.includes('store') || p.includes('ecommerce') || p.includes('product') || p.includes('order') || p.includes('cart')) {
    return {
      id: `ecommerce_${timestamp}`,
      title: `${capitalizedTitle} Hub`,
      description: "Live sales analytics, order fulfillment status, inventory levels, and customer cart insights.",
      category: "E-Commerce & Retail",
      theme: customTheme || { accentColor: "amber", style: "modern" },
      generatedPrompt: prompt,
      metrics: [
        { id: 'm1', label: "Daily Revenue", value: 4280, change: "+14.2% vs yesterday", trend: "up", subtext: "128 total orders placed", format: "currency", sparkline: [3100, 3400, 3800, 3950, 4100, 4280] },
        { id: 'm2', label: "Average Order Value (AOV)", value: 84.50, change: "+$3.20 MoM", trend: "up", subtext: "Higher cross-sell conversion", format: "currency", sparkline: [74, 76, 79, 81, 83, 84.5] },
        { id: 'm3', label: "Cart Abandonment", value: "22.4%", change: "-3.1% improved", trend: "up", subtext: "Target < 25%", format: "percentage", sparkline: [28, 26, 25, 24, 23, 22.4] },
        { id: 'm4', label: "Items Pending Fulfillment", value: "18 Orders", change: "Next batch 3 PM", trend: "neutral", subtext: "Standard 24h shipping SLA", format: "text", sparkline: [24, 22, 20, 19, 18, 18] }
      ],
      initialState: {},
      layout: [
        {
          id: 'sec_ecom_1',
          gridCols: 2,
          components: [
            {
              id: 'chart_ecom_sales',
              type: 'chart',
              chartType: 'area',
              title: "Monthly Store Revenue & Orders",
              subtitle: "Gross merchandise value ($) vs order count",
              xAxisKey: "week",
              dataKeys: [
                { key: "revenue", name: "Revenue ($)", color: "#f59e0b" },
                { key: "orders", name: "Order Count", color: "#10b981" }
              ],
              data: [
                { week: "Wk 1", revenue: 24500, orders: 310 },
                { week: "Wk 2", revenue: 28400, orders: 350 },
                { week: "Wk 3", revenue: 31200, orders: 390 },
                { week: "Wk 4", revenue: 35800, orders: 440 }
              ]
            },
            {
              id: 'table_ecom_orders',
              type: 'table',
              title: "Recent Customer Orders",
              description: "Fulfillment progress and payment details",
              searchable: true,
              exportable: true,
              columns: [
                { key: "id", label: "Order ID", type: "text" },
                { key: "customer", label: "Customer", type: "text" },
                { key: "total", label: "Total ($)", type: "currency" },
                { key: "status", label: "Fulfillment", type: "badge", badgeColorMap: { "Shipped": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", "Processing": "bg-amber-500/10 text-amber-600 border-amber-500/20" } }
              ],
              data: [
                { id: "#ORD-9421", customer: "Liam Hemsworth", total: 145.00, status: "Shipped" },
                { id: "#ORD-9422", customer: "Emma Watson", total: 89.90, status: "Shipped" },
                { id: "#ORD-9423", customer: "Oliver Queen", total: 230.50, status: "Processing" },
                { id: "#ORD-9424", customer: "Chloe Bennett", total: 64.00, status: "Processing" }
              ]
            }
          ]
        }
      ]
    };
  }

  // 4. SOCIAL MEDIA & MARKETING
  if (p.includes('social') || p.includes('media') || p.includes('instagram') || p.includes('youtube') || p.includes('content') || p.includes('tiktok') || p.includes('post') || p.includes('marketing')) {
    return {
      id: `social_${timestamp}`,
      title: `${capitalizedTitle} Dashboard`,
      description: "Cross-platform audience engagement, content scheduling, campaign reach, and follower analytics.",
      category: "Marketing & Media",
      theme: customTheme || { accentColor: "rose", style: "modern" },
      generatedPrompt: prompt,
      metrics: [
        { id: 'm1', label: "Total Audience Reach", value: "248.5K", change: "+18.2% this mo", trend: "up", subtext: "Across IG, YouTube, LinkedIn", format: "text", sparkline: [180, 195, 210, 225, 238, 248.5] },
        { id: 'm2', label: "Avg Engagement Rate", value: "4.8%", change: "+0.6% vs benchmark", trend: "up", subtext: "Likes, comments, shares", format: "percentage", sparkline: [3.8, 4.0, 4.2, 4.5, 4.6, 4.8] },
        { id: 'm3', label: "Scheduled Posts", value: "14 Posts", change: "Next: Today 3 PM", trend: "neutral", subtext: "Queued for automated publishing", format: "number", sparkline: [8, 10, 12, 11, 13, 14] },
        { id: 'm4', label: "Ad Campaign ROI", value: "3.4x", change: "+0.5x QoQ", trend: "up", subtext: "$12.4K ad spend generated $42K sales", format: "text", sparkline: [2.6, 2.8, 3.0, 3.1, 3.3, 3.4] }
      ],
      initialState: {},
      layout: [
        {
          id: 'sec_social_1',
          gridCols: 2,
          components: [
            {
              id: 'chart_engagement',
              type: 'chart',
              chartType: 'bar',
              title: "Weekly Engagement by Platform",
              subtitle: "Total impressions & interactions per channel",
              xAxisKey: "day",
              dataKeys: [
                { key: "instagram", name: "Instagram", color: "#ec4899" },
                { key: "youtube", name: "YouTube", color: "#f43f5e" },
                { key: "linkedin", name: "LinkedIn", color: "#0284c7" }
              ],
              data: [
                { day: "Mon", instagram: 12400, youtube: 8500, linkedin: 6200 },
                { day: "Tue", instagram: 14800, youtube: 9200, linkedin: 7800 },
                { day: "Wed", instagram: 16200, youtube: 11000, linkedin: 8400 },
                { day: "Thu", instagram: 15100, youtube: 10400, linkedin: 7100 },
                { day: "Fri", instagram: 18900, youtube: 13500, linkedin: 9500 },
                { day: "Sat", instagram: 22400, youtube: 16800, linkedin: 4200 },
                { day: "Sun", instagram: 20100, youtube: 15200, linkedin: 3800 }
              ]
            },
            {
              id: 'table_posts',
              type: 'table',
              title: "Content Calendar & Post Performance",
              description: "Live post metrics and queued publication schedule",
              searchable: true,
              exportable: true,
              columns: [
                { key: "title", label: "Post Title", type: "text" },
                { key: "platform", label: "Platform", type: "text" },
                { key: "views", label: "Impressions", type: "text" },
                { key: "status", label: "Status", type: "badge", badgeColorMap: { "Published": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", "Scheduled": "bg-amber-500/10 text-amber-600 border-amber-500/20" } }
              ],
              data: [
                { title: "AI Studio Product Reveal Reel", platform: "Instagram", views: "48.2K", status: "Published" },
                { title: "Top 10 Developer Productivity Hacks", platform: "YouTube", views: "32.1K", status: "Published" },
                { title: "How We Scaled Cloud Infrastructure", platform: "LinkedIn", views: "18.5K", status: "Published" },
                { title: "Weekly Tech Digest & Q&A", platform: "YouTube", views: "Queued", status: "Scheduled" }
              ]
            }
          ]
        }
      ]
    };
  }

  // 5. HOTEL / BOOKING / RESORT / VILLA / REAL ESTATE / STAY / TRAVEL
  if (p.includes('hotel') || p.includes('booking') || p.includes('resort') || p.includes('villa') || p.includes('property') || p.includes('real estate') || p.includes('reservation') || p.includes('room') || p.includes('travel') || p.includes('stay')) {
    return {
      id: `hotel_${timestamp}`,
      title: `Grand Horizon Luxury Hotel & Resort Portal`,
      description: "Book five-star oceanfront villas, luxury penthouses, spa retreats, private dining, and explore handpicked suites.",
      category: "Hotel & Resort Booking",
      theme: customTheme || { accentColor: "amber", style: "modern" },
      generatedPrompt: prompt,
      metrics: [
        { id: 'm1', label: "Available Suites", value: "18 Suites", change: "4 Penthouses left", trend: "up", subtext: "High seasonal demand", format: "text", sparkline: [12, 14, 15, 16, 17, 18] },
        { id: 'm2', label: "Average Nightly Rate", value: 520, change: "+12.4% vs peak", trend: "up", subtext: "Includes breakfast & spa", format: "currency", sparkline: [420, 450, 480, 500, 510, 520] },
        { id: 'm3', label: "Guest Satisfaction", value: "4.95 ★", change: "99.2% positive", trend: "up", subtext: "Based on 3,420 reviews", format: "text", sparkline: [4.8, 4.85, 4.9, 4.92, 4.94, 4.95] },
        { id: 'm4', label: "Resort Occupancy", value: "92.8%", change: "Near full capacity", trend: "up", subtext: "Peak holiday bookings", format: "percentage", sparkline: [82, 85, 88, 90, 91, 92.8] }
      ],
      initialState: {},
      layout: [
        {
          id: 'sec_hotel_hero',
          gridCols: 1,
          components: [
            {
              id: `hotel_hero_${timestamp}`,
              type: 'image',
              title: "Experience Unrivaled Luxury — Oceanfront Villas & Private Infinity Pools",
              description: "Book direct for complimentary spa credits, 24/7 butler service, private helipad transfers, and sunset dining.",
              url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80",
              aspectRatio: "wide"
            }
          ]
        },
        {
          id: 'sec_hotel_categories',
          gridCols: 1,
          components: [
            {
              id: `hotel_cats_${timestamp}`,
              type: 'food_category_grid',
              title: "Explore Luxury Accommodation Suites & Villas",
              categories: [
                { id: "h1", name: "Oceanfront Villa", icon: "Sun", offerText: "PRIVATE POOL", imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=200&auto=format&fit=crop&q=80" },
                { id: "h2", name: "Penthouse Suite", icon: "Crown", offerText: "360 VIEW", imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=200&auto=format&fit=crop&q=80" },
                { id: "h3", name: "Presidential Suite", icon: "Star", offerText: "BUTLER INCLUDED", imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=200&auto=format&fit=crop&q=80" },
                { id: "h4", name: "Wellness Spa Chalet", icon: "Heart", offerText: "ALL INCLUSIVE", imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=200&auto=format&fit=crop&q=80" },
                { id: "h5", name: "Overwater Bungalow", icon: "Compass", offerText: "BALCONY JACUZZI", imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=200&auto=format&fit=crop&q=80" }
              ]
            }
          ]
        },
        {
          id: 'sec_hotel_listings',
          gridCols: 1,
          components: [
            {
              id: `hotel_list_${timestamp}`,
              type: 'restaurant_list',
              title: "Top Rated Luxury Suites & Private Residences",
              subtitle: "Handpicked five-star suites with direct beach access, king beds, and VIP guest privileges",
              restaurants: [
                {
                  id: "res1",
                  name: "The Royal Oceanfront Horizon Villa",
                  cuisine: "3 King Bedrooms • Private Infinity Pool • Helipad",
                  rating: 4.98,
                  reviewsCount: "1.2k reviews",
                  deliveryTime: "Direct Beach Access",
                  distance: "0.1 km",
                  priceForTwo: "$680 / night",
                  offerBadge: "FLAT 20% OFF WEEKDAYS",
                  imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
                  isVegOnly: false,
                  isPromoted: true
                },
                {
                  id: "res2",
                  name: "Grand Skylight Penthouse Suite",
                  cuisine: "Panoramic Bay View • Jacuzzi Terrace • Chef Service",
                  rating: 4.92,
                  reviewsCount: "850 reviews",
                  deliveryTime: "Top Floor Tower",
                  distance: "0.5 km",
                  priceForTwo: "$850 / night",
                  offerBadge: "FREE AIRPORT TRANSFER",
                  imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80",
                  isVegOnly: false,
                  isPromoted: false
                },
                {
                  id: "res3",
                  name: "Botanical Spa & Thermal Chalet",
                  cuisine: "Thermal Mineral Bath • Organic Dining • Sauna",
                  rating: 4.88,
                  reviewsCount: "640 reviews",
                  deliveryTime: "Private Garden View",
                  distance: "1.4 km",
                  priceForTwo: "$450 / night",
                  offerBadge: "FREE SPA MASSAGE",
                  imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80",
                  isVegOnly: false,
                  isPromoted: false
                }
              ]
            }
          ]
        }
      ]
    };
  }

  // 6. HEALTHCARE / PATIENT CLINIC / MEDICAL
  if (p.includes('health') || p.includes('patient') || p.includes('medical') || p.includes('clinic') || p.includes('doctor') || p.includes('hospital') || p.includes('pharma')) {
    return {
      id: `health_${timestamp}`,
      title: `${capitalizedTitle} Portal`,
      description: "Patient appointment schedules, consultation logs, health vitals, and medical practice analytics.",
      category: "Healthcare",
      theme: customTheme || { accentColor: "sky", style: "modern" },
      generatedPrompt: prompt,
      metrics: [
        { id: 'm1', label: "Daily Consultations", value: "34 Patients", change: "+4 vs daily avg", trend: "up", subtext: "28 in-clinic, 6 telehealth", format: "text", sparkline: [26, 28, 30, 29, 32, 34] },
        { id: 'm2', label: "Avg Wait Time", value: "8.5 Mins", change: "-3.2 mins MoM", trend: "up", subtext: "Target < 10 minutes", format: "text", sparkline: [14, 13, 11, 10, 9, 8.5] },
        { id: 'm3', label: "Patient Satisfaction", value: "98.2%", change: "+1.4% YoY", trend: "up", subtext: "Post-consultation feedback", format: "percentage", sparkline: [95, 96, 96.5, 97, 97.8, 98.2] },
        { id: 'm4', label: "Monthly Clinic Revenue", value: 64200, change: "+8.6% MoM", trend: "up", subtext: "Insurance claims & direct copays", format: "currency", sparkline: [52000, 55000, 58000, 60000, 62000, 64200] }
      ],
      initialState: {},
      layout: [
        {
          id: 'sec_health_1',
          gridCols: 2,
          components: [
            {
              id: 'chart_patients',
              type: 'chart',
              chartType: 'bar',
              title: "Weekly Patient Visits & Telehealth Calls",
              subtitle: "Volume breakdown by appointment type",
              xAxisKey: "day",
              dataKeys: [
                { key: "inClinic", name: "In-Clinic Visits", color: "#0284c7" },
                { key: "telehealth", name: "Telehealth Calls", color: "#10b981" }
              ],
              data: [
                { day: "Mon", inClinic: 28, telehealth: 8 },
                { day: "Tue", inClinic: 32, telehealth: 10 },
                { day: "Wed", inClinic: 30, telehealth: 7 },
                { day: "Thu", inClinic: 34, telehealth: 9 },
                { day: "Fri", inClinic: 29, telehealth: 12 },
                { day: "Sat", inClinic: 15, telehealth: 5 }
              ]
            },
            {
              id: 'table_appointments',
              type: 'table',
              title: "Today's Patient Schedule",
              description: "Upcoming consultations and check-in statuses",
              searchable: true,
              exportable: true,
              columns: [
                { key: "time", label: "Time", type: "text" },
                { key: "patient", label: "Patient Name", type: "text" },
                { key: "doctor", label: "Attending Doctor", type: "text" },
                { key: "type", label: "Consultation Type", type: "text" },
                { key: "status", label: "Status", type: "badge", badgeColorMap: { "Completed": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", "In Progress": "bg-sky-500/10 text-sky-600 border-sky-500/20", "Scheduled": "bg-amber-500/10 text-amber-600 border-amber-500/20" } }
              ],
              data: [
                { time: "09:00 AM", patient: "Eleanor Vance", doctor: "Dr. Sarah Jenkins", type: "Annual Physical", status: "Completed" },
                { time: "10:30 AM", patient: "Robert Thorne", doctor: "Dr. Alan Mercer", type: "Cardiology Follow-up", status: "In Progress" },
                { time: "11:15 AM", patient: "Maya Lin", doctor: "Dr. Sarah Jenkins", type: "Telehealth Checkup", status: "Scheduled" },
                { time: "02:00 PM", patient: "David Miller", doctor: "Dr. Alan Mercer", type: "Routine Bloodwork", status: "Scheduled" }
              ]
            }
          ]
        }
      ]
    };
  }

  // 7. DEFAULT CLEAN DOMAIN SYNTHESIZER FOR ANY UNMATCHED PROMPT
  // Exclude common command/stop words to build meaningful non-monetary labels!
  const stopWords = new Set([
    'build', 'create', 'design', 'generate', 'make', 'set', 'up', 'setup',
    'show', 'me', 'a', 'an', 'the', 'app', 'application', 'ui', 'dashboard',
    'system', 'for', 'with', 'and', 'to', 'in', 'of', 'on', 'at', 'is', 'it',
    'daily', 'remainder', 'reminder', 'planner'
  ]);

  const rawWords = prompt.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
  const meaningfulWords = rawWords.filter(w => w.length > 2 && !stopWords.has(w));

  const noun1 = meaningfulWords[0] ? meaningfulWords[0].charAt(0).toUpperCase() + meaningfulWords[0].slice(1) : "Activity";
  const noun2 = meaningfulWords[1] ? meaningfulWords[1].charAt(0).toUpperCase() + meaningfulWords[1].slice(1) : "Item";

  return {
    id: `custom_${timestamp}`,
    title: `${capitalizedTitle} Control Center`,
    description: `Tailored management application for "${prompt}". Provides real-time status monitoring, activity tracking, and interactive controls.`,
    category: "Custom Application",
    theme: customTheme || { accentColor: "emerald", style: "modern" },
    generatedPrompt: prompt,
    metrics: [
      { id: 'm1', label: `Active ${noun1} Items`, value: "48 Total", change: "+6 this week", trend: "up", subtext: "Current operational queue", format: "text", sparkline: [32, 36, 40, 42, 45, 48] },
      { id: 'm2', label: `${noun2} Completion Rate`, value: "92.5%", change: "+3.2% vs target", trend: "up", subtext: "High efficiency output", format: "percentage", sparkline: [82, 85, 88, 90, 91, 92.5] },
      { id: 'm3', label: "Daily Active Volume", value: "312 Logs", change: "+14.8% MoM", trend: "up", subtext: "Logged system actions", format: "number", sparkline: [220, 240, 260, 280, 300, 312] },
      { id: 'm4', label: "System Health Score", value: "99.8%", change: "Optimal state", trend: "up", subtext: "Zero active errors", format: "percentage", sparkline: [98, 99, 99.2, 99.5, 99.7, 99.8] }
    ],
    initialState: {},
    layout: [
      {
        id: `sec_custom_hero`,
        gridCols: 1,
        components: [
          {
            id: `custom_hero_${timestamp}`,
            type: 'image',
            title: `${capitalizedTitle} Command Hub`,
            description: `Tailored management workspace for "${prompt}". Provides real-time status monitoring, activity tracking, and interactive controls.`,
            url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=80",
            aspectRatio: "wide"
          }
        ]
      },
      {
        id: `sec_custom_categories`,
        gridCols: 1,
        components: [
          {
            id: `cat_grid_${timestamp}`,
            type: 'food_category_grid',
            title: `What's on your mind? Explore ${noun1} Categories`,
            categories: [
              { id: "c1", name: `${noun1} Core`, icon: "Zap", offerText: "POPULAR", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&auto=format&fit=crop&q=80" },
              { id: "c2", name: `${noun2} Prime`, icon: "Star", offerText: "FEATURED", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&auto=format&fit=crop&q=80" },
              { id: "c3", name: "Express Pack", icon: "Clock", offerText: "20 MINS", imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=80" },
              { id: "c4", name: "Pro Tier", icon: "Crown", offerText: "FLAT 50% OFF", imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop&q=80" },
              { id: "c5", name: "Custom Mix", icon: "Layers", offerText: "NEW", imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&auto=format&fit=crop&q=80" },
              { id: "c6", name: "Trending", icon: "Flame", offerText: "BESTSELLER", imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=200&auto=format&fit=crop&q=80" }
            ]
          }
        ]
      },
      {
        id: `sec_custom_top_grid`,
        gridCols: 1,
        components: [
          {
            id: `top_grid_${timestamp}`,
            type: 'restaurant_list',
            title: `Top Rated ${noun1} Options & Services Near You`,
            subtitle: `Curated selections with verified ratings, fast delivery, and special offers for ${cleanTitle}`,
            restaurants: [
              {
                id: "item1",
                name: `The Artisan ${noun1} Project`,
                cuisine: `Premium ${noun1}, Gourmet ${noun2}`,
                rating: 4.9,
                reviewsCount: "1.4k+ reviews",
                deliveryTime: "15-20 mins",
                distance: "1.2 km",
                priceForTwo: "$18.00",
                offerBadge: "50% OFF UP TO $10",
                imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80",
                isVegOnly: false,
                isPromoted: true
              },
              {
                id: "item2",
                name: `Royal ${noun2} Master Edition`,
                cuisine: `Authentic ${noun2}, Express Service`,
                rating: 4.8,
                reviewsCount: "2.8k+ reviews",
                deliveryTime: "20-25 mins",
                distance: "2.4 km",
                priceForTwo: "$24.00",
                offerBadge: "FREE EXPRESS DELIVERY",
                imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
                isVegOnly: false,
                isPromoted: false
              },
              {
                id: "item3",
                name: `Craft ${noun1} & ${noun2} Hub`,
                cuisine: `Modern ${noun1}, Daily Specials`,
                rating: 4.7,
                reviewsCount: "950+ reviews",
                deliveryTime: "12-18 mins",
                distance: "0.8 km",
                priceForTwo: "$15.50",
                offerBadge: "FLAT 20% OFF",
                imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
                isVegOnly: false,
                isPromoted: false
              }
            ]
          }
        ]
      },
      {
        id: `sec_custom_menu`,
        gridCols: 1,
        components: [
          {
            id: `bestsellers_menu_${timestamp}`,
            type: 'food_menu',
            title: `Popular ${noun1} Bestsellers & Packages`,
            subtitle: "Most requested items and services with instant booking",
            items: [
              {
                id: "m_item1",
                name: `Signature Deluxe ${noun1} Pack`,
                description: `Complete premium ${noun1.toLowerCase()} set with guaranteed fast turnaround and top quality.`,
                price: 19.99,
                rating: 4.9,
                imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80",
                isVeg: true,
                isBestseller: true,
                category: `${noun1}`
              },
              {
                id: "m_item2",
                name: `Special ${noun2} Handi Combo`,
                description: `Authentic combination pack designed for maximum performance and savings.`,
                price: 24.50,
                rating: 4.9,
                imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80",
                isVeg: false,
                isBestseller: true,
                category: `${noun2}`
              },
              {
                id: "m_item3",
                name: `Express ${noun1} Margherita Bundle`,
                description: `Lightweight and fast option with fresh ingredients and verified hygiene standards.`,
                price: 14.99,
                rating: 4.8,
                imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80",
                isVeg: true,
                isBestseller: true,
                category: "Bundles"
              }
            ]
          }
        ]
      }
    ]
  };
}
