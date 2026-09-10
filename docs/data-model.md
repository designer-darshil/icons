# Glyphroom — Data Models & Repository Contracts

## 1. TypeScript Core Types

```ts
export type IconStyle =
  | "linear"
  | "outline"
  | "bold"
  | "filled"
  | "duotone"
  | "two-tone"
  | "broken"
  | "mono";

export type IconCategory =
  | "interface"
  | "editor"
  | "arrows"
  | "media"
  | "communication"
  | "commerce"
  | "security"
  | "devices"
  | "files"
  | "weather"
  | "shapes";

export type IconVariant = {
  id: string;
  style: IconStyle;
  label: string;
  svg: string; // Inner SVG path/elements or full clean SVG string
  viewBox: string; // e.g., "0 0 24 24"
  supportsStroke: boolean;
  supportsColor: boolean;
  defaultStrokeWidth?: number;
};

export type IconMetadata = {
  author?: string;
  license?: string;
  source?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Icon = {
  id: string;
  name: string;
  slug: string;
  category: IconCategory | string;
  tags: string[];
  keywords: string[];
  style: IconStyle;
  variants: IconVariant[];
  svg: string;
  viewBox: string;
  popularity: number;
  updatedAt: string;
  relatedIconIds: string[];
  metadata?: IconMetadata;
};

export type IconCustomization = {
  color: string;
  background: string;
  size: number;
  strokeWidth?: number;
  strokeLinecap?: "butt" | "round" | "square";
  strokeLinejoin?: "miter" | "round" | "bevel";
  rotation: number;
  flipX: boolean;
  flipY: boolean;
};

export type Collection = {
  id: string;
  name: string;
  description?: string;
  iconIds: string[];
  createdAt: string;
  updatedAt: string;
};
```

## 2. Icon Repository Interface

```ts
export interface IconRepository {
  getAll(): Promise<Icon[]>;
  getBySlug(slug: string): Promise<Icon | undefined>;
  getById(id: string): Promise<Icon | undefined>;
  getByIds(ids: string[]): Promise<Icon[]>;
  search(query: string, options?: { category?: string; style?: IconStyle }): Promise<Icon[]>;
  getByCategory(category: string): Promise<Icon[]>;
  getByStyle(style: IconStyle): Promise<Icon[]>;
  getRelated(iconId: string): Promise<Icon[]>;
}
```

## 3. SVG Ingestion & Sanitization Guidelines
- All raw SVGs must be stripped of harmful tags (`<script>`, `<style>`, `onload=`, etc.) using a dedicated sanitizer.
- Attribute normalization: `stroke="currentColor"`, `fill="none"` or `fill="currentColor"` based on variant style.
- Dimensions default to `width="100%" height="100%"` with standard `viewBox="0 0 24 24"`.
