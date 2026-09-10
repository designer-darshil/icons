# Glyphroom — Vector Data Integration & Extension Guide

This guide outlines how to connect Glyphroom to external icon datasets, remote REST/GraphQL APIs, design tool pipelines (Figma/Penpot), or local file-based icon packages.

---

## 🏗️ Architecture Overview

Glyphroom's data layer is decoupled from the UI via the **Repository Pattern**:

```text
┌────────────────────────────────────────────────────────┐
│                   UI Layer                             │
│  (IconGrid, IconDetailPage, IconCustomizer, Search)   │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│             Data Repository Interface                  │
│               `IconRepository` (Promise-based)         │
└──────────────────────────┬─────────────────────────────┘
                           │
         ┌─────────────────┴─────────────────┐
         ▼                                   ▼
┌──────────────────┐               ┌──────────────────┐
│ Local Repository │  ── Swap ──►  │ Remote API / CMS │
│ (`mock-icons.ts`)│               │ (`HttpIconRepo`) │
└──────────────────┘               └──────────────────┘
```

---

## 1. Icon Data Contract

All icon sources must satisfy the `Icon` and `IconVariant` types defined in [`src/types/icon.ts`](file:///Users/jarvis/Documents/gridframe/src/types/icon.ts):

```typescript
export interface IconVariant {
  style: 'linear' | 'bold' | 'filled' | 'duotone' | 'two-tone' | 'broken' | 'mono';
  svgMarkup: string;        // Clean, valid SVG elements (paths, rects, circles)
  defaultStrokeWidth?: number; // Default: 2.0
  recommendedSize?: number;    // Default: 24
}

export interface Icon {
  id: string;               // Unique stable identifier (e.g. "arrow-right")
  name: string;             // Human-readable display name (e.g. "Arrow Right")
  slug: string;             // URL-safe slug (e.g. "arrow-right")
  category: IconCategory;   // e.g. "interface" | "editor" | "communication" | ...
  tags: string[];           // Semantic search keywords & synonyms
  variants: IconVariant[];  // Array of multi-style variants
  viewBox: string;          // e.g. "0 0 24 24"
  createdAt: string;        // ISO 8601 date string
  popularity: number;       // Ranking weight (1 - 100)
}
```

---

## 2. Implementing a Remote API Repository

To connect a remote backend or headless CMS (e.g. Strapi, Sanity, Supabase, Cloudflare Workers):

```typescript
// src/data/remote-icon-repository.ts
import { Icon, IconFilterOptions, IconRepository } from '@/types/icon';
import { sanitizeSvgMarkup } from '@/lib/icon-sanitizer';

export class HttpIconRepository implements IconRepository {
  private baseUrl: string;

  constructor(baseUrl = import.meta.env.VITE_API_URL || 'https://api.glyphroom.io/v1') {
    this.baseUrl = baseUrl;
  }

  async getAll(): Promise<Icon[]> {
    const res = await fetch(`${this.baseUrl}/icons`);
    const data: Icon[] = await res.json();
    return data.map(icon => ({
      ...icon,
      variants: icon.variants.map(v => ({
        ...v,
        svgMarkup: sanitizeSvgMarkup(v.svgMarkup)
      }))
    }));
  }

  async getBySlug(slug: string): Promise<Icon | undefined> {
    const res = await fetch(`${this.baseUrl}/icons/${slug}`);
    if (!res.ok) return undefined;
    const icon: Icon = await res.json();
    return {
      ...icon,
      variants: icon.variants.map(v => ({
        ...v,
        svgMarkup: sanitizeSvgMarkup(v.svgMarkup)
      }))
    };
  }
}
```

---

## 3. Automated SVG Asset Pipeline (Build-Time Script)

If you maintain SVGs in a folder (e.g. `assets/icons/*.svg`), you can convert them into typed JSON objects using the built-in sanitizer:

```typescript
// scripts/generate-icons.ts
import fs from 'fs';
import path from 'path';
import { sanitizeSvgMarkup, extractInnerSvg } from '../src/lib/icon-sanitizer';

// Read all raw SVGs, clean them, and produce standard mock-icons dataset
```

---

## 4. Security & Sanitization Checklist

When ingesting icon data from untrusted sources or community submissions:
1. **Never bypass `sanitizeSvgMarkup`**: It automatically strips script tags, event handlers (`onload`, `onclick`), and `javascript:` URIs.
2. **Ensure uniform `viewBox`**: Standardize on `0 0 24 24` or `0 0 32 32`.
3. **Use `currentColor`** for stroke/fill in linear icons so they respond to dynamic color themes.
