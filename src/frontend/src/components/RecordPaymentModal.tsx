import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRecordPayment } from "@/hooks/useQueries";
import { type InvoiceInfo, type PartyInfo, PaymentMethod } from "@/types";
import { formatINR } from "@/types";
import { useState } from "react";
import { toast } from "sonner";

interface RecordPaymentModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  invoices: InvoiceInfo[];
  parties: PartyInfo[];
  preselectedInvoiceId?: bigint;
}

const METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.cash]: "Cash",
  [PaymentMethod.bank]: "Bank Transfer",
  [PaymentMethod.cheque]: "Cheque",
  [PaymentMethod.upi]: "UPI",
};

function todayNs(): bigint {
  return BigInt(Date.now()) * 1_000_000n;
}

function nsToInputDate(ns: bigint): string {
  const d = new Date(Number(ns / 1_000_000n));
  return d.toISOString().split("T")[0];
}

export function RecordPaymentModal({
  open,
  onOpenChange,
  invoices,
  parties,
  preselectedInvoiceId,
}: RecordPaymentModalProps) {
  const recordPayment = useRecordPayment();

  const partyMap = new Map(parties.map((p) => [p.id.toString(), p]));

  const outstanding = invoices.filter(
    (inv) => inv.grandTotal - inv.amountPaid > 0,
  );

  const [invoiceId, setInvoiceId] = useState<string>(
    preselectedInvoiceId ? preselectedInvoiceId.toString() : "",
  );
  const [amount, setAmount] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>(
    nsToInputDate(todayNs()),
  );
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.cash);
  const [notes, setNotes] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const selectedInvoice = outstanding.find(
    (i) => i.id.toString() === invoiceId,
  );
  const balance = selectedInvoice
    ? selectedInvoice.grandTotal - selectedInvoice.amountPaid
    : 0;

  const filteredInvoices = outstanding.filter((inv) => {
    const party = partyMap.get(inv.partyId.toString());
    const q = search.toLowerCase();
    return (
      inv.invoiceNumber.toLowerCase().includes(q) ||
      (party?.name ?? "").toLowerCase().includes(q)
    );
  });

  function handleInvoiceSelect(id: string) {
    setInvoiceId(id);
    const inv = outstanding.find((i) => i.id.toString() === id);
    if (inv) setAmount(String(inv.grandTotal - inv.amountPaid));
  }

  async function handleSubmit() {
    if (!invoiceId) {
      toast.error("Select an invoice");
      return;
    }
    const amt = Number.parseFloat(amount);
    if (!amt || amt <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (amt > balance) {
      toast.error(
        `Amount cannot exceed outstanding balance ${formatINR(balance)}`,
      );
      return;
    }
    const dateMs = new Date(paymentDate).getTime();
    if (Number.isNaN(dateMs)) {
      toast.error("Invalid payment date");
      return;
    }
    try {
      await recordPayment.mutateAsync({
        invoiceId: BigInt(invoiceId),
        amount: amt,
        paymentDate: BigInt(dateMs) * 1_000_000n,
        method,
        notes: notes || undefined,
      });
      toast.success("Payment recorded");
      onOpenChange(false);
      setInvoiceId("");
      setAmount("");
      setNotes("");
      setSearch("");
    } catch {
      toast.error("Failed to record payment");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-ocid="record-payment.dialog">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">
            Record Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-1">
          {/* Invoice search & select */}
          <div>
            <Label className="text-xs font-medium mb-1 block">Invoice</Label>
            <Input
              placeholder="Search invoice # or party..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-7 text-xs mb-1"
              data-ocid="record-payment.search_input"
            />
            <Select value={invoiceId} onValueChange={handleInvoiceSelect}>
              <SelectTrigger
                className="h-7 text-xs"
                data-ocid="record-payment.invoice_select"
              >
                <SelectValue placeholder="Select invoice" />
              </SelectTrigger>
              <SelectContent className="max-h-48">
                {filteredInvoices.length === 0 && (
                  <div className="px-3 py-2 text-xs text-muted-foreground">
                    No outstanding invoices
                  </div>
                )}
                {filteredInvoices.map((inv) => {
                  const party = partyMap.get(inv.partyId.toString());
                  const bal = inv.grandTotal - inv.amountPaid;
                  return (
                    <SelectItem
                      key={inv.id.toString()}
                      value={inv.id.toString()}
                      className="text-xs"
                    >
                      {inv.invoiceNumber} — {party?.name ?? "Unknown"} —{" "}
                      {formatINR(bal)}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {selectedInvoice && (
              <p className="text-xs text-muted-foreground mt-1">
                Outstanding balance:{" "}
                <span className="font-medium text-foreground">
                  {formatINR(balance)}
                </span>
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <Label className="text-xs font-medium mb-1 block">Amount (₹)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-7 text-xs"
              data-ocid="record-payment.amount_input"
            />
          </div>

          {/* Date + Method row */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs font-medium mb-1 block">
                Payment Date
              </Label>
              <Input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="h-7 text-xs"
                data-ocid="record-payment.date_input"
              />
            </div>
            <div>
              <Label className="text-xs font-medium mb-1 block">Method</Label>
              <Select
                value={method}
                onValueChange={(v) => setMethod(v as PaymentMethod)}
              >
                <SelectTrigger
                  className="h-7 text-xs"
                  data-ocid="record-payment.method_select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PaymentMethod).map((m) => (
                    <SelectItem key={m} value={m} className="text-xs">
                      {METHOD_LABELS[m]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label className="text-xs font-medium mb-1 block">
              Notes (optional)
            </Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Cheque no., UPI ref..."
              className="h-7 text-xs"
              data-ocid="record-payment.notes_input"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            data-ocid="record-payment.cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={recordPayment.isPending}
            data-ocid="record-payment.submit_button"
          >
            {recordPayment.isPending ? "Saving..." : "Record Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
