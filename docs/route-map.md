# Glyphroom — Route Map & URL State Guidelines

## 1. Route Map Specification

| Route Path | View / Layout | Primary Purpose | URL Query Parameters |
| :--- | :--- | :--- | :--- |
| `/` | `IconExplorerPage` | Default entry point, redirects or renders full explorer | `?q=`, `?cat=`, `?style=`, `?sort=`, `?density=` |
| `/icons` | `IconExplorerPage` | Library browser with interactive filters & grid | Same as `/` |
| `/icons/:slug` | `IconDetailPage` or `WorkspaceLayout (modal overlay)` | Deep-linkable icon detail view with live customizer & export | Same as above + overlay context |
| `/categories/:category` | `IconExplorerPage` | Pre-filtered category view | `?q=`, `?style=`, `?sort=` |
| `/styles/:style` | `IconExplorerPage` | Pre-filtered style view (Linear, Bold, Duotone, etc.) | `?q=`, `?cat=`, `?sort=` |
| `/favorites` | `FavoritesPage` | Curated favorite icons list with bulk export | `?sort=`, `?density=` |
| `/collections` | `CollectionsPage` | User collection manager | None |
| `/collections/:collectionId` | `CollectionDetailPage` | Specific collection icon grid with batch export | `?sort=`, `?density=` |
| `/recent` | `RecentPage` | History of recently inspected icons | None |

## 2. Route-Aware Overlay Behavior
- On Desktop (`>=1280px`), clicking an icon tile updates the URL to `/icons/:slug` using React Router state `{ backgroundLocation }`, maintaining the explorer scroll position while sliding in the Inspector panel.
- On Mobile/Direct URL access, `/icons/:slug` renders as a dedicated full-page experience with back navigation to `/icons`.
