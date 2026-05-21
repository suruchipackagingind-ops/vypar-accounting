import { InvoiceStatus, TaxType } from "@/backend";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCancelInvoice,
  usePaymentsForInvoice,
  useUpdateInvoiceStatus,
} from "@/hooks/useQueries";
import { StatusBadge } from "@/pages/InvoicesPage";
import type { InvoiceInfo, LineItem, PartyInfo } from "@/types";
import { formatDate, formatINR } from "@/types";
import { CheckCircle, X, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function calcLineAmounts(item: LineItem) {
  const base = item.quantity * item.rate;
  const disc = base * (item.discount / 100);
  const taxable = base - disc;
  const taxAmt = taxable * (item.taxPercent / 100);
  return { taxable, taxAmt, total: taxable + taxAmt };
}

function GSTSummary({ lineItems }: { lineItems: LineItem[] }) {
  type TaxGroup = { taxable: number; igst: number; cgst: number; sgst: number };
  const byRate: Record<string, TaxGroup> = {};

  for (const item of lineItems) {
    const { taxable, taxAmt } = calcLineAmounts(item);
    const key = `${item.taxType}-${item.taxPercent}`;
    if (!byRate[key]) byRate[key] = { taxable: 0, igst: 0, cgst: 0, sgst: 0 };
    const g = byRate[key];
    g.taxable += taxable;
    if (item.taxType === TaxType.igst) g.igst += taxAmt;
    else if (item.taxType === TaxType.cgstSgst) {
      g.cgst += taxAmt / 2;
      g.sgst += taxAmt / 2;
    }
  }

  const rows = Object.entries(byRate);
  if (rows.length === 0) return null;

  return (
    <div className="mt-3">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
        GST Summary
      </p>
      <table className="w-full text-[10px] border border-border rounded">
        <thead>
          <tr className="bg-muted/50 text-muted-foreground">
            <th className="text-left px-2 py-1 font-medium">Tax Rate</th>
            <th className="text-right px-2 py-1 font-medium">Taxable Amt</th>
            <th className="text-right px-2 py-1 font-medium">IGST</th>
            <th className="text-right px-2 py-1 font-medium">CGST</th>
            <th className="text-right px-2 py-1 font-medium">SGST</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([key, g]) => {
            const [taxTypeStr, rateStr] = key.split("-");
            return (
              <tr key={key} className="border-t border-border">
                <td className="px-2 py-1">
                  {taxTypeStr === TaxType.igst
                    ? "IGST"
                    : taxTypeStr === TaxType.cgstSgst
                      ? "CGST+SGST"
                      : "None"}{" "}
                  {rateStr}%
                </td>
                <td className="px-2 py-1 text-right tabular-nums">
                  {formatINR(g.taxable)}
                </td>
                <td className="px-2 py-1 text-right tabular-nums">
                  {g.igst > 0 ? formatINR(g.igst) : "—"}
                </td>
                <td className="px-2 py-1 text-right tabular-nums">
                  {g.cgst > 0 ? formatINR(g.cgst) : "—"}
                </td>
                <td className="px-2 py-1 text-right tabular-nums">
                  {g.sgst > 0 ? formatINR(g.sgst) : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function InvoiceDetailPanel({
  invoice,
  parties,
  onClose,
}: {
  invoice: InvoiceInfo;
  parties: PartyInfo[];
  onClose: () => void;
}) {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const partyName =
    parties.find((p) => p.id === invoice.partyId)?.name ??
    `Party #${invoice.partyId}`;
  const { data: payments = [], isLoading: paymentsLoading } =
    usePaymentsForInvoice(invoice.id);
  const updateStatus = useUpdateInvoiceStatus();
  const cancelInvoice = useCancelInvoice();

  const balanceDue = invoice.grandTotal - invoice.amountPaid;

  const handleMarkSent = () => {
    updateStatus.mutate(
      { id: invoice.id, status: InvoiceStatus.sent },
      { onSuccess: () => toast.success("Invoice marked as Sent") },
    );
  };

  const handleCancel = () => {
    cancelInvoice.mutate(invoice.id, {
      onSuccess: () => {
        toast.success("Invoice cancelled");
        onClose();
      },
    });
  };

  return (
    <div
      className="w-[420px] flex-shrink-0 flex flex-col bg-background overflow-hidden"
      data-ocid="invoices.detail_panel"
    >
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-card border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground font-mono">
            {invoice.invoiceNumber}
          </span>
          <StatusBadge status={invoice.status} />
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
          data-ocid="invoices.close_button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Meta */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Party
            </p>
            <p className="font-medium text-foreground">{partyName}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Type
            </p>
            <p className="font-medium">
              {invoice.invoiceType === "sales"
                ? "Sales Invoice"
                : "Purchase Bill"}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Invoice Date
            </p>
            <p>{formatDate(invoice.createdAt)}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Due Date
            </p>
            <p>
              {invoice.dueDate ? (
                formatDate(invoice.dueDate)
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </p>
          </div>
        </div>

        {/* Line items */}
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            Line Items
          </p>
          <table className="w-full border border-border rounded text-[10px]">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground">
                <th className="text-left px-2 py-1 font-medium">Item</th>
                <th className="text-right px-2 py-1 font-medium">Qty</th>
                <th className="text-right px-2 py-1 font-medium">Rate</th>
                <th className="text-right px-2 py-1 font-medium">Tax</th>
                <th className="text-right px-2 py-1 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item, i) => {
                const { total } = calcLineAmounts(item);
                const taxLabel =
                  item.taxType === TaxType.igst
                    ? `IGST ${item.taxPercent}%`
                    : item.taxType === TaxType.cgstSgst
                      ? `CGST+SGST ${item.taxPercent}%`
                      : "No Tax";

                return (
                  <tr
                    key={`${item.itemName}-${i}`}
                    className="border-t border-border"
                  >
                    <td className="px-2 py-1">
                      <div>{item.itemName}</div>
                      <div className="text-muted-foreground">
                        {item.unit}
                        {item.discount > 0 ? ` · ${item.discount}% disc` : ""}
                      </div>
                    </td>
                    <td className="px-2 py-1 text-right tabular-nums">
                      {item.quantity}
                    </td>
                    <td className="px-2 py-1 text-right tabular-nums">
                      {formatINR(item.rate)}
                    </td>
                    <td className="px-2 py-1 text-right">{taxLabel}</td>
                    <td className="px-2 py-1 text-right tabular-nums font-medium">
                      {formatINR(total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* GST Summary */}
        <GSTSummary lineItems={invoice.lineItems} />

        {/* Totals */}
        <div className="bg-muted/30 rounded border border-border p-3 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="tabular-nums">{formatINR(invoice.subtotal)}</span>
          </div>
          {invoice.totalDiscount > 0 && (
            <div className="flex justify-between text-red-600 dark:text-red-400">
              <span>Discount</span>
              <span className="tabular-nums">
                - {formatINR(invoice.totalDiscount)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Tax</span>
            <span className="tabular-nums">{formatINR(invoice.totalTax)}</span>
          </div>
          <div className="flex justify-between font-semibold border-t border-border pt-1.5 text-sm">
            <span>Grand Total</span>
            <span className="tabular-nums">
              {formatINR(invoice.grandTotal)}
            </span>
          </div>
          <div className="flex justify-between text-green-700 dark:text-green-400">
            <span>Amount Paid</span>
            <span className="tabular-nums">
              {formatINR(invoice.amountPaid)}
            </span>
          </div>
          <div
            className={`flex justify-between font-semibold ${balanceDue > 0 ? "text-red-600 dark:text-red-400" : "text-green-700 dark:text-green-400"}`}
          >
            <span>Balance Due</span>
            <span className="tabular-nums">{formatINR(balanceDue)}</span>
          </div>
        </div>

        {/* Payments */}
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            Payment History
          </p>
          {paymentsLoading ? (
            <Skeleton className="h-6 w-full" />
          ) : payments.length === 0 ? (
            <p className="text-muted-foreground text-[10px] italic">
              No payments recorded yet.
            </p>
          ) : (
            <div className="space-y-1">
              {payments.map((p) => (
                <div
                  key={String(p.id)}
                  className="flex justify-between items-center py-1 border-b border-border last:border-0"
                >
                  <div>
                    <span className="font-medium">{formatINR(p.amount)}</span>
                    <span className="text-muted-foreground ml-2 uppercase">
                      {p.method}
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    {formatDate(p.paymentDate)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Notes
            </p>
            <p className="text-muted-foreground">{invoice.notes}</p>
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="border-t border-border px-4 py-2.5 bg-card flex items-center gap-2 flex-wrap">
        {invoice.status === InvoiceStatus.draft && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={handleMarkSent}
            disabled={updateStatus.isPending}
            data-ocid="invoices.mark_sent_button"
          >
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            Mark Sent
          </Button>
        )}

        {invoice.status !== InvoiceStatus.cancelled &&
          invoice.status !== InvoiceStatus.paid &&
          (confirmCancel ? (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground">
                Confirm cancel?
              </span>
              <Button
                size="sm"
                variant="destructive"
                className="h-6 text-[10px] px-2"
                onClick={handleCancel}
                disabled={cancelInvoice.isPending}
                data-ocid="invoices.confirm_cancel_button"
              >
                Yes, Cancel
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 text-[10px] px-2"
                onClick={() => setConfirmCancel(false)}
                data-ocid="invoices.cancel_button"
              >
                No
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs text-destructive hover:text-destructive"
              onClick={() => setConfirmCancel(true)}
              data-ocid="invoices.cancel_invoice_button"
            >
              <XCircle className="h-3.5 w-3.5 mr-1" />
              Cancel Invoice
            </Button>
          ))}
      </div>
    </div>
  );
}
