import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAgingReport,
  useDashboard,
  useInvoices,
  useMonthlyCashFlow,
  useParties,
} from "@/hooks/useQueries";
import { formatDate, formatINR, formatINRCompact } from "@/types";
import { InvoiceType } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  IndianRupee,
  Plus,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  colorClass,
  borderColorClass,
  icon: Icon,
  loading,
  badge,
}: {
  label: string;
  value: string;
  sub?: string;
  colorClass: string;
  borderColorClass: string;
  icon: React.ComponentType<{ className?: string }>;
  loading?: boolean;
  badge?: string;
}) {
  return (
    <div
      className={`bg-card border-l-2 ${borderColorClass} border border-border rounded p-3 relative`}
      data-ocid={`dashboard.stat.${label.toLowerCase().replace(/\s+/g, "_")}`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
        <Icon className={`w-3.5 h-3.5 ${colorClass}`} />
      </div>
      {loading ? (
        <Skeleton className="h-6 w-28 mt-1" />
      ) : (
        <div
          className={`text-xl font-semibold font-mono leading-tight ${colorClass}`}
        >
          {value}
        </div>
      )}
      {badge && (
        <div className="mt-1">
          {loading ? (
            <Skeleton className="h-4 w-16" />
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] bg-destructive/10 text-destructive rounded px-1.5 py-0.5 font-medium">
              <AlertCircle className="w-2.5 h-2.5" />
              {badge}
            </span>
          )}
        </div>
      )}
      {sub && !badge && (
        <div className="text-[10px] text-muted-foreground mt-1">{sub}</div>
      )}
    </div>
  );
}

// ─── Cash Flow Chart ──────────────────────────────────────────────────────────
function CashFlowChart() {
  const { data: flows, isLoading } = useMonthlyCashFlow(12n);

  const chartData = (flows ?? []).map((f) => ({
    month: f.month,
    inflow: f.inflow,
    outflow: f.outflow,
  }));

  return (
    <div
      className="bg-card border border-border rounded"
      data-ocid="dashboard.cashflow.card"
    >
      <div className="px-3 py-2 border-b border-border flex items-center justify-between">
        <h2 className="text-[11px] font-semibold text-foreground uppercase tracking-wide">
          Monthly Cash Flow
        </h2>
        <span className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-[oklch(0.65_0.2_145)]" />
            Inflow
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-[oklch(0.6_0.18_25)]" />
            Outflow
          </span>
        </span>
      </div>
      <div className="p-3">
        {isLoading ? (
          <Skeleton className="h-36 w-full" />
        ) : chartData.length === 0 ? (
          <div
            className="h-36 flex items-center justify-center"
            data-ocid="dashboard.cashflow.empty_state"
          >
            <p className="text-[11px] text-muted-foreground">
              No cash flow data yet
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={148}>
            <BarChart data={chartData} barGap={2} barSize={10}>
              <CartesianGrid
                vertical={false}
                stroke="oklch(0.88 0.003 260)"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 9, fill: "oklch(0.5 0.002 260)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 9, fill: "oklch(0.5 0.002 260)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => formatINRCompact(v)}
                width={48}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 11,
                  backgroundColor: "oklch(1.0 0.002 260)",
                  border: "1px solid oklch(0.88 0.003 260)",
                  borderRadius: 4,
                  padding: "4px 8px",
                }}
                formatter={(val: number, name: string) => [
                  formatINR(val),
                  name === "inflow" ? "Inflow" : "Outflow",
                ]}
              />
              <Bar
                dataKey="inflow"
                fill="oklch(0.65 0.2 145)"
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="outflow"
                fill="oklch(0.6 0.18 25)"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

// ─── Aging Table ──────────────────────────────────────────────────────────────
function AgingTable({
  title,
  invoiceType,
  ocid,
}: {
  title: string;
  invoiceType: InvoiceType;
  ocid: string;
}) {
  const { data: buckets, isLoading } = useAgingReport(invoiceType);

  const b0 = buckets?.find((b) => b.bucket === "0-30");
  const b30 = buckets?.find((b) => b.bucket === "30-60");
  const b60 = buckets?.find((b) => b.bucket === "60+");
  const total =
    (b0?.totalAmount ?? 0) + (b30?.totalAmount ?? 0) + (b60?.totalAmount ?? 0);

  return (
    <div className="bg-card border border-border rounded" data-ocid={ocid}>
      <div className="px-3 py-2 border-b border-border">
        <h2 className="text-[11px] font-semibold text-foreground uppercase tracking-wide">
          {title}
        </h2>
      </div>
      {isLoading ? (
        <div className="p-3 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ) : (
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="px-3 py-1.5 text-left text-[10px] font-medium text-muted-foreground">
                Age
              </th>
              <th className="px-3 py-1.5 text-right text-[10px] font-medium text-muted-foreground">
                Count
              </th>
              <th className="px-3 py-1.5 text-right text-[10px] font-medium text-muted-foreground">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "0–30 days", data: b0, warnClass: "text-foreground" },
              { label: "30–60 days", data: b30, warnClass: "text-yellow-600" },
              { label: "60+ days", data: b60, warnClass: "text-destructive" },
            ].map(({ label, data, warnClass }) => (
              <tr
                key={label}
                className="border-b border-border/50 hover:bg-muted/30"
              >
                <td className="px-3 py-1.5 text-[11px] text-muted-foreground">
                  {label}
                </td>
                <td
                  className={`px-3 py-1.5 text-right font-mono text-[11px] ${warnClass}`}
                >
                  {data ? Number(data.count) : 0}
                </td>
                <td
                  className={`px-3 py-1.5 text-right font-mono text-[11px] font-medium ${warnClass}`}
                >
                  {formatINR(data?.totalAmount ?? 0)}
                </td>
              </tr>
            ))}
            <tr className="bg-muted/20">
              <td className="px-3 py-1.5 text-[11px] font-semibold text-foreground">
                Total
              </td>
              <td className="px-3 py-1.5 text-right font-mono text-[11px] font-semibold text-foreground">
                {buckets ? buckets.reduce((s, b) => s + Number(b.count), 0) : 0}
              </td>
              <td className="px-3 py-1.5 text-right font-mono text-[11px] font-semibold text-foreground">
                {formatINR(total)}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  sent: {
    label: "Sent",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  paid: {
    label: "Paid",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  overdue: {
    label: "Overdue",
    className: "bg-destructive/10 text-destructive",
  },
  partiallyPaid: {
    label: "Partial",
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-muted text-muted-foreground line-through",
  },
};

function InvoiceStatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={`inline-flex items-center text-[10px] font-medium rounded px-1.5 py-0.5 ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

// ─── Recent Invoices ──────────────────────────────────────────────────────────
function RecentInvoices() {
  const { data: invoices, isLoading } = useInvoices(null, null);
  const { data: parties = [] } = useParties();
  const navigate = useNavigate();

  const partyMap = new Map(parties.map((p) => [String(p.id), p]));
  const recent = (invoices ?? []).slice(0, 5);

  return (
    <div
      className="bg-card border border-border rounded"
      data-ocid="dashboard.recent_invoices.card"
    >
      <div className="px-3 py-2 border-b border-border flex items-center justify-between">
        <h2 className="text-[11px] font-semibold text-foreground uppercase tracking-wide">
          Recent Invoices
        </h2>
        <button
          type="button"
          onClick={() => navigate({ to: "/invoices" })}
          className="text-[10px] text-primary hover:underline"
          data-ocid="dashboard.recent_invoices.link"
        >
          View all →
        </button>
      </div>
      {isLoading ? (
        <div className="p-3 space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      ) : recent.length === 0 ? (
        <div
          className="px-3 py-6 flex flex-col items-center justify-center"
          data-ocid="dashboard.recent_invoices.empty_state"
        >
          <p className="text-[11px] text-muted-foreground">
            No invoices yet. Create your first invoice.
          </p>
        </div>
      ) : (
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="px-3 py-1.5 text-left text-[10px] font-medium text-muted-foreground">
                Invoice #
              </th>
              <th className="px-3 py-1.5 text-left text-[10px] font-medium text-muted-foreground">
                Party
              </th>
              <th className="px-3 py-1.5 text-left text-[10px] font-medium text-muted-foreground">
                Date
              </th>
              <th className="px-3 py-1.5 text-right text-[10px] font-medium text-muted-foreground">
                Amount
              </th>
              <th className="px-3 py-1.5 text-right text-[10px] font-medium text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {recent.map((inv, idx) => {
              const statusKey =
                typeof inv.status === "object"
                  ? Object.keys(inv.status)[0]
                  : String(inv.status);
              const partyName =
                partyMap.get(String(inv.partyId))?.name ?? String(inv.partyId);
              return (
                <tr
                  key={String(inv.id)}
                  tabIndex={0}
                  className="border-b border-border/50 hover:bg-muted/30 cursor-pointer"
                  onClick={() => navigate({ to: "/invoices" })}
                  onKeyDown={(e) =>
                    e.key === "Enter" && navigate({ to: "/invoices" })
                  }
                  data-ocid={`dashboard.recent_invoices.item.${idx + 1}`}
                >
                  <td className="px-3 py-1.5 font-mono text-[11px] text-primary">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-3 py-1.5 text-[11px] text-foreground max-w-[120px] truncate">
                    {partyName}
                  </td>
                  <td className="px-3 py-1.5 text-[11px] text-muted-foreground">
                    {formatDate(inv.createdAt)}
                  </td>
                  <td className="px-3 py-1.5 text-right font-mono text-[11px] font-medium text-foreground">
                    {formatINR(inv.grandTotal)}
                  </td>
                  <td className="px-3 py-1.5 text-right">
                    <InvoiceStatusBadge status={statusKey} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: summary, isLoading } = useDashboard();
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-3" data-ocid="dashboard.page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold text-foreground">Dashboard</h1>
          <p className="text-[10px] text-muted-foreground">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-[11px] gap-1.5 px-2.5"
            onClick={() => navigate({ to: "/clients" })}
            data-ocid="dashboard.add_client_button"
          >
            <UserPlus className="w-3 h-3" />
            Add Client
          </Button>
          <Button
            size="sm"
            className="h-7 text-[11px] gap-1.5 px-2.5"
            onClick={() => navigate({ to: "/invoices" })}
            data-ocid="dashboard.new_invoice_button"
          >
            <Plus className="w-3 h-3" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <StatCard
          label="Total Sales"
          value={summary ? formatINRCompact(summary.totalSales) : "—"}
          sub="All invoices"
          colorClass="text-[oklch(0.55_0.18_145)]"
          borderColorClass="border-l-[oklch(0.65_0.2_145)]"
          icon={TrendingUp}
          loading={isLoading}
        />
        <StatCard
          label="Receivables"
          value={
            summary ? formatINRCompact(summary.outstandingReceivables) : "—"
          }
          colorClass="text-[oklch(0.6_0.16_50)]"
          borderColorClass="border-l-[oklch(0.65_0.2_50)]"
          icon={IndianRupee}
          loading={isLoading}
          badge={
            summary && Number(summary.overdueInvoicesCount) > 0
              ? `${Number(summary.overdueInvoicesCount)} overdue`
              : undefined
          }
        />
        <StatCard
          label="Total Purchases"
          value={summary ? formatINRCompact(summary.totalPurchases) : "—"}
          sub="All bills"
          colorClass="text-[oklch(0.5_0.14_230)]"
          borderColorClass="border-l-[oklch(0.55_0.16_230)]"
          icon={ShoppingCart}
          loading={isLoading}
        />
        <StatCard
          label="Payables"
          value={summary ? formatINRCompact(summary.outstandingPayables) : "—"}
          sub="Outstanding"
          colorClass="text-destructive"
          borderColorClass="border-l-destructive"
          icon={TrendingDown}
          loading={isLoading}
        />
      </div>

      {/* Cash Flow Chart */}
      <CashFlowChart />

      {/* Aging Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
        <AgingTable
          title="Receivables Aging"
          invoiceType={InvoiceType.sales}
          ocid="dashboard.receivables_aging.card"
        />
        <AgingTable
          title="Payables Aging"
          invoiceType={InvoiceType.purchase}
          ocid="dashboard.payables_aging.card"
        />
      </div>

      {/* Recent Invoices */}
      <RecentInvoices />
    </div>
  );
}
