import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/cn";
import { Grid, Tag, Palette, Heart, FolderHeart } from "lucide-react";
import { useFavorites } from "@/features/favorites/useFavorites";
import { useCollections } from "@/features/collections/useCollections";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
}

export interface PrimaryNavigationProps {
  className?: string;
  onItemClick?: () => void;
}

export const PrimaryNavigation: React.FC<PrimaryNavigationProps> = ({
  className,
  onItemClick,
}) => {
  const { count: favoriteCount } = useFavorites();
  const { count: collectionCount } = useCollections();

  const navItems: NavItem[] = [
    {
      label: "Icons",
      href: "/icons",
      icon: <Grid className="w-4 h-4" />,
    },
    {
      label: "Categories",
      href: "/categories",
      icon: <Tag className="w-4 h-4" />,
    },
    {
      label: "Styles",
      href: "/styles",
      icon: <Palette className="w-4 h-4" />,
    },
    {
      label: "Favorites",
      href: "/favorites",
      icon: <Heart className="w-4 h-4" />,
      badge: favoriteCount > 0 ? favoriteCount : undefined,
    },
    {
      label: "Collections",
      href: "/collections",
      icon: <FolderHeart className="w-4 h-4" />,
      badge: collectionCount > 0 ? collectionCount : undefined,
    },
  ];

  return (
    <nav
      aria-label="Primary Navigation"
      className={cn("flex items-center gap-1", className)}
    >
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          onClick={onItemClick}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              isActive
                ? "bg-bg-subtle text-text-primary shadow-sm border border-border-default font-semibold"
                : "text-text-secondary hover:text-text-primary hover:bg-bg-subtle/60"
            )
          }
        >
          {item.icon}
          <span>{item.label}</span>
          {item.badge !== undefined && (
            <span className="text-[10px] bg-bg-surface-elevated px-1.5 py-0.2 rounded-full border border-border-subtle font-mono text-text-muted">
              {item.badge}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
