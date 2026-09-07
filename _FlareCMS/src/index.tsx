import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  redirect,
  RouterProvider,
  useParams,
} from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { ThemeProvider } from "@mui/material/styles";

import { theme } from "./theme";
import adminRouter from "./admin/index";
import "./i18n";
import "./site/site.css";
import { SiteLayout } from "./site/SiteLayout";
import HomePage from "./site/HomePage";
import { ContentPage } from "./site/ContentPage";
import { SimplePage } from "./site/SimplePage";
import EventPage from "./site/EventPage";
import DonatePage from "./site/DonatePage";
import NotFoundPage from "./site/NotFoundPage";
import { findRecord, isLang, useSiteRecords } from "./site/api";

const AppGlobalStyles = (
  <GlobalStyles
    styles={{
      "html, body, #root, .App": {
        height: "100%",
      },
      "*": {
        scrollbarWidth: "thin",
        scrollbarColor: "#333333 #1a1a1a",
      },
    }}
  />
);

/** MUI dark chrome for login/install/admin only; the public site stays unstyled by MUI. */
function AdminShell() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {AppGlobalStyles}
      <div className="App">
        <Outlet />
      </div>
    </ThemeProvider>
  );
}

async function rootLoader({ request }: { request: Request }) {
  try {
    const res = await fetch("/api/options");
    const options: Record<string, string> = await res.json();

    if (
      options["error"] === "Secret not set" &&
      new URL(request.url).pathname !== "/install"
    )
      return redirect("/install");

    return options;
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}

/** Chooses the page component by the record template of the matched slug. */
function SlugDispatcher() {
  const { lang: rawLang, slug } = useParams();
  const { records, loading, error } = useSiteRecords();
  const lang = isLang(rawLang) ? rawLang : undefined;

  if (!lang || error) return <NotFoundPage />;
  if (loading) return null;
  const record = records ? findRecord(records, slug) : undefined;
  if (!record) return <NotFoundPage />;
  if (record.template === "simple") return <SimplePage />;
  if (record.template === "content") return <ContentPage />;
  // Events have their own route; shared-content records are not public pages.
  return <NotFoundPage />;
}

const router = createBrowserRouter([
  {
    path: "/",
    id: "root",
    loader: rootLoader,
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <Navigate to="/en" replace />,
      },
      {
        path: "donate",
        loader: () => redirect("/en/donate"),
      },
      {
        path: "events/:slug",
        loader: ({ params }) => redirect(`/en/events/${params.slug}`),
      },
      {
        element: <AdminShell />,
        children: [
          {
            path: "login",
            lazy: async () => {
              const Component = (await import("./Login")).default;
              return { Component };
            },
          },
          {
            path: "install",
            lazy: async () => {
              const Component = (await import("./Install")).default;
              return { Component };
            },
          },
          {
            path: "admin",
            children: adminRouter,
          },
        ],
      },
      {
        path: ":lang",
        element: <SiteLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "donate", element: <DonatePage /> },
          { path: "events/:slug", element: <EventPage /> },
          { path: ":slug", element: <SlugDispatcher /> },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
