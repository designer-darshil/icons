import React, { useState, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { router } from "@/app/router";
import { GridframeErrorBoundary } from "@/components/error/GridframeErrorBoundary";
import { AppLoader } from "@/components/system/AppLoader";
import type { LoaderState } from "@/components/system/GridframeLoader";

export const App: React.FC = () => {
  const [bootState, setBootState] = useState<LoaderState>("initializing");
  const [isInitializing, setIsInitializing] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  useEffect(() => {
    let isMounted = true;
    const startTime = Date.now();
    const MIN_LOAD_DURATION_MS = 600; // Prevent jarring sub-frame flicker on ultra-fast cache/hot-reload

    // Graceful startup sequence: ensure font metrics & initial render calibrate smoothly
    const initApp = async () => {
      try {
        setBootState("initializing");

        // 1. Check fonts ready
        if ("fonts" in document) {
          await Promise.race([
            document.fonts.ready,
            new Promise((resolve) => setTimeout(resolve, 800)),
          ]);
        }

        if (!isMounted) return;
        setBootState("loading");

        // 2. Ensure minimum display time to avoid 50ms flashing
        const elapsed = Date.now() - startTime;
        if (elapsed < MIN_LOAD_DURATION_MS) {
          await new Promise((resolve) => setTimeout(resolve, MIN_LOAD_DURATION_MS - elapsed));
        }

        if (!isMounted) return;
        setBootState("ready");

        // Brief delay before unmounting overlay smoothly
        setTimeout(() => {
          if (isMounted) {
            setIsInitializing(false);
          }
        }, 150);
      } catch (err: unknown) {
        if (!isMounted) return;
        console.error("App boot initialization error:", err);
        setBootState("error");
        setErrorMessage(err instanceof Error ? err.message : "Initialization failed.");
      }
    };

    initApp();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRetryBoot = () => {
    setBootState("initializing");
    setErrorMessage(undefined);
    window.location.reload();
  };

  return (
    <GridframeErrorBoundary>
      <RouterProvider router={router} />
      <AnimatePresence>
        {isInitializing && (
          <motion.div
            key="app-boot-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } }}
            className="fixed inset-0 z-[9999] pointer-events-none"
          >
            <AppLoader
              fullscreen
              state={bootState}
              errorMessage={errorMessage}
              onRetry={handleRetryBoot}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </GridframeErrorBoundary>
  );
};

export default App;
