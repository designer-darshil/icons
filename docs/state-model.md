# Glyphroom — State Architecture & Store Boundaries

## 1. State Separation Strategy
Glyphroom enforces clean boundaries between **URL Search Params**, **Global Store**, **Feature Stores**, and **Local Component State**.

| State Scope | Purpose | Storage / Mechanism | Key Properties |
| :--- | :--- | :--- | :--- |
| **URL State** | Shareable discovery parameters | React Router `useSearchParams` | `query`, `category`, `style`, `sort`, `density`, `selected` |
| **Global Theme Store** | App appearance & preferences | Zustand / LocalStorage | `theme: 'dark' \| 'light' \| 'system'`, `reducedMotion: boolean` |
| **Favorites Store** | User-curated favorite icons | Zustand / LocalStorage | `favoriteIds: string[]`, `addFavorite()`, `removeFavorite()`, `isFavorite()` |
| **Collections Store** | Custom project sets | Zustand / LocalStorage | `collections: Collection[]`, `createCollection()`, `addToCollection()`, `removeFromCollection()` |
| **Explorer UI Store** | Non-URL temporary layout state | Zustand | `activeDensity: 'compact' \| 'comfortable' \| 'spacious'`, `isFilterDrawerOpen: boolean` |
| **Customizer State** | Active icon tuning | Local React State (per selected icon) | `color`, `background`, `size`, `strokeWidth`, `strokeLinecap`, `strokeLinejoin`, `rotation`, `flipX`, `flipY` |
| **Search State** | Ephemeral search queries | Local React hook / Debounced | `inputValue`, `debouncedQuery`, `suggestions`, `highlightedIndex` |

## 2. Local-First Persistence Rules
- Favorites and Collections are stored under `glyphroom_favorites_v1` and `glyphroom_collections_v1` in `localStorage`.
- Theme is stored under `glyphroom_theme_v1` and synced with `document.documentElement.dataset.theme`.
- Fallbacks are provided when localStorage is unavailable or corrupted.
