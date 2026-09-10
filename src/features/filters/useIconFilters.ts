import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";
import type { FilterState, SortOption, StrokeWeightFilter } from "@/types/filters";

export function useIconFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: FilterState = useMemo(() => {
    return {
      query: searchParams.get("query") || searchParams.get("q") || "",
      category: searchParams.get("category") || searchParams.get("cat") || "all",
      style: searchParams.get("style") || "all",
      strokeWeight: (searchParams.get("weight") as StrokeWeightFilter) || "all",
      tag: searchParams.get("tag") || undefined,
      sort: (searchParams.get("sort") as SortOption) || "popular",
    };
  }, [searchParams]);

  const setFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K] | undefined) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (!value || value === "all" || value === "") {
            next.delete(key);
            if (key === "query") next.delete("q");
            if (key === "category") next.delete("cat");
            if (key === "strokeWeight") next.delete("weight");
          } else {
            next.set(key, String(value));
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  return {
    filters,
    setFilter,
    resetFilters,
  };
}
