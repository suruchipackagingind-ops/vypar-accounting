import { ClientFormDrawer } from "@/components/ClientFormDrawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeactivateParty,
  useInvoices,
  useParties,
} from "@/hooks/useQueries";
import type { InvoiceInfo, PartyInfo } from "@/types";
import { InvoiceStatus, PartyType } from "@/types";
import { formatDate, formatINRCompact } from "@/types";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  Search,
  UserX,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type FilterTab = "all" | "customers" | "vendors";
type SortKey = "name" | "createdAt";
type SortDir = "asc" | "desc";

function partyTypeBadge(type: PartyType) {
  const map: Record<PartyType, { label: string; className: string }> = {
    [PartyType.customer]: {
      label: "Customer",
      className: "bg-primary/10 text-primary border-primary/20",
    },
    [PartyType.vendor]: {
      label: "Vendor",
      className: "bg-chart-2/15 text-chart-2 border-chart-2/20",
    },
    [PartyType.both]: {
      label: "Both",
      className: "bg-chart-3/15 text-chart-3 border-chart-3/20",
    },
  };
  const { label, className } = map[type] ?? { label: type, className: "" };
  return (
    <Badge
      variant="outline"
      className={`text-[10px] px-1.5 py-0 h-[18px] ${className}`}
    >
      {label}
    </Badge>
  );
}

function InvoiceSummary({
  partyId,
  allInvoices,
}: { partyId: bigint; allInvoices: InvoiceInfo[] }) {
  const inv = allInvoices.filter((i) => i.partyId === partyId);
  const totalInvoiced = inv.reduce((s, i) => s + i.grandTotal, 0);
  const totalPaid = inv.reduce((s, i) => s + i.amountPaid, 0);
  const outstanding = totalInvoiced - totalPaid;
  return (
    <div className="flex gap-6 mt-3 pt-3 border-t">
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
          Invoiced
        </p>
        <p className="text-sm font-semibold text-foreground">
          {formatINRCompact(totalInvoiced)}
        </p>
      </div>
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
          Paid
        </p>
        <p className="text-sm font-semibold text-primary">
          {formatINRCompact(totalPaid)}
        </p>
      </div>
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
          Outstanding
        </p>
        <p
          className={`text-sm font-semibold ${outstanding > 0 ? "text-destructive" : "text-foreground"}`}
        >
          {formatINRCompact(outstanding)}
        </p>
      </div>
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
          Invoices
        </p>
        <p className="text-sm font-semibold text-foreground">{inv.length}</p>
      </div>
    </div>
  );
}

function DetailPanel({
  party,
  allInvoices,
  onEdit,
}: { party: PartyInfo; allInvoices: InvoiceInfo[]; onEdit: () => void }) {
  return (
    <div className="bg-muted/30 border-t border-b px-4 py-3">
      <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs">
        {party.phone && (
          <p>
            <span className="text-muted-foreground">Phone: </span>
            {party.phone}
          </p>
        )}
        {party.email && (
          <p>
            <span className="text-muted-foreground">Email: </span>
            {party.email}
          </p>
        )}
        {party.gstNumber && (
          <p>
            <span className="text-muted-foreground">GST: </span>
            <span className="font-mono">{party.gstNumber}</span>
          </p>
        )}
        {party.address && (
          <p className="col-span-2">
            <span className="text-muted-foreground">Address: </span>
            {party.address}
          </p>
        )}
        <p>
          <span className="text-muted-foreground">Added: </span>
          {formatDate(party.createdAt)}
        </p>
      </div>
      <InvoiceSummary partyId={party.id} allInvoices={allInvoices} />
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="mt-3 h-7 text-xs"
        onClick={onEdit}
      >
        <Pencil className="h-3 w-3 mr-1" /> Edit
      </Button>
    </div>
  );
}

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<FilterTab>("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [expandedId, setExpandedId] = useState<bigint | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editParty, setEditParty] = useState<PartyInfo | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<PartyInfo | null>(
    null,
  );

  const partyTypeFilter =
    tab === "customers"
      ? PartyType.customer
      : tab === "vendors"
        ? PartyType.vendor
        : null;
  const { data: parties = [], isLoading } = useParties(partyTypeFilter);
  const { data: allInvoices = [] } = useInvoices(null, null);
  const deactivateParty = useDeactivateParty();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return parties
      .filter(
        (p) =>
          !q ||
          p.name.toLowerCase().includes(q) ||
          (p.phone ?? "").includes(q) ||
          (p.gstNumber ?? "").toLowerCase().includes(q),
      )
      .sort((a, b) => {
        const aVal =
          sortKey === "name" ? a.name.toLowerCase() : Number(a.createdAt);
        const bVal =
          sortKey === "name" ? b.name.toLowerCase() : Number(b.createdAt);
        return sortDir === "asc"
          ? aVal > bVal
            ? 1
            : -1
          : aVal < bVal
            ? 1
            : -1;
      });
  }, [parties, search, sortKey, sortDir]);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "customers", label: "Customers" },
    { key: "vendors", label: "Vendors" },
  ];

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      sortDir === "asc" ? (
        <ChevronUp className="h-3 w-3" />
      ) : (
        <ChevronDown className="h-3 w-3" />
      )
    ) : null;

  const handleDeactivate = async () => {
    if (!deactivateTarget) return;
    try {
      await deactivateParty.mutateAsync(deactivateTarget.id);
      toast.success(`${deactivateTarget.name} deactivated`);
    } catch {
      toast.error("Failed to deactivate");
    } finally {
      setDeactivateTarget(null);
    }
  };

  return (
    <div className="flex flex-col h-full" data-ocid="clients.page">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b bg-card">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            data-ocid="clients.search_input"
            className="pl-7 h-7 text-xs"
            placeholder="Search by name, phone, GST…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div
          className="flex gap-0.5 border rounded-md overflow-hidden"
          data-ocid="clients.filter.tab"
        >
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`px-3 h-7 text-xs transition-colors ${
                tab === t.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
              }`}
              data-ocid={`clients.filter.${t.key}_tab`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Button
          type="button"
          size="sm"
          className="h-7 text-xs gap-1"
          onClick={() => {
            setEditParty(null);
            setFormOpen(true);
          }}
          data-ocid="clients.add_button"
        >
          <Plus className="h-3.5 w-3.5" /> Add Client
        </Button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table
          className="w-full text-xs border-collapse"
          data-ocid="clients.table"
        >
          <thead>
            <tr className="bg-muted/40 border-b text-muted-foreground sticky top-0 z-10">
              <th
                className="text-left px-3 py-2 font-medium cursor-pointer select-none hover:text-foreground"
                onClick={() => toggleSort("name")}
                onKeyDown={(e) => e.key === "Enter" && toggleSort("name")}
              >
                <span className="inline-flex items-center gap-1">
                  Name <SortIcon k="name" />
                </span>
              </th>
              <th className="text-left px-3 py-2 font-medium">Type</th>
              <th className="text-left px-3 py-2 font-medium">Phone</th>
              <th className="text-left px-3 py-2 font-medium">Email</th>
              <th className="text-left px-3 py-2 font-medium font-mono">
                GST Number
              </th>
              <th className="text-right px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              [1, 2, 3, 4, 5, 6].map((n) => (
                <tr
                  key={`skeleton-${n}`}
                  className="border-b"
                  data-ocid={`clients.loading_state.item.${n}`}
                >
                  {[1, 2, 3, 4, 5, 6].map((m) => (
                    <td key={`col-${m}`} className="px-3 py-1.5">
                      <Skeleton
                        className="h-4 rounded"
                        style={{ width: `${60 + Math.random() * 40}%` }}
                      />
                    </td>
                  ))}
                </tr>
              ))}

            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <div
                    className="flex flex-col items-center justify-center py-16 gap-3"
                    data-ocid="clients.empty_state"
                  >
                    <Users className="h-10 w-10 text-muted-foreground/30" />
                    <p className="text-sm font-medium text-muted-foreground">
                      {search
                        ? "No clients match your search"
                        : "No clients yet"}
                    </p>
                    {!search && (
                      <Button
                        type="button"
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={() => {
                          setEditParty(null);
                          setFormOpen(true);
                        }}
                        data-ocid="clients.empty_state.add_button"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add your first client
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            )}

            {!isLoading &&
              filtered.map((party, idx) => (
                <>
                  <tr
                    key={party.id.toString()}
                    className={`border-b cursor-pointer transition-colors ${
                      expandedId === party.id
                        ? "bg-muted/20"
                        : "hover:bg-muted/10"
                    } ${!party.isActive ? "opacity-50" : ""}`}
                    onClick={() =>
                      setExpandedId(expandedId === party.id ? null : party.id)
                    }
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setExpandedId(
                          expandedId === party.id ? null : party.id,
                        );
                      }
                    }}
                    data-ocid={`clients.item.${idx + 1}`}
                  >
                    <td className="px-3 py-1.5 font-medium text-foreground min-w-0">
                      <span className="truncate block max-w-[180px]">
                        {party.name}
                      </span>
                    </td>
                    <td className="px-3 py-1.5">
                      {partyTypeBadge(party.partyType)}
                    </td>
                    <td className="px-3 py-1.5 text-muted-foreground">
                      {party.phone ?? (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </td>
                    <td className="px-3 py-1.5 text-muted-foreground max-w-[160px]">
                      <span className="truncate block">
                        {party.email ?? (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </span>
                    </td>
                    <td className="px-3 py-1.5 font-mono text-muted-foreground">
                      {party.gstNumber ?? (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </td>
                    <td
                      className="px-3 py-1.5"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <div className="flex gap-1 justify-end">
                        <button
                          type="button"
                          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="Edit"
                          onClick={() => {
                            setEditParty(party);
                            setFormOpen(true);
                          }}
                          data-ocid={`clients.edit_button.${idx + 1}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        {party.isActive && (
                          <button
                            type="button"
                            className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                            title="Deactivate"
                            onClick={() => setDeactivateTarget(party)}
                            data-ocid={`clients.delete_button.${idx + 1}`}
                          >
                            <UserX className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedId === party.id && (
                    <tr key={`${party.id}-detail`} className="border-b">
                      <td colSpan={6} className="p-0">
                        <DetailPanel
                          party={party}
                          allInvoices={allInvoices}
                          onEdit={() => {
                            setEditParty(party);
                            setFormOpen(true);
                          }}
                        />
                      </td>
                    </tr>
                  )}
                </>
              ))}
          </tbody>
        </table>
      </div>

      {/* Form Drawer */}
      <ClientFormDrawer
        open={formOpen}
        onClose={() => setFormOpen(false)}
        editParty={editParty}
      />

      {/* Deactivate Confirm */}
      <AlertDialog
        open={!!deactivateTarget}
        onOpenChange={(v) => !v && setDeactivateTarget(null)}
      >
        <AlertDialogContent data-ocid="clients.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm">
              Deactivate Client?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              <strong>{deactivateTarget?.name}</strong> will be marked inactive
              and hidden from active lists. This can be reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="clients.cancel_button"
              className="h-7 text-xs"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-7 text-xs bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={handleDeactivate}
              data-ocid="clients.confirm_button"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
