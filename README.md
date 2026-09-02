# 🧭 Local Tourist Guide (Stitch Explorer) — React Native Assignment

A cross-platform React Native application for discovering nearby tourist attractions and places of interest, faithfully converted from the **Horizon Ethos** travel design system.

---

## 📌 Assignment Overview & Architecture

This application demonstrates modern React Native architecture, state handling, micro-animations, and strict adherence to a professional UI/UX design token system.

### 📐 Design System & Tokens ([`src/theme/index.ts`](file:///d:/stitch_explorer_local_tourist_guide/src/theme/index.ts))
* **Color Hierarchy**: Systematic Material Design 3 palette including `primary` (`#0050cb`), `primaryContainer` (`#0066ff`), `surface` (`#f7f9fb`), `surfaceContainerLowest` (`#ffffff`), `tertiary` (`#005f89`), and error palettes.
* **Typography**: Proportional type scale with dedicated headline, body, and label variants.
* **Spacing Rhythm**: Strict 8px grid system (`xs: 4`, `sm: 8`, `md: 16`, `lg: 24`, `xl: 32`).
* **Elevation & Shadows**: Calibrated dual-platform shadows (`elevation1` for destination cards, `elevation2` for floating headers/bars).

---

## 📱 Implemented Screens & Features

### 1. Location Permission Screen ([`src/screens/LocationPermissionScreen.tsx`](file:///d:/stitch_explorer_local_tourist_guide/src/screens/LocationPermissionScreen.tsx))
* **Animated Radar Effect**: 3 concentric looping pulse circles using React Native `Animated` with `useNativeDriver: true`.
* **Floating Badge Icons**: Elevation badges showcasing map and camera exploration cues.
* **Interactive Actions**: "Allow Location Access" triggers the loading flow, and "Not Now" proceeds directly to the places feed.

### 2. Animated Loading Screen ([`src/screens/LoadingScreen.tsx`](file:///d:/stitch_explorer_local_tourist_guide/src/screens/LoadingScreen.tsx))
* **Dynamic Pulse & Radar**: Animated expanding ripple rings with a pulsing central compass badge.
* **Indeterminate Progress Bar**: Smooth horizontal linear animation illustrating active data retrieval.
* **Ambient Gradients**: Soft background lighting spots matching the design aesthetic.

### 3. Nearby Places Discovery Feed ([`src/screens/NearbyPlacesScreen.tsx`](file:///d:/stitch_explorer_local_tourist_guide/src/screens/NearbyPlacesScreen.tsx))
* **Sticky Top App Bar**: Displays current location context (*Jaipur, Rajasthan*) and on-demand refresh.
* **Rich Destination Cards ([`src/components/PlaceCard.tsx`](file:///d:/stitch_explorer_local_tourist_guide/src/components/PlaceCard.tsx))**:
  * High-resolution imagery with full bleed and contrast overlay.
  * Interactive **Favorite / Wishlist toggle** with visual state change.
  * Rating badge pill with star icon.
  * Category badge (*Historical*, *Palace*, *Monument*, *Museum*).
  * Location address and driving distance indicators.
* **Pull-to-Refresh**: Native `RefreshControl` integration.
* **Interactive Bottom Navigation Bar ([`src/components/BottomNavBar.tsx`](file:///d:/stitch_explorer_local_tourist_guide/src/components/BottomNavBar.tsx))**: Supports *Explore*, *Saved* (with live filtering of favorited attractions), *Trips*, and *Profile* tabs.

### 4. System & App States ([`src/screens/AppStatesScreen.tsx`](file:///d:/stitch_explorer_local_tourist_guide/src/screens/AppStatesScreen.tsx))
* **Empty State ([`src/components/EmptyState.tsx`](file:///d:/stitch_explorer_local_tourist_guide/src/components/EmptyState.tsx))**: When no places match user criteria.
* **Location Permission Required State ([`src/components/LocationRequiredState.tsx`](file:///d:/stitch_explorer_local_tourist_guide/src/components/LocationRequiredState.tsx))**: Actionable buttons to retry or open device settings via `Linking.openSettings()`.
* **Error State ([`src/components/ErrorState.tsx`](file:///d:/stitch_explorer_local_tourist_guide/src/components/ErrorState.tsx))**: Network error recovery with retry trigger.

---

## 🗂️ Project Directory Layout

```
stitch_explorer_local_tourist_guide/
├── App.tsx                               # Main entry with natural flow & preview switcher
├── package.json                          # App dependencies (Expo & React Native)
├── README.md                             # Assignment report & run documentation
└── src/
    ├── theme/
    │   └── index.ts                      # Horizon Ethos design system tokens
    ├── types/
    │   └── index.ts                      # TypeScript data models & navigation types
    ├── data/
    │   └── mockPlaces.ts                 # Jaipur tourist attraction places
    ├── components/
    │   ├── BottomNavBar.tsx              # Bottom navigation bar with tab pills
    │   ├── EmptyState.tsx                # Empty state component
    │   ├── ErrorState.tsx                # Error state component
    │   ├── Icon.tsx                      # Robust vector/glyph cross-platform icon adapter
    │   ├── LocationRequiredState.tsx     # Location permission error state
    │   ├── PlaceCard.tsx                 # Destination card item
    │   └── TopAppBar.tsx                 # Top navigation header
    └── screens/
        ├── AppStatesScreen.tsx           # State previewer & segment switcher
        ├── LoadingScreen.tsx             # Animated indeterminate loading screen
        ├── LocationPermissionScreen.tsx  # Animated permission request screen
        └── NearbyPlacesScreen.tsx        # Main discovery feed & favorites screen
```

---

## ⚡ Getting Started & Running

### Using Expo CLI:
```bash
# 1. Install dependencies
npm install

# 2. Start the Expo development server
npx expo start
```
* Scan the QR code with the **Expo Go** app on iOS or Android, or press `w` to run in the web browser.

### Using React Native CLI:
```bash
# 1. Install dependencies
npm install

# 2. Run on Android or iOS
npx react-native run-android
# or
npx react-native run-ios
```

---

## 🛠️ Assignment Evaluation Highlights

1. **Performance**: All animations (`Animated.timing`, `Animated.sequence`, `Animated.loop`) utilize `useNativeDriver: true` to prevent UI thread blockage.
2. **Component Reusability**: All UI elements (cards, headers, state views, tabs) are decoupled into pure, memoized, or customizable components.
3. **Type Safety**: Written in TypeScript with interfaces covering all data structures and component props.
4. **Interactive Navigator**: Includes a floating `🧭 Preview Screens` toggle in `App.tsx` allowing evaluators to jump directly between all 4 screens and state variants at any time.
