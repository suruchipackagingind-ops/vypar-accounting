import { QUERY_KEYS } from "@/api";
import { createActor } from "@/backend";
import { RecordPaymentModal } from "@/components/RecordPaymentModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAgingReport, useInvoices, useParties } from "@/hooks/useQueries";
import {
  type AgingBucket,
  type InvoiceInfo,
  InvoiceStatus,
  InvoiceType,
  type PartyInfo,
  type Payment,
  PaymentMethod,
} from "@/types";
import { formatDate, formatINR } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  CreditCard,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";

type TabType = "receivables" | "payables";
type FilterType = "all" | "outstanding" | "paid";

const METHOD_BADGE: Record<
  PaymentMethod,
  { label: string; className: string }
> = {
  [PaymentMethod.cash]: {
    label: "Cash",
    className: "bg-muted text-muted-foreground",
  },
  [PaymentMethod.bank]: {
    label: "Bank",
    className: "bg-primary/10 text-primary",
  },
  [PaymentMethod.cheque]: {
    label: "Cheque",
    className: "bg-accent/10 text-accent-foreground",
  },
  [PaymentMethod.upi]: {
    label: "UPI",
    className: "bg-chart-1/10 text-chart-1",
  },
};

function useAllPayments(invoices: InvoiceInfo[]) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<
    { payment: Payment; invoiceNumber: string; partyId: bigint }[]
  >({
    queryKey: ["all-payments", invoices.map((i) => i.id.toString()).join(",")],
    queryFn: async () => {
      if (!actor || invoices.length === 0) return [];
      const results = await Promise.all(
        invoices.map(async (inv) => {
          const payments = await actor.listPaymentsForInvoice(inv.id);
          return payments.map((p) => ({
            payment: p,
            invoiceNumber: inv.invoiceNumber,
            partyId: inv.partyId,
          }));
        }),
      );
      return results
        .flat()
        .sort((a, b) => Number(b.payment.paymentDate - a.payment.paymentDate));
    },
    enabled: !!actor && !isFetching && invoices.length > 0,
  });
}

function daysOverdue(dueDateNs?: bigint): number {
  if (!dueDateNs) return 0;
  const nowMs = Date.now();
  const dueMs = Number(dueDateNs / 1_000_000n);
  return dueMs < nowMs ? Math.floor((nowMs - dueMs) / 86_400_000) : 0;
}

function AgingTable({
  buckets,
  loading,
}: { buckets: AgingBucket[]; loading: boolean }) {
  if (loading) return <Skeleton className="h-10 w-full" />;
  return (
    <div className="border border-border rounded overflow-hidden">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-muted/60">
            {["0–30 Days", "30–60 Days", "60+ Days"].map((h) => (
              <th
                key={h}
                className="px-3 py-1.5 text-muted-foreground font-medium text-right first:text-left"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="bg-card">
            {["0-30", "31-60", "60+"].map((key) => {
              const bucket = buckets.find((b) => b.bucket === key);
              return (
                <td
                  key={key}
                  className="px-3 py-1.5 text-right first:text-left font-mono"
                >
                  {bucket ? (
                    <span
                      className={
                        key === "60+" && bucket.totalAmount > 0
                          ? "text-destructive font-semibold"
                          : ""
                      }
                    >
                      {formatINR(bucket.totalAmount)}
                      <span className="text-muted-foreground ml-1">
                        ({bucket.count.toString()})
                      </span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function InvoiceTable({
  invoices,
  parties,
  filter,
  onRecord,
}: {
  invoices: InvoiceInfo[];
  parties: PartyInfo[];
  filter: FilterType;
  onRecord: (id: bigint) => void;
}) {
  const partyMap = new Map(parties.map((p) => [p.id.toString(), p]));

  const filtered = invoices.filter((inv) => {
    if (filter === "outstanding")
      return (
        inv.grandTotal - inv.amountPaid > 0.01 &&
        inv.status !== InvoiceStatus.cancelled
      );
    if (filter === "paid") return inv.status === InvoiceStatus.paid;
    return inv.status !== InvoiceStatus.cancelled;
  });

  if (filtered.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-12 gap-2"
        data-ocid="payments.empty_state"
      >
        <AlertCircle className="w-8 h-8 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">
          No invoices found
        </p>
        <p className="text-xs text-muted-foreground">
          Adjust the filter or create new invoices
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <table className="w-full text-xs min-w-[700px]">
        <thead>
          <tr className="bg-muted/60 border-b border-border">
            {[
              "Invoice #",
              "Party",
              "Total",
              "Paid",
              "Balance",
              "Due Date",
              "Overdue",
              "Action",
            ].map((h) => (
              <th
                key={h}
                className="px-3 py-2 text-muted-foreground font-medium text-left last:text-right"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {filtered.map((inv, idx) => {
            const party = partyMap.get(inv.partyId.toString());
            const balance = inv.grandTotal - inv.amountPaid;
            const overdue = daysOverdue(inv.dueDate);
            const isOverdue = overdue > 0 && inv.status !== InvoiceStatus.paid;
            const canRecord =
              balance > 0.01 &&
              inv.status !== InvoiceStatus.cancelled &&
              inv.status !== InvoiceStatus.paid;
            const ocidIdx = idx + 1;
            return (
              <tr
                key={inv.id.toString()}
                className="hover:bg-muted/30 transition-colors"
                data-ocid={`payments.item.${ocidIdx}`}
              >
                <td className="px-3 py-2 font-mono font-medium text-foreground">
                  {inv.invoiceNumber}
                </td>
                <td className="px-3 py-2 text-foreground max-w-[160px] truncate">
                  {party?.name ?? "—"}
                </td>
                <td className="px-3 py-2 text-right font-mono">
                  {formatINR(inv.grandTotal)}
                </td>
                <td className="px-3 py-2 text-right font-mono text-chart-1">
                  {inv.amountPaid > 0 ? formatINR(inv.amountPaid) : "—"}
                </td>
                <td className="px-3 py-2 text-right font-mono font-semibold">
                  {balance > 0.01 ? (
                    formatINR(balance)
                  ) : (
                    <span className="text-chart-1">Paid</span>
                  )}
                </td>
                <td className="px-3 py-2 text-muted-foreground">
                  {inv.dueDate ? formatDate(inv.dueDate) : "—"}
                </td>
                <td className="px-3 py-2">
                  {isOverdue ? (
                    <span className="text-destructive font-semibold">
                      {overdue}d
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-3 py-2 text-right">
                  {canRecord && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-6 text-xs px-2"
                      onClick={() => onRecord(inv.id)}
                      data-ocid={`payments.record_button.${ocidIdx}`}
                    >
                      Record
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function PaymentHistoryTable({
  payments,
  parties,
  loading,
}: {
  payments: { payment: Payment; invoiceNumber: string; partyId: bigint }[];
  parties: PartyInfo[];
  loading: boolean;
}) {
  const partyMap = new Map(parties.map((p) => [p.id.toString(), p]));

  if (loading)
    return (
      <div className="space-y-1 p-4">
        {[...Array(5)].map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders have no stable id
          <Skeleton key={`skel-${i}`} className="h-8 w-full" />
        ))}
      </div>
    );
  if (payments.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-10"
        data-ocid="payments-history.empty_state"
      >
        <CreditCard className="w-7 h-7 text-muted-foreground/40 mb-2" />
        <p className="text-xs text-muted-foreground">No payment records yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <table className="w-full text-xs min-w-[600px]">
        <thead>
          <tr className="bg-muted/60 border-b border-border">
            {["Invoice #", "Party", "Date", "Amount", "Method", "Notes"].map(
              (h) => (
                <th
                  key={h}
                  className="px-3 py-2 text-muted-foreground font-medium text-left last:text-left"
                >
                  {h}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {payments.map(({ payment, invoiceNumber, partyId }, idx) => {
            const party = partyMap.get(partyId.toString());
            const mb = METHOD_BADGE[payment.method];
            return (
              <tr
                key={payment.id.toString()}
                className="hover:bg-muted/30"
                data-ocid={`payment-history.item.${idx + 1}`}
              >
                <td className="px-3 py-2 font-mono font-medium">
                  {invoiceNumber}
                </td>
                <td className="px-3 py-2 max-w-[160px] truncate">
                  {party?.name ?? "—"}
                </td>
                <td className="px-3 py-2 text-muted-foreground">
                  {formatDate(payment.paymentDate)}
                </td>
                <td className="px-3 py-2 font-mono font-semibold">
                  {formatINR(payment.amount)}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${mb.className}`}
                  >
                    {mb.label}
                  </span>
                </td>
                <td className="px-3 py-2 text-muted-foreground">
                  {payment.notes ?? "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function PaymentsPage() {
  const [tab, setTab] = useState<TabType>("receivables");
  const [filter, setFilter] = useState<FilterType>("outstanding");
  const [section, setSection] = useState<"invoices" | "history">("invoices");
  const [modalOpen, setModalOpen] = useState(false);
  const [preselectedId, setPreselectedId] = useState<bigint | undefined>();

  const invoiceType =
    tab === "receivables" ? InvoiceType.sales : InvoiceType.purchase;

  const { data: invoices = [], isLoading: invLoading } =
    useInvoices(invoiceType);
  const { data: agingBuckets = [], isLoading: agingLoading } =
    useAgingReport(invoiceType);
  const { data: parties = [] } = useParties();
  const { data: allPayments = [], isLoading: paymentsLoading } =
    useAllPayments(invoices);

  const totalOutstanding = useMemo(
    () =>
      invoices
        .filter((i) => i.status !== InvoiceStatus.cancelled)
        .reduce((sum, i) => sum + Math.max(0, i.grandTotal - i.amountPaid), 0),
    [invoices],
  );

  function openRecord(id?: bigint) {
    setPreselectedId(id);
    setModalOpen(true);
  }

  return (
    <div className="flex flex-col h-full" data-ocid="payments.page">
      {/* Top toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card gap-3">
        <div className="flex items-center gap-3">
          <Tabs
            value={tab}
            onValueChange={(v) => {
              setTab(v as TabType);
              setFilter("outstanding");
            }}
          >
            <TabsList className="h-7">
              <TabsTrigger
                value="receivables"
                className="text-xs px-3 h-6"
                data-ocid="payments.receivables_tab"
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                Receivables
              </TabsTrigger>
              <TabsTrigger
                value="payables"
                className="text-xs px-3 h-6"
                data-ocid="payments.payables_tab"
              >
                <TrendingDown className="w-3 h-3 mr-1" />
                Payables
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Select
              value={section}
              onValueChange={(v) => setSection(v as "invoices" | "history")}
            >
              <SelectTrigger
                className="h-7 text-xs w-36"
                data-ocid="payments.section_select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="invoices" className="text-xs">
                  Invoice List
                </SelectItem>
                <SelectItem value="history" className="text-xs">
                  Payment History
                </SelectItem>
              </SelectContent>
            </Select>

            {section === "invoices" && (
              <Select
                value={filter}
                onValueChange={(v) => setFilter(v as FilterType)}
              >
                <SelectTrigger
                  className="h-7 text-xs w-36"
                  data-ocid="payments.filter_select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">
                    All Invoices
                  </SelectItem>
                  <SelectItem value="outstanding" className="text-xs">
                    Outstanding Only
                  </SelectItem>
                  <SelectItem value="paid" className="text-xs">
                    Paid Only
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
              {tab === "receivables"
                ? "Total Outstanding Receivables"
                : "Total Outstanding Payables"}
            </p>
            <p className="text-sm font-semibold font-mono text-foreground">
              {formatINR(totalOutstanding)}
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            className="h-7 text-xs"
            onClick={() => openRecord(undefined)}
            data-ocid="payments.record_payment_button"
          >
            Record Payment
          </Button>
        </div>
      </div>

      {/* Aging summary */}
      <div className="px-4 py-2 bg-muted/30 border-b border-border">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5 font-medium">
          Aging Summary — {tab === "receivables" ? "Receivables" : "Payables"}
        </p>
        <AgingTable buckets={agingBuckets} loading={agingLoading} />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-background">
        {section === "invoices" ? (
          invLoading ? (
            <div className="p-4 space-y-2">
              {[...Array(8)].map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders have no stable id
                <Skeleton key={`skel-${i}`} className="h-8 w-full" />
              ))}
            </div>
          ) : (
            <InvoiceTable
              invoices={invoices}
              parties={parties}
              filter={filter}
              onRecord={openRecord}
            />
          )
        ) : (
          <PaymentHistoryTable
            payments={allPayments}
            parties={parties}
            loading={paymentsLoading}
          />
        )}
      </div>

      <RecordPaymentModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        invoices={invoices}
        parties={parties}
        preselectedInvoiceId={preselectedId}
      />
    </div>
  );
}
