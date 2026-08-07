import { DynamicUISchema, PresetTemplate } from '../types';

export const DEMO_BURN_RATE_SCHEMA: DynamicUISchema = {
  id: 'demo_burn_rate',
  title: "Startup Burn Rate & Runway Command Center",
  description: "Real-time visibility into monthly cash burn, expense allocations, and interactive runway projections based on headcount and marketing spend.",
  category: "Financial",
  theme: {
    accentColor: "emerald",
    style: "modern"
  },
  generatedPrompt: "Set up a dashboard to track my startup's burn rate, monthly expenses, cash runway, and headcount costs with interactive sliders.",
  metrics: [
    {
      id: 'm1',
      label: "Cash Runway",
      value: "14.2 Months",
      change: "+1.5 mos vs Q1",
      trend: "up",
      subtext: "At current net burn rate",
      format: "text",
      sparkline: [10, 11, 12, 11.5, 13, 14.2]
    },
    {
      id: 'm2',
      label: "Total Bank Balance",
      value: 1850000,
      change: "-$120K this mo",
      trend: "neutral",
      subtext: "Across SVB & Mercury accounts",
      format: "currency",
      sparkline: [2500000, 2380000, 2240000, 2100000, 1970000, 1850000]
    },
    {
      id: 'm3',
      label: "Monthly Net Burn",
      value: 130000,
      change: "-8.5% YoY",
      trend: "up",
      subtext: "Gross Burn $195K | Revenue $65K",
      format: "currency",
      sparkline: [160000, 155000, 148000, 142000, 138000, 130000]
    },
    {
      id: 'm4',
      label: "Gross Profit Margin",
      value: "78.4%",
      change: "+3.2%",
      trend: "up",
      subtext: "SaaS revenue growth on track",
      format: "percentage",
      sparkline: [70, 72, 74, 75, 77, 78.4]
    }
  ],
  initialState: {
    headcount: 12,
    avgSalary: 11000,
    marketingBudget: 25000,
    serverCost: 12000
  },
  layout: [
    {
      id: 'sec_1',
      title: "Runway Projections & Burn Dynamics",
      gridCols: 2,
      components: [
        {
          id: 'comp_chart_runway',
          type: 'chart',
          chartType: 'area',
          title: "12-Month Cash Reserve & Burn Trajectory",
          subtitle: "Historical bank reserves (USD) and projected 6-month trajectory",
          xAxisKey: "month",
          dataKeys: [
            { key: "cashReserve", name: "Cash Reserve ($)", color: "#10b981", fillOpacity: 0.2 },
            { key: "netBurn", name: "Net Monthly Burn ($)", color: "#f43f5e", fillOpacity: 0.1 }
          ],
          data: [
            { month: "Jan", cashReserve: 2500000, netBurn: 160000, revenue: 45000 },
            { month: "Feb", cashReserve: 2380000, netBurn: 155000, revenue: 48000 },
            { month: "Mar", cashReserve: 2240000, netBurn: 148000, revenue: 52000 },
            { month: "Apr", cashReserve: 2100000, netBurn: 142000, revenue: 56000 },
            { month: "May", cashReserve: 1970000, netBurn: 138000, revenue: 60000 },
            { month: "Jun (Now)", cashReserve: 1850000, netBurn: 130000, revenue: 65000 },
            { month: "Jul (Proj)", cashReserve: 1720000, netBurn: 128000, revenue: 70000 },
            { month: "Aug (Proj)", cashReserve: 1590000, netBurn: 125000, revenue: 76000 },
            { month: "Sep (Proj)", cashReserve: 1460000, netBurn: 120000, revenue: 82000 }
          ],
          grid: true
        },
        {
          id: 'comp_calculator_headcount',
          type: 'calculator',
          title: "Runway Scenario Simulator",
          description: "Adjust hiring plans and spend to instantly calculate new cash runway",
          inputs: [
            { id: 'headcount', label: "Team Size (Engineers & GTM)", value: 12, min: 5, max: 35, step: 1, unit: "people" },
            { id: 'avgSalary', label: "Avg Monthly Cost per Hire ($)", value: 11000, min: 5000, max: 25000, step: 1000, unit: "$" },
            { id: 'marketingBudget', label: "Monthly Marketing Spend ($)", value: 25000, min: 5000, max: 100000, step: 5000, unit: "$" },
            { id: 'serverCost', label: "Cloud Infra & Tooling ($)", value: 12000, min: 2000, max: 50000, step: 1000, unit: "$" }
          ],
          outputs: [
            { id: 'totalExp', label: "Simulated Monthly Expense", formulaDescription: "(Team * Salary) + Marketing + Infra", format: "currency", calculatedValue: 169000, formula: "(headcount * avgSalary) + marketingBudget + serverCost" },
            { id: 'simRunway', label: "Simulated Cash Runway", formulaDescription: "$1,850,000 / (Simulated Expense - Revenue)", format: "number", calculatedValue: 17.8, multiplier: 1, formula: "1850000 / (((headcount * avgSalary) + marketingBudget + serverCost) - 65000)" }
          ]
        }
      ]
    },
    {
      id: 'sec_2',
      title: "Monthly Expense Breakdown & Log",
      gridCols: 2,
      components: [
        {
          id: 'comp_chart_expense_pie',
          type: 'chart',
          chartType: 'pie',
          title: "Expense Breakdown by Department",
          subtitle: "Percentage allocation of $195,000 gross monthly spend",
          dataKeys: [
            { key: "value", name: "Spend ($)", color: "#10b981" }
          ],
          data: [
            { name: "Engineering & R&D", value: 95000, color: "#6366f1" },
            { name: "Sales & Marketing", value: 45000, color: "#ec4899" },
            { name: "Cloud & Infrastructure", value: 22000, color: "#06b6d4" },
            { name: "Operations & Legal", value: 18000, color: "#f59e0b" },
            { name: "SaaS Tools & Office", value: 15000, color: "#8b5cf6" }
          ]
        },
        {
          id: 'comp_alert_runway',
          type: 'alert',
          title: "Runway Health Advisory",
          severity: "success",
          message: "Current runway exceeds Series A investor threshold (>12 months). Series A fundraising timeline suggested for Q1 next year.",
          timestamp: "Updated 2 mins ago",
          actionLabel: "Export Deck Summary"
        }
      ]
    },
    {
      id: 'sec_3',
      title: "Vendor & Expense Ledger",
      gridCols: 1,
      components: [
        {
          id: 'comp_table_vendors',
          type: 'table',
          title: "Recurring Monthly Vendor Expenses",
          description: "Active vendor subscriptions and infrastructure line items",
          searchable: true,
          exportable: true,
          columns: [
            { key: "vendor", label: "Vendor / Service", type: "text" },
            { key: "category", label: "Category", type: "badge", badgeColorMap: { "Infrastructure": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20", "Payroll": "bg-indigo-500/10 text-indigo-400 border-indigo-500/20", "Marketing": "bg-pink-500/10 text-pink-400 border-pink-500/20", "Software": "bg-purple-500/10 text-purple-400 border-purple-500/20" } },
            { key: "amount", label: "Monthly Cost ($)", type: "currency" },
            { key: "status", label: "Approval Status", type: "badge", badgeColorMap: { "Approved": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", "Pending Review": "bg-amber-500/10 text-amber-400 border-amber-500/20" } },
            { key: "owner", label: "Department Lead", type: "text" }
          ],
          data: [
            { vendor: "Gusto Payroll & Benefits", category: "Payroll", amount: 132000, status: "Approved", owner: "HR / Operations" },
            { vendor: "Google Cloud / GCP", category: "Infrastructure", amount: 14500, status: "Approved", owner: "DevOps Lead" },
            { vendor: "AWS Cloud Infrastructure", category: "Infrastructure", amount: 7500, status: "Approved", owner: "VP Engineering" },
            { vendor: "LinkedIn & Meta Ad Campaigns", category: "Marketing", amount: 25000, status: "Approved", owner: "Growth Marketer" },
            { vendor: "HubSpot & Salesforce CRM", category: "Software", amount: 4200, status: "Approved", owner: "Head of Sales" },
            { vendor: "Notion & Slack Enterprise", category: "Software", amount: 1800, status: "Pending Review", owner: "Office Manager" }
          ],
          actionButtons: [
            { id: "add_exp", label: "Add Expense Line", icon: "Plus", action: "add_row" },
            { id: "audit_vendors", label: "Audit Vendor Contracts", icon: "FileText", action: "trigger_workflow" }
          ]
        }
      ]
    }
  ],
  workflows: [
    {
      id: 'wf_1',
      name: "Runway Alert (<10 Months)",
      trigger: "Runway drops below 10 months threshold",
      actionType: "email_alert",
      status: "active",
      lastRun: "Today at 09:00 AM"
    },
    {
      id: 'wf_2',
      name: "Monthly Financial Digest to Investors",
      trigger: "1st of every month",
      actionType: "export",
      status: "active",
      lastRun: "Aug 1, 2026"
    }
  ]
};

export const SAAS_MRR_SCHEMA: DynamicUISchema = {
  id: 'saas_mrr',
  title: "SaaS MRR & Customer Churn Control Panel",
  description: "Track monthly recurring revenue, active subscription tiers, churn rate benchmarks, and expansion MRR forecasts.",
  category: "Sales & SaaS",
  theme: { accentColor: "indigo", style: "modern" },
  generatedPrompt: "Create a SaaS metrics dashboard tracking Monthly Recurring Revenue (MRR), Customer Churn Rate, ARPU, and user tier breakdown with interactive growth projections.",
  metrics: [
    { id: 'm1', label: "Monthly Recurring Revenue", value: 84500, change: "+14.2% MoM", trend: "up", subtext: "ARR Run Rate: $1.01M", format: "currency", sparkline: [58000, 62000, 69000, 74000, 79000, 84500] },
    { id: 'm2', label: "Active Subscribers", value: 1420, change: "+185 net new", trend: "up", subtext: "Average Revenue Per User $59.50", format: "number", sparkline: [950, 1050, 1180, 1260, 1340, 1420] },
    { id: 'm3', label: "Gross Churn Rate", value: "1.8%", change: "-0.4% MoM", trend: "up", subtext: "Below industry 2.5% standard", format: "percentage", sparkline: [2.8, 2.5, 2.3, 2.1, 1.9, 1.8] },
    { id: 'm4', label: "Net Revenue Retention", value: "118.5%", change: "+3.1% YoY", trend: "up", subtext: "Expansion MRR: $8.2K", format: "percentage", sparkline: [108, 110, 112, 115, 117, 118.5] }
  ],
  initialState: { targetGrowth: 15 },
  layout: [
    {
      id: 'sec_1',
      title: "MRR Trajectory & Subscription Tiers",
      gridCols: 2,
      components: [
        {
          id: 'chart_mrr_growth',
          type: 'chart',
          chartType: 'line',
          title: "Monthly Recurring Revenue (USD)",
          subtitle: "6-month historical MRR vs Target trajectory",
          xAxisKey: "month",
          dataKeys: [
            { key: "mrr", name: "Actual MRR ($)", color: "#6366f1" },
            { key: "target", name: "Growth Target ($)", color: "#10b981" }
          ],
          data: [
            { month: "Mar", mrr: 58000, target: 55000 },
            { month: "Apr", mrr: 62000, target: 61000 },
            { month: "May", mrr: 69000, target: 67000 },
            { month: "Jun", mrr: 74000, target: 73000 },
            { month: "Jul", mrr: 79000, target: 80000 },
            { month: "Aug", mrr: 84500, target: 86000 }
          ],
          grid: true
        },
        {
          id: 'chart_tier_pie',
          type: 'chart',
          chartType: 'pie',
          title: "Subscription Tier Distribution",
          subtitle: "Revenue split by pricing tier",
          dataKeys: [{ key: "value", name: "Revenue ($)", color: "#6366f1" }],
          data: [
            { name: "Enterprise ($299/mo)", value: 42000, color: "#4f46e5" },
            { name: "Pro Plan ($79/mo)", value: 28500, color: "#06b6d4" },
            { name: "Starter ($29/mo)", value: 14000, color: "#10b981" }
          ]
        }
      ]
    },
    {
      id: 'sec_2',
      title: "Top Subscribers & Accounts",
      gridCols: 1,
      components: [
        {
          id: 'table_customers',
          type: 'table',
          title: "Key Enterprise Accounts Ledger",
          description: "High-value active subscription contracts and renewal dates",
          searchable: true,
          exportable: true,
          columns: [
            { key: "company", label: "Account Name", type: "text" },
            { key: "tier", label: "Plan Tier", type: "badge", badgeColorMap: { "Enterprise": "bg-indigo-500/10 text-indigo-400 border-indigo-500/20", "Pro": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" } },
            { key: "mrr", label: "Monthly MRR ($)", type: "currency" },
            { key: "status", label: "Health Score", type: "badge", badgeColorMap: { "Healthy": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", "At Risk": "bg-rose-500/10 text-rose-400 border-rose-500/20" } },
            { key: "renewal", label: "Renewal Date", type: "date" }
          ],
          data: [
            { company: "Acme Cloud Solutions", tier: "Enterprise", mrr: 2990, status: "Healthy", renewal: "2026-11-15" },
            { company: "TechCorp Global", tier: "Enterprise", mrr: 4500, status: "Healthy", renewal: "2026-12-01" },
            { company: "Vanguard Analytics", tier: "Enterprise", mrr: 1495, status: "At Risk", renewal: "2026-09-10" },
            { company: "Nexus Digital Agency", tier: "Pro", mrr: 790, status: "Healthy", renewal: "2026-10-04" },
            { company: "Hyperion Labs", tier: "Enterprise", mrr: 2390, status: "Healthy", renewal: "2027-01-20" }
          ]
        }
      ]
    }
  ]
};

export const HIRING_PIPELINE_SCHEMA: DynamicUISchema = {
  id: 'hiring_pipeline',
  title: "Candidate Recruitment & Interview Center",
  description: "Kanban pipeline, interview scorecards, candidate skill ratings, and time-to-hire velocity.",
  category: "HR & Operations",
  theme: { accentColor: "violet", style: "modern" },
  generatedPrompt: "Build a candidate recruitment pipeline with Kanban stages, interview feedback form, applicant skill ratings table, and candidate stage actions.",
  metrics: [
    { id: 'm1', label: "Open Requisitions", value: 14, change: "4 critical roles", trend: "neutral", subtext: "Eng: 8 | Product: 4 | Sales: 2", format: "number" },
    { id: 'm2', label: "Active Candidates", value: 68, change: "+12 this week", trend: "up", subtext: "18 in Final Round Stage", format: "number" },
    { id: 'm3', label: "Avg Time-to-Hire", value: "22 Days", change: "-4 days vs Q1", trend: "up", subtext: "Industry benchmark: 35 days", format: "text" },
    { id: 'm4', label: "Offer Acceptance Rate", value: "88.2%", change: "+5.1% YoY", trend: "up", subtext: "15 offers extended this quarter", format: "percentage" }
  ],
  initialState: {},
  layout: [
    {
      id: 'sec_kanban',
      title: "Applicant Kanban Pipeline",
      gridCols: 1,
      components: [
        {
          id: 'kanban_applicants',
          type: 'kanban',
          title: "Candidate Progression Board",
          columns: [
            { id: 'col_applied', title: "Screening (24)", color: "#94a3b8" },
            { id: 'col_tech', title: "Tech Assessment (16)", color: "#3b82f6" },
            { id: 'col_interview', title: "Onsite Interview (18)", color: "#8b5cf6" },
            { id: 'col_offer', title: "Offer Stage (10)", color: "#10b981" }
          ],
          items: [
            { id: 'k1', columnId: 'col_interview', title: "Alex Rivera", subtitle: "Senior Staff Frontend Eng", priority: "high", tags: ["React", "TypeScript", "System Design"], assignee: "Sarah Chen" },
            { id: 'k2', columnId: 'col_tech', title: "Elena Rostova", subtitle: "Lead Product Designer", priority: "medium", tags: ["Figma", "Design Systems"], assignee: "Marcus Vance" },
            { id: 'k3', columnId: 'col_offer', title: "David Kim", subtitle: "Backend Infrastructure Lead", priority: "high", tags: ["Go", "Kubernetes", "GCP"], assignee: "Sarah Chen" },
            { id: 'k4', columnId: 'col_applied', title: "Maya Patel", subtitle: "Growth Product Manager", priority: "low", tags: ["Analytics", "A/B Testing"], assignee: "Unassigned" }
          ]
        }
      ]
    }
  ]
};

export const INVENTORY_MONITOR_SCHEMA: DynamicUISchema = {
  id: 'inventory_monitor',
  title: "E-Commerce Stock & Supply Chain Monitor",
  description: "Live stock level alerts, demand forecasting, reorder thresholds, and warehouse status.",
  category: "Operations",
  theme: { accentColor: "amber", style: "modern" },
  generatedPrompt: "Design an inventory management dashboard with low stock alert cards, sales demand line chart, SKU stock levels table, and quick reorder buttons.",
  metrics: [
    { id: 'm1', label: "Total Active SKUs", value: 1248, change: "98% in stock", trend: "up", subtext: "Across 3 fulfillment centers", format: "number" },
    { id: 'm2', label: "Low Stock Items", value: 12, change: "Requires reorder", trend: "down", subtext: "Below safety threshold", format: "number" },
    { id: 'm3', label: "Total Stock Value", value: 485000, change: "+$32K this mo", trend: "neutral", subtext: "Wholesale valuation", format: "currency" },
    { id: 'm4', label: "Fulfillment Rate", value: "99.4%", change: "Same-day dispatch", trend: "up", subtext: "Avg turnaround 1.2 days", format: "percentage" }
  ],
  initialState: {},
  layout: [
    {
      id: 'sec_inv',
      title: "SKU Stock Levels & Inventory Ledger",
      gridCols: 1,
      components: [
        {
          id: 'table_inventory',
          type: 'table',
          title: "Warehouse Inventory & Safety Stock Log",
          description: "Real-time SKU quantities across West & East coast fulfillment hubs",
          searchable: true,
          exportable: true,
          columns: [
            { key: "sku", label: "SKU Code", type: "text" },
            { key: "productName", label: "Product Name", type: "text" },
            { key: "quantity", label: "Units in Stock", type: "number" },
            { key: "status", label: "Stock Health", type: "badge", badgeColorMap: { "Optimal": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", "Low Stock": "bg-rose-500/10 text-rose-400 border-rose-500/20" } },
            { key: "unitCost", label: "Unit Cost ($)", type: "currency" }
          ],
          data: [
            { sku: "SKU-9021", productName: "Wireless Noise-Canceling Headphones", quantity: 450, status: "Optimal", unitCost: 85 },
            { sku: "SKU-4412", productName: "Ergonomic Mechanical Keyboard", quantity: 18, status: "Low Stock", unitCost: 62 },
            { sku: "SKU-1092", productName: "UltraWide 34' Curved Monitor", quantity: 120, status: "Optimal", unitCost: 290 },
            { sku: "SKU-8831", productName: "USB-C Multi-Port Docking Station", quantity: 14, status: "Low Stock", unitCost: 28 }
          ]
        }
      ]
    }
  ]
};

export const SPRINT_PLANNER_SCHEMA: DynamicUISchema = {
  id: 'sprint_planner',
  title: "Agile Sprint & Velocity Burndown Tracker",
  description: "Sprint velocity burndown chart, task priority Kanban board, team velocity gauge, and story point logs.",
  category: "Project Management",
  theme: { accentColor: "sky", style: "modern" },
  generatedPrompt: "Create an agile sprint planner with burndown chart, task priority Kanban board, team velocity gauge, and quick task logger.",
  metrics: [
    { id: 'm1', label: "Sprint Completion", value: "68%", change: "5 days remaining", trend: "up", subtext: "42 of 62 story points done", format: "percentage" },
    { id: 'm2', label: "Team Velocity", value: "54 pts", change: "+6 pts vs Sprint 14", trend: "up", subtext: "Historical avg 48 pts", format: "text" },
    { id: 'm3', label: "Open Blockers", value: 2, change: "1 high priority", trend: "down", subtext: "Requires DevOps intervention", format: "number" }
  ],
  initialState: {},
  layout: [
    {
      id: 'sec_sprint',
      title: "Sprint Tasks & Kanban",
      gridCols: 1,
      components: [
        {
          id: 'kanban_sprint',
          type: 'kanban',
          title: "Sprint Task Board",
          columns: [
            { id: 's_todo', title: "To Do (12 pts)", color: "#94a3b8" },
            { id: 's_inprog', title: "In Progress (28 pts)", color: "#0284c7" },
            { id: 's_review', title: "In Code Review (10 pts)", color: "#a855f7" },
            { id: 's_done', title: "Completed (42 pts)", color: "#10b981" }
          ],
          items: [
            { id: 'st1', columnId: 's_inprog', title: "Migrate Auth to OAuth 2.0 PKCE", subtitle: "Backend - 8 pts", priority: "high", tags: ["Security", "API"] },
            { id: 'st2', columnId: 's_review', title: "Redesign Mobile Navigation Drawer", subtitle: "Frontend - 5 pts", priority: "medium", tags: ["UI/UX"] },
            { id: 'st3', columnId: 's_done', title: "Optimize Redis Cache Invalidation", subtitle: "DevOps - 3 pts", priority: "low", tags: ["Performance"] }
          ]
        }
      ]
    }
  ]
};

export const HABIT_TRACKER_SCHEMA: DynamicUISchema = {
  id: 'habit_tracker',
  title: "Personal Habit & Focus OS",
  description: "Weekly streak tracker, focus time logging, habit scorecards, and daily completion trends.",
  category: "Personal Growth",
  theme: { accentColor: "rose", style: "modern" },
  generatedPrompt: "Generate a habit and focus tracking dashboard with weekly completion bar charts, habit check-in form, streak metrics, and focus activity log.",
  metrics: [
    { id: 'm1', label: "Current Focus Streak", value: "18 Days", change: "Personal Best!", trend: "up", subtext: "Daily goal: 4 hours deep work", format: "text" },
    { id: 'm2', label: "Weekly Completion", value: "92%", change: "+8% vs last week", trend: "up", subtext: "36 of 39 habits logged", format: "percentage" },
    { id: 'm3', label: "Total Focus Hours", value: "38.5 hrs", change: "+4.2 hrs this week", trend: "up", subtext: "Avg 5.5 hrs/day", format: "text" }
  ],
  initialState: {},
  layout: [
    {
      id: 'sec_habit',
      title: "Weekly Habit Consistency",
      gridCols: 1,
      components: [
        {
          id: 'chart_habit_bar',
          type: 'chart',
          chartType: 'bar',
          title: "Weekly Focus Hours & Habit Check-ins",
          subtitle: "Hours logged per day",
          xAxisKey: "day",
          dataKeys: [{ key: "hours", name: "Deep Work (hrs)", color: "#f43f5e" }],
          data: [
            { day: "Mon", hours: 6.2 },
            { day: "Tue", hours: 5.8 },
            { day: "Wed", hours: 6.5 },
            { day: "Thu", hours: 5.0 },
            { day: "Fri", hours: 6.0 },
            { day: "Sat", hours: 4.2 },
            { day: "Sun", hours: 4.8 }
          ]
        }
      ]
    }
  ]
};

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'burn_rate',
    title: "Startup Burn Rate & Runway",
    description: "Track cash reserves, net burn rate, expense breakdown, and interactive runway projection.",
    category: "Financial",
    icon: "TrendingDown",
    prompt: "Set up a dashboard to track my startup's burn rate, monthly expenses, cash runway, and headcount costs with interactive sliders.",
    schema: DEMO_BURN_RATE_SCHEMA
  },
  {
    id: 'saas_mrr',
    title: "SaaS MRR & Churn Analytics",
    description: "Monitor recurring revenue, churn trends, subscriber tiers, and plan upgrade forecasts.",
    category: "Sales & SaaS",
    icon: "LineChart",
    prompt: "Create a SaaS metrics dashboard tracking Monthly Recurring Revenue (MRR), Customer Churn Rate, ARPU, and user tier breakdown with interactive growth projections.",
    schema: SAAS_MRR_SCHEMA
  },
  {
    id: 'hiring_pipeline',
    title: "Candidate Hiring Pipeline",
    description: "Kanban candidate tracking, interview scorecard ratings, and automated offer workflows.",
    category: "HR & Operations",
    icon: "Users",
    prompt: "Build a candidate recruitment pipeline with Kanban stages, interview feedback form, applicant skill ratings table, and candidate stage actions.",
    schema: HIRING_PIPELINE_SCHEMA
  },
  {
    id: 'inventory_monitor',
    title: "E-Commerce Stock & Supply Chain",
    description: "Live stock level alerts, demand forecasting, reorder thresholds, and warehouse status.",
    category: "Operations",
    icon: "Package",
    prompt: "Design an inventory management dashboard with low stock alert cards, sales demand line chart, SKU stock levels table, and quick reorder buttons.",
    schema: INVENTORY_MONITOR_SCHEMA
  },
  {
    id: 'ridex_mobility',
    title: "RideX Next-Gen Ride Booking & Mobility",
    description: "Uber-inspired transportation application with interactive map, ride selection cards (Moto, Go, Comfort, Lux), fare estimation, driver tracking, wallet, safety center, and driver app mode.",
    category: "Ride-Booking & Transport",
    icon: "Navigation",
    prompt: "Create a modern, premium ride-booking application UI inspired by the general experience of apps like Uber named RideX.",
    schema: undefined
  },
  {
    id: 'foodrush_delivery',
    title: "FoodRush Food Delivery Studio",
    description: "Swiggy-inspired gourmet food ordering app with cuisine chips, restaurant cover cards, rating pills, offer badges, and menu items with ADD buttons.",
    category: "Food & Dining",
    icon: "Utensils",
    prompt: "Design and build a modern food-delivery mobile and web application UI named FoodRush inspired by Swiggy.",
    schema: undefined
  },
  {
    id: 'remindme_app',
    title: "RemindMe Smart Reminder & Alarm Application",
    description: "Production-ready smart reminder & alarm application with onboarding, home dashboard, AI prompt reminder extractor, smart math alarms, habit streaks, calendar view, notification center, and productivity insights.",
    category: "Productivity & Reminders",
    icon: "Bell",
    prompt: "Create a modern, attractive, responsive Daily Reminder & Smart Alarm application UI called RemindMe.",
    schema: undefined
  },
  {
    id: 'hotellux_app',
    title: "HotelLux Luxury Resort & Villa Booking Studio",
    description: "Production-ready luxury hotel & resort booking app with 5-star oceanfront villa covers, accommodation category chips, night rates, reservation checkout modal, digital key unlock, and VIP concierge.",
    category: "Hotel & Resort Booking",
    icon: "Crown",
    prompt: "Luxury hotel booking application",
    schema: undefined
  },
  {
    id: 'sprint_planner',
    title: "Agile Sprint & Burndown Tracker",
    description: "Sprint velocity burndown, task priority matrix, developer allocation, and story points log.",
    category: "Project Management",
    icon: "CheckSquare",
    prompt: "Create an agile sprint planner with burndown chart, task priority Kanban board, team velocity gauge, and quick task logger.",
    schema: SPRINT_PLANNER_SCHEMA
  },
  {
    id: 'habit_tracker',
    title: "Personal Habit & Focus OS",
    description: "Daily completion logs, weekly streak charts, mood analytics, and focus timer log.",
    category: "Personal Growth",
    icon: "Sparkles",
    prompt: "Generate a habit and focus tracking dashboard with weekly completion bar charts, habit check-in form, streak metrics, and focus activity log.",
    schema: HABIT_TRACKER_SCHEMA
  }
];

export const getPresetSchema = (id: string): DynamicUISchema => {
  const found = PRESET_TEMPLATES.find(p => p.id === id);
  if (found && found.schema) {
    return found.schema;
  }
  return DEMO_BURN_RATE_SCHEMA;
};
