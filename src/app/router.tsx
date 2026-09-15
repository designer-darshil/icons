import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { IconsRoute } from "@/routes/IconsRoute";
import { FavoritesRoute } from "@/routes/FavoritesRoute";
import { CollectionsRoute } from "@/routes/CollectionsRoute";
import { CategoriesRoute } from "@/routes/CategoriesRoute";
import { StylesRoute } from "@/routes/StylesRoute";
import { IconDetailRoute } from "@/routes/IconDetailRoute";
import { DesignSystemRoute } from "@/routes/DesignSystemRoute";
import { DevQARoute } from "@/routes/DevQARoute";
import { IconRenderingQARoute } from "@/routes/IconRenderingQARoute";
import { IconoirQARoute } from "@/routes/IconoirQARoute";
import { NotFoundRoute } from "@/routes/NotFoundRoute";
import { CompareRoute } from "@/routes/CompareRoute";
import { PrivacyRoute } from "@/routes/PrivacyRoute";
import { TermsRoute } from "@/routes/TermsRoute";
import { AboutRoute } from "@/routes/AboutRoute";
import { IntelligenceRoute } from "@/routes/IntelligenceRoute";
import { GridframeRouteError } from "@/components/error/GridframeRouteError";

// Admin Module Routes & Shell
import { AdminShell } from "@/features/admin/layout/AdminShell";
import { AdminAuthProvider } from "@/features/admin/auth/AdminAuthContext";
import { AdminLoginRoute } from "@/routes/admin/AdminLoginRoute";
import { AdminDashboardRoute } from "@/routes/admin/AdminDashboardRoute";
import { AdminIconsRoute } from "@/routes/admin/AdminIconsRoute";
import { AdminIconNewRoute } from "@/routes/admin/AdminIconNewRoute";
import { AdminIconDetailRoute } from "@/routes/admin/AdminIconDetailRoute";
import { AdminCategoriesRoute } from "@/routes/admin/AdminCategoriesRoute";
import { AdminStylesRoute } from "@/routes/admin/AdminStylesRoute";
import { AdminCollectionsRoute } from "@/routes/admin/AdminCollectionsRoute";
import { AdminUsersRoute } from "@/routes/admin/AdminUsersRoute";
import { AdminActivityRoute } from "@/routes/admin/AdminActivityRoute";
import { AdminSettingsRoute } from "@/routes/admin/AdminSettingsRoute";
import { AdminHealthRoute } from "@/routes/admin/AdminHealthRoute";
import { AdminSvgRepairRoute } from "@/routes/admin/AdminSvgRepairRoute";
import { AdminDuplicatesRoute } from "@/routes/admin/AdminDuplicatesRoute";
import { AdminCoverageRoute } from "@/routes/admin/AdminCoverageRoute";
import { AdminTaxonomyRoute } from "@/routes/admin/AdminTaxonomyRoute";
import { AdminSetBuilderRoute } from "@/routes/admin/AdminSetBuilderRoute";
import { AdminSourcesRoute } from "@/routes/admin/AdminSourcesRoute";

export const router = createBrowserRouter([
  // Public Client Routes
  {
    path: "/",
    element: <AppShell />,
    errorElement: <GridframeRouteError />,
    children: [
      {
        index: true,
        element: <Navigate to="/icons" replace />,
      },
      {
        path: "icons",
        element: <IconsRoute />,
      },
      {
        path: "icons/:slug",
        element: <IconDetailRoute />,
      },
      {
        path: "categories",
        element: <CategoriesRoute />,
      },
      {
        path: "categories/:category",
        element: <CategoriesRoute />,
      },
      {
        path: "styles",
        element: <StylesRoute />,
      },
      {
        path: "styles/:style",
        element: <StylesRoute />,
      },
      {
        path: "favorites",
        element: <FavoritesRoute />,
      },
      {
        path: "collections",
        element: <CollectionsRoute />,
      },
      {
        path: "collections/:id",
        element: <CollectionsRoute />,
      },
      {
        path: "compare",
        element: <CompareRoute />,
      },
      {
        path: "intelligence",
        element: <IntelligenceRoute />,
      },
      {
        path: "intelligence/:tool",
        element: <IntelligenceRoute />,
      },
      {
        path: "intelligence/:tool/:slug",
        element: <IntelligenceRoute />,
      },
      {
        path: "dev/design-system",
        element: <DesignSystemRoute />,
      },
      {
        path: "design-system",
        element: <DesignSystemRoute />,
      },
      {
        path: "dev/iconoir",
        element: <IconoirQARoute />,
      },
      {
        path: "dev/icons",
        element: <IconoirQARoute />,
      },
      {
        path: "dev/icon-rendering",
        element: <IconRenderingQARoute />,
      },
      {
        path: "icon-rendering",
        element: <IconRenderingQARoute />,
      },
      {
        path: "dev/qa",
        element: <DevQARoute />,
      },
      {
        path: "qa",
        element: <DevQARoute />,
      },
      {
        path: "privacy",
        element: <PrivacyRoute />,
      },
      {
        path: "terms",
        element: <TermsRoute />,
      },
      {
        path: "about",
        element: <AboutRoute />,
      },
      {
        path: "contact",
        element: <AboutRoute />,
      },
      {
        path: "*",
        element: <NotFoundRoute />,
      },
    ],
  },

  // Protected Admin Management Area
  {
    path: "/admin",
    element: <AdminShell />,
    errorElement: <GridframeRouteError />,
    children: [
      {
        index: true,
        element: <AdminDashboardRoute />,
      },
      {
        path: "icons",
        element: <AdminIconsRoute />,
      },
      {
        path: "icons/new",
        element: <AdminIconNewRoute />,
      },
      {
        path: "icons/:id",
        element: <AdminIconDetailRoute />,
      },
      {
        path: "health",
        element: <AdminHealthRoute />,
      },
      {
        path: "svg-repair",
        element: <AdminSvgRepairRoute />,
      },
      {
        path: "duplicates",
        element: <AdminDuplicatesRoute />,
      },
      {
        path: "coverage",
        element: <AdminCoverageRoute />,
      },
      {
        path: "taxonomy",
        element: <AdminTaxonomyRoute />,
      },
      {
        path: "set-builder",
        element: <AdminSetBuilderRoute />,
      },
      {
        path: "sources",
        element: <AdminSourcesRoute />,
      },
      {
        path: "categories",
        element: <AdminCategoriesRoute />,
      },
      {
        path: "styles",
        element: <AdminStylesRoute />,
      },
      {
        path: "collections",
        element: <AdminCollectionsRoute />,
      },
      {
        path: "users",
        element: <AdminUsersRoute />,
      },
      {
        path: "activity",
        element: <AdminActivityRoute />,
      },
      {
        path: "settings",
        element: <AdminSettingsRoute />,
      },
    ],
  },

  // Admin Authentication Portal
  {
    path: "/admin/login",
    element: (
      <AdminAuthProvider>
        <AdminLoginRoute />
      </AdminAuthProvider>
    ),
    errorElement: <GridframeRouteError />,
  },
]);
