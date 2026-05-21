import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import LoginPage from "@/pages/LoginPage";
import { createRootRoute } from "@tanstack/react-router";

function RootComponent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="app.loading_state"
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-xs">Initialising…</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <Layout />;
}

export const Route = createRootRoute({
  component: RootComponent,
});
