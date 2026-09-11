import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MobileNavigation } from "@/components/navigation/MobileNavigation";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";
import { IconButton } from "@/components/ui/IconButton";
import { Zap, Menu, Search } from "lucide-react";

export interface MobileHeaderProps {
  onSearchClick?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onSearchClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="flex md:hidden h-14 border-b border-border-subtle bg-bg-surface sticky top-0 z-30 px-4 items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <IconButton
            aria-label="Open navigation menu"
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </IconButton>
          <Link to="/icons" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-sm">
              <Zap className="w-4 h-4" />
            </div>
            <span className="font-semibold tracking-tight text-sm">Glyphroom</span>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1.5">
          <IconButton
            aria-label="Search icons"
            variant="ghost"
            size="sm"
            onClick={onSearchClick}
          >
            <Search className="w-4 h-4" />
          </IconButton>
          <ThemeToggle compact />
        </div>
      </header>

      {/* Drawer */}
      <MobileNavigation isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};
