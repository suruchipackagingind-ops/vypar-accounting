import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { LogOut, PanelLeftClose, PanelLeftOpen, User } from "lucide-react";

interface HeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function Header({ sidebarCollapsed, onToggleSidebar }: HeaderProps) {
  const { isAuthenticated, principal, logout } = useAuth();
  const { profile } = useProfile();

  const principalShort = principal
    ? `${principal.toString().slice(0, 8)}…`
    : "";

  const displayName = profile?.name || principalShort || "User";

  return (
    <header
      className="h-12 bg-card border-b border-border flex items-center px-4 gap-3 flex-shrink-0"
      data-ocid="header.panel"
    >
      <button
        type="button"
        onClick={onToggleSidebar}
        className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        data-ocid="header.sidebar_toggle"
      >
        {sidebarCollapsed ? (
          <PanelLeftOpen className="w-4 h-4" />
        ) : (
          <PanelLeftClose className="w-4 h-4" />
        )}
      </button>

      {/* Breadcrumb / title area */}
      <div className="flex-1 min-w-0">
        <span className="text-xs text-muted-foreground font-mono">
          GST Accounting
        </span>
      </div>

      {/* Right side */}
      {isAuthenticated && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted transition-colors"
              data-ocid="header.user_menu_toggle"
            >
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-xs font-medium text-foreground max-w-[120px] truncate">
                {displayName}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="text-xs">
              <div className="font-medium">{displayName}</div>
              {principal && (
                <div className="text-muted-foreground font-mono text-[10px] mt-0.5 truncate">
                  {principal.toString()}
                </div>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              className="text-xs text-destructive focus:text-destructive cursor-pointer"
              data-ocid="header.logout_button"
            >
              <LogOut className="w-3.5 h-3.5 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
