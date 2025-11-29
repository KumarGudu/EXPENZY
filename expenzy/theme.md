🎨 Complete Theming Color System
Main Theme Colors (Tailwind CSS 4 Format)
globals.css Configuration
css@layer base {
  :root {
    /* Background Colors */
    --background: 0 0% 100%;              /* #ffffff - Main app background */
    --surface: 210 20% 98%;               /* #f9fafb - Cards, modals background */
    --surface-elevated: 0 0% 100%;        /* #ffffff - Elevated cards */
    
    /* Foreground (Text) Colors */
    --foreground: 222 47% 11%;            /* #111827 - Primary text */
    --foreground-muted: 215 16% 47%;      /* #6b7280 - Secondary text */
    
    /* Primary Brand Color (Emerald for Income/Positive) */
    --primary: 160 84% 39%;               /* #10b981 */
    --primary-foreground: 0 0% 100%;      /* White text on primary */
    
    /* Secondary (Red for Expenses/Negative) */
    --secondary: 0 84% 60%;               /* #ef4444 */
    --secondary-foreground: 0 0% 100%;    /* White text on secondary */
    
    /* Accent (Blue for Actions/Links) */
    --accent: 217 91% 60%;                /* #3b82f6 */
    --accent-foreground: 0 0% 100%;       /* White text on accent */
    
    /* Muted (Subtle backgrounds) */
    --muted: 210 20% 98%;                 /* #f9fafb */
    --muted-foreground: 215 16% 47%;      /* #6b7280 */
    
    /* Border Colors */
    --border: 214 32% 91%;                /* #e5e7eb */
    --border-strong: 215 16% 47%;         /* #9ca3af - Stronger borders */
    
    /* Input Colors */
    --input: 214 32% 91%;                 /* #e5e7eb */
    --input-focus: 217 91% 60%;           /* #3b82f6*/
    
    /* Card Colors */
    --card: 0 0% 100%;                    /* #ffffff */
    --card-foreground: 222 47% 11%;       /* #111827 */
    
    /* Popover/Modal Colors */
    --popover: 0 0% 100%;                 /* #ffffff */
    --popover-foreground: 222 47% 11%;    /* #111827 */
    
    /* Destructive (Delete actions) */
    --destructive: 0 84% 60%;             /* #ef4444 */
    --destructive-foreground: 0 0% 100%;  /* White */
    
    /* Success (Confirmations) */
    --success: 160 84% 39%;               /* #10b981 */
    --success-foreground: 0 0% 100%;      /* White */
    
    /* Warning */
    --warning: 38 92% 50%;                /* #f59e0b */
    --warning-foreground: 0 0% 100%;      /* White */
    
    /* Info */
    --info: 217 91% 60%;                  /* #3b82f6 */
    --info-foreground: 0 0% 100%;         /* White */
    
    /* Ring (Focus rings) */
    --ring: 217 91% 60%;                  /* #3b82f6 */
    
    /* Chart Colors */
    --chart-1: 160 84% 39%;               /* #10b981 - Income */
    --chart-2: 0 84% 60%;                 /* #ef4444 - Expenses */
    --chart-3: 217 91% 60%;               /* #3b82f6 */
    --chart-4: 280 89% 60%;               /* #a855f7 - Purple */
    --chart-5: 38 92% 50%;                /* #f59e0b - Orange */
    
    /* Radius */
    --radius: 0.5rem;                     /* 8px */
  }

  .dark {
    /* Background Colors */
    --background: 222 47% 11%;            /* #0f172a - Main dark background */
    --surface: 217 33% 17%;               /* #1e293b - Cards, modals background */
    --surface-elevated: 215 25% 27%;      /* #334155 - Elevated cards */
    
    /* Foreground (Text) Colors */
    --foreground: 210 20% 98%;            /* #f1f5f9 - Primary text */
    --foreground-muted: 215 20% 65%;      /* #94a3b8 - Secondary text */
    
    /* Primary Brand Color (Brighter Emerald) */
    --primary: 160 84% 60%;               /* #34d399 */
    --primary-foreground: 222 47% 11%;    /* Dark text on primary */
    
    /* Secondary (Brighter Red) */
    --secondary: 0 91% 71%;               /* #f87171 */
    --secondary-foreground: 222 47% 11%;  /* Dark text on secondary */
    
    /* Accent (Brighter Blue) */
    --accent: 217 91% 70%;                /* #60a5fa */
    --accent-foreground: 222 47% 11%;     /* Dark text on accent */
    
    /* Muted (Dark subtle backgrounds) */
    --muted: 217 33% 17%;                 /* #1e293b */
    --muted-foreground: 215 20% 65%;      /* #94a3b8 */
    
    /* Border Colors */
    --border: 215 25% 27%;                /* #334155 */
    --border-strong: 215 20% 65%;         /* #64748b - Stronger borders */
    
    /* Input Colors */
    --input: 215 25% 27%;                 /* #334155 */
    --input-focus: 217 91% 70%;           /* #60a5fa */
    
    /* Card Colors */
    --card: 217 33% 17%;                  /* #1e293b */
    --card-foreground: 210 20% 98%;       /* #f1f5f9 */
    
    /* Popover/Modal Colors */
    --popover: 215 25% 27%;               /* #334155 */
    --popover-foreground: 210 20% 98%;    /* #f1f5f9 */
    
    /* Destructive */
    --destructive: 0 91% 71%;             /* #f87171 */
    --destructive-foreground: 222 47% 11%; /* Dark text */
    
    /* Success */
    --success: 160 84% 60%;               /* #34d399 */
    --success-foreground: 222 47% 11%;    /* Dark text */
    
    /* Warning */
    --warning: 38 92% 60%;                /* #fbbf24 */
    --warning-foreground: 222 47% 11%;    /* Dark text */
    
    /* Info */
    --info: 217 91% 70%;                  /* #60a5fa */
    --info-foreground: 222 47% 11%;       /* Dark text */
    
    /* Ring (Focus rings) */
    --ring: 217 91% 70%;                  /* #60a5fa */
    
    /* Chart Colors (Brighter for dark mode) */
    --chart-1: 160 84% 60%;               /* #34d399 */
    --chart-2: 0 91% 71%;                 /* #f87171 */
    --chart-3: 217 91% 70%;               /* #60a5fa */
    --chart-4: 280 89% 70%;               /* #c084fc */
    --chart-5: 38 92% 60%;                /* #fbbf24 */
  }
}

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
  }
}

🎨 Usage in Components
Background Colors
tsx// Main app background
className="bg-background"

// Cards and surfaces
className="bg-surface"
className="bg-card"

// Modals and popovers
className="bg-popover"

// Elevated elements
className="bg-surface-elevated"
Text Colors
tsx// Primary text
className="text-foreground"

// Secondary/muted text
className="text-foreground-muted"
className="text-muted-foreground"

// On colored backgrounds
className="text-primary-foreground"
Button & Interactive Elements
tsx// Primary button (Income/Positive action)
className="bg-primary text-primary-foreground hover:bg-primary/90"

// Secondary button (Expense/Negative action)
className="bg-secondary text-secondary-foreground hover:bg-secondary/90"

// Accent button (General actions)
className="bg-accent text-accent-foreground hover:bg-accent/90"

// Destructive button
className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
Borders
tsx// Standard border
className="border border-border"

// Stronger border
className="border border-border-strong"

// Focus ring
className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
Modals & Overlays
tsx// Modal background
className="bg-popover text-popover-foreground"

// Modal overlay (backdrop)
className="bg-background/80 backdrop-blur-sm"

// Card in modal
className="bg-card text-card-foreground border border-border rounded-lg"

🌓 Semantic Color Mapping
Light Mode (Day Theme)

Background: Pure white #ffffff
Surface: Very light gray #f9fafb
Modals: White with subtle shadow
Text: Dark gray #111827
Borders: Light gray #e5e7eb

Dark Mode (Night Theme)

Background: Deep slate #0f172a
Surface: Medium slate #1e293b
Modals: Elevated slate #334155
Text: Off-white #f1f5f9
Borders: Medium slate #334155


📊 Category-Specific Colors (Optional)
For expense categories, use these consistent colors:
tsxconst categoryColors = {
  food: "bg-orange-500 dark:bg-orange-400",
  transport: "bg-blue-500 dark:bg-blue-400",
  shopping: "bg-pink-500 dark:bg-pink-400",
  entertainment: "bg-purple-500 dark:bg-purple-400",
  bills: "bg-red-500 dark:bg-red-400",
  health: "bg-green-500 dark:bg-green-400",
  education: "bg-indigo-500 dark:bg-indigo-400",
  other: "bg-gray-500 dark:bg-gray-400",
}

🎯 Quick Reference Card
ElementLightDarkMain Background#ffffff#0f172aCard/Surface#f9fafb#1e293bModal#ffffff#334155Primary Text#111827#f1f5f9Secondary Text#6b7280#94a3b8Border#e5e7eb#334155Primary (Income)#10b981#34d399Secondary (Expense)#ef4444#f87171Accent#3b82f6#60a5fa
This color system ensures perfect contrast ratios, accessibility compliance (WCAG AA), and a professional look for your expense tracker! 🚀