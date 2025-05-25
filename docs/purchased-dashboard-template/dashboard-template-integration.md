# Dashboard Template Integration Guide

This document outlines how the purchased dashboard template was integrated into the project, including file mappings, component structures, and customization points.

## Table of Contents
- [Project Structure](#project-structure)
- [Component Mappings](#component-mappings)
- [Theme Integration](#theme-integration)
- [Routing](#routing)
- [Responsive Behavior](#responsive-behavior)
- [Customization Guide](#customization-guide)
- [Troubleshooting](#troubleshooting)

## Project Structure

### Template Structure (Purchased)
```
docs/purchased-dashboard-template/
├── app/
│   ├── dashboard/
│   │   └── page.tsx
│   └── page.tsx
├── components/
│   ├── sidebar.tsx
│   ├── theme-toggle.tsx
│   └── ui/...
└── lib/
    └── utils.ts
```

### Project Structure (Our Implementation)
```
src/
├── app/
│   └── dashboard/
│       └── page.tsx
├── components/
│   └── theme/
│       └── theme-toggle.tsx
├── features/
│   └── dashboard/
│       ├── components/
│       │   ├── dashboard-layout.tsx
│       │   └── sidebar.tsx
│       └── dashboard-page.tsx
└── lib/
    └── utils.ts
```

## Component Mappings

### 1. Sidebar (`sidebar.tsx`)

**Location**: `src/features/dashboard/components/sidebar.tsx`

**Key Features**:
- Responsive design with mobile support
- Collapsible state
- User menu with dropdown
- Active link highlighting

**Customization Points**:
- Navigation items in `navItems` array
- User menu items in `userMenuItems` array
- Logo and branding in the header section
- Styling in the component's className props

### 2. Dashboard Layout (`dashboard-layout.tsx`)

**Location**: `src/features/dashboard/components/dashboard-layout.tsx`

**Key Features**:
- Handles responsive layout
- Manages sidebar state
- Provides consistent header with mobile menu

**Customization Points**:
- Header content and actions
- Mobile breakpoint (currently 768px)
- Transition animations

### 3. Theme Toggle (`theme-toggle.tsx`)

**Location**: `src/components/theme/theme-toggle.tsx`

**Key Features**:
- Toggles between light/dark mode
- Persists user preference
- Accessible with keyboard navigation

## Theme Integration

The template uses Tailwind CSS with the following customizations:

### Colors
- Primary: Defined in `tailwind.config.js`
- Background: Uses Tailwind's background colors
- Text: Uses Tailwind's text colors

### Typography
- Uses Inter font family (included in the project)
- Responsive text sizes using Tailwind's text utilities

## Routing

### Dashboard Route
- Path: `/dashboard`
- Layout: Uses `DashboardLayout` component
- Page: Renders dashboard content

### Navigation Items
Update the `navItems` array in `sidebar.tsx` to modify the main navigation:

```typescript
const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  // Add more items here
];
```

## Responsive Behavior

### Mobile (≤ 768px)
- Sidebar is hidden by default
- Toggle button in header
- Full-width sidebar when open
- Click outside to close

### Desktop (> 768px)
- Sidebar is visible by default
- Collapsible to icon-only mode
- Smooth transitions

## Customization Guide

### 1. Update Branding
1. Modify the logo in the sidebar header
2. Update the site name in both sidebar and dashboard layout
3. Update favicon and other brand assets

### 2. Add New Navigation Items
1. Add new items to the `navItems` array in `sidebar.tsx`
2. Include appropriate icon from Lucide React
3. Update the route if needed

### 3. Modify Styling
1. Update colors in `tailwind.config.js`
2. Modify component-specific styles in their respective files
3. Update responsive breakpoints if needed

### 4. Add New Pages
1. Create new route in `app/` directory
2. Use `DashboardLayout` as the layout
3. Add navigation items to the sidebar

## Troubleshooting

### Hydration Errors
If you see hydration mismatches:
1. Ensure all browser APIs are called in `useEffect`
2. Use the `mounted` state pattern for client-side only code
3. Check for inconsistencies between server and client rendering

### Styling Issues
1. Check for conflicting Tailwind classes
2. Verify custom styles aren't being overridden
3. Ensure proper dark mode classes are applied

### Mobile Menu Not Working
1. Verify the mobile breakpoint matches in both layout and sidebar
2. Check z-index values for proper stacking
3. Ensure click handlers are properly bound

## Performance Tips

1. **Code Splitting**:
   - Use dynamic imports for heavy components
   - Split large pages into smaller components

2. **Optimize Images**:
   - Use Next.js Image component
   - Compress and optimize all assets

3. **Reduce Bundle Size**:
   - Only import necessary icons
   - Use tree-shaking for libraries

## Version History

- **1.0.0** (2025-05-25): Initial integration of dashboard template

---

For any additional questions or issues, please refer to the template documentation or contact the development team.
