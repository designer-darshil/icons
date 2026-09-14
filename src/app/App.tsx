import React, { useState, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { router } from "@/app/router";
import { GridframeErrorBoundary } from "@/components/error/GridframeErrorBoundary";
import { AppLoader } from "@/components/system/AppLoader";

export const App: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Graceful startup sequence: ensure font metrics & initial render calibrate smoothly
    const initApp = async () => {
      try {
        if ("fonts" in document) {
          await Promise.race([
            document.fonts.ready,
            new Promise((resolve) => setTimeout(resolve, 600)),
          ]);
        }
      } catch {
        // Fallback gracefully on font API error
      } finally {
        const timer = setTimeout(() => {
          setIsInitializing(false);
        }, 450);
        return () => clearTimeout(timer);
      }
    };

    initApp();
  }, []);

  return (
    <GridframeErrorBoundary>
      <RouterProvider router={router} />
      <AnimatePresence>
        {isInitializing && (
          <motion.div
            key="app-boot-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35, ease: "easeInOut" } }}
            className="fixed inset-0 z-[9999] pointer-events-none"
          >
            <AppLoader
              fullscreen
              label="INITIALIZING WORKSTATION"
              sublabel="Calibrating vector catalog & optical metrics..."
            />
          </motion.div>
        )}
      </AnimatePresence>
    </GridframeErrorBoundary>
  );
};

