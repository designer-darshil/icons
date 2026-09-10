import type { IconCategory } from "./icon";

export type SortOption = "popular" | "name-asc" | "name-desc" | "newest";

export type StrokeWeightFilter = "all" | "regular" | "bold" | "stroke-only";

export interface FilterState {
  query: string;
  category: string; // 'all' or IconCategory
  style: string; // 'all' or IconStyle
  strokeWeight: StrokeWeightFilter;
  tag?: string;
  sort: SortOption;
}

export interface SearchSuggestion {
  text: string;
  category?: IconCategory | string;
  type: "tag" | "keyword" | "category" | "icon";
}
