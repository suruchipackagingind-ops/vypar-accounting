import { InvoiceStatus, InvoiceType } from "@/backend";
import CreateInvoiceModal from "@/components/CreateInvoiceModal";
import InvoiceDetailPanel from "@/components/InvoiceDetailPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useInvoices, useParties } from "@/hooks/useQueries";
import type { InvoiceInfo, PartyInfo } from "@/types";
import { formatDate, formatINR } from "@/types";
import { FileText, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  [InvoiceStatus.draft]: "Draft",
  [InvoiceStatus.sent]: "Sent",
  [InvoiceStatus.paid]: "Paid",
  [InvoiceStatus.partiallyPaid]: "Partial",
  [InvoiceStatus.overdue]: "Overdue",
  [InvoiceStatus.cancelled]: "Cancelled",
};

const STATUS_CLASS: Record<InvoiceStatus, string> = {
  [InvoiceStatus.draft]: "bg-muted text-muted-foreground border-border",
  [InvoiceStatus.sent]:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  [InvoiceStatus.paid]:
    "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
  [InvoiceStatus.partiallyPaid]:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  [InvoiceStatus.overdue]:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  [InvoiceStatus.cancelled]:
    "bg-muted text-muted-foreground border-border line-through",
};

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${STATUS_CLASS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function getPartyName(partyId: bigint, parties: PartyInfo[]): string {
  return parties.find((p) => p.id === partyId)?.name ?? `Party #${partyId}`;
}

export default function InvoicesPage() {
  const [activeTab, setActiveTab] = useState<"sales" | "purchase">("sales");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | InvoiceStatus>(
    "all",
  );
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<bigint | null>(
    null,
  );
  const [showCreateModal, setShowCreateModal] = useState(false);

  const invoiceType =
    activeTab === "sales" ? InvoiceType.sales : InvoiceType.purchase;
  const { data: invoices = [], isLoading } = useInvoices(
    invoiceType,
    statusFilter !== "all" ? statusFilter : null,
  );
  const { data: parties = [] } = useParties(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return invoices;
    const q = search.toLowerCase();
    return invoices.filter(
      (inv) =>
        inv.invoiceNumber.toLowerCase().includes(q) ||
        getPartyName(inv.partyId, parties).toLowerCase().includes(q),
    );
  }, [invoices, search, parties]);

  const selectedInvoice = selectedInvoiceId
    ? (invoices.find((i) => i.id === selectedInvoiceId) ?? null)
    : null;

  return (
    <div className="flex h-full" data-ocid="invoices.page">
      {/* Main list pane */}
      <div
        className={`flex flex-col flex-1 min-w-0 ${selectedInvoice ? "border-r border-border" : ""}`}
      >
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-card border-b border-border flex-wrap">
          {/* Tab toggle */}
          <div className="flex rounded border border-border overflow-hidden text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                setActiveTab("sales");
                setSelectedInvoiceId(null);
              }}
              className={`px-3 py-1.5 transition-colors ${
                activeTab === "sales"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-muted"
              }`}
              data-ocid="invoices.sales_tab"
            >
              Sales Invoices
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("purchase");
                setSelectedInvoiceId(null);
              }}
              className={`px-3 py-1.5 transition-colors border-l border-border ${
                activeTab === "purchase"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-muted"
              }`}
              data-ocid="invoices.purchase_tab"
            >
              Purchase Bills
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[160px] max-w-xs">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Invoice # or party name…"
              className="pl-7 h-7 text-xs"
              data-ocid="invoices.search_input"
            />
          </div>

          {/* Status filter */}
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
          >
            <SelectTrigger
              className="h-7 text-xs w-32"
              data-ocid="invoices.status_filter"
            >
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.values(InvoiceStatus).map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            size="sm"
            className="h-7 text-xs ml-auto"
            onClick={() => setShowCreateModal(true)}
            data-ocid="invoices.create_button"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            {activeTab === "sales" ? "New Invoice" : "New Bill"}
          </Button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="p-4 space-y-2" data-ocid="invoices.loading_state">
              {[...Array(6)].map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders have no stable id
                <Skeleton key={`skel-${i}`} className="h-8 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center h-48 text-center"
              data-ocid="invoices.empty_state"
            >
              <FileText className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-foreground">
                No {activeTab === "sales" ? "invoices" : "bills"} found
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Create your first{" "}
                {activeTab === "sales" ? "invoice" : "purchase bill"} to get
                started
              </p>
            </div>
          ) : (
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground border-b border-border">
                  <th className="text-left px-3 py-2 font-medium w-28">
                    Invoice #
                  </th>
                  <th className="text-left px-3 py-2 font-medium">Party</th>
                  <th className="text-left px-3 py-2 font-medium w-24">Date</th>
                  <th className="text-left px-3 py-2 font-medium w-24">
                    Due Date
                  </th>
                  <th className="text-right px-3 py-2 font-medium w-28">
                    Grand Total
                  </th>
                  <th className="text-center px-3 py-2 font-medium w-24">
                    Status
                  </th>
                  <th className="text-right px-3 py-2 font-medium w-24">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv, idx) => (
                  <InvoiceRow
                    key={String(inv.id)}
                    invoice={inv}
                    index={idx + 1}
                    parties={parties}
                    isSelected={selectedInvoiceId === inv.id}
                    onClick={() =>
                      setSelectedInvoiceId(
                        inv.id === selectedInvoiceId ? null : inv.id,
                      )
                    }
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail panel */}
      {selectedInvoice && (
        <InvoiceDetailPanel
          invoice={selectedInvoice}
          parties={parties}
          onClose={() => setSelectedInvoiceId(null)}
        />
      )}

      {/* Create modal */}
      {showCreateModal && (
        <CreateInvoiceModal
          defaultType={invoiceType}
          parties={parties}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}

function InvoiceRow({
  invoice,
  index,
  parties,
  isSelected,
  onClick,
}: {
  invoice: InvoiceInfo;
  index: number;
  parties: PartyInfo[];
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <tr
      className={`border-b border-border cursor-pointer transition-colors ${
        isSelected
          ? "bg-primary/5 border-l-2 border-l-primary"
          : "hover:bg-muted/30"
      }`}
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
      data-ocid={`invoices.item.${index}`}
    >
      <td className="px-3 py-2 font-mono text-primary">
        {invoice.invoiceNumber}
      </td>
      <td
        className="px-3 py-2 truncate max-w-[180px]"
        title={getPartyName(invoice.partyId, parties)}
      >
        {getPartyName(invoice.partyId, parties)}
      </td>
      <td className="px-3 py-2 text-muted-foreground">
        {formatDate(invoice.createdAt)}
      </td>
      <td className="px-3 py-2 text-muted-foreground">
        {invoice.dueDate ? (
          formatDate(invoice.dueDate)
        ) : (
          <span className="text-border">—</span>
        )}
      </td>
      <td className="px-3 py-2 text-right font-medium tabular-nums">
        {formatINR(invoice.grandTotal)}
      </td>
      <td className="px-3 py-2 text-center">
        <StatusBadge status={invoice.status} />
      </td>
      <td
        className="px-3 py-2 text-right"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClick}
          className="text-primary hover:underline text-[10px]"
          data-ocid={`invoices.view_button.${index}`}
        >
          View
        </button>
      </td>
    </tr>
  );
}
