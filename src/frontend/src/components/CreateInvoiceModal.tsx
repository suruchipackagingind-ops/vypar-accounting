import { InvoiceType, TaxType } from "@/backend";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Textarea } from "@/components/ui/textarea";
import { useCreateInvoice } from "@/hooks/useQueries";
import type { CreateInvoiceRequest, LineItem, PartyInfo } from "@/types";
import { formatINR } from "@/types";
import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface DraftLineItem {
  itemName: string;
  quantity: string;
  unit: string;
  rate: string;
  taxPercent: string;
  taxType: TaxType;
  discount: string;
}

const EMPTY_LINE: DraftLineItem = {
  itemName: "",
  quantity: "1",
  unit: "pcs",
  rate: "",
  taxPercent: "18",
  taxType: TaxType.cgstSgst,
  discount: "0",
};

function parseNum(s: string): number {
  const n = Number.parseFloat(s);
  return Number.isNaN(n) ? 0 : n;
}

function calcLine(item: DraftLineItem) {
  const qty = parseNum(item.quantity);
  const rate = parseNum(item.rate);
  const disc = parseNum(item.discount);
  const taxPct = parseNum(item.taxPercent);
  const base = qty * rate;
  const discAmt = base * (disc / 100);
  const taxable = base - discAmt;
  const taxAmt = item.taxType !== TaxType.none ? taxable * (taxPct / 100) : 0;
  return { taxable, taxAmt, total: taxable + taxAmt };
}

export default function CreateInvoiceModal({
  defaultType,
  parties,
  onClose,
}: {
  defaultType: InvoiceType;
  parties: PartyInfo[];
  onClose: () => void;
}) {
  const [invoiceType, setInvoiceType] = useState<InvoiceType>(defaultType);
  const [partyId, setPartyId] = useState("");
  const [partySearch, setPartySearch] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<DraftLineItem[]>([{ ...EMPTY_LINE }]);
  const createInvoice = useCreateInvoice();

  const filteredParties = useMemo(() => {
    if (!partySearch) return parties;
    const q = partySearch.toLowerCase();
    return parties.filter((p) => p.name.toLowerCase().includes(q));
  }, [parties, partySearch]);

  const totals = useMemo(() => {
    let subtotal = 0;
    let totalTax = 0;
    let totalDiscount = 0;
    for (const l of lines) {
      const qty = parseNum(l.quantity);
      const rate = parseNum(l.rate);
      const disc = parseNum(l.discount);
      const base = qty * rate;
      const discAmt = base * (disc / 100);
      const taxable = base - discAmt;
      const taxPct = parseNum(l.taxPercent);
      const taxAmt = l.taxType !== TaxType.none ? taxable * (taxPct / 100) : 0;
      subtotal += taxable;
      totalTax += taxAmt;
      totalDiscount += discAmt;
    }
    return {
      subtotal,
      totalTax,
      totalDiscount,
      grandTotal: subtotal + totalTax,
    };
  }, [lines]);

  const updateLine = (
    idx: number,
    field: keyof DraftLineItem,
    value: string | TaxType,
  ) => {
    setLines((prev) =>
      prev.map((l, i) => (i === idx ? { ...l, [field]: value } : l)),
    );
  };

  const addLine = () => setLines((prev) => [...prev, { ...EMPTY_LINE }]);
  const removeLine = (idx: number) =>
    setLines((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = () => {
    if (!partyId) {
      toast.error("Please select a party");
      return;
    }
    if (lines.some((l) => !l.itemName || !l.rate)) {
      toast.error("Fill in item name and rate for all rows");
      return;
    }

    const lineItems: LineItem[] = lines.map((l) => ({
      itemName: l.itemName,
      quantity: parseNum(l.quantity),
      unit: l.unit,
      rate: parseNum(l.rate),
      taxPercent: l.taxType !== TaxType.none ? parseNum(l.taxPercent) : 0,
      taxType: l.taxType,
      discount: parseNum(l.discount),
    }));

    const req: CreateInvoiceRequest = {
      invoiceType,
      partyId: BigInt(partyId),
      lineItems,
      notes: notes || undefined,
      dueDate: dueDate
        ? BigInt(new Date(dueDate).getTime()) * 1_000_000n
        : undefined,
    };

    createInvoice.mutate(req, {
      onSuccess: () => {
        toast.success(
          `${invoiceType === InvoiceType.sales ? "Invoice" : "Bill"} created successfully`,
        );
        onClose();
      },
      onError: () => toast.error("Failed to create invoice"),
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-y-auto"
        data-ocid="invoices.create_dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-sm">
            Create{" "}
            {invoiceType === InvoiceType.sales
              ? "Sales Invoice"
              : "Purchase Bill"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-xs">
          {/* Row 1: Type + Party */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Invoice Type
              </Label>
              <Select
                value={invoiceType}
                onValueChange={(v) => setInvoiceType(v as InvoiceType)}
              >
                <SelectTrigger
                  className="h-8 text-xs"
                  data-ocid="invoices.type_select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={InvoiceType.sales}>
                    Sales Invoice
                  </SelectItem>
                  <SelectItem value={InvoiceType.purchase}>
                    Purchase Bill
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Party *
              </Label>
              <Select value={partyId} onValueChange={setPartyId}>
                <SelectTrigger
                  className="h-8 text-xs"
                  data-ocid="invoices.party_select"
                >
                  <SelectValue placeholder="Select party…" />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 pb-1 pt-1">
                    <Input
                      value={partySearch}
                      onChange={(e) => setPartySearch(e.target.value)}
                      placeholder="Search party…"
                      className="h-7 text-xs"
                      data-ocid="invoices.party_search_input"
                    />
                  </div>
                  {filteredParties.length === 0 ? (
                    <div className="px-2 py-2 text-muted-foreground text-xs">
                      No parties found
                    </div>
                  ) : (
                    filteredParties.map((p) => (
                      <SelectItem key={String(p.id)} value={String(p.id)}>
                        {p.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Due date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Due Date
              </Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="h-8 text-xs"
                data-ocid="invoices.due_date_input"
              />
            </div>
          </div>

          {/* Line items */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                Line Items
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-6 text-[10px] px-2"
                onClick={addLine}
                data-ocid="invoices.add_line_button"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Row
              </Button>
            </div>
            <div className="border border-border rounded overflow-hidden">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="bg-muted/50 text-muted-foreground">
                    <th className="text-left px-2 py-1.5 font-medium w-40">
                      Item Name
                    </th>
                    <th className="text-right px-2 py-1.5 font-medium w-14">
                      Qty
                    </th>
                    <th className="text-left px-2 py-1.5 font-medium w-16">
                      Unit
                    </th>
                    <th className="text-right px-2 py-1.5 font-medium w-20">
                      Rate (₹)
                    </th>
                    <th className="text-center px-2 py-1.5 font-medium w-28">
                      Tax Type
                    </th>
                    <th className="text-right px-2 py-1.5 font-medium w-16">
                      Tax %
                    </th>
                    <th className="text-right px-2 py-1.5 font-medium w-14">
                      Disc %
                    </th>
                    <th className="text-right px-2 py-1.5 font-medium w-20">
                      Amount
                    </th>
                    <th className="w-7" />
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line, idx) => {
                    const { total } = calcLine(line);
                    return (
                      <tr
                        key={`line-${line.itemName || idx}`}
                        className="border-t border-border"
                      >
                        <td className="px-1 py-1">
                          <Input
                            value={line.itemName}
                            onChange={(e) =>
                              updateLine(idx, "itemName", e.target.value)
                            }
                            placeholder="Item name"
                            className="h-7 text-[10px]"
                            data-ocid={`invoices.line_item_name.${idx + 1}`}
                          />
                        </td>
                        <td className="px-1 py-1">
                          <Input
                            value={line.quantity}
                            onChange={(e) =>
                              updateLine(idx, "quantity", e.target.value)
                            }
                            className="h-7 text-[10px] text-right"
                            data-ocid={`invoices.line_qty.${idx + 1}`}
                          />
                        </td>
                        <td className="px-1 py-1">
                          <Input
                            value={line.unit}
                            onChange={(e) =>
                              updateLine(idx, "unit", e.target.value)
                            }
                            placeholder="pcs"
                            className="h-7 text-[10px]"
                          />
                        </td>
                        <td className="px-1 py-1">
                          <Input
                            value={line.rate}
                            onChange={(e) =>
                              updateLine(idx, "rate", e.target.value)
                            }
                            placeholder="0"
                            className="h-7 text-[10px] text-right"
                            data-ocid={`invoices.line_rate.${idx + 1}`}
                          />
                        </td>
                        <td className="px-1 py-1">
                          <Select
                            value={line.taxType}
                            onValueChange={(v) =>
                              updateLine(idx, "taxType", v as TaxType)
                            }
                          >
                            <SelectTrigger className="h-7 text-[10px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={TaxType.cgstSgst}>
                                CGST+SGST
                              </SelectItem>
                              <SelectItem value={TaxType.igst}>IGST</SelectItem>
                              <SelectItem value={TaxType.none}>None</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-1 py-1">
                          <Input
                            value={line.taxPercent}
                            onChange={(e) =>
                              updateLine(idx, "taxPercent", e.target.value)
                            }
                            disabled={line.taxType === TaxType.none}
                            placeholder="18"
                            className="h-7 text-[10px] text-right"
                          />
                        </td>
                        <td className="px-1 py-1">
                          <Input
                            value={line.discount}
                            onChange={(e) =>
                              updateLine(idx, "discount", e.target.value)
                            }
                            placeholder="0"
                            className="h-7 text-[10px] text-right"
                          />
                        </td>
                        <td className="px-1 py-1 text-right tabular-nums font-medium">
                          {formatINR(total)}
                        </td>
                        <td className="px-1 py-1">
                          {lines.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeLine(idx)}
                              className="text-muted-foreground hover:text-destructive"
                              data-ocid={`invoices.remove_line_button.${idx + 1}`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Live totals */}
          <div className="flex justify-end">
            <div className="bg-muted/30 border border-border rounded p-3 min-w-[220px] space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums">
                  {formatINR(totals.subtotal)}
                </span>
              </div>
              {totals.totalDiscount > 0 && (
                <div className="flex justify-between text-red-600 dark:text-red-400">
                  <span>Discount</span>
                  <span className="tabular-nums">
                    - {formatINR(totals.totalDiscount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Tax</span>
                <span className="tabular-nums">
                  {formatINR(totals.totalTax)}
                </span>
              </div>
              <div className="flex justify-between font-semibold border-t border-border pt-1.5 text-sm">
                <span>Grand Total</span>
                <span className="tabular-nums">
                  {formatINR(totals.grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Notes (optional)
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any internal notes or remarks…"
              className="text-xs resize-none"
              rows={2}
              data-ocid="invoices.notes_textarea"
            />
          </div>

          {/* Footer actions */}
          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              data-ocid="invoices.modal_cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSubmit}
              disabled={createInvoice.isPending}
              data-ocid="invoices.modal_submit_button"
            >
              {createInvoice.isPending
                ? "Creating…"
                : `Create ${invoiceType === InvoiceType.sales ? "Invoice" : "Bill"}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
