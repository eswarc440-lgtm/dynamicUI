import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Clock,
  Calendar as CalendarIcon,
  CheckCircle2,
  Plus,
  Flame,
  Sparkles,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  AlertCircle,
  TrendingUp,
  Award,
  User,
  Settings,
  Sun,
  Moon,
  Volume2,
  Zap,
  ShieldCheck,
  Smartphone,
  RotateCcw,
  Trash2,
  Edit,
  Share2,
  Heart,
  BookOpen,
  Dumbbell,
  Briefcase,
  Home,
  Cake,
  CreditCard,
  ShoppingBag,
  MoreHorizontal,
  ArrowRight,
  LogOut,
  HelpCircle,
  Lock,
  Play,
  Pause,
  AlertTriangle,
  Send,
  ZapOff
} from 'lucide-react';
import { getTopicImageUrl } from '../utils/imageResolver';

// Interfaces
export interface ReminderItem {
  id: string;
  title: string;
  time: string;
  date: string; // YYYY-MM-DD or 'Today' | 'Tomorrow'
  category: 'Health' | 'Study' | 'Work' | 'Personal' | 'Birthday' | 'Payment' | 'Fitness' | 'Shopping' | 'Other';
  priority: 'low' | 'medium' | 'high';
  repeat: 'Once' | 'Daily' | 'Weekdays' | 'Weekends' | 'Weekly' | 'Monthly';
  notificationLeadTime: string;
  completed: boolean;
  notes?: string;
}

export interface AlarmItem {
  id: string;
  title: string;
  time: string;
  days: string[];
  active: boolean;
  sound: string;
  mathChallenge: boolean;
}

export interface HabitItem {
  id: string;
  title: string;
  icon: string;
  currentCount: number;
  targetCount: number;
  unit: string;
  streakDays: number;
  category: string;
  color: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'reminder' | 'alarm' | 'habit' | 'system';
  read: boolean;
}

export const RemindMeApp: React.FC = () => {
  // Navigation & Theme State
  const [activeScreen, setActiveScreen] = useState<
    'splash' | 'onboarding' | 'auth' | 'home' | 'calendar' | 'reminders' | 'alarms' | 'habits' | 'insights' | 'notifications' | 'profile' | 'settings'
  >('home');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [onboardingStep, setOnboardingStep] = useState<number>(0);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'guest'>('login');
  
  // App Live Clock State
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Modals & Overlays
  const [isAlarmRingingOpen, setIsAlarmRingingOpen] = useState<boolean>(false);
  const [isCreateReminderOpen, setIsCreateReminderOpen] = useState<boolean>(false);
  const [isAiReminderOpen, setIsAiReminderOpen] = useState<boolean>(false);
  const [isAddAlarmOpen, setIsAddAlarmOpen] = useState<boolean>(false);
  const [isAddHabitOpen, setIsAddHabitOpen] = useState<boolean>(false);
  const [selectedReminderDetail, setSelectedReminderDetail] = useState<ReminderItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Initial Mock Reminders
  const [reminders, setReminders] = useState<ReminderItem[]>([
    {
      id: 'r1',
      title: 'Take Daily Multivitamin & Fish Oil',
      time: '08:00 AM',
      date: 'Today',
      category: 'Health',
      priority: 'high',
      repeat: 'Daily',
      notificationLeadTime: 'At reminder time',
      completed: true,
      notes: 'Take after breakfast with a full glass of water'
    },
    {
      id: 'r2',
      title: 'Study Data Structures & Algorithms',
      time: '10:30 AM',
      date: 'Today',
      category: 'Study',
      priority: 'high',
      repeat: 'Daily',
      notificationLeadTime: '10 minutes before',
      completed: true,
      notes: 'Review Graph Traversal (DFS/BFS) & Tree LeetCode problems'
    },
    {
      id: 'r3',
      title: 'Team Sync & Product Design Review',
      time: '01:00 PM',
      date: 'Today',
      category: 'Work',
      priority: 'medium',
      repeat: 'Weekdays',
      notificationLeadTime: '15 minutes before',
      completed: false,
      notes: 'Prepare Figma interactive prototypes'
    },
    {
      id: 'r4',
      title: 'Evening HIIT Workout & Hydration',
      time: '05:00 PM',
      date: 'Today',
      category: 'Fitness',
      priority: 'high',
      repeat: 'Daily',
      notificationLeadTime: '30 minutes before',
      completed: false
    },
    {
      id: 'r5',
      title: 'Read 20 Pages of System Design Book',
      time: '09:00 PM',
      date: 'Today',
      category: 'Personal',
      priority: 'low',
      repeat: 'Daily',
      notificationLeadTime: '10 minutes before',
      completed: false
    },
    {
      id: 'r6',
      title: 'Pay Monthly Utility Bill & Subscriptions',
      time: '10:00 AM',
      date: 'Tomorrow',
      category: 'Payment',
      priority: 'high',
      repeat: 'Monthly',
      notificationLeadTime: '1 hour before',
      completed: false
    },
    {
      id: 'r7',
      title: "Sarah's Birthday Celebration Party",
      time: '07:00 PM',
      date: 'Tomorrow',
      category: 'Birthday',
      priority: 'medium',
      repeat: 'Once',
      notificationLeadTime: '1 hour before',
      completed: false
    }
  ]);

  // 2. Initial Mock Alarms
  const [alarms, setAlarms] = useState<AlarmItem[]>([
    {
      id: 'a1',
      title: 'Morning Rise & Shine',
      time: '06:30 AM',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      active: true,
      sound: 'Gentle Chime',
      mathChallenge: true
    },
    {
      id: 'a2',
      title: 'Afternoon Focus Refresh',
      time: '03:00 PM',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      active: false,
      sound: 'Radar Beats',
      mathChallenge: false
    },
    {
      id: 'a3',
      title: 'Night Sleep Wind Down',
      time: '10:30 PM',
      days: ['Daily'],
      active: true,
      sound: 'Ocean Waves',
      mathChallenge: false
    }
  ]);

  // 3. Initial Mock Habits
  const [habits, setHabits] = useState<HabitItem[]>([
    {
      id: 'h1',
      title: 'Drink Water',
      icon: '💧',
      currentCount: 6,
      targetCount: 8,
      unit: 'glasses',
      streakDays: 14,
      category: 'Health',
      color: 'bg-cyan-500'
    },
    {
      id: 'h2',
      title: 'Study Java & Tech',
      icon: '📚',
      currentCount: 1,
      targetCount: 1,
      unit: 'session',
      streakDays: 12,
      category: 'Study',
      color: 'bg-purple-500'
    },
    {
      id: 'h3',
      title: 'Daily HIIT Workout',
      icon: '🏃',
      currentCount: 4,
      targetCount: 7,
      unit: 'days/wk',
      streakDays: 8,
      category: 'Fitness',
      color: 'bg-amber-500'
    },
    {
      id: 'h4',
      title: 'Read Book Pages',
      icon: '📖',
      currentCount: 1,
      targetCount: 1,
      unit: 'chapter',
      streakDays: 9,
      category: 'Personal',
      color: 'bg-emerald-500'
    }
  ]);

  // 4. Initial Mock Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'Study DSA Reminder',
      message: 'Study Data Structures & Algorithms starts in 10 minutes.',
      time: '10:20 AM',
      type: 'reminder',
      read: false
    },
    {
      id: 'n2',
      title: 'Morning Alarm Scheduled',
      message: 'Your morning rise & shine alarm is set for 06:30 AM tomorrow.',
      time: '08:00 AM',
      type: 'alarm',
      read: true
    },
    {
      id: 'n3',
      title: '12-Day Streak Achieved! 🔥',
      message: "Awesome consistency! You've completed your study habit 12 days in a row.",
      time: 'Yesterday',
      type: 'habit',
      read: true
    }
  ]);

  // Form State: New Reminder
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('Today');
  const [newTime, setNewTime] = useState('08:00 AM');
  const [newRepeat, setNewRepeat] = useState<'Once' | 'Daily' | 'Weekdays' | 'Weekends' | 'Weekly' | 'Monthly'>('Daily');
  const [newCategory, setNewCategory] = useState<'Health' | 'Study' | 'Work' | 'Personal' | 'Birthday' | 'Payment' | 'Fitness' | 'Shopping' | 'Other'>('Study');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('high');
  const [newLeadTime, setNewLeadTime] = useState('10 minutes before');

  // Form State: AI Reminder
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [aiParsedResult, setAiParsedResult] = useState<{ title: string; time: string; repeat: string; category: any } | null>(null);

  // Form State: New Alarm
  const [newAlarmTime, setNewAlarmTime] = useState('07:00 AM');
  const [newAlarmTitle, setNewAlarmTitle] = useState('Morning Alarm');
  const [newAlarmMath, setNewAlarmMath] = useState(true);

  // Form State: New Habit
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitIcon, setNewHabitIcon] = useState('💧');
  const [newHabitTarget, setNewHabitTarget] = useState(8);

  // Search & Filter State (All Reminders tab)
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'All' | 'Today' | 'Upcoming' | 'Completed'>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  // Calendar selected date state
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<number>(8); // August 8

  // Math Challenge State for Ringing Alarm
  const [mathAnswer, setMathAnswer] = useState('');
  const [mathError, setMathError] = useState(false);

  // Toggle Reminder Completed Handler
  const toggleReminderComplete = (id: string) => {
    setReminders(prev =>
      prev.map(r => {
        if (r.id === id) {
          const nextState = !r.completed;
          if (nextState) {
            showToast('✅ Reminder Completed! Great job staying on track 🚀');
          }
          return { ...r, completed: nextState };
        }
        return r;
      })
    );
  };

  // Add Reminder Handler
  const handleSaveReminder = () => {
    if (!newTitle.trim()) {
      showToast('⚠️ Please enter a title for your reminder');
      return;
    }
    const created: ReminderItem = {
      id: `r_${Date.now()}`,
      title: newTitle,
      time: newTime,
      date: newDate,
      category: newCategory,
      priority: newPriority,
      repeat: newRepeat,
      notificationLeadTime: newLeadTime,
      completed: false
    };
    setReminders(prev => [created, ...prev]);
    setIsCreateReminderOpen(false);
    setNewTitle('');
    showToast(`🔔 Reminder "${created.title}" scheduled!`);
  };

  // AI Extraction Simulator
  const handleAiExtract = () => {
    if (!aiPromptInput.trim()) return;
    const text = aiPromptInput.toLowerCase();
    let extractedTitle = aiPromptInput;
    let extractedTime = '07:00 PM';
    let extractedRepeat = 'Every day';
    let extractedCat: any = 'Study';

    if (text.includes('water') || text.includes('drink')) {
      extractedTitle = 'Drink Hydration Water';
      extractedCat = 'Health';
    } else if (text.includes('workout') || text.includes('exercise') || text.includes('gym')) {
      extractedTitle = 'Evening Workout';
      extractedCat = 'Fitness';
    } else if (text.includes('java') || text.includes('dsa') || text.includes('study') || text.includes('read')) {
      extractedTitle = 'Study Session';
      extractedCat = 'Study';
    }

    if (text.includes('7 pm') || text.includes('7pm')) extractedTime = '07:00 PM';
    else if (text.includes('8 am') || text.includes('8am')) extractedTime = '08:00 AM';
    else if (text.includes('10 am') || text.includes('10am')) extractedTime = '10:00 AM';

    setAiParsedResult({
      title: extractedTitle,
      time: extractedTime,
      repeat: extractedRepeat,
      category: extractedCat
    });
  };

  const handleConfirmAiReminder = () => {
    if (!aiParsedResult) return;
    const created: ReminderItem = {
      id: `r_ai_${Date.now()}`,
      title: aiParsedResult.title,
      time: aiParsedResult.time,
      date: 'Today',
      category: aiParsedResult.category,
      priority: 'high',
      repeat: 'Daily',
      notificationLeadTime: '10 minutes before',
      completed: false
    };
    setReminders(prev => [created, ...prev]);
    setIsAiReminderOpen(false);
    setAiPromptInput('');
    setAiParsedResult(null);
    showToast(`✨ Smart AI Reminder "${created.title}" Created!`);
  };

  // Add Alarm Handler
  const handleSaveAlarm = () => {
    const newAlarm: AlarmItem = {
      id: `a_${Date.now()}`,
      title: newAlarmTitle || 'Custom Alarm',
      time: newAlarmTime,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      active: true,
      sound: 'Chime Breeze',
      mathChallenge: newAlarmMath
    };
    setAlarms(prev => [...prev, newAlarm]);
    setIsAddAlarmOpen(false);
    showToast(`⏰ Alarm set for ${newAlarm.time}`);
  };

  // Add Habit Handler
  const handleSaveHabit = () => {
    if (!newHabitTitle.trim()) return;
    const newHabit: HabitItem = {
      id: `h_${Date.now()}`,
      title: newHabitTitle,
      icon: newHabitIcon,
      currentCount: 0,
      targetCount: newHabitTarget,
      unit: 'times',
      streakDays: 1,
      category: 'Personal',
      color: 'bg-purple-500'
    };
    setHabits(prev => [...prev, newHabit]);
    setIsAddHabitOpen(false);
    setNewHabitTitle('');
    showToast(`🔥 Habit "${newHabit.title}" created!`);
  };

  // Increment Habit Progress
  const handleIncrementHabit = (id: string) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id === id) {
          const next = Math.min(h.targetCount, h.currentCount + 1);
          if (next === h.targetCount) {
            showToast(`🎉 Goal Reached for ${h.title}! Streak updated!`);
          }
          return { ...h, currentCount: next };
        }
        return h;
      })
    );
  };

  // Stop Ringing Alarm (with Math check if enabled)
  const handleStopAlarm = () => {
    if (mathAnswer === '27' || mathAnswer.trim() === '') {
      setIsAlarmRingingOpen(false);
      setMathAnswer('');
      setMathError(false);
      showToast('🌅 Good Morning! Alarm Dismissed.');
    } else {
      setMathError(true);
    }
  };

  // Filtered Reminders for "All Reminders" Screen
  const filteredReminders = reminders.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || r.category === filterCategory;
    if (filterTab === 'Today') return matchesSearch && matchesCategory && r.date === 'Today';
    if (filterTab === 'Upcoming') return matchesSearch && matchesCategory && !r.completed && r.date !== 'Today';
    if (filterTab === 'Completed') return matchesSearch && matchesCategory && r.completed;
    return matchesSearch && matchesCategory;
  });

  const completedTodayCount = reminders.filter(r => r.date === 'Today' && r.completed).length;
  const totalTodayCount = reminders.filter(r => r.date === 'Today').length;
  const nextReminder = reminders.find(r => !r.completed) || reminders[0];

  const isDark = themeMode === 'dark';

  // Dynamic Theme Colors
  const bgClass = isDark ? 'bg-[#0b0f19] text-zinc-100' : 'bg-[#f8fafc] text-zinc-900';
  const cardBgClass = isDark ? 'bg-[#151c2d] border-zinc-800/80 shadow-lg' : 'bg-white border-zinc-200/80 shadow-xs';
  const subCardBgClass = isDark ? 'bg-[#1e293b]' : 'bg-zinc-50';
  const accentGradient = 'bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600';
  const textAccent = isDark ? 'text-indigo-400' : 'text-indigo-600';

  return (
    <div className={`w-full min-h-screen ${bgClass} font-sans transition-colors duration-300 flex flex-col relative`}>
      {/* GLOBAL TOAST NOTIFICATION OVERLAY */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl bg-zinc-900/95 text-white text-xs font-bold border border-indigo-500/40 shadow-2xl flex items-center gap-2.5 backdrop-blur-md animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SPLASH SCREEN MODE */}
      {activeScreen === 'splash' && (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${bgClass} p-6 text-center`}>
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30 mb-6 animate-pulse">
            <Bell className="w-12 h-12 text-white animate-wiggle" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">RemindMe</h1>
          <p className="text-sm text-zinc-400 font-medium mb-8">Never miss what matters.</p>
          <button
            onClick={() => setActiveScreen('onboarding')}
            className={`px-8 py-3.5 rounded-2xl ${accentGradient} text-white font-bold text-sm shadow-xl shadow-indigo-500/30 hover:opacity-95 transition-all cursor-pointer`}
          >
            Get Started
          </button>
        </div>
      )}

      {/* ONBOARDING SCREEN MODE */}
      {activeScreen === 'onboarding' && (
        <div className={`fixed inset-0 z-50 flex flex-col justify-between ${bgClass} p-6 max-w-md mx-auto`}>
          <div className="flex items-center justify-end">
            <button onClick={() => setActiveScreen('home')} className="text-xs font-bold text-zinc-400 hover:text-zinc-600">
              Skip
            </button>
          </div>

          <div className="flex flex-col items-center text-center my-auto">
            {onboardingStep === 0 && (
              <>
                <div className="w-28 h-28 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-6">
                  <Bell className="w-14 h-14" />
                </div>
                <h2 className="text-2xl font-black mb-3">Stay Organized</h2>
                <p className="text-xs text-zinc-400 max-w-xs">Create smart reminders for everything that matters in your daily life.</p>
              </>
            )}
            {onboardingStep === 1 && (
              <>
                <div className="w-28 h-28 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center mb-6">
                  <Clock className="w-14 h-14" />
                </div>
                <h2 className="text-2xl font-black mb-3">Never Miss a Moment</h2>
                <p className="text-xs text-zinc-400 max-w-xs">Get timely smart alerts for appointments, tasks, medicines, and important events.</p>
              </>
            )}
            {onboardingStep === 2 && (
              <>
                <div className="w-28 h-28 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6">
                  <Flame className="w-14 h-14" />
                </div>
                <h2 className="text-2xl font-black mb-3">Build Better Days</h2>
                <p className="text-xs text-zinc-400 max-w-xs">Plan your day, track habits, and stay consistent with AI productivity insights.</p>
              </>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center gap-2">
              {[0, 1, 2].map(idx => (
                <div key={idx} className={`h-2 rounded-full transition-all ${onboardingStep === idx ? 'w-8 bg-indigo-600' : 'w-2 bg-zinc-300 dark:bg-zinc-700'}`} />
              ))}
            </div>
            <button
              onClick={() => {
                if (onboardingStep < 2) setOnboardingStep(onboardingStep + 1);
                else setActiveScreen('auth');
              }}
              className={`w-full py-4 rounded-2xl ${accentGradient} text-white font-bold text-sm shadow-xl shadow-indigo-500/20 cursor-pointer`}
            >
              {onboardingStep === 2 ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {/* AUTHENTICATION SCREEN MODE */}
      {activeScreen === 'auth' && (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${bgClass} p-6`}>
          <div className={`w-full max-w-sm p-6 rounded-3xl ${cardBgClass} border shadow-2xl`}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black">Welcome to RemindMe</h2>
                <p className="text-[10px] text-zinc-400">Sign in to sync your reminders & habits</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Email / Phone</label>
                <input
                  type="text"
                  placeholder="mounika@example.com"
                  className={`w-full mt-1 p-3 rounded-xl text-xs border ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'} focus:outline-none focus:border-indigo-500`}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full mt-1 p-3 rounded-xl text-xs border ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'} focus:outline-none focus:border-indigo-500`}
                />
              </div>
            </div>

            <button
              onClick={() => setActiveScreen('home')}
              className={`w-full py-3.5 rounded-xl ${accentGradient} text-white font-bold text-xs shadow-md shadow-indigo-500/30 cursor-pointer mb-3`}
            >
              Login to RemindMe
            </button>

            <button
              onClick={() => setActiveScreen('home')}
              className="w-full py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer mb-4"
            >
              Continue as Guest
            </button>

            <p className="text-[10px] text-center text-zinc-400">
              By continuing you agree to RemindMe Terms & Privacy Policy
            </p>
          </div>
        </div>
      )}

      {/* MAIN APPLICATION FRAME (HEADER + SIDEBAR/MOBILE NAV + SCREEN VIEWPORT) */}
      {['home', 'calendar', 'reminders', 'alarms', 'habits', 'insights', 'notifications', 'profile', 'settings'].includes(activeScreen) && (
        <div className="flex flex-1 min-h-screen">
          {/* DESKTOP LEFT SIDEBAR */}
          <aside className={`hidden md:flex flex-col w-64 border-r ${isDark ? 'border-zinc-800 bg-[#121827]' : 'border-zinc-200 bg-white'} p-4 justify-between shrink-0 sticky top-0 h-screen`}>
            <div className="space-y-6">
              {/* App Brand Logo */}
              <div className="flex items-center gap-3 px-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="font-extrabold text-base tracking-tight leading-none">RemindMe</h1>
                  <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">Smart Alarm & UI</span>
                </div>
              </div>

              {/* Navigation Menu Links */}
              <nav className="space-y-1">
                {[
                  { id: 'home', label: 'Home Dashboard', icon: Home },
                  { id: 'reminders', label: 'All Reminders', icon: Bell },
                  { id: 'alarms', label: 'Smart Alarms', icon: Clock },
                  { id: 'calendar', label: 'Calendar View', icon: CalendarIcon },
                  { id: 'habits', label: 'Habit Tracker', icon: Flame },
                  { id: 'insights', label: 'Insights & Analytics', icon: TrendingUp },
                  { id: 'notifications', label: 'Notification Center', icon: Bell },
                  { id: 'settings', label: 'App Settings', icon: Settings }
                ].map(item => {
                  const IconComp = item.icon;
                  const isActive = activeScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveScreen(item.id as any)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                          : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* User Profile Footer Card */}
            <div className={`p-3 rounded-2xl ${subCardBgClass} border ${isDark ? 'border-zinc-800' : 'border-zinc-200'} flex items-center justify-between`}>
              <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveScreen('profile')}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  M
                </div>
                <div>
                  <p className="text-xs font-bold line-clamp-1">Mounika</p>
                  <p className="text-[9px] text-zinc-400">Pro Subscriber</p>
                </div>
              </div>
              <button
                onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
                className={`p-1.5 rounded-lg border ${isDark ? 'bg-zinc-800 border-zinc-700 text-amber-400' : 'bg-zinc-100 border-zinc-300 text-zinc-700'}`}
                title="Toggle Theme"
              >
                {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
            </div>
          </aside>

          {/* MAIN VIEWPORT CONTAINER */}
          <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8 overflow-y-auto">
            {/* TOP HEADER BAR */}
            <header className={`px-4 sm:px-8 py-4 border-b ${isDark ? 'border-zinc-800 bg-[#0f172a]' : 'border-zinc-200 bg-white'} flex items-center justify-between sticky top-0 z-30`}>
              <div className="flex items-center gap-3">
                <div className="md:hidden flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                    <Bell className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm tracking-tight">RemindMe</span>
                </div>
                <div className="hidden md:block">
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-zinc-400">
                    {activeScreen === 'home' && 'Home Dashboard'}
                    {activeScreen === 'reminders' && 'Reminders Directory'}
                    {activeScreen === 'alarms' && 'Smart Alarms & Wake Controls'}
                    {activeScreen === 'calendar' && 'Calendar Overview'}
                    {activeScreen === 'habits' && 'Habits & Routine Consistency'}
                    {activeScreen === 'insights' && 'Productivity Analytics'}
                    {activeScreen === 'notifications' && 'Notification Log'}
                    {activeScreen === 'profile' && 'User Account Profile'}
                    {activeScreen === 'settings' && 'App Preferences'}
                  </h2>
                </div>
              </div>

              {/* Header Right Action Buttons */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsAiReminderOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-500/20 hover:opacity-90 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                  <span className="hidden sm:inline">Create with AI</span>
                </button>

                <button
                  onClick={() => setIsAlarmRingingOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold flex items-center gap-1 hover:bg-rose-500/20 cursor-pointer"
                  title="Test Ringing Alarm Modal"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Test Alarm</span>
                </button>

                <button
                  onClick={() => setActiveScreen('notifications')}
                  className={`p-2 rounded-xl border relative ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-100 border-zinc-200'}`}
                >
                  <Bell className="w-4 h-4 text-zinc-500" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  )}
                </button>
              </div>
            </header>

            {/* VIEWPORT SCREEN CONTENTS */}
            <div className="p-4 sm:p-8 max-w-6xl w-full mx-auto space-y-8">
              {/* ====================================================
                  SCREEN 4 & 5: HOME DASHBOARD
                 ==================================================== */}
              {activeScreen === 'home' && (
                <>
                  {/* Hero Greeting & Live Clock Banner */}
                  <div className={`p-6 sm:p-8 rounded-3xl ${accentGradient} text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6`}>
                    <div className="space-y-2 relative z-10">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-purple-200 border border-white/10">
                        <span>👋 Good Morning, Mounika</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                        Ready to make today productive?
                      </h2>
                      <p className="text-xs text-purple-100 font-medium">
                        You have {reminders.filter(r => r.date === 'Today' && !r.completed).length} pending reminders and 3 active smart alarms scheduled.
                      </p>
                    </div>

                    {/* Live Clock Card */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-black/25 backdrop-blur-md border border-white/20 flex flex-col items-center text-center shrink-0 min-w-[200px]">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-purple-200">
                        {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </span>
                      <div className="text-3xl font-black tracking-tight my-1 font-mono flex items-center justify-center gap-1">
                        <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-300">
                        <Clock className="w-3 h-3 animate-spin" />
                        <span>System Sync Active</span>
                      </div>
                    </div>
                  </div>

                  {/* TODAY'S SUMMARY KPI CARDS */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className={`p-4 sm:p-5 rounded-2xl ${cardBgClass} border flex items-center justify-between`}>
                      <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Total Reminders</p>
                        <p className="text-2xl font-black mt-1">{reminders.length}</p>
                        <p className="text-[10px] text-indigo-500 font-semibold mt-1">Scheduled in app</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold">
                        <Bell className="w-5 h-5" />
                      </div>
                    </div>

                    <div className={`p-4 sm:p-5 rounded-2xl ${cardBgClass} border flex items-center justify-between`}>
                      <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Upcoming Today</p>
                        <p className="text-2xl font-black mt-1">{reminders.filter(r => r.date === 'Today' && !r.completed).length}</p>
                        <p className="text-[10px] text-amber-500 font-semibold mt-1">Action items</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                        <Clock className="w-5 h-5" />
                      </div>
                    </div>

                    <div className={`p-4 sm:p-5 rounded-2xl ${cardBgClass} border flex items-center justify-between`}>
                      <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Completed</p>
                        <p className="text-2xl font-black mt-1">{completedTodayCount} / {totalTodayCount}</p>
                        <p className="text-[10px] text-emerald-500 font-semibold mt-1">
                          {totalTodayCount > 0 ? `${Math.round((completedTodayCount / totalTodayCount) * 100)}% done today` : '100% complete'}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    </div>

                    <div className={`p-4 sm:p-5 rounded-2xl ${cardBgClass} border flex items-center justify-between`}>
                      <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Habit Streak</p>
                        <p className="text-2xl font-black mt-1">12 Days 🔥</p>
                        <p className="text-[10px] text-purple-500 font-semibold mt-1">Personal Best: 28</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
                        <Flame className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* SCREEN 5: HIGHLIGHTED NEXT REMINDER CARD WITH COUNTDOWN */}
                  {nextReminder && (
                    <div className={`p-6 rounded-3xl ${cardBgClass} border-2 border-indigo-500/30 relative overflow-hidden`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
                            {nextReminder.category === 'Health' && '💊'}
                            {nextReminder.category === 'Study' && '📚'}
                            {nextReminder.category === 'Work' && '💼'}
                            {nextReminder.category === 'Fitness' && '🏃'}
                            {nextReminder.category === 'Personal' && '🏠'}
                            {nextReminder.category === 'Birthday' && '🎂'}
                            {nextReminder.category === 'Payment' && '💰'}
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">
                              Next Highlighted Reminder
                            </span>
                            <h3 className="text-lg font-black">{nextReminder.title}</h3>
                            <p className="text-xs text-zinc-400 font-semibold mt-0.5">
                              {nextReminder.date} · {nextReminder.time} ({nextReminder.repeat})
                            </p>
                          </div>
                        </div>

                        {/* Countdown Badge */}
                        <div className="px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center gap-2 self-start md:self-auto">
                          <Clock className="w-4 h-4 animate-pulse" />
                          <span>09h 18m remaining</span>
                        </div>
                      </div>

                      {/* Quick Action Buttons */}
                      <div className="flex items-center gap-3 pt-3 border-t border-zinc-200/60 dark:border-zinc-800">
                        <button
                          onClick={() => toggleReminderComplete(nextReminder.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-700 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Mark Done</span>
                        </button>
                        <button
                          onClick={() => showToast('⏰ Reminder Snoozed for 15 minutes')}
                          className="px-4 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-xs font-bold hover:bg-zinc-300 dark:hover:bg-zinc-700 cursor-pointer"
                        >
                          Snooze (15m)
                        </button>
                        <button
                          onClick={() => setSelectedReminderDetail(nextReminder)}
                          className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer ml-auto"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SCREEN 6: TODAY'S REMINDERS TIMELINE */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-extrabold flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-500" />
                        <span>Today's Reminders Timeline</span>
                      </h3>
                      <button
                        onClick={() => setIsCreateReminderOpen(true)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-indigo-700 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add New</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {reminders.filter(r => r.date === 'Today').map(reminder => (
                        <div
                          key={reminder.id}
                          className={`p-4 rounded-2xl ${cardBgClass} border flex items-center justify-between gap-4 transition-all hover:scale-[1.01] ${
                            reminder.completed ? 'opacity-60 bg-emerald-500/5 border-emerald-500/30' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            {/* Checkbox Trigger */}
                            <button
                              onClick={() => toggleReminderComplete(reminder.id)}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                                reminder.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-zinc-400 hover:border-indigo-500'
                              }`}
                            >
                              {reminder.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </button>

                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className={`text-xs font-extrabold ${reminder.completed ? 'line-through text-zinc-400' : ''}`}>
                                  {reminder.title}
                                </h4>
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                                    reminder.priority === 'high'
                                      ? 'bg-rose-500/10 text-rose-500'
                                      : reminder.priority === 'medium'
                                      ? 'bg-amber-500/10 text-amber-500'
                                      : 'bg-zinc-500/10 text-zinc-500'
                                  }`}
                                >
                                  {reminder.priority}
                                </span>
                              </div>
                              <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                                ⏰ {reminder.time} · {reminder.category} ({reminder.repeat})
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => setSelectedReminderDetail(reminder)}
                              className="p-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-400 hover:text-zinc-800 dark:hover:text-white cursor-pointer"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ====================================================
                  SCREEN 12: ALL REMINDERS DIRECTORY & FILTERS
                 ==================================================== */}
              {activeScreen === 'reminders' && (
                <div className="space-y-6">
                  {/* Search Bar & Filter Controls */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-80">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search reminders..."
                        className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs border ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'} focus:outline-none focus:border-indigo-500`}
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                      {(['All', 'Today', 'Upcoming', 'Completed'] as const).map(tab => (
                        <button
                          key={tab}
                          onClick={() => setFilterTab(tab)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all whitespace-nowrap ${
                            filterTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {['All', 'Health', 'Study', 'Work', 'Personal', 'Fitness', 'Payment', 'Birthday'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold cursor-pointer transition-all whitespace-nowrap border ${
                          filterCategory === cat ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/40' : 'border-zinc-300 dark:border-zinc-700 text-zinc-500'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Reminders List */}
                  <div className="space-y-3">
                    {filteredReminders.length === 0 ? (
                      /* SCREEN 22: BEAUTIFUL EMPTY STATE */
                      <div className={`p-12 rounded-3xl ${cardBgClass} border text-center space-y-3`}>
                        <div className="w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center mx-auto">
                          <Bell className="w-8 h-8" />
                        </div>
                        <h3 className="text-base font-extrabold">Your day is clear!</h3>
                        <p className="text-xs text-zinc-400 max-w-xs mx-auto">Create a reminder so you don't forget something important.</p>
                        <button
                          onClick={() => setIsCreateReminderOpen(true)}
                          className="px-6 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-bold cursor-pointer"
                        >
                          + Create Reminder
                        </button>
                      </div>
                    ) : (
                      filteredReminders.map(reminder => (
                        <div
                          key={reminder.id}
                          className={`p-4 rounded-2xl ${cardBgClass} border flex items-center justify-between gap-4 transition-all hover:scale-[1.005]`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <button
                              onClick={() => toggleReminderComplete(reminder.id)}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer ${
                                reminder.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-zinc-400'
                              }`}
                            >
                              {reminder.completed && <Check className="w-3.5 h-3.5" />}
                            </button>
                            <div>
                              <h4 className={`text-xs font-extrabold ${reminder.completed ? 'line-through text-zinc-400' : ''}`}>
                                {reminder.title}
                              </h4>
                              <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                                {reminder.date} · {reminder.time} · {reminder.category} ({reminder.repeat})
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setReminders(prev => prev.filter(r => r.id !== reminder.id));
                                showToast('🗑️ Reminder deleted');
                              }}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setSelectedReminderDetail(reminder)}
                              className="px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ====================================================
                  SCREEN 9: SMART ALARM SECTION
                 ==================================================== */}
              {activeScreen === 'alarms' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold">Smart Alarms & Wake Controls</h3>
                      <p className="text-xs text-zinc-400">Configure morning wake-up alarms with gentle chime or math challenges.</p>
                    </div>
                    <button
                      onClick={() => setIsAddAlarmOpen(true)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Alarm</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {alarms.map(alarm => (
                      <div key={alarm.id} className={`p-6 rounded-3xl ${cardBgClass} border flex items-center justify-between`}>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-3xl font-black font-mono tracking-tight">{alarm.time}</span>
                            {alarm.mathChallenge && (
                              <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-500 text-[9px] font-bold">
                                🧮 Math Lock
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold">{alarm.title}</h4>
                          <p className="text-[10px] text-zinc-400 font-semibold">
                            Repeat: {alarm.days.join(', ')} · Sound: {alarm.sound}
                          </p>
                        </div>

                        {/* Toggle Active Switch */}
                        <button
                          onClick={() => {
                            setAlarms(prev =>
                              prev.map(a => (a.id === alarm.id ? { ...a, active: !a.active } : a))
                            );
                            showToast(`Alarm ${alarm.title} ${!alarm.active ? 'Activated' : 'Disabled'}`);
                          }}
                          className={`w-12 h-6 rounded-full transition-all relative p-1 cursor-pointer ${
                            alarm.active ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-all transform ${
                              alarm.active ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ====================================================
                  SCREEN 11: CALENDAR VIEW
                 ==================================================== */}
              {activeScreen === 'calendar' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold">August 2026 Reminders Calendar</h3>
                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-xs font-bold">
                      <span className="px-3 py-1 bg-white dark:bg-zinc-700 rounded-lg shadow-xs">Month</span>
                      <span className="px-3 py-1 text-zinc-500 cursor-pointer">Week</span>
                      <span className="px-3 py-1 text-zinc-500 cursor-pointer">Day</span>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className={`p-6 rounded-3xl ${cardBgClass} border`}>
                    <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-zinc-400 mb-4 uppercase">
                      <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(dayNum => {
                        const isSelected = selectedCalendarDate === dayNum;
                        const hasReminders = dayNum === 8 || dayNum === 9 || dayNum === 15;
                        return (
                          <div
                            key={dayNum}
                            onClick={() => setSelectedCalendarDate(dayNum)}
                            className={`p-3 rounded-2xl border text-center cursor-pointer transition-all flex flex-col items-center justify-between min-h-[70px] ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg'
                                : isDark
                                ? 'bg-zinc-850 border-zinc-800 hover:border-zinc-700'
                                : 'bg-zinc-50 border-zinc-200 hover:border-indigo-300'
                            }`}
                          >
                            <span className="text-xs font-black">{dayNum}</span>
                            {hasReminders && (
                              <div className="flex items-center gap-1 mt-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-500'}`} />
                                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-purple-200' : 'bg-purple-500'}`} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Scheduled Reminders for Selected Date */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Scheduled for August {selectedCalendarDate}, 2026
                    </h4>
                    {reminders.slice(0, 3).map(r => (
                      <div key={r.id} className={`p-4 rounded-2xl ${cardBgClass} border flex items-center justify-between`}>
                        <div className="flex items-center gap-3">
                          <span className="text-lg">
                            {r.category === 'Health' ? '💊' : r.category === 'Study' ? '📚' : '💼'}
                          </span>
                          <div>
                            <h5 className="text-xs font-bold">{r.title}</h5>
                            <p className="text-[10px] text-zinc-400 font-semibold">{r.time} · {r.category}</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-xl bg-indigo-500/10 text-indigo-500 text-[10px] font-bold">
                          Scheduled
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ====================================================
                  SCREEN 13: HABIT TRACKER
                 ==================================================== */}
              {activeScreen === 'habits' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold">My Habits & Daily Consistency</h3>
                      <p className="text-xs text-zinc-400">Build long-term positive routines with streak tracking.</p>
                    </div>
                    <button
                      onClick={() => setIsAddHabitOpen(true)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Habit</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {habits.map(habit => (
                      <div key={habit.id} className={`p-6 rounded-3xl ${cardBgClass} border space-y-4`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-2xl">
                              {habit.icon}
                            </div>
                            <div>
                              <h4 className="text-xs font-extrabold">{habit.title}</h4>
                              <p className="text-[10px] text-zinc-400 font-semibold">
                                {habit.currentCount} / {habit.targetCount} {habit.unit}
                              </p>
                            </div>
                          </div>

                          <div className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 fill-amber-500" />
                            <span>{habit.streakDays} Days</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1.5">
                          <div className="w-full h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                              style={{ width: `${(habit.currentCount / habit.targetCount) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-[10px] text-zinc-400 font-semibold">Daily Goal Progress</span>
                          <button
                            onClick={() => handleIncrementHabit(habit.id)}
                            className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer"
                          >
                            + Log Progress
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ====================================================
                  SCREEN 15: INSIGHTS & PRODUCTIVITY DASHBOARD
                 ==================================================== */}
              {activeScreen === 'insights' && (
                <div className="space-y-6">
                  {/* Productivity Insight Banner */}
                  <div className={`p-6 rounded-3xl ${accentGradient} text-white shadow-xl flex items-center gap-4`}>
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-purple-200">AI Productivity Insight</h3>
                      <p className="text-base font-extrabold mt-0.5">
                        "You are 42% most productive between 6:00 PM and 9:00 PM."
                      </p>
                      <p className="text-xs text-purple-100 mt-1">
                        Your study and fitness completion rates peak during evening hours. Keep up the high focus momentum!
                      </p>
                    </div>
                  </div>

                  {/* Productivity Metrics */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className={`p-5 rounded-2xl ${cardBgClass} border`}>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase">Completion Rate</p>
                      <p className="text-2xl font-black mt-1 text-indigo-500">82%</p>
                      <p className="text-[10px] text-zinc-400 mt-1">+4.2% vs last week</p>
                    </div>
                    <div className={`p-5 rounded-2xl ${cardBgClass} border`}>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase">Reminders Completed</p>
                      <p className="text-2xl font-black mt-1 text-emerald-500">124</p>
                      <p className="text-[10px] text-zinc-400 mt-1">Total tasks done</p>
                    </div>
                    <div className={`p-5 rounded-2xl ${cardBgClass} border`}>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase">Current Streak</p>
                      <p className="text-2xl font-black mt-1 text-amber-500">12 Days 🔥</p>
                      <p className="text-[10px] text-zinc-400 mt-1">Active habit streak</p>
                    </div>
                    <div className={`p-5 rounded-2xl ${cardBgClass} border`}>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase">Best Record</p>
                      <p className="text-2xl font-black mt-1 text-purple-500">28 Days 🔥</p>
                      <p className="text-[10px] text-zinc-400 mt-1">Personal best high score</p>
                    </div>
                  </div>

                  {/* Weekly Productivity Visual Bars */}
                  <div className={`p-6 rounded-3xl ${cardBgClass} border space-y-4`}>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">Weekly Task Completion Breakdown</h4>
                    <div className="flex items-end justify-between gap-3 h-44 pt-6">
                      {[
                        { day: 'Mon', count: 8, height: '80%' },
                        { day: 'Tue', count: 6, height: '60%' },
                        { day: 'Wed', count: 9, height: '90%' },
                        { day: 'Thu', count: 7, height: '70%' },
                        { day: 'Fri', count: 10, height: '100%' },
                        { day: 'Sat', count: 5, height: '50%' },
                        { day: 'Sun', count: 4, height: '40%' }
                      ].map(item => (
                        <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                          <span className="text-[10px] font-bold text-zinc-400">{item.count}</span>
                          <div className="w-full rounded-t-xl bg-gradient-to-t from-indigo-600 to-purple-500" style={{ height: item.height }} />
                          <span className="text-[10px] font-extrabold">{item.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ====================================================
                  SCREEN 14: NOTIFICATION CENTER
                 ==================================================== */}
              {activeScreen === 'notifications' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold">Notification Center Log</h3>
                    <button
                      onClick={() => {
                        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                        showToast('All notifications marked as read');
                      }}
                      className="text-xs font-bold text-indigo-500 hover:underline"
                    >
                      Mark All as Read
                    </button>
                  </div>

                  <div className="space-y-3">
                    {notifications.map(notif => (
                      <div
                        key={notif.id}
                        className={`p-4 rounded-2xl ${cardBgClass} border flex items-center justify-between ${
                          !notif.read ? 'border-l-4 border-l-indigo-500 bg-indigo-500/5' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                            <Bell className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold">{notif.title}</h4>
                            <p className="text-[11px] text-zinc-400 mt-0.5">{notif.message}</p>
                            <span className="text-[9px] text-zinc-400 font-semibold">{notif.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ====================================================
                  SCREEN 18 & 19: PROFILE & SETTINGS
                 ==================================================== */}
              {(activeScreen === 'profile' || activeScreen === 'settings') && (
                <div className="space-y-6">
                  {/* User Profile Banner */}
                  <div className={`p-6 rounded-3xl ${cardBgClass} border flex items-center gap-4`}>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-black">
                      M
                    </div>
                    <div>
                      <h3 className="text-lg font-black">Mounika</h3>
                      <p className="text-xs text-zinc-400">mounika@example.com · Premium Account</p>
                      <span className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                        🟢 Cloud Sync Active
                      </span>
                    </div>
                  </div>

                  {/* Settings Sections */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">App Preferences</h4>
                    {[
                      { title: 'Enable Local Notifications', sub: 'Receive push alerts at reminder lead times', default: true },
                      { title: 'Smart AI Suggestions', sub: 'Allow AI to auto-extract titles and schedule times', default: true },
                      { title: 'Alarm Math Challenge Lock', sub: 'Require solving simple math equation to dismiss morning alarm', default: true },
                      { title: 'Gradual Alarm Volume Ramping', sub: 'Increase volume gently over 30 seconds', default: false }
                    ].map((setting, idx) => (
                      <div key={idx} className={`p-4 rounded-2xl ${cardBgClass} border flex items-center justify-between`}>
                        <div>
                          <h5 className="text-xs font-bold">{setting.title}</h5>
                          <p className="text-[10px] text-zinc-400">{setting.sub}</p>
                        </div>
                        <div className="w-10 h-5 rounded-full bg-indigo-600 relative p-0.5 cursor-pointer">
                          <div className="w-4 h-4 rounded-full bg-white translate-x-5 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-40 ${isDark ? 'bg-[#0f172a] border-zinc-800' : 'bg-white border-zinc-200'} border-t px-4 py-2 flex items-center justify-around`}>
        {[
          { id: 'home', label: 'Home', icon: Home },
          { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
          { id: 'reminders', label: 'Reminders', icon: Bell },
          { id: 'insights', label: 'Insights', icon: TrendingUp },
          { id: 'profile', label: 'Profile', icon: User }
        ].map(tab => {
          const IconComp = tab.icon;
          const active = activeScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveScreen(tab.id as any)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all cursor-pointer ${
                active ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-zinc-500'
              }`}
            >
              <IconComp className="w-5 h-5" />
              <span className="text-[9px]">{tab.label}</span>
            </button>
          );
        })}

        {/* PROMINENT MOBILE FLOATING + BUTTON */}
        <button
          onClick={() => setIsCreateReminderOpen(true)}
          className={`w-12 h-12 rounded-full ${accentGradient} text-white flex items-center justify-center shadow-xl shadow-indigo-500/40 -mt-6 cursor-pointer`}
          title="Create Reminder"
        >
          <Plus className="w-6 h-6" />
        </button>
      </nav>

      {/* ====================================================
          SCREEN 7: CREATE REMINDER MODAL / BOTTOM SHEET
         ==================================================== */}
      {isCreateReminderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className={`w-full max-w-lg p-6 rounded-3xl ${cardBgClass} border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-500" />
                <span>Create New Reminder</span>
              </h3>
              <button onClick={() => setIsCreateReminderOpen(false)} className="p-1 text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Reminder Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="What do you want to remember?"
                  className={`w-full mt-1 p-3 rounded-xl text-xs border ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'} focus:outline-none focus:border-indigo-500`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Date</label>
                  <select
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className={`w-full mt-1 p-3 rounded-xl text-xs border ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                  >
                    <option value="Today">Today</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="Custom Date">Custom Date</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Time Picker</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    placeholder="08:00 AM"
                    className={`w-full mt-1 p-3 rounded-xl text-xs border ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Repeat Frequency</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {(['Once', 'Daily', 'Weekdays', 'Weekends', 'Weekly', 'Monthly'] as const).map(rep => (
                    <button
                      key={rep}
                      onClick={() => setNewRepeat(rep)}
                      className={`p-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                        newRepeat === rep ? 'bg-indigo-600 text-white border-indigo-600' : 'border-zinc-300 dark:border-zinc-700'
                      }`}
                    >
                      {rep}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Category Icon</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {[
                    { id: 'Health', label: '💊 Health' },
                    { id: 'Study', label: '📚 Study' },
                    { id: 'Work', label: '💼 Work' },
                    { id: 'Personal', label: '🏠 Personal' },
                    { id: 'Birthday', label: '🎂 Birthday' },
                    { id: 'Payment', label: '💰 Payment' },
                    { id: 'Fitness', label: '🏃 Fitness' },
                    { id: 'Shopping', label: '🛒 Shopping' },
                    { id: 'Other', label: '📌 Other' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setNewCategory(cat.id as any)}
                      className={`p-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                        newCategory === cat.id ? 'bg-indigo-600 text-white border-indigo-600' : 'border-zinc-300 dark:border-zinc-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Priority Level</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {(['low', 'medium', 'high'] as const).map(prio => (
                    <button
                      key={prio}
                      onClick={() => setNewPriority(prio)}
                      className={`p-2 rounded-xl text-[10px] font-bold border transition-all uppercase cursor-pointer ${
                        newPriority === prio ? 'bg-indigo-600 text-white border-indigo-600' : 'border-zinc-300 dark:border-zinc-700'
                      }`}
                    >
                      {prio}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveReminder}
              className={`w-full py-3.5 rounded-2xl ${accentGradient} text-white font-bold text-xs shadow-xl shadow-indigo-500/30 cursor-pointer mt-4`}
            >
              Save Reminder
            </button>
          </div>
        </div>
      )}

      {/* ====================================================
          SCREEN 8: SMART AI REMINDER CREATION MODAL
         ==================================================== */}
      {isAiReminderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-md p-6 rounded-3xl ${cardBgClass} border shadow-2xl space-y-4`}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
                <span>✨ Create with AI Assistant</span>
              </h3>
              <button onClick={() => setIsAiReminderOpen(false)} className="p-1 text-zinc-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Type naturally e.g., <span className="italic text-indigo-400">"Remind me to study Java every evening at 7 PM"</span>
            </p>

            <textarea
              rows={3}
              value={aiPromptInput}
              onChange={e => setAiPromptInput(e.target.value)}
              placeholder="What do you need to do?"
              className={`w-full p-3 rounded-xl text-xs border ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'} focus:outline-none focus:border-indigo-500`}
            />

            {!aiParsedResult ? (
              <button
                onClick={handleAiExtract}
                className={`w-full py-3.5 rounded-2xl ${accentGradient} text-white font-bold text-xs shadow-xl cursor-pointer`}
              >
                Extract Reminder Info
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-2 text-xs">
                <p className="font-bold text-indigo-400 uppercase tracking-widest text-[9px]">Does this look correct?</p>
                <p><strong>Title:</strong> {aiParsedResult.title}</p>
                <p><strong>Time:</strong> {aiParsedResult.time}</p>
                <p><strong>Repeat:</strong> {aiParsedResult.repeat}</p>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={handleConfirmAiReminder}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold cursor-pointer"
                  >
                    Confirm & Save
                  </button>
                  <button
                    onClick={() => setAiParsedResult(null)}
                    className="py-2 px-3 rounded-xl border font-bold cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================
          SCREEN 10: ALARM RINGING SCREEN (FULLSCREEN MODAL)
         ==================================================== */}
      {isAlarmRingingOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-gradient-to-b from-indigo-950 via-purple-950 to-black text-white animate-fadeIn">
          <div className="text-center space-y-2 mt-8">
            <div className="w-20 h-20 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto animate-bounce">
              <Clock className="w-10 h-10" />
            </div>
            <h2 className="text-5xl font-black font-mono tracking-tight my-4">06:30 AM</h2>
            <h3 className="text-xl font-extrabold text-amber-300">Good Morning! 🌅</h3>
            <p className="text-xs text-purple-200">Time to wake up, conquer your goals & log your habits!</p>
          </div>

          {/* Math Challenge Lock Box */}
          <div className="w-full max-w-sm p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-center space-y-3">
            <p className="text-xs font-bold text-purple-200">🧮 Solve Math Problem to Stop Alarm:</p>
            <p className="text-2xl font-black tracking-widest font-mono">12 + 15 = ?</p>
            <input
              type="text"
              value={mathAnswer}
              onChange={e => {
                setMathAnswer(e.target.value);
                setMathError(false);
              }}
              placeholder="Enter answer (27)"
              className="w-full p-3 rounded-xl bg-black/40 border border-white/30 text-center text-sm font-bold focus:outline-none"
            />
            {mathError && <p className="text-xs text-rose-400 font-bold">Incorrect answer! Try again.</p>}
          </div>

          {/* Stop & Snooze Buttons */}
          <div className="w-full max-w-sm space-y-3 mb-8">
            <button
              onClick={handleStopAlarm}
              className="w-full py-4 rounded-2xl bg-rose-600 text-white font-extrabold text-sm shadow-2xl shadow-rose-600/40 cursor-pointer"
            >
              DISMISS ALARM
            </button>
            <button
              onClick={() => {
                setIsAlarmRingingOpen(false);
                showToast('⏰ Alarm Snoozed for 10 minutes');
              }}
              className="w-full py-3 rounded-2xl bg-white/10 backdrop-blur-md text-xs font-bold hover:bg-white/20 cursor-pointer"
            >
              Snooze (10 min)
            </button>
          </div>
        </div>
      )}

      {/* ADD ALARM MODAL */}
      {isAddAlarmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-sm p-6 rounded-3xl ${cardBgClass} border shadow-2xl space-y-4`}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black">Set New Smart Alarm</h3>
              <button onClick={() => setIsAddAlarmOpen(false)} className="p-1 text-zinc-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Alarm Title</label>
              <input
                type="text"
                value={newAlarmTitle}
                onChange={e => setNewAlarmTitle(e.target.value)}
                className={`w-full mt-1 p-3 rounded-xl text-xs border ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Alarm Time</label>
              <input
                type="text"
                value={newAlarmTime}
                onChange={e => setNewAlarmTime(e.target.value)}
                className={`w-full mt-1 p-3 rounded-xl text-xs border ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
              />
            </div>
            <button
              onClick={handleSaveAlarm}
              className={`w-full py-3.5 rounded-2xl ${accentGradient} text-white font-bold text-xs cursor-pointer`}
            >
              Save Alarm
            </button>
          </div>
        </div>
      )}

      {/* ADD HABIT MODAL */}
      {isAddHabitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-sm p-6 rounded-3xl ${cardBgClass} border shadow-2xl space-y-4`}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black">Add New Daily Habit</h3>
              <button onClick={() => setIsAddHabitOpen(false)} className="p-1 text-zinc-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Habit Title</label>
              <input
                type="text"
                value={newHabitTitle}
                onChange={e => setNewHabitTitle(e.target.value)}
                placeholder="e.g. Read 15 mins"
                className={`w-full mt-1 p-3 rounded-xl text-xs border ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Habit Emoji Icon</label>
              <input
                type="text"
                value={newHabitIcon}
                onChange={e => setNewHabitIcon(e.target.value)}
                placeholder="💧"
                className={`w-full mt-1 p-3 rounded-xl text-xs border ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
              />
            </div>
            <button
              onClick={handleSaveHabit}
              className={`w-full py-3.5 rounded-2xl ${accentGradient} text-white font-bold text-xs cursor-pointer`}
            >
              Create Habit
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 16: REMINDER DETAILS MODAL */}
      {selectedReminderDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-md p-6 rounded-3xl ${cardBgClass} border shadow-2xl space-y-4`}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black">Reminder Details</h3>
              <button onClick={() => setSelectedReminderDetail(null)} className="p-1 text-zinc-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="text-lg font-black text-indigo-500">{selectedReminderDetail.title}</h4>
              <p><strong>Date:</strong> {selectedReminderDetail.date}</p>
              <p><strong>Time:</strong> {selectedReminderDetail.time}</p>
              <p><strong>Repeat:</strong> {selectedReminderDetail.repeat}</p>
              <p><strong>Category:</strong> {selectedReminderDetail.category}</p>
              <p><strong>Priority:</strong> <span className="uppercase">{selectedReminderDetail.priority}</span></p>
              <p><strong>Notification:</strong> {selectedReminderDetail.notificationLeadTime}</p>
              {selectedReminderDetail.notes && <p className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-[11px] text-zinc-400">Notes: {selectedReminderDetail.notes}</p>}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  toggleReminderComplete(selectedReminderDetail.id);
                  setSelectedReminderDetail(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer"
              >
                Mark Complete
              </button>
              <button
                onClick={() => {
                  setReminders(prev => prev.filter(r => r.id !== selectedReminderDetail.id));
                  setSelectedReminderDetail(null);
                  showToast('🗑️ Reminder deleted');
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-500/10 text-rose-500 font-bold text-xs cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default RemindMeApp;
