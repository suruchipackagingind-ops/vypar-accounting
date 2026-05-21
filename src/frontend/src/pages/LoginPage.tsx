import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const { login, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded bg-primary flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-5 h-5 text-primary-foreground"
              role="img"
              aria-label="Vyapar Pro logo"
            >
              <path
                d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z"
                fill="currentColor"
                opacity=".7"
              />
              <path
                d="M6 6h2v2H6zM16 6h2v2h-2zM6 16h2v2H6zM16 16h2v2h-2z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground leading-none">
              Vyapar Pro
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Accounting & Billing
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-1">
            Sign in to your account
          </h2>
          <p className="text-xs text-muted-foreground mb-5">
            Secure login via Internet Identity — no passwords required.
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                GST-compliant invoices with IGST/CGST+SGST
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                Client & vendor management with GSTIN validation
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                Payment tracking with aging reports
              </p>
            </div>
          </div>

          <Button
            className="w-full mt-6 h-9 text-sm"
            onClick={() => login()}
            disabled={isLoading}
            data-ocid="login.submit_button"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                Signing in…
              </>
            ) : (
              "Login with Internet Identity"
            )}
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Powered by Internet Computer · Decentralised & Secure
        </p>
      </div>
    </div>
  );
}
