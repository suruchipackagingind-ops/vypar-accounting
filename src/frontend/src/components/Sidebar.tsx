import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  CreditCard,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    ocid: "nav.dashboard",
  },
  {
    label: "Clients & Vendors",
    path: "/clients",
    icon: Users,
    ocid: "nav.clients",
  },
  {
    label: "Invoices & Bills",
    path: "/invoices",
    icon: FileText,
    ocid: "nav.invoices",
  },
  {
    label: "Payments",
    path: "/payments",
    icon: CreditCard,
    ocid: "nav.payments",
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
    ocid: "nav.settings",
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onClose?: () => void;
}

export function Sidebar({ collapsed = false, onClose }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col bg-card border-r border-border h-full transition-all duration-200",
        collapsed ? "w-0 overflow-hidden" : "w-[220px] min-w-[220px]",
      )}
      data-ocid="sidebar.panel"
    >
      {/* Brand header */}
      <div className="flex items-center justify-between h-12 px-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-primary flex items-center justify-center flex-shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-4 h-4 text-primary-foreground"
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
          <span className="text-sm font-semibold text-foreground whitespace-nowrap">
            Vyapar Pro
          </span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-muted text-muted-foreground"
            aria-label="Close sidebar"
            data-ocid="sidebar.close_button"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            data-ocid={item.ocid}
            className={cn(
              "flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground",
              "hover:bg-muted hover:text-foreground transition-colors duration-150",
              "[&.active]:bg-primary/10 [&.active]:text-primary [&.active]:font-medium",
            )}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer branding */}
      <div className="px-4 py-3 border-t border-border flex-shrink-0">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </aside>
  );
}
