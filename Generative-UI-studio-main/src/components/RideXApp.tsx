import React, { useState, useEffect, useRef } from 'react';
import {
  Navigation,
  MapPin,
  Search,
  ShieldCheck,
  Phone,
  MessageSquare,
  Star,
  Clock,
  CreditCard,
  Wallet,
  User,
  Bell,
  ChevronRight,
  ArrowLeft,
  Check,
  Plus,
  Minus,
  X,
  AlertTriangle,
  Share2,
  Sparkles,
  RefreshCw,
  Zap,
  DollarSign,
  Award,
  ThumbsUp,
  Compass,
  Sun,
  Moon,
  ShieldAlert,
  CheckCircle2,
  Sliders,
  Copy,
  Car,
  Bike,
  Crown,
  Heart,
  Briefcase,
  Home,
  GraduationCap,
  Percent,
  CheckCircle,
  HelpCircle,
  Settings,
  LogOut,
  Send,
  Radio,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  Crosshair,
  TrendingUp,
  Calendar,
  Gift,
  FileText,
  RotateCcw,
  Tag as TagIcon
} from 'lucide-react';

interface SavedPlace {
  id: string;
  name: string;
  address: string;
  icon: string;
  distance: string;
}

interface DestinationOption {
  id: string;
  name: string;
  address: string;
  category: string;
  distance: string;
  time: string;
  priceMultiplier: number;
}

interface RideOption {
  id: 'bike' | 'economy' | 'comfort' | 'premium';
  name: string;
  tagline: string;
  seats: number;
  eta: string;
  price: number;
  originalPrice: number;
  icon: string;
  popular?: boolean;
  fastest?: boolean;
  luxury?: boolean;
}

interface TripRecord {
  id: string;
  date: string;
  time: string;
  pickup: string;
  destination: string;
  rideType: string;
  driverName: string;
  driverRating: number;
  fare: number;
  status: 'Completed' | 'Cancelled';
  vehicle: string;
}

export function RideXApp() {
  // Theme & Mode states
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [appRole, setAppRole] = useState<'passenger' | 'driver'>('passenger');

  // Passenger Navigation Flow: 'home' | 'search' | 'choose_ride' | 'fare_breakdown' | 'searching_driver' | 'driver_assigned' | 'live_trip' | 'trip_completed' | 'trips' | 'wallet' | 'offers' | 'profile' | 'safety'
  const [activeScreen, setActiveScreen] = useState<string>('home');
  const [bottomNav, setBottomNav] = useState<'home' | 'trips' | 'wallet' | 'offers' | 'profile'>('home');

  // Location & Destination selection
  const [pickupAddress, setPickupAddress] = useState('Current Location: 742 Evergreen Terrace, Sector 4');
  const [selectedDestination, setSelectedDestination] = useState<DestinationOption | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Ride booking states
  const [selectedRideId, setSelectedRideId] = useState<'bike' | 'economy' | 'comfort' | 'premium'>('economy');
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>('RIDEXFIRST');
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [showFareBreakdown, setShowFareBreakdown] = useState(false);

  // Driver search & live ride simulation
  const [driverSearchProgress, setDriverSearchProgress] = useState(0);
  const [driverAssignedEta, setDriverAssignedEta] = useState(3);
  const [tripProgress, setTripProgress] = useState(0);

  // Modals & Drawers
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'driver' | 'user'; text: string; time: string }>>([
    { sender: 'driver', text: "Hello! I've arrived near your pickup location.", time: '10:42 AM' }
  ]);
  const [newMessageText, setNewMessageText] = useState('');
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [addMoneyModalOpen, setAddMoneyModalOpen] = useState(false);
  const [addMoneyAmount, setAddMoneyAmount] = useState('50');

  // Trip completion rating & feedback
  const [userRating, setUserRating] = useState(5);
  const [selectedTip, setSelectedTip] = useState<number>(3);
  const [reviewText, setReviewText] = useState('');
  const [tripCompliments, setTripCompliments] = useState<string[]>(['Clean Vehicle', 'Great Music']);

  // Wallet & Payment State
  const [walletBalance, setWalletBalance] = useState(142.50);
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 'p1', name: 'RideX Wallet', type: 'wallet', balance: 142.50, isDefault: true },
    { id: 'p2', name: 'Google Pay (UPI)', type: 'upi', isDefault: false },
    { id: 'p3', name: 'Visa ending in 4829', type: 'card', isDefault: false }
  ]);
  const [selectedPaymentId, setSelectedPaymentId] = useState('p1');

  // Driver App UI States
  const [driverOnline, setDriverOnline] = useState(true);
  const [incomingRequest, setIncomingRequest] = useState<any | null>(null);
  const [requestCountdown, setRequestCountdown] = useState(15);
  const [driverActiveTab, setDriverActiveTab] = useState<'home' | 'earnings' | 'trips' | 'profile'>('home');
  const [driverEarningsToday, setDriverEarningsToday] = useState(184.50);
  const [driverCompletedTrips, setDriverCompletedTrips] = useState(8);

  // Map Animation simulation coords
  const [mapZoom, setMapZoom] = useState(1);
  const [mapCenter, setMapCenter] = useState({ x: 50, y: 50 });
  const [carPosition, setCarPosition] = useState({ x: 20, y: 70 });

  // Notifications
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 4000);
  };

  // Mock data definitions
  const savedPlaces: SavedPlace[] = [
    { id: 'sp1', name: 'Home', address: '742 Evergreen Terrace, Sector 4', icon: 'Home', distance: '0.0 km' },
    { id: 'sp2', name: 'Work / Tech Park', address: 'Cyber Tower 8, Silicon Boulevard', icon: 'Briefcase', distance: '8.4 km' },
    { id: 'sp3', name: 'University Campus', address: 'North Gate, State University', icon: 'GraduationCap', distance: '5.2 km' },
    { id: 'sp4', name: 'Downtown Fitness Center', address: '45 Avenue St, Metro Plaza', icon: 'Heart', distance: '3.1 km' }
  ];

  const popularDestinations: DestinationOption[] = [
    { id: 'd1', name: 'Grand City Airport (Terminal 3)', address: 'Airport Express Highway, International Zone', category: 'Airport', distance: '16.4 km', time: '24 mins', priceMultiplier: 1.8 },
    { id: 'd2', name: 'Central Railway Junction', address: 'Station Road, Old Town Square', category: 'Railway Station', distance: '6.5 km', time: '14 mins', priceMultiplier: 1.1 },
    { id: 'd3', name: 'The Galleria Mega Mall', address: '5th Avenue, Fashion District', category: 'Shopping Mall', distance: '4.2 km', time: '10 mins', priceMultiplier: 1.0 },
    { id: 'd4', name: 'Skyline Bistro & Lounge', address: 'Rooftop 42, Harbour Bay', category: 'Restaurants', distance: '3.8 km', time: '9 mins', priceMultiplier: 1.05 },
    { id: 'd5', name: 'Tech Park One - Gate 2', address: 'Innovation Drive, Sector 12', category: 'Business Park', distance: '9.1 km', time: '18 mins', priceMultiplier: 1.25 }
  ];

  const rideOptions: RideOption[] = [
    {
      id: 'bike',
      name: 'RideX Moto',
      tagline: 'Fast, solo & traffic-beating',
      seats: 1,
      eta: '2 mins away',
      price: Math.round((selectedDestination?.priceMultiplier || 1) * 4.5 * 10) / 10,
      originalPrice: Math.round((selectedDestination?.priceMultiplier || 1) * 6.0 * 10) / 10,
      icon: 'Bike',
      fastest: true
    },
    {
      id: 'economy',
      name: 'RideX Go',
      tagline: 'Affordable, compact daily hatchbacks',
      seats: 4,
      eta: '3 mins away',
      price: Math.round((selectedDestination?.priceMultiplier || 1) * 12.8 * 10) / 10,
      originalPrice: Math.round((selectedDestination?.priceMultiplier || 1) * 15.0 * 10) / 10,
      icon: 'Car',
      popular: true
    },
    {
      id: 'comfort',
      name: 'RideX Comfort',
      tagline: 'Spacious sedans with top-rated drivers',
      seats: 4,
      eta: '4 mins away',
      price: Math.round((selectedDestination?.priceMultiplier || 1) * 18.5 * 10) / 10,
      originalPrice: Math.round((selectedDestination?.priceMultiplier || 1) * 22.0 * 10) / 10,
      icon: 'Car'
    },
    {
      id: 'premium',
      name: 'RideX Lux / XL',
      tagline: 'Executive SUVs & high-end luxury',
      seats: 6,
      eta: '6 mins away',
      price: Math.round((selectedDestination?.priceMultiplier || 1) * 28.9 * 10) / 10,
      originalPrice: Math.round((selectedDestination?.priceMultiplier || 1) * 34.0 * 10) / 10,
      icon: 'Crown',
      luxury: true
    }
  ];

  const couponsList = [
    { code: 'RIDEXFIRST', discount: 5.0, type: 'flat', description: '$5.00 OFF on your first 3 rides', minFare: 10, expiry: 'Valid till Aug 30' },
    { code: 'WEEKEND20', discount: 20, type: 'percent', description: '20% OFF on Comfort & XL rides', minFare: 15, expiry: 'Valid on Sat & Sun' },
    { code: 'AIRPORT15', discount: 15, type: 'percent', description: '15% OFF all airport transfers', minFare: 20, expiry: 'Valid till Sep 15' },
    { code: 'FREEMOTO', discount: 4.5, type: 'flat', description: '100% OFF up to $4.50 on Moto rides', minFare: 4.5, expiry: 'Limited time deal' }
  ];

  const driverProfile = {
    name: 'Marcus Vance',
    rating: 4.94,
    trips: '3,482 trips',
    vehicleModel: 'Toyota Camry Hybrid',
    vehicleColor: 'Midnight Onyx Black',
    licensePlate: 'RX-9021-US',
    phone: '+1 (555) 382-9102',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
  };

  const tripHistoryRecords: TripRecord[] = [
    {
      id: 'TR-9821',
      date: 'Today',
      time: '08:45 AM',
      pickup: '742 Evergreen Terrace, Sector 4',
      destination: 'Cyber Tower 8, Silicon Boulevard',
      rideType: 'RideX Go',
      driverName: 'Alex Rivera',
      driverRating: 4.9,
      fare: 15.30,
      status: 'Completed',
      vehicle: 'Honda Civic (White • #8291)'
    },
    {
      id: 'TR-9740',
      date: 'Yesterday',
      time: '06:15 PM',
      pickup: 'The Galleria Mega Mall',
      destination: '742 Evergreen Terrace, Sector 4',
      rideType: 'RideX Comfort',
      driverName: 'David Chen',
      driverRating: 5.0,
      fare: 21.80,
      status: 'Completed',
      vehicle: 'Hyundai Sonata (Silver • #1042)'
    },
    {
      id: 'TR-9510',
      date: 'Aug 04, 2026',
      time: '02:30 PM',
      pickup: 'Grand City Airport (Terminal 3)',
      destination: 'Downtown Fitness Center',
      rideType: 'RideX Lux / XL',
      driverName: 'Sarah Jenkins',
      driverRating: 4.95,
      fare: 34.50,
      status: 'Completed',
      vehicle: 'BMW X5 (Black • #9901)'
    }
  ];

  // Driver search timer logic
  useEffect(() => {
    let timer: any;
    if (activeScreen === 'searching_driver') {
      setDriverSearchProgress(0);
      timer = setInterval(() => {
        setDriverSearchProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setActiveScreen('driver_assigned');
            showToast('🎉 Driver found! Marcus is on his way.');
            return 100;
          }
          return prev + 20;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeScreen]);

  // Driver arrival simulation logic
  useEffect(() => {
    let timer: any;
    if (activeScreen === 'driver_assigned') {
      timer = setInterval(() => {
        setDriverAssignedEta((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setActiveScreen('live_trip');
            showToast("🚗 Your driver has arrived & trip started!");
            return 0;
          }
          return prev - 1;
        });
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [activeScreen]);

  // Live trip simulation logic
  useEffect(() => {
    let timer: any;
    if (activeScreen === 'live_trip') {
      setTripProgress(10);
      timer = setInterval(() => {
        setTripProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setActiveScreen('trip_completed');
            showToast("🎉 You've arrived at your destination!");
            return 100;
          }
          return prev + 15;
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [activeScreen]);

  // Simulated Driver app incoming trip request timer
  useEffect(() => {
    let timer: any;
    if (appRole === 'driver' && driverOnline && !incomingRequest) {
      timer = setTimeout(() => {
        setIncomingRequest({
          passengerName: 'Elena Rostova',
          passengerRating: 4.92,
          pickup: '742 Evergreen Terrace, Sector 4',
          destination: 'Grand City Airport (Terminal 3)',
          distance: '16.4 km',
          earnings: 28.50,
          passengerPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
        });
        setRequestCountdown(15);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [appRole, driverOnline, incomingRequest]);

  useEffect(() => {
    let countdownTimer: any;
    if (incomingRequest && requestCountdown > 0) {
      countdownTimer = setInterval(() => {
        setRequestCountdown(prev => prev - 1);
      }, 1000);
    } else if (requestCountdown === 0 && incomingRequest) {
      setIncomingRequest(null);
      showToast('Ride request expired.');
    }
    return () => clearInterval(countdownTimer);
  }, [incomingRequest, requestCountdown]);

  // Selected ride fare computation
  const currentRideObj = rideOptions.find((r) => r.id === selectedRideId) || rideOptions[1];
  const baseFare = currentRideObj.price;
  let discountAmount = 0;
  if (appliedCouponCode) {
    const matched = couponsList.find((c) => c.code === appliedCouponCode);
    if (matched) {
      if (matched.type === 'flat') discountAmount = matched.discount;
      else discountAmount = Math.round((baseFare * matched.discount) / 100 * 10) / 10;
    }
  }
  const taxAmount = Math.round(baseFare * 0.08 * 10) / 10;
  const finalFare = Math.max(2.0, Math.round((baseFare + taxAmount - discountAmount) * 10) / 10);

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    const found = couponsList.find((c) => c.code === code);
    if (found) {
      setAppliedCouponCode(code);
      setCouponSuccess(`Coupon '${code}' applied successfully!`);
      setCouponError('');
      showToast(`Promo ${code} applied! Saved $${found.discount}`);
    } else {
      setCouponError('Invalid promo code. Please check and try again.');
      setCouponSuccess('');
    }
  };

  const handleSendMessage = () => {
    if (!newMessageText.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: newMessageText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setNewMessageText('');
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'driver', text: 'Got it! I am pulling up in 1 minute.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 1500);
  };

  const handleSelectDestination = (dest: DestinationOption) => {
    setSelectedDestination(dest);
    setActiveScreen('choose_ride');
  };

  // Helper theme styles
  const isDark = themeMode === 'dark';
  const bgMain = isDark ? 'bg-[#090A0F] text-zinc-100' : 'bg-zinc-50 text-zinc-900';
  const cardBg = isDark ? 'bg-[#12141D]/90 border-zinc-800/80' : 'bg-white border-zinc-200';
  const inputBg = isDark ? 'bg-[#1B1E2B] border-zinc-700/70 text-white' : 'bg-zinc-100 border-zinc-300 text-zinc-900';
  const accentColor = 'bg-cyan-500 hover:bg-cyan-400 text-black font-bold';
  const accentText = 'text-cyan-400';

  return (
    <div className={`flex flex-col h-full w-full font-sans overflow-hidden select-none transition-colors duration-300 ${bgMain}`}>
      {/* Top Header Bar */}
      <header className={`px-4 py-3 flex items-center justify-between border-b shrink-0 z-30 ${isDark ? 'bg-[#0E1017]/95 border-zinc-800/90' : 'bg-white/95 border-zinc-200'} backdrop-blur-md`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveScreen('home'); setBottomNav('home'); }}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Navigation className="w-4 h-4 text-black transform rotate-45" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight flex items-center gap-1 leading-none">
                Ride<span className="text-cyan-400">X</span>
              </span>
              <span className="text-[9px] text-zinc-400 font-mono tracking-wider">URBAN MOBILITY</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 ml-4 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-400">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>GPS Active • High Accuracy</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Passenger / Driver Role Switcher */}
          <button
            onClick={() => {
              const next = appRole === 'passenger' ? 'driver' : 'passenger';
              setAppRole(next);
              showToast(`Switched to ${next === 'driver' ? 'Driver Partner' : 'Passenger'} App Mode`);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${appRole === 'driver'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
              : isDark
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-300'
              }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>{appRole === 'driver' ? 'Driver Partner' : 'Passenger Mode'}</span>
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
            className={`p-2 rounded-xl transition-all cursor-pointer ${isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-yellow-400' : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-700'
              }`}
            title="Toggle Light/Dark Theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Safety SOS Quick Access */}
          <button
            onClick={() => setSosModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-1 animate-pulse cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <span className="hidden sm:inline">SOS</span>
          </button>
        </div>
      </header>

      {/* Main Body Area */}
      <div className="flex-1 relative flex flex-col overflow-hidden">
        {/* PASSENGER ROLE FLOWS */}
        {appRole === 'passenger' && (
          <div className="flex-1 flex flex-col relative overflow-hidden">
            {/* Interactive Map Visual Component (Background or Main) */}
            <div className="absolute inset-0 z-0 bg-[#0B0F19] overflow-hidden">
              {/* Interactive Vector SVG Simulated Map */}
              <svg className="w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                  </pattern>
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00F0FF" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                {/* Roads representation */}
                <path d="M -50 200 C 200 150, 400 350, 900 280" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="24" />
                <path d="M 150 -50 C 180 300, 320 500, 400 900" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="20" />
                <path d="M 0 450 L 1000 450" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="16" />

                {/* Animated Route Curve when destination is chosen */}
                {(activeScreen === 'choose_ride' || activeScreen === 'driver_assigned' || activeScreen === 'live_trip') && (
                  <g>
                    <path
                      d="M 220 380 Q 400 220, 650 290"
                      fill="none"
                      stroke="url(#routeGradient)"
                      strokeWidth="6"
                      strokeDasharray="8 6"
                      className="animate-pulse"
                    />
                    {/* Destination Marker Pin */}
                    <circle cx="650" cy="290" r="14" fill="#EF4444" fillOpacity="0.3" />
                    <circle cx="650" cy="290" r="6" fill="#EF4444" />
                  </g>
                )}

                {/* Live Simulated Moving Driver Marker */}
                <g className="transition-all duration-1000 ease-out" style={{ transform: `translate(${carPosition.x * 6}px, ${carPosition.y * 5}px)` }}>
                  <circle cx="0" cy="0" r="18" fill="#00F0FF" fillOpacity="0.25" className="animate-ping" />
                  <circle cx="0" cy="0" r="10" fill="#00F0FF" />
                </g>
              </svg>

              {/* Map Floating HUD Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                <button
                  onClick={() => setMapZoom(prev => Math.min(prev + 0.2, 2))}
                  className="p-2.5 rounded-xl bg-[#12141D]/90 border border-zinc-800 text-white hover:bg-zinc-800 backdrop-blur-md shadow-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setMapZoom(prev => Math.max(prev - 0.2, 0.6))}
                  className="p-2.5 rounded-xl bg-[#12141D]/90 border border-zinc-800 text-white hover:bg-zinc-800 backdrop-blur-md shadow-lg cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => showToast('Locating your position via GPS...')}
                  className="p-2.5 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 font-bold backdrop-blur-md shadow-lg shadow-cyan-500/20 cursor-pointer"
                  title="Locate Me"
                >
                  <Crosshair className="w-4 h-4" />
                </button>
              </div>

              {/* Floating Nearby Vehicles Counter Pill */}
              <div className="absolute top-4 left-4 z-10 px-3.5 py-2 rounded-full bg-[#12141D]/90 border border-zinc-800/90 text-xs font-medium text-zinc-300 flex items-center gap-2 backdrop-blur-md shadow-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span><strong className="text-white">8 drivers</strong> nearby in Sector 4</span>
              </div>
            </div>

            {/* SCREEN 1: HOME / RIDE BOOKING SCREEN */}
            {activeScreen === 'home' && (
              <div className="flex-1 flex flex-col justify-end z-10 p-4 sm:p-6 overflow-y-auto">
                <div className={`w-full max-w-xl mx-auto rounded-3xl p-5 border shadow-2xl backdrop-blur-xl transition-all ${cardBg}`}>
                  {/* Current Pickup Location Banner */}
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-4">
                    <div className="p-2 rounded-xl bg-cyan-500 text-black font-bold shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold">Pickup Location</p>
                      <p className="text-xs font-semibold truncate text-zinc-100">{pickupAddress}</p>
                    </div>
                    <button
                      onClick={() => setActiveScreen('search')}
                      className="text-xs font-bold text-cyan-400 hover:underline shrink-0 cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>

                  {/* "Where to?" Search Trigger Input */}
                  <div
                    onClick={() => setActiveScreen('search')}
                    className={`w-full p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all hover:border-cyan-500/50 mb-5 ${inputBg}`}
                  >
                    <Search className="w-5 h-5 text-cyan-400 shrink-0" />
                    <span className="text-base font-semibold text-zinc-400 flex-1">Where are you going?</span>
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">Search</span>
                  </div>

                  {/* Saved Places Grid */}
                  <div className="space-y-2 mb-5">
                    <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold px-1">
                      <span>Saved Places</span>
                      <span className="text-cyan-400 cursor-pointer hover:underline">+ Add New</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {savedPlaces.map((place) => (
                        <div
                          key={place.id}
                          onClick={() => {
                            setSelectedDestination({
                              id: place.id,
                              name: place.name,
                              address: place.address,
                              category: 'Saved',
                              distance: place.distance || '5.0 km',
                              time: '12 mins',
                              priceMultiplier: 1.1
                            });
                            setActiveScreen('choose_ride');
                          }}
                          className={`p-3 rounded-2xl border flex items-center gap-2.5 cursor-pointer transition-all hover:scale-[1.02] ${isDark ? 'bg-[#181B27] border-zinc-800 hover:border-cyan-500/40' : 'bg-zinc-50 border-zinc-200 hover:border-cyan-500'
                            }`}
                        >
                          <div className="p-2 rounded-xl bg-zinc-800 text-cyan-400 shrink-0">
                            {place.icon === 'Home' && <Home className="w-4 h-4" />}
                            {place.icon === 'Briefcase' && <Briefcase className="w-4 h-4" />}
                            {place.icon === 'GraduationCap' && <GraduationCap className="w-4 h-4" />}
                            {place.icon === 'Heart' && <Heart className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-zinc-100 truncate">{place.name}</p>
                            <p className="text-[10px] text-zinc-400 truncate">{place.address}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Choose Ride */}
                  <button
                    onClick={() => setActiveScreen('search')}
                    className={`w-full py-3.5 rounded-2xl ${accentColor} text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 cursor-pointer`}
                  >
                    <span>Choose a Ride</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 2: DESTINATION SEARCH MODAL */}
            {activeScreen === 'search' && (
              <div className="absolute inset-0 z-20 bg-[#090A0F]/95 backdrop-blur-xl p-4 sm:p-6 flex flex-col overflow-y-auto">
                <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col">
                  {/* Top Bar */}
                  <div className="flex items-center gap-3 mb-6">
                    <button
                      onClick={() => setActiveScreen('home')}
                      className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-bold">Set Destination</h2>
                  </div>

                  {/* Inputs */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                      <div className="w-3 h-3 rounded-full bg-emerald-400 shrink-0 ml-1" />
                      <input
                        type="text"
                        value={pickupAddress}
                        onChange={(e) => setPickupAddress(e.target.value)}
                        className="bg-transparent text-xs font-semibold text-zinc-200 w-full focus:outline-none"
                        placeholder="Current Pickup Location"
                      />
                    </div>

                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/40">
                      <MapPin className="w-5 h-5 text-cyan-400 shrink-0" />
                      <input
                        type="text"
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent text-sm font-bold text-white w-full focus:outline-none"
                        placeholder="Where are you going?"
                      />
                      {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="text-zinc-400 hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Search Suggestions & Popular Destinations */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                    <p className="text-xs font-bold text-zinc-400 tracking-wider uppercase">Popular & Recent Destinations</p>
                    <div className="space-y-2">
                      {popularDestinations
                        .filter(
                          (d) =>
                            !searchQuery ||
                            d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            d.address.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((dest) => (
                          <div
                            key={dest.id}
                            onClick={() => handleSelectDestination(dest)}
                            className="p-4 rounded-2xl bg-[#12141D] hover:bg-[#1B1E2B] border border-zinc-800/80 flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01]"
                          >
                            <div className="flex items-center gap-3.5">
                              <div className="p-3 rounded-xl bg-zinc-800 text-cyan-400">
                                <Compass className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-bold text-white">{dest.name}</h4>
                                  <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] font-mono text-cyan-300">
                                    {dest.category}
                                  </span>
                                </div>
                                <p className="text-xs text-zinc-400 mt-0.5">{dest.address}</p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-xs font-bold text-white">{dest.distance}</p>
                              <p className="text-[10px] text-zinc-400">{dest.time}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 3 & 4: CHOOSE RIDE & FARE ESTIMATION */}
            {activeScreen === 'choose_ride' && selectedDestination && (
              <div className="flex-1 flex flex-col justify-end z-10 p-4 sm:p-6 overflow-y-auto">
                <div className={`w-full max-w-xl mx-auto rounded-3xl p-5 border shadow-2xl backdrop-blur-xl ${cardBg}`}>
                  {/* Route Summary Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-white">{selectedDestination.name}</h3>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                          {selectedDestination.time}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400">{selectedDestination.distance} • Fastest Route via Highway</p>
                    </div>
                    <button
                      onClick={() => setActiveScreen('search')}
                      className="p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold cursor-pointer"
                    >
                      Change
                    </button>
                  </div>

                  {/* Ride Option Cards */}
                  <div className="space-y-2.5 mb-5 max-h-[260px] overflow-y-auto pr-1">
                    {rideOptions.map((ride) => {
                      const isSelected = selectedRideId === ride.id;
                      return (
                        <div
                          key={ride.id}
                          onClick={() => setSelectedRideId(ride.id)}
                          className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${isSelected
                            ? 'bg-cyan-500/10 border-cyan-500 shadow-md shadow-cyan-500/10'
                            : 'bg-[#181B27] border-zinc-800 hover:border-zinc-700'
                            }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <div className={`p-3 rounded-2xl ${isSelected ? 'bg-cyan-500 text-black' : 'bg-zinc-800 text-cyan-400'}`}>
                              {ride.icon === 'Bike' && <Bike className="w-6 h-6" />}
                              {ride.icon === 'Car' && <Car className="w-6 h-6" />}
                              {ride.icon === 'Crown' && <Crown className="w-6 h-6" />}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-white">{ride.name}</h4>
                                {ride.popular && (
                                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                                    POPULAR
                                  </span>
                                )}
                                {ride.fastest && (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                                    FASTEST
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-zinc-400">{ride.tagline}</p>
                              <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-1">
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3" /> {ride.seats} seats
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                                  <Clock className="w-3 h-3" /> {ride.eta}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <p className="text-base font-black text-white">${ride.price.toFixed(2)}</p>
                            <p className="text-xs line-through text-zinc-500">${ride.originalPrice.toFixed(2)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Payment Method & Promo Trigger Bar */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900 border border-zinc-800 mb-4">
                    <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveScreen('wallet')}>
                      <Wallet className="w-4 h-4 text-cyan-400" />
                      <div>
                        <p className="text-[10px] text-zinc-400 uppercase font-bold">Payment</p>
                        <p className="text-xs font-bold text-zinc-200">RideX Wallet (${walletBalance.toFixed(2)})</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowFareBreakdown(true)}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold flex items-center gap-1 hover:bg-cyan-500/20 cursor-pointer"
                    >
                      <TagIcon className="w-3.5 h-3.5" />
                      <span>Fare & Promo</span>
                    </button>
                  </div>

                  {/* Confirm Ride CTA */}
                  <button
                    onClick={() => setActiveScreen('searching_driver')}
                    className={`w-full py-4 rounded-2xl ${accentColor} text-base flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/30 cursor-pointer`}
                  >
                    <span>Confirm {currentRideObj.name} (${finalFare.toFixed(2)})</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* FARE ESTIMATION & BREAKDOWN MODAL */}
            {showFareBreakdown && (
              <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-[#12141D] border border-zinc-800 rounded-3xl p-6 relative shadow-2xl">
                  <button
                    onClick={() => setShowFareBreakdown(false)}
                    className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <h3 className="text-lg font-bold text-white mb-1">Fare Breakdown</h3>
                  <p className="text-xs text-zinc-400 mb-4">Transparent pricing with no hidden surcharges</p>

                  <div className="space-y-3 text-xs mb-6">
                    <div className="flex justify-between py-1.5 border-b border-zinc-800">
                      <span className="text-zinc-400">Base Ride Fare ({currentRideObj.name})</span>
                      <span className="font-bold text-white">${baseFare.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-zinc-800">
                      <span className="text-zinc-400">Distance ({selectedDestination?.distance || '8.4 km'})</span>
                      <span className="font-bold text-white">$4.20</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-zinc-800">
                      <span className="text-zinc-400">Taxes & Service Fee (8%)</span>
                      <span className="font-bold text-white">${taxAmount.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between py-1.5 border-b border-zinc-800 text-emerald-400">
                        <span>Promo Coupon ({appliedCouponCode})</span>
                        <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 text-sm font-extrabold text-white">
                      <span>Total Estimated Fare</span>
                      <span className="text-cyan-400">${finalFare.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Promo Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-300">Apply Promo Coupon</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Enter Promo Code e.g. WEEKEND20"
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white uppercase focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        onClick={() => handleApplyCoupon()}
                        className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {couponSuccess && <p className="text-[11px] text-emerald-400">{couponSuccess}</p>}
                    {couponError && <p className="text-[11px] text-red-400">{couponError}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 5: DRIVER SEARCHING SCREEN */}
            {activeScreen === 'searching_driver' && (
              <div className="flex-1 flex flex-col justify-center items-center z-10 p-6">
                <div className="w-full max-w-md rounded-3xl p-8 border border-zinc-800/90 bg-[#12141D]/95 backdrop-blur-2xl text-center shadow-2xl relative">
                  {/* Radar Pulse Animation */}
                  <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-500/40 animate-ping" />
                    <div className="absolute inset-2 rounded-full border border-cyan-400/20 animate-pulse" />
                    <div className="w-20 h-20 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center">
                      <Car className="w-10 h-10 text-cyan-400 animate-bounce" />
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-white mb-2">Finding Your Driver...</h3>
                  <p className="text-xs text-zinc-400 mb-6">Contacting nearby RideX partners in Sector 4</p>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden mb-6">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${driverSearchProgress}%` }}
                    />
                  </div>

                  <p className="text-xs font-mono text-cyan-400 mb-6">Estimated wait time: 2-3 minutes</p>

                  <button
                    onClick={() => setActiveScreen('home')}
                    className="w-full py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-red-400 font-bold text-xs border border-zinc-700 cursor-pointer"
                  >
                    Cancel Ride
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 6: DRIVER ASSIGNED SCREEN */}
            {activeScreen === 'driver_assigned' && (
              <div className="flex-1 flex flex-col justify-end z-10 p-4 sm:p-6">
                <div className="w-full max-w-xl mx-auto rounded-3xl p-5 border border-zinc-800 bg-[#12141D]/95 backdrop-blur-2xl shadow-2xl">
                  {/* Arrival Banner */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-cyan-500 text-black font-bold">
                        <Clock className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Driver Arriving</p>
                        <p className="text-sm font-black text-white">Arriving in {driverAssignedEta} mins</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-cyan-500 text-black font-extrabold text-xs font-mono">
                      PIN: 4892
                    </span>
                  </div>

                  {/* Driver Info Card */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 mb-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={driverProfile.avatar}
                        alt={driverProfile.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-white">{driverProfile.name}</h4>
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {driverProfile.rating}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400">{driverProfile.vehicleModel} • {driverProfile.vehicleColor}</p>
                        <p className="text-xs font-mono font-bold text-cyan-400 mt-0.5">{driverProfile.licensePlate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <button
                      onClick={() => showToast(`Calling ${driverProfile.name}...`)}
                      className="p-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-cyan-400 font-bold text-xs flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call</span>
                    </button>
                    <button
                      onClick={() => setChatOpen(true)}
                      className="p-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-cyan-400 font-bold text-xs flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat</span>
                    </button>
                    <button
                      onClick={() => setShareModalOpen(true)}
                      className="p-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-cyan-400 font-bold text-xs flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                    <button
                      onClick={() => setSosModalOpen(true)}
                      className="p-3 rounded-2xl bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold text-xs flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>SOS</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 7 & 8: LIVE RIDE TRACKING & TRIP STARTED */}
            {activeScreen === 'live_trip' && (
              <div className="flex-1 flex flex-col justify-end z-10 p-4 sm:p-6">
                <div className="w-full max-w-xl mx-auto rounded-3xl p-5 border border-zinc-800 bg-[#12141D]/95 backdrop-blur-2xl shadow-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
                    <div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wider uppercase">
                        Trip In Progress
                      </span>
                      <h3 className="text-lg font-black text-white mt-1">You're on your way!</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-400">ETA Destination</p>
                      <p className="text-base font-extrabold text-cyan-400">12 mins</p>
                    </div>
                  </div>

                  {/* Trip Live Progress */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs text-zinc-400 font-semibold">
                      <span>Trip Progress</span>
                      <span>{tripProgress}% completed</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-700"
                        style={{ width: `${tripProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Destination Info */}
                  <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="text-xs font-bold text-white">{selectedDestination?.name || 'Grand City Airport'}</p>
                        <p className="text-[11px] text-zinc-400">{selectedDestination?.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShareModalOpen(true)}
                      className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Share2 className="w-4 h-4 text-cyan-400" />
                      <span>Share Trip Status</span>
                    </button>
                    <button
                      onClick={() => setSosModalOpen(true)}
                      className="px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>Emergency</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 9: TRIP COMPLETED & RATING */}
            {activeScreen === 'trip_completed' && (
              <div className="absolute inset-0 z-30 bg-[#090A0F]/95 backdrop-blur-xl p-4 sm:p-6 flex items-center justify-center overflow-y-auto">
                <div className="w-full max-w-lg bg-[#12141D] border border-zinc-800 rounded-3xl p-6 text-center shadow-2xl">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>

                  <h2 className="text-2xl font-black text-white mb-1">🎉 Trip Completed!</h2>
                  <p className="text-xs text-zinc-400 mb-6">Hope you enjoyed your RideX experience</p>

                  {/* Summary Card */}
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-left mb-6 space-y-2 text-xs">
                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                      <span className="text-zinc-400">Total Distance</span>
                      <span className="font-bold text-white">{selectedDestination?.distance || '8.4 km'}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                      <span className="text-zinc-400">Ride Duration</span>
                      <span className="font-bold text-white">18 mins</span>
                    </div>
                    <div className="flex justify-between pt-1 text-sm font-extrabold">
                      <span className="text-zinc-200">Amount Paid</span>
                      <span className="text-cyan-400">${finalFare.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Driver Rating */}
                  <div className="mb-6">
                    <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Rate Your Driver ({driverProfile.name})</p>
                    <div className="flex justify-center gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setUserRating(star)}
                          className="p-2 transition-transform hover:scale-125 cursor-pointer"
                        >
                          <Star
                            className={`w-7 h-7 ${star <= userRating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'
                              }`}
                          />
                        </button>
                      ))}
                    </div>

                    {/* Tip Selection */}
                    <p className="text-xs font-bold text-zinc-400 mb-2">Add a Tip for Driver Partner</p>
                    <div className="flex justify-center gap-2">
                      {[0, 2, 3, 5].map((tip) => (
                        <button
                          key={tip}
                          onClick={() => setSelectedTip(tip)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${selectedTip === tip
                            ? 'bg-cyan-500 text-black border-cyan-400'
                            : 'bg-zinc-900 text-zinc-300 border-zinc-800'
                            }`}
                        >
                          {tip === 0 ? 'No Tip' : `$${tip}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveScreen('home');
                      setBottomNav('home');
                      showToast('Thank you for your rating & feedback!');
                    }}
                    className={`w-full py-4 rounded-2xl ${accentColor} text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 cursor-pointer`}
                  >
                    <span>Done & Back to Home</span>
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 10: RIDE HISTORY / YOUR TRIPS */}
            {bottomNav === 'trips' && activeScreen !== 'choose_ride' && activeScreen !== 'search' && (
              <div className="absolute inset-0 z-20 bg-[#090A0F] p-4 sm:p-6 overflow-y-auto">
                <div className="w-full max-w-3xl mx-auto space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-white">Your Trips</h2>
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold">
                      {tripHistoryRecords.length} Total Trips
                    </span>
                  </div>

                  <div className="space-y-4">
                    {tripHistoryRecords.map((record) => (
                      <div
                        key={record.id}
                        className="p-5 rounded-3xl bg-[#12141D] border border-zinc-800 hover:border-zinc-700 transition-all space-y-4"
                      >
                        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                              {record.status}
                            </span>
                            <span className="text-xs text-zinc-400">{record.date} • {record.time}</span>
                          </div>
                          <span className="text-base font-black text-white">${record.fare.toFixed(2)}</span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-3 text-xs text-zinc-300">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                            <span className="truncate">{record.pickup}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-zinc-300">
                            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            <span className="truncate">{record.destination}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                          <div className="text-xs text-zinc-400">
                            <span className="font-bold text-white">{record.rideType}</span> • {record.driverName}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => showToast(`Receipt for ${record.id} downloaded.`)}
                              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 cursor-pointer"
                            >
                              Receipt
                            </button>
                            <button
                              onClick={() => {
                                setSelectedDestination({
                                  id: 'rebook_' + record.id,
                                  name: record.destination,
                                  address: record.destination,
                                  category: 'Rebook',
                                  distance: '8.0 km',
                                  time: '15 mins',
                                  priceMultiplier: 1.1
                                });
                                setBottomNav('home');
                                setActiveScreen('choose_ride');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-bold cursor-pointer"
                            >
                              Rebook
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 11: WALLET & PAYMENTS */}
            {bottomNav === 'wallet' && (
              <div className="absolute inset-0 z-20 bg-[#090A0F] p-4 sm:p-6 overflow-y-auto">
                <div className="w-full max-w-2xl mx-auto space-y-6">
                  <h2 className="text-2xl font-black text-white">Wallet & Payments</h2>

                  {/* Balance Card */}
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-600 via-teal-700 to-emerald-800 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute -right-10 -bottom-10 opacity-10">
                      <Wallet className="w-64 h-64" />
                    </div>
                    <p className="text-xs uppercase font-bold text-cyan-200 tracking-wider">RideX Cash Balance</p>
                    <h3 className="text-4xl font-black mt-2 mb-4">${walletBalance.toFixed(2)}</h3>
                    <button
                      onClick={() => setAddMoneyModalOpen(true)}
                      className="px-5 py-2.5 rounded-2xl bg-white text-black font-black text-xs hover:bg-zinc-100 shadow-lg cursor-pointer"
                    >
                      + Add Money
                    </button>
                  </div>

                  {/* Payment Methods List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-400">
                      <span>Saved Payment Methods</span>
                      <span className="text-cyan-400 cursor-pointer hover:underline">+ Add New</span>
                    </div>

                    {paymentMethods.map((pm) => (
                      <div
                        key={pm.id}
                        onClick={() => setSelectedPaymentId(pm.id)}
                        className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${selectedPaymentId === pm.id
                          ? 'bg-cyan-500/10 border-cyan-500'
                          : 'bg-[#12141D] border-zinc-800'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-cyan-400" />
                          <div>
                            <p className="text-sm font-bold text-white">{pm.name}</p>
                            {pm.balance !== undefined && (
                              <p className="text-xs text-zinc-400">Available: ${pm.balance.toFixed(2)}</p>
                            )}
                          </div>
                        </div>
                        {selectedPaymentId === pm.id && <CheckCircle className="w-5 h-5 text-cyan-400" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 12: OFFERS & COUPONS */}
            {bottomNav === 'offers' && (
              <div className="absolute inset-0 z-20 bg-[#090A0F] p-4 sm:p-6 overflow-y-auto">
                <div className="w-full max-w-2xl mx-auto space-y-6">
                  <h2 className="text-2xl font-black text-white">Offers & Promo Codes</h2>

                  <div className="space-y-4">
                    {couponsList.map((coupon) => (
                      <div
                        key={coupon.code}
                        className="p-5 rounded-3xl bg-[#12141D] border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono font-black text-xs tracking-wider border border-cyan-500/40">
                              {coupon.code}
                            </span>
                            <span className="text-[10px] text-zinc-400">{coupon.expiry}</span>
                          </div>
                          <p className="text-sm font-bold text-white">{coupon.description}</p>
                          <p className="text-xs text-zinc-400">Min ride fare: ${coupon.minFare.toFixed(2)}</p>
                        </div>

                        <button
                          onClick={() => {
                            handleApplyCoupon(coupon.code);
                            setBottomNav('home');
                          }}
                          className="px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shrink-0 cursor-pointer"
                        >
                          Apply Code
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 13 & 14: PROFILE & SAFETY CENTER */}
            {bottomNav === 'profile' && (
              <div className="absolute inset-0 z-20 bg-[#090A0F] p-4 sm:p-6 overflow-y-auto">
                <div className="w-full max-w-xl mx-auto space-y-6">
                  {/* User Header */}
                  <div className="p-6 rounded-3xl bg-[#12141D] border border-zinc-800 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 p-0.5">
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80"
                        alt="Profile"
                        className="w-full h-full rounded-2xl object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">Sarah Jenkins</h3>
                      <p className="text-xs text-zinc-400">+1 (555) 019-2834</p>
                      <div className="flex items-center gap-1 text-xs text-amber-400 font-bold mt-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>4.95 Rating • Gold Tier</span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Options */}
                  <div className="p-4 rounded-3xl bg-[#12141D] border border-zinc-800 space-y-1 text-sm">
                    <div
                      onClick={() => setBottomNav('trips')}
                      className="p-3 rounded-2xl hover:bg-zinc-800 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        <span>Your Trips</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-500" />
                    </div>

                    <div
                      onClick={() => setBottomNav('wallet')}
                      className="p-3 rounded-2xl hover:bg-zinc-800 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Wallet className="w-4 h-4 text-cyan-400" />
                        <span>Wallet & Payments</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-500" />
                    </div>

                    <div
                      onClick={() => setSosModalOpen(true)}
                      className="p-3 rounded-2xl hover:bg-zinc-800 flex items-center justify-between cursor-pointer text-red-400"
                    >
                      <div className="flex items-center gap-3">
                        <ShieldAlert className="w-4 h-4" />
                        <span>Safety Center & Emergency SOS</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-500" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PASSENGER MOBILE NAVIGATION BAR */}
            <nav className={`px-4 py-2 border-t flex items-center justify-around shrink-0 z-30 ${isDark ? 'bg-[#0E1017] border-zinc-800' : 'bg-white border-zinc-200'}`}>
              {[
                { id: 'home', label: 'Ride', icon: Navigation },
                { id: 'trips', label: 'Trips', icon: Clock },
                { id: 'wallet', label: 'Wallet', icon: Wallet },
                { id: 'offers', label: 'Offers', icon: Gift },
                { id: 'profile', label: 'Profile', icon: User }
              ].map((tab) => {
                const Icon = tab.icon;
                const active = bottomNav === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setBottomNav(tab.id as any);
                      if (tab.id === 'home') setActiveScreen('home');
                    }}
                    className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all cursor-pointer ${active ? 'text-cyan-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px]">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* SCREEN 15: DRIVER APP INTERFACE ROLE */}
        {appRole === 'driver' && (
          <div className="flex-1 flex flex-col relative overflow-hidden bg-[#090A0F]">
            {/* Driver Top Banner */}
            <div className="p-4 bg-[#12141D] border-b border-zinc-800 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <div>
                  <h3 className="text-sm font-bold text-white">Driver Partner Interface</h3>
                  <p className="text-xs text-zinc-400">{driverOnline ? 'Online • Accepting Rides' : 'Offline'}</p>
                </div>
              </div>

              <button
                onClick={() => setDriverOnline(!driverOnline)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${driverOnline ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}
              >
                {driverOnline ? 'GO OFFLINE' : 'GO ONLINE'}
              </button>
            </div>

            {/* Driver Main Content Dashboard */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 z-10">
              {/* Today's Earnings Card */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-[#12141D] border border-zinc-800 text-center">
                  <p className="text-[10px] uppercase text-zinc-400 font-bold">Today's Earnings</p>
                  <p className="text-xl font-black text-cyan-400 mt-1">${driverEarningsToday.toFixed(2)}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#12141D] border border-zinc-800 text-center">
                  <p className="text-[10px] uppercase text-zinc-400 font-bold">Trips Done</p>
                  <p className="text-xl font-black text-white mt-1">{driverCompletedTrips}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#12141D] border border-zinc-800 text-center">
                  <p className="text-[10px] uppercase text-zinc-400 font-bold">Rating</p>
                  <p className="text-xl font-black text-amber-400 mt-1">4.92 ★</p>
                </div>
              </div>

              {/* Incoming Ride Request Modal Overlay */}
              {incomingRequest && (
                <div className="p-6 rounded-3xl bg-gradient-to-b from-cyan-950/90 to-[#12141D] border-2 border-cyan-500 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-cyan-500 text-black font-extrabold text-xs">
                      INCOMING REQUEST ({requestCountdown}s)
                    </span>
                    <span className="text-lg font-black text-cyan-400">${incomingRequest.earnings.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={incomingRequest.passengerPhoto}
                      alt={incomingRequest.passengerName}
                      className="w-12 h-12 rounded-2xl object-cover"
                    />
                    <div>
                      <h4 className="text-base font-bold text-white">{incomingRequest.passengerName}</h4>
                      <p className="text-xs text-amber-400 font-bold">★ {incomingRequest.passengerRating} Rating</p>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-zinc-300">
                    <p><strong>Pickup:</strong> {incomingRequest.pickup}</p>
                    <p><strong>Dropoff:</strong> {incomingRequest.destination}</p>
                    <p><strong>Distance:</strong> {incomingRequest.distance}</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setIncomingRequest(null)}
                      className="flex-1 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs cursor-pointer"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => {
                        setDriverEarningsToday((prev) => prev + incomingRequest.earnings);
                        setDriverCompletedTrips((prev) => prev + 1);
                        setIncomingRequest(null);
                        showToast('Ride accepted! Navigating to passenger pickup...');
                      }}
                      className="flex-1 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs cursor-pointer"
                    >
                      Accept Ride
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CHAT DRAWER */}
      {chatOpen && (
        <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-md h-full bg-[#12141D] border-l border-zinc-800 flex flex-col p-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Chat with {driverProfile.name}</h3>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-1">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs ${msg.sender === 'user' ? 'bg-cyan-500 text-black font-semibold' : 'bg-zinc-800 text-zinc-200'
                      }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-zinc-500 mt-1">{msg.time}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAFETY SOS MODAL */}
      {sosModalOpen && (
        <div className="absolute inset-0 z-50 bg-red-950/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#180A0A] border-2 border-red-500 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <ShieldAlert className="w-16 h-16 text-red-500 mx-auto animate-bounce" />
            <h3 className="text-2xl font-black text-white">Emergency SOS Active</h3>
            <p className="text-xs text-zinc-300">
              Triggering SOS will alert 911 dispatch, your trusted contacts, and RideX 24/7 Emergency Safety Team.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setSosModalOpen(false);
                  showToast('🚨 Emergency SOS Broadcast Sent to Authorities & Contacts!');
                }}
                className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-sm shadow-xl cursor-pointer"
              >
                CONFIRM EMERGENCY BROADCAST
              </button>
              <button
                onClick={() => setSosModalOpen(false)}
                className="w-full py-3 rounded-2xl bg-zinc-900 text-zinc-400 font-bold text-xs hover:text-white cursor-pointer"
              >
                Dismiss / False Alarm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHARE TRIP MODAL */}
      {shareModalOpen && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#12141D] border border-zinc-800 rounded-3xl p-6 relative">
            <button onClick={() => setShareModalOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-white mb-2">Share Live Trip Status</h3>
            <p className="text-xs text-zinc-400 mb-4">Send real-time map tracking link to family & friends</p>
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-cyan-400 break-all mb-4">
              https://ridex.app/track/tr-9821-live
            </div>
            <button
              onClick={() => {
                setShareModalOpen(false);
                showToast('Tracking link copied to clipboard!');
              }}
              className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Link</span>
            </button>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {notificationToast && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-cyan-500 text-black font-extrabold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{notificationToast}</span>
        </div>
      )}
    </div>
  );
}
