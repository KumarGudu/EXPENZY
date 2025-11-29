Expense Tracker App - Implementation Plan
🎨 Color Theme Recommendation
Day Theme:

Primary: #10b981 (Emerald 500) - for positive/income
Secondary: #ef4444 (Red 500) - for expenses
Accent: #3b82f6 (Blue 500) - for actions/links
Background: #ffffff (White)
Surface: #f9fafb (Gray 50)
Text Primary: #111827 (Gray 900)
Text Secondary: #6b7280 (Gray 500)
Border: #e5e7eb (Gray 200)

Night Theme:

Primary: #34d399 (Emerald 400)
Secondary: #f87171 (Red 400)
Accent: #60a5fa (Blue 400)
Background: #0f172a (Slate 950)
Surface: #1e293b (Slate 800)
Text Primary: #f1f5f9 (Slate 100)
Text Secondary: #94a3b8 (Slate 400)
Border: #334155 (Slate 700)


📁 Folder Structure
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx (Overview/Dashboard)
│   │   ├── expenses/
│   │   │   ├── page.tsx (List view)
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx (Edit)
│   │   │   └── new/
│   │   │       └── page.tsx
│   │   ├── categories/
│   │   │   └── page.tsx
│   │   ├── reports/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts
│   ├── layout.tsx (Root layout)
│   └── providers.tsx
│
├── components/
│   ├── ui/ (shadcn components)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── sheet.tsx (for mobile drawer)
│   │   ├── tabs.tsx
│   │   └── ... (other shadcn components)
│   │
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   ├── mobile-nav.tsx
│   │   └── bottom-nav.tsx (mobile tab bar)
│   │
│   ├── expense/
│   │   ├── expense-card.tsx
│   │   ├── expense-form.tsx
│   │   ├── expense-list.tsx
│   │   └── expense-filters.tsx
│   │
│   ├── dashboard/
│   │   ├── stats-card.tsx
│   │   ├── expense-chart.tsx
│   │   ├── recent-expenses.tsx
│   │   └── category-breakdown.tsx
│   │
│   ├── reports/
│   │   ├── date-range-picker.tsx
│   │   ├── report-preview.tsx
│   │   └── download-button.tsx
│   │
│   └── shared/
│       ├── theme-toggle.tsx
│       ├── loading-spinner.tsx
│       └── empty-state.tsx
│
├── lib/
│   ├── api/
│   │   ├── client.ts (axios instance)
│   │   └── endpoints.ts
│   │
│   ├── hooks/
│   │   ├── use-expenses.ts
│   │   ├── use-categories.ts
│   │   ├── use-reports.ts
│   │   ├── use-auth.ts
│   │   └── use-media-query.ts
│   │
│   ├── utils/
│   │   ├── cn.ts (classnames helper)
│   │   ├── format.ts (date, currency formatting)
│   │   ├── validation.ts
│   │   └── download.ts (PDF/Excel generation)
│   │
│   ├── types/
│   │   ├── expense.ts
│   │   ├── category.ts
│   │   ├── report.ts
│   │   └── auth.ts
│   │
│   └── config/
│       ├── site.ts
│       └── query-client.ts
│
├── styles/
│   └── globals.css
│
└── middleware.ts (auth protection)

🗺️ App Roadmap & Implementation Steps
Phase 1: Setup & Foundation (Week 1)

Initialize Next.js 14+ with App Router

Install Tailwind CSS 4
Configure shadcn/ui
Setup TanStack Query (React Query)


Authentication Setup

NextAuth.js configuration
Google OAuth provider
JWT token handling
Protected route middleware


API Client Setup

Axios instance with interceptors
Token refresh logic
Error handling
TanStack Query configuration



Phase 2: Core UI Components (Week 1-2)

Layout Components

Responsive header with user menu
Desktop sidebar navigation
Mobile bottom navigation (tab bar)
Theme toggle (day/night)


Base UI Components (using shadcn/ui)

Forms with validation (React Hook Form + Zod)
Cards, buttons, inputs
Dialogs/modals
Dropdowns and selects
Sheet component for mobile drawers



Phase 3: Main Features (Week 2-3)

Dashboard Page

Summary statistics cards (total, income, expenses)
Expense trend chart (Recharts)
Recent expenses list
Category breakdown pie chart


Expense Management

List view with infinite scroll/pagination
Add new expense (sheet on mobile, dialog on desktop)
Edit expense
Delete expense
Filter by category, date range, amount
Search functionality


Categories Management

CRUD operations
Icon picker
Color picker
Category usage statistics



Phase 4: Reports & Export (Week 3-4)

Reports Page

Date range selector (preset ranges: today, week, month, year, custom)
Visual charts and graphs
Category-wise breakdown
Download options:

PDF (using jsPDF or react-pdf)
Excel (using xlsx library)
CSV




Settings Page

Profile management
Currency preferences
Notification settings
Export/Import data



Phase 5: Mobile Optimization (Week 4)

Mobile-First Responsive Design

Touch-friendly components (min 44px tap targets)
Swipe gestures for actions
Pull-to-refresh
Bottom sheet for forms
Sticky bottom navigation


Performance Optimization

Image optimization
Code splitting
Lazy loading
TanStack Query caching strategy




📱 Mobile-First Approach Strategy
Breakpoints (Tailwind 4)
sm: 640px   (small tablets)
md: 768px   (tablets)
lg: 1024px  (desktops)
xl: 1280px  (large desktops)
Mobile Design Patterns

Navigation:

Bottom tab bar (Home, Expenses, Reports, Profile)
Hamburger menu for secondary actions
Floating action button (FAB) for "Add Expense"


Forms:

Full-screen sheets from bottom
Large touch targets
Auto-focus on inputs
Native date pickers


Lists:

Swipeable expense cards (swipe left to delete)
Pull-to-refresh
Virtual scrolling for performance


Charts:

Horizontal scroll for long data
Simplified mobile charts
Tap to see details




🔧 Tech Stack Summary
Frontend

Framework: Next.js 14+ (App Router)
Styling: Tailwind CSS 4
UI Components: shadcn/ui
State Management: TanStack Query v5
Forms: React Hook Form + Zod
Charts: Recharts
Auth: NextAuth.js
HTTP Client: Axios

Libraries Needed
json{
  "dependencies": {
    "next": "^14.x",
    "react": "^18.x",
    "@tanstack/react-query": "^5.x",
    "axios": "^1.x",
    "next-auth": "^4.x",
    "react-hook-form": "^7.x",
    "zod": "^3.x",
    "recharts": "^2.x",
    "date-fns": "^3.x",
    "jspdf": "^2.x",
    "xlsx": "^0.18.x",
    "lucide-react": "latest",
    "@radix-ui/react-*": "latest" (shadcn dependencies)
  }
}

🎯 Key Features Checklist

 Google OAuth login
 JWT token management
 Dashboard with statistics
 Add/Edit/Delete expenses
 Category management
 Date range filtering
 Search functionality
 Charts and visualizations
 PDF report download
 Excel report download
 CSV export
 Day/Night theme toggle
 Mobile bottom navigation
 Responsive design (mobile-first)
 Offline support (optional with React Query)
 Push notifications (optional)


💡 Best Practices

TanStack Query Setup:

Use query keys consistently: ['expenses', filters]
Implement optimistic updates for mutations
Configure staleTime and cacheTime appropriately
Use prefetching for better UX


Mobile Performance:

Use next/image for optimized images
Implement virtual scrolling for long lists
Minimize bundle size with dynamic imports
Use service workers for offline capability


Accessibility:

Proper ARIA labels
Keyboard navigation
Focus management
Screen reader support


Security:

HTTP-only cookies for tokens
CSRF protection
Input sanitization
Rate limiting on API calls



This plan gives you a professional, production-ready expense tracker with mobile-first design! 🚀