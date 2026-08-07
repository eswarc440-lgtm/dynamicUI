import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Search,
  Star,
  MapPin,
  Calendar,
  Users,
  Wifi,
  Coffee,
  Tv,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Heart,
  Share2,
  Check,
  Plus,
  Minus,
  X,
  CreditCard,
  Phone,
  MessageSquare,
  Clock,
  Crown,
  Compass,
  DollarSign,
  Briefcase,
  Key,
  Utensils,
  Wind,
  BedDouble,
  SlidersHorizontal
} from 'lucide-react';

export interface HotelSuiteItem {
  id: string;
  name: string;
  type: string;
  rating: number;
  reviewsCount: string;
  location: string;
  pricePerNight: number;
  originalPrice?: number;
  imageUrl: string;
  badge: string;
  features: string[];
  bedrooms: number;
  maxGuests: number;
  isPopular?: boolean;
}

export const HotelLuxApp: React.FC = () => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState<'explore' | 'bookings' | 'amenities' | 'concierge' | 'profile'>('explore');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Search Bar state
  const [searchDestination, setSearchDestination] = useState<string>('Maldives Ocean Atoll');
  const [checkInDate, setCheckInDate] = useState<string>('Aug 12, 2026');
  const [checkOutDate, setCheckOutDate] = useState<string>('Aug 16, 2026');
  const [guestCount, setGuestCount] = useState<number>(2);

  // Booking Modal State
  const [selectedSuiteForBooking, setSelectedSuiteForBooking] = useState<HotelSuiteItem | null>(null);
  const [stayNights, setStayNights] = useState<number>(4);
  const [addHelipadTransfer, setAddHelipadTransfer] = useState<boolean>(true);
  const [addSpaPackage, setAddSpaPackage] = useState<boolean>(false);
  const [addPrivateChef, setAddPrivateChef] = useState<boolean>(false);
  
  // Active User Reservations
  const [userBookings, setUserBookings] = useState<Array<{ id: string; suiteName: string; dates: string; totalCost: number; status: string; code: string }>>([
    {
      id: 'bk_101',
      suiteName: 'The Royal Oceanfront Horizon Villa',
      dates: 'Aug 12 - Aug 16, 2026 (4 Nights)',
      totalCost: 2870,
      status: 'Confirmed & Guaranteed',
      code: 'HLX-89421'
    }
  ]);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Mock Hotel Suites Data
  const suites: HotelSuiteItem[] = [
    {
      id: 'suite_1',
      name: 'The Royal Oceanfront Horizon Villa',
      type: 'Oceanfront Villa',
      rating: 4.98,
      reviewsCount: '1.2k reviews',
      location: 'South Atoll • Private Beach',
      pricePerNight: 680,
      originalPrice: 850,
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
      badge: 'FLAT 20% OFF • PRIVATE POOL',
      features: ['Private Infinity Pool', '24/7 Butler', 'Helipad Transfer', 'Ocean Balcony'],
      bedrooms: 3,
      maxGuests: 6,
      isPopular: true
    },
    {
      id: 'suite_2',
      name: 'Grand Skylight Penthouse Residence',
      type: 'Penthouse Suite',
      rating: 4.94,
      reviewsCount: '850 reviews',
      location: 'Tower East • Top Floor 42',
      pricePerNight: 850,
      originalPrice: 1050,
      imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80',
      badge: 'FREE HELIPAD TRANSFER',
      features: ['Panoramic Bay View', 'Jacuzzi Terrace', 'Private Chef', 'VIP Lounge'],
      bedrooms: 2,
      maxGuests: 4,
      isPopular: true
    },
    {
      id: 'suite_3',
      name: 'Botanical Sanctuary Spa Chalet',
      type: 'Wellness Spa Chalet',
      rating: 4.89,
      reviewsCount: '640 reviews',
      location: 'Eco Garden • Forest Sanctuary',
      pricePerNight: 450,
      imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
      badge: 'FREE DAILY SPA MASSAGE',
      features: ['Thermal Mineral Springs', 'Organic Dining', 'Sauna', 'Yoga Deck'],
      bedrooms: 1,
      maxGuests: 2
    },
    {
      id: 'suite_4',
      name: 'Maldives Overwater Coral Bungalow',
      type: 'Overwater Bungalow',
      rating: 4.99,
      reviewsCount: '2.1k reviews',
      location: 'Lagoon Reef • Overwater',
      pricePerNight: 920,
      originalPrice: 1150,
      imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop&q=80',
      badge: 'GLASS FLOOR LAGOON VIEW',
      features: ['Direct Lagoon Steps', 'Glass Floor Viewing', 'Sunset Cocktail Bar'],
      bedrooms: 2,
      maxGuests: 4,
      isPopular: true
    },
    {
      id: 'suite_5',
      name: 'Presidential Heritage Grand Suite',
      type: 'Presidential Suite',
      rating: 4.96,
      reviewsCount: '490 reviews',
      location: 'Main Pavilion • VIP Floor',
      pricePerNight: 1200,
      imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
      badge: 'DEDICATED CONCIERGE & LIMOUSINE',
      features: ['Grand Piano Room', 'Private Security', 'Wine Cellar', 'Chauffeur'],
      bedrooms: 4,
      maxGuests: 8
    }
  ];

  const filteredSuites = suites.filter(s => {
    if (selectedCategory === 'All') return true;
    return s.type === selectedCategory;
  });

  // Calculate total cost for booking modal
  const calculateTotal = () => {
    if (!selectedSuiteForBooking) return 0;
    let base = selectedSuiteForBooking.pricePerNight * stayNights;
    if (addHelipadTransfer) base += 150;
    if (addSpaPackage) base += 120;
    if (addPrivateChef) base += 200;
    return base;
  };

  const handleConfirmReservation = () => {
    if (!selectedSuiteForBooking) return;
    const total = calculateTotal();
    const newBooking = {
      id: `bk_${Date.now()}`,
      suiteName: selectedSuiteForBooking.name,
      dates: `${checkInDate} - ${checkOutDate} (${stayNights} Nights)`,
      totalCost: total,
      status: 'Confirmed & Guaranteed',
      code: `HLX-${Math.floor(10000 + Math.random() * 90000)}`
    };
    setUserBookings(prev => [newBooking, ...prev]);
    setSelectedSuiteForBooking(null);
    showToast(`🎉 Reservation Confirmed! Code: ${newBooking.code}`);
  };

  const isDark = themeMode === 'dark';
  const bgClass = isDark ? 'bg-[#0b0f19] text-zinc-100' : 'bg-[#f8fafc] text-zinc-900';
  const cardBgClass = isDark ? 'bg-[#151c2d] border-zinc-800 shadow-xl' : 'bg-white border-zinc-200 shadow-xs';
  const accentGold = 'bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500';

  return (
    <div className={`w-full min-h-screen ${bgClass} font-sans flex flex-col relative`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl bg-zinc-900/95 text-white text-xs font-bold border border-amber-500/40 shadow-2xl flex items-center gap-2.5 backdrop-blur-md animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP NAVBAR */}
      <header className={`px-4 sm:px-8 py-4 border-b ${isDark ? 'border-zinc-800 bg-[#0f172a]' : 'border-zinc-200 bg-white'} flex items-center justify-between sticky top-0 z-30`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-black flex items-center justify-center font-black shadow-lg shadow-amber-500/30">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-base tracking-tight leading-none">HotelLux</h1>
            <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">Grand Horizon Resort & Spa</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold">
          <span onClick={() => setActiveTab('explore')} className={`cursor-pointer transition-colors ${activeTab === 'explore' ? 'text-amber-500' : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'}`}>
            Explore Villas
          </span>
          <span onClick={() => setActiveTab('bookings')} className={`cursor-pointer transition-colors ${activeTab === 'bookings' ? 'text-amber-500' : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'}`}>
            My Reservations ({userBookings.length})
          </span>
          <span onClick={() => setActiveTab('amenities')} className={`cursor-pointer transition-colors ${activeTab === 'amenities' ? 'text-amber-500' : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'}`}>
            Dining & Spa
          </span>
          <span onClick={() => setActiveTab('concierge')} className={`cursor-pointer transition-colors ${activeTab === 'concierge' ? 'text-amber-500' : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'}`}>
            24/7 VIP Concierge
          </span>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
            className={`p-2 rounded-xl border ${isDark ? 'bg-zinc-800 border-zinc-700 text-amber-400' : 'bg-zinc-100 border-zinc-200 text-zinc-700'}`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl ${accentGold} text-black font-extrabold text-xs shadow-md shadow-amber-500/20 cursor-pointer hidden sm:block`}
          >
            View Reservations
          </button>
        </div>
      </header>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 space-y-8 pb-20 md:pb-8">
        {activeTab === 'explore' && (
          <>
            {/* HERO RESORT COVER BANNER */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[340px] flex flex-col justify-end p-6 sm:p-10 border border-zinc-200 dark:border-zinc-800">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&auto=format&fit=crop&q=80"
                alt="HotelLux Resort"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="relative z-10 space-y-3 max-w-2xl text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-extrabold">
                  <Crown className="w-3.5 h-3.5" />
                  <span>5-Star Luxury World Award Winner 2026</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                  Experience Unrivaled Oceanfront Villas & Private Infinity Pools
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 font-medium">
                  Book direct for complimentary helipad transfers, 24/7 butler service, private dining, and daily thermal spa credits.
                </p>
              </div>
            </div>

            {/* SEARCH & RESERVATION FILTER BAR */}
            <div className={`p-4 sm:p-6 rounded-3xl ${cardBgClass} border flex flex-col lg:flex-row items-center gap-4`}>
              <div className="flex-1 w-full space-y-1">
                <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-500" />
                  <span>Destination / Atoll</span>
                </label>
                <input
                  type="text"
                  value={searchDestination}
                  onChange={e => setSearchDestination(e.target.value)}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold border ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                />
              </div>

              <div className="w-full lg:w-44 space-y-1">
                <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-500" />
                  <span>Check-in</span>
                </label>
                <input
                  type="text"
                  value={checkInDate}
                  onChange={e => setCheckInDate(e.target.value)}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold border ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                />
              </div>

              <div className="w-full lg:w-44 space-y-1">
                <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-500" />
                  <span>Check-out</span>
                </label>
                <input
                  type="text"
                  value={checkOutDate}
                  onChange={e => setCheckOutDate(e.target.value)}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold border ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                />
              </div>

              <div className="w-full lg:w-36 space-y-1">
                <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  <Users className="w-3 h-3 text-amber-500" />
                  <span>Guests</span>
                </label>
                <select
                  value={guestCount}
                  onChange={e => setGuestCount(Number(e.target.value))}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold border ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={4}>4 Guests</option>
                  <option value={6}>6+ Guests</option>
                </select>
              </div>

              <button
                onClick={() => showToast('🔍 Filtered available villas for selected dates!')}
                className={`w-full lg:w-auto px-6 py-3.5 rounded-2xl ${accentGold} text-black font-extrabold text-xs shadow-lg cursor-pointer self-end`}
              >
                Check Availability
              </button>
            </div>

            {/* ACCOMMODATION CATEGORIES GRID */}
            <div className="space-y-4">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-500" />
                <span>Explore Luxury Accommodation Categories</span>
              </h3>

              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['All', 'Oceanfront Villa', 'Penthouse Suite', 'Wellness Spa Chalet', 'Overwater Bungalow', 'Presidential Suite'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all border cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-amber-500 text-black border-amber-500 shadow-md'
                        : 'border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* FEATURED LUXURY SUITES LISTINGS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSuites.map(suite => (
                <div key={suite.id} className={`rounded-3xl ${cardBgClass} border overflow-hidden flex flex-col justify-between group hover:scale-[1.01] transition-all`}>
                  <div>
                    {/* Suite Image Cover */}
                    <div className="relative h-60 overflow-hidden">
                      <img src={suite.imageUrl} alt={suite.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-amber-400 text-[10px] font-extrabold border border-amber-500/30 uppercase">
                        {suite.badge}
                      </span>
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md text-xs font-black">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{suite.rating}</span>
                        <span className="text-[10px] text-zinc-400">({suite.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Suite Details Body */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-500">{suite.type}</span>
                        <span className="text-xs text-zinc-400 font-semibold">{suite.location}</span>
                      </div>

                      <h4 className="text-lg font-black tracking-tight">{suite.name}</h4>

                      {/* Features Chips */}
                      <div className="flex flex-wrap gap-1.5">
                        {suite.features.map((feat, fIdx) => (
                          <span key={fIdx} className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-500">
                            ✓ {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Suite Footer & Price Action */}
                  <div className="p-6 pt-0 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between mt-4">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-amber-500">${suite.pricePerNight}</span>
                        <span className="text-xs text-zinc-400 font-semibold">/ night</span>
                        {suite.originalPrice && (
                          <span className="text-xs text-zinc-400 line-through ml-1">${suite.originalPrice}</span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-500 font-bold">Includes Breakfast & Taxes</span>
                    </div>

                    <button
                      onClick={() => setSelectedSuiteForBooking(suite)}
                      className={`px-5 py-2.5 rounded-xl ${accentGold} text-black font-extrabold text-xs shadow-md cursor-pointer hover:opacity-90`}
                    >
                      Book Suite
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* MY RESERVATIONS TAB */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <h3 className="text-base font-extrabold">Active Guest Reservations</h3>
            {userBookings.map(bk => (
              <div key={bk.id} className={`p-6 rounded-3xl ${cardBgClass} border space-y-4`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                      🟢 {bk.status}
                    </span>
                    <h4 className="text-lg font-black mt-2">{bk.suiteName}</h4>
                    <p className="text-xs text-zinc-400 font-semibold">{bk.dates}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-zinc-400 font-bold">Confirmation Code</span>
                    <p className="text-base font-black font-mono text-amber-500">{bk.code}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold">Digital Room Key Ready</span>
                  </div>
                  <button
                    onClick={() => showToast('🔑 Digital Room Key Unlocked! Room #402')}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs cursor-pointer"
                  >
                    Unlock Digital Key
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DINING & SPA TAB */}
        {activeTab === 'amenities' && (
          <div className="space-y-6">
            <h3 className="text-base font-extrabold">Resort Dining & Spa Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-6 rounded-3xl ${cardBgClass} border space-y-3`}>
                <Utensils className="w-8 h-8 text-amber-500" />
                <h4 className="text-base font-black">Michelin-Starred Oceanfront Dining</h4>
                <p className="text-xs text-zinc-400">Enjoy fresh seafood, Japanese omakase, and wine pairings overlooking the sunset horizon.</p>
                <button onClick={() => showToast('🍽️ Table reserved at L’Horizon Restaurant!')} className="px-4 py-2 rounded-xl bg-zinc-800 text-white font-bold text-xs cursor-pointer">
                  Reserve Dinner Table
                </button>
              </div>

              <div className={`p-6 rounded-3xl ${cardBgClass} border space-y-3`}>
                <Sparkles className="w-8 h-8 text-amber-500" />
                <h4 className="text-base font-black">Thermal Mineral Spa & Massage</h4>
                <p className="text-xs text-zinc-400">Rejuvenate with organic herbal massages, ocean thermal pools, and aromatherapy sessions.</p>
                <button onClick={() => showToast('💆 Spa treatment scheduled for 3:00 PM!')} className="px-4 py-2 rounded-xl bg-zinc-800 text-white font-bold text-xs cursor-pointer">
                  Book Spa Package
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* INTERACTIVE BOOKING MODAL */}
      {selectedSuiteForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className={`w-full max-w-lg p-6 rounded-3xl ${cardBgClass} border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-amber-500 uppercase">Reservation Checkout</span>
                <h3 className="text-base font-black">{selectedSuiteForBooking.name}</h3>
              </div>
              <button onClick={() => setSelectedSuiteForBooking(null)} className="p-1 text-zinc-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold">${selectedSuiteForBooking.pricePerNight} per night</p>
                <p className="text-[10px] text-zinc-400">Dates: {checkInDate} - {checkOutDate}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setStayNights(Math.max(1, stayNights - 1))} className="p-1 rounded-lg bg-zinc-800 text-white"><Minus className="w-3.5 h-3.5" /></button>
                <span className="text-xs font-bold">{stayNights} Nights</span>
                <button onClick={() => setStayNights(stayNights + 1)} className="p-1 rounded-lg bg-zinc-800 text-white"><Plus className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            {/* Add-on Services */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">VIP Add-on Services</label>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 cursor-pointer">
                  <span className="text-xs font-bold">Helipad Airport Transfer (+$150)</span>
                  <input type="checkbox" checked={addHelipadTransfer} onChange={e => setAddHelipadTransfer(e.target.checked)} />
                </label>
                <label className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 cursor-pointer">
                  <span className="text-xs font-bold">Full Body Thermal Spa Package (+$120)</span>
                  <input type="checkbox" checked={addSpaPackage} onChange={e => setAddSpaPackage(e.target.checked)} />
                </label>
                <label className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 cursor-pointer">
                  <span className="text-xs font-bold">Private Villa Chef Dinner (+$200)</span>
                  <input type="checkbox" checked={addPrivateChef} onChange={e => setAddPrivateChef(e.target.checked)} />
                </label>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-zinc-400 uppercase font-bold">Total Estimated Cost</p>
                <p className="text-2xl font-black text-amber-500">${calculateTotal()}</p>
              </div>
              <button
                onClick={handleConfirmReservation}
                className={`px-6 py-3 rounded-2xl ${accentGold} text-black font-extrabold text-xs shadow-lg cursor-pointer`}
              >
                Confirm Reservation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default HotelLuxApp;
