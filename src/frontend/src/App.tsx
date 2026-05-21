import { RouterProvider, createRouter } from "@tanstack/react-router";
import { createRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Route as rootRoute } from "./routes/__root";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ClientsPage = lazy(() => import("./pages/ClientsPage"));
const InvoicesPage = lazy(() => import("./pages/InvoicesPage"));
const PaymentsPage = lazy(() => import("./pages/PaymentsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

const PageFallback = () => (
  <div
    className="flex items-center justify-center h-32"
    data-ocid="page.loading_state"
  >
    <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

function withSuspense(Component: React.ComponentType) {
  return function Wrapped() {
    return (
      <Suspense fallback={<PageFallback />}>
        <Component />
      </Suspense>
    );
  };
}

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: withSuspense(DashboardPage),
});

const clientsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/clients",
  component: withSuspense(ClientsPage),
});

const invoicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/invoices",
  component: withSuspense(InvoicesPage),
});

const paymentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payments",
  component: withSuspense(PaymentsPage),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: withSuspense(SettingsPage),
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  clientsRoute,
  invoicesRoute,
  paymentsRoute,
  settingsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
