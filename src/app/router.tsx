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
import { GridframeRouteError } from "@/components/error/GridframeRouteError";

// Admin Module Routes & Shell
import { AdminShell } from "@/features/admin/layout/AdminShell";
import { AdminAuthProvider } from "@/features/admin/auth/AdminAuthContext";
import { AdminLoginRoute } from "@/routes/admin/AdminLoginRoute";
import { AdminDashboardRoute } from "@/routes/admin/AdminDashboardRoute";
import { AdminIconsRoute } from "@/routes/admin/AdminIconsRoute";
import { AdminIconDetailRoute } from "@/routes/admin/AdminIconDetailRoute";
import { AdminCategoriesRoute } from "@/routes/admin/AdminCategoriesRoute";
import { AdminStylesRoute } from "@/routes/admin/AdminStylesRoute";
import { AdminCollectionsRoute } from "@/routes/admin/AdminCollectionsRoute";
import { AdminUsersRoute } from "@/routes/admin/AdminUsersRoute";
import { AdminActivityRoute } from "@/routes/admin/AdminActivityRoute";
import { AdminSettingsRoute } from "@/routes/admin/AdminSettingsRoute";

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
        path: "icons/:id",
        element: <AdminIconDetailRoute />,
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
