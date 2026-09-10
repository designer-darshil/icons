import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { IconButton } from "@/components/ui/IconButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useFavorites } from "@/features/favorites/useFavorites";
import { useCollections } from "@/features/collections/useCollections";
import { X, Zap, Grid, Tag, Palette, Heart, FolderHeart } from "lucide-react";
import { cn } from "@/lib/cn";

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onClose }) => {
  const prefersReducedMotion = useReducedMotion();
  const { count: favoriteCount } = useFavorites();
  const { count: collectionCount } = useCollections();

  const navItems = [
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

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  const drawerVariants = {
    closed: { x: "-100%" },
    open: { x: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Mobile Navigation Menu">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            initial="closed"
            animate="open"
            exit="closed"
            variants={prefersReducedMotion ? undefined : overlayVariants}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Drawer Content */}
          <motion.div
            className="relative w-4/5 max-w-xs bg-bg-surface border-r border-border-subtle h-full flex flex-col shadow-dialog z-10"
            initial="closed"
            animate="open"
            exit="closed"
            variants={prefersReducedMotion ? undefined : drawerVariants}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-sm">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="font-semibold tracking-tight text-base">Glyphroom</span>
              </div>
              <IconButton
                aria-label="Close menu"
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </IconButton>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 p-4 overflow-y-auto space-y-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-text-muted px-3 block mb-2">
                Workspace
              </span>
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors select-none",
                      isActive
                        ? "bg-bg-subtle text-primary border border-border-default shadow-sm"
                        : "text-text-secondary hover:text-text-primary hover:bg-bg-subtle/50"
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="text-xs bg-bg-surface-elevated px-2 py-0.5 rounded-full border border-border-subtle font-mono text-text-muted">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Footer with Theme Selector */}
            <div className="p-4 border-t border-border-subtle bg-bg-surface-subtle space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">Theme</span>
                <ThemeToggle />
              </div>
              <div className="pt-2 flex items-center justify-between text-xs text-text-muted">
                <span>v0.1.0 • Workstation</span>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-text-primary flex items-center gap-1 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
