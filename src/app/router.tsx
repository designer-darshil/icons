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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
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
]);
