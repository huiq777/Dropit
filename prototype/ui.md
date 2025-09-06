# Dropit UI Design System

## Brand Identity

### Logo & Icon Design
The Dropit logo features an arrow down icon (ArrowBigDownDash from Lucide React), symbolizing the core action of "dropping" files and content sharing.

**Core Brand Elements:**
- **Icon**: Arrow down (ArrowBigDownDash icon)
- **Primary Color**: `#6366f1` (Indigo-500)
- **Background**: Dark theme (`#1a1a1a`, `#2d2d2d`)
- **Accent Colors**: White (`#ffffff`), Gray variations

## Icon Usage Guidelines

### 1. Logo Placement
```html
<!-- Main Logo (Large) -->
<div class="w-16 h-16 bg-[#6366f1] rounded-2xl flex items-center justify-center">
  <ArrowBigDownDash className="text-white w-8 h-8" />
</div>

<!-- Header Logo (Medium) -->
<div class="flex items-center">
  <ArrowBigDownDash className="text-white w-5 h-5 mr-3" />
  <span class="text-lg font-semibold">Dropit</span>
</div>

<!-- Icon Only (Small) -->
<ArrowBigDownDash className="text-[#6366f1] w-6 h-6" />
```

### 2. Design Principles

**Centered & Balanced:**
- All icons should be properly centered within their containers
- Use consistent padding and margins
- Maintain visual balance with surrounding elements

**Natural Integration:**
- Icons blend seamlessly with the dark theme
- Consistent sizing across similar UI elements
- Proper contrast ratios for accessibility

**Visual Hierarchy:**
```css
/* Primary Brand Icon */
.brand-icon-primary { 
  width: 32px; 
  height: 32px; 
  color: #6366f1; 
}

/* Secondary Icons */
.icon-secondary { 
  width: 16px; 
  height: 16px; 
  color: #ffffff; 
}

/* Accent Icons */
.icon-accent { 
  width: 12px; 
  height: 12px; 
  color: #9ca3af; 
}
```

## Component-Specific Icon Implementation

### Authentication Screen
```jsx
// Main Logo
<div className="w-16 h-16 bg-[#6366f1] rounded-2xl flex items-center justify-center mx-auto mb-4">
  <ArrowBigDownDash className="text-white w-8 h-8" />
</div>

// Login Button (uses functional icon)
<LogIn className="w-4 h-4 mr-2" />
```

### Chat Interface
```jsx
// Header Brand
<div className="flex items-center">
  <ArrowBigDownDash className="text-white w-5 h-5 mr-3" />
  <h1 className="text-lg font-semibold">Dropit</h1>
</div>

// Message Icons (functional icons)
<Type className="text-blue-400 w-3 h-3" />
<Image className="w-4 h-4" />
<File className="w-4 h-4" />
```

### Settings Panel
```jsx
// About Section Brand
<div className="w-12 h-12 bg-[#6366f1] rounded-xl flex items-center justify-center mx-auto mb-3">
  <ArrowBigDownDash className="text-white w-6 h-6" />
</div>
```

## Send Button Specification

### Fixed "Drop" Text
The send button text is always "Drop" regardless of language setting, reinforcing the brand identity.

```jsx
// Chat Input Drop Button
<button className="bg-[#6366f1] hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-xl transition-colors flex items-center justify-center">
  <span>Drop</span>
  <ArrowBigDownDash className="w-4 h-4 ml-2" />
</button>
```

**Rationale:**
- "Drop" reinforces the arrow down icon symbolism
- Creates consistent brand recognition
- Works well in both Chinese and English contexts
- Emphasizes the core action of "dropping" files

## Color Palette

### Primary Colors
- **Brand Blue**: `#6366f1` - Main brand color, used for primary actions
- **Dark Background**: `#1a1a1a` - Primary background
- **Card Background**: `#2d2d2d` - Secondary surfaces
- **Border**: `#404040` - Subtle borders and dividers

### Text Colors
- **Primary Text**: `#ffffff` - Main text on dark backgrounds  
- **Secondary Text**: `#9ca3af` - Secondary information
- **Accent Text**: `#6366f1` - Links and emphasized text
- **Success**: `#10b981` - Success states
- **Warning**: `#f59e0b` - Warning states  
- **Error**: `#ef4444` - Error states

## Responsive Icon Sizing

```css
/* Mobile (default) */
.brand-logo { width: 64px; height: 64px; }
.header-icon { width: 20px; height: 20px; }
.ui-icon { width: 16px; height: 16px; }

/* Tablet */
@media (min-width: 768px) {
  .brand-logo { width: 72px; height: 72px; }
  .header-icon { width: 24px; height: 24px; }
  .ui-icon { width: 18px; height: 18px; }
}

/* Desktop */
@media (min-width: 1024px) {
  .brand-logo { width: 80px; height: 80px; }
  .header-icon { width: 28px; height: 28px; }
  .ui-icon { width: 20px; height: 20px; }
}
```

## Accessibility Guidelines

### Icon Labels
All icons must include proper accessibility labels:

```jsx
<ArrowBigDownDash 
  className="w-4 h-4" 
  aria-label="Dropit brand icon"
  role="img"
/>
```

### Contrast Requirements
- Icons on dark backgrounds: minimum 4.5:1 contrast ratio
- Interactive icons: minimum 3:1 contrast ratio for focus states
- Brand icons: maintain consistent #6366f1 color for recognition

## Animation Guidelines

### Hover Effects
```css
.icon-interactive:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;
}
```

### Loading States
```jsx
<Loader2 className="w-4 h-4 animate-spin" />
```

### Success Feedback
```jsx
<Check className="w-4 h-4 text-green-500 animate-pulse" />
```

---

*This design system ensures consistent, accessible, and brand-aligned icon usage throughout the Dropit application with the new ArrowBigDownDash brand identity.*