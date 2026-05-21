import { c as createLucideIcon, r as reactExports, T as TaxType, j as jsxRuntimeExports, I as InvoiceType, B as Button, X, n as InvoiceStatus, F as FileText } from "./index-9WJHbuJb.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, S as Select, d as SelectTrigger, e as SelectValue, f as SelectContent, g as SelectItem } from "./select-DSCHxrCU.js";
import { L as Label, I as Input, u as ue } from "./index-GatS_aqM.js";
import { T as Textarea, S as Search } from "./textarea-FibJKKIa.js";
import { l as useCreateInvoice, b as formatINR, m as usePaymentsForInvoice, n as useUpdateInvoiceStatus, o as useCancelInvoice, g as formatDate, S as Skeleton, d as useInvoices, e as useParties } from "./types-DrzT-PkP.js";
import { P as Plus } from "./plus-hpJf09Zu.js";
import "./index-BCeTUzrl.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode);
const EMPTY_LINE = {
  itemName: "",
  quantity: "1",
  unit: "pcs",
  rate: "",
  taxPercent: "18",
  taxType: TaxType.cgstSgst,
  discount: "0"
};
function parseNum(s) {
  const n = Number.parseFloat(s);
  return Number.isNaN(n) ? 0 : n;
}
function calcLine(item) {
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
function CreateInvoiceModal({
  defaultType,
  parties,
  onClose
}) {
  const [invoiceType, setInvoiceType] = reactExports.useState(defaultType);
  const [partyId, setPartyId] = reactExports.useState("");
  const [partySearch, setPartySearch] = reactExports.useState("");
  const [dueDate, setDueDate] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  const [lines, setLines] = reactExports.useState([{ ...EMPTY_LINE }]);
  const createInvoice = useCreateInvoice();
  const filteredParties = reactExports.useMemo(() => {
    if (!partySearch) return parties;
    const q = partySearch.toLowerCase();
    return parties.filter((p) => p.name.toLowerCase().includes(q));
  }, [parties, partySearch]);
  const totals = reactExports.useMemo(() => {
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
      grandTotal: subtotal + totalTax
    };
  }, [lines]);
  const updateLine = (idx, field, value) => {
    setLines(
      (prev) => prev.map((l, i) => i === idx ? { ...l, [field]: value } : l)
    );
  };
  const addLine = () => setLines((prev) => [...prev, { ...EMPTY_LINE }]);
  const removeLine = (idx) => setLines((prev) => prev.filter((_, i) => i !== idx));
  const handleSubmit = () => {
    if (!partyId) {
      ue.error("Please select a party");
      return;
    }
    if (lines.some((l) => !l.itemName || !l.rate)) {
      ue.error("Fill in item name and rate for all rows");
      return;
    }
    const lineItems = lines.map((l) => ({
      itemName: l.itemName,
      quantity: parseNum(l.quantity),
      unit: l.unit,
      rate: parseNum(l.rate),
      taxPercent: l.taxType !== TaxType.none ? parseNum(l.taxPercent) : 0,
      taxType: l.taxType,
      discount: parseNum(l.discount)
    }));
    const req = {
      invoiceType,
      partyId: BigInt(partyId),
      lineItems,
      notes: notes || void 0,
      dueDate: dueDate ? BigInt(new Date(dueDate).getTime()) * 1000000n : void 0
    };
    createInvoice.mutate(req, {
      onSuccess: () => {
        ue.success(
          `${invoiceType === InvoiceType.sales ? "Invoice" : "Bill"} created successfully`
        );
        onClose();
      },
      onError: () => ue.error("Failed to create invoice")
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-3xl max-h-[90vh] overflow-y-auto",
      "data-ocid": "invoices.create_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-sm", children: [
          "Create",
          " ",
          invoiceType === InvoiceType.sales ? "Sales Invoice" : "Purchase Bill"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] text-muted-foreground uppercase tracking-wide", children: "Invoice Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: invoiceType,
                  onValueChange: (v) => setInvoiceType(v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        className: "h-8 text-xs",
                        "data-ocid": "invoices.type_select",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: InvoiceType.sales, children: "Sales Invoice" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: InvoiceType.purchase, children: "Purchase Bill" })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] text-muted-foreground uppercase tracking-wide", children: "Party *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: partyId, onValueChange: setPartyId, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "h-8 text-xs",
                    "data-ocid": "invoices.party_select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select party…" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 pb-1 pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: partySearch,
                      onChange: (e) => setPartySearch(e.target.value),
                      placeholder: "Search party…",
                      className: "h-7 text-xs",
                      "data-ocid": "invoices.party_search_input"
                    }
                  ) }),
                  filteredParties.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 py-2 text-muted-foreground text-xs", children: "No parties found" }) : filteredParties.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(p.id), children: p.name }, String(p.id)))
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] text-muted-foreground uppercase tracking-wide", children: "Due Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "date",
                value: dueDate,
                onChange: (e) => setDueDate(e.target.value),
                className: "h-8 text-xs",
                "data-ocid": "invoices.due_date_input"
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wide", children: "Line Items" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  className: "h-6 text-[10px] px-2",
                  onClick: addLine,
                  "data-ocid": "invoices.add_line_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3 mr-1" }),
                    "Add Row"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border rounded overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-[10px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/50 text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-2 py-1.5 font-medium w-40", children: "Item Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-2 py-1.5 font-medium w-14", children: "Qty" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-2 py-1.5 font-medium w-16", children: "Unit" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-2 py-1.5 font-medium w-20", children: "Rate (₹)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-2 py-1.5 font-medium w-28", children: "Tax Type" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-2 py-1.5 font-medium w-16", children: "Tax %" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-2 py-1.5 font-medium w-14", children: "Disc %" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-2 py-1.5 font-medium w-20", children: "Amount" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "w-7" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: lines.map((line, idx) => {
                const { total } = calcLine(line);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: "border-t border-border",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-1 py-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          value: line.itemName,
                          onChange: (e) => updateLine(idx, "itemName", e.target.value),
                          placeholder: "Item name",
                          className: "h-7 text-[10px]",
                          "data-ocid": `invoices.line_item_name.${idx + 1}`
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-1 py-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          value: line.quantity,
                          onChange: (e) => updateLine(idx, "quantity", e.target.value),
                          className: "h-7 text-[10px] text-right",
                          "data-ocid": `invoices.line_qty.${idx + 1}`
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-1 py-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          value: line.unit,
                          onChange: (e) => updateLine(idx, "unit", e.target.value),
                          placeholder: "pcs",
                          className: "h-7 text-[10px]"
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-1 py-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          value: line.rate,
                          onChange: (e) => updateLine(idx, "rate", e.target.value),
                          placeholder: "0",
                          className: "h-7 text-[10px] text-right",
                          "data-ocid": `invoices.line_rate.${idx + 1}`
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-1 py-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Select,
                        {
                          value: line.taxType,
                          onValueChange: (v) => updateLine(idx, "taxType", v),
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-7 text-[10px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: TaxType.cgstSgst, children: "CGST+SGST" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: TaxType.igst, children: "IGST" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: TaxType.none, children: "None" })
                            ] })
                          ]
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-1 py-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          value: line.taxPercent,
                          onChange: (e) => updateLine(idx, "taxPercent", e.target.value),
                          disabled: line.taxType === TaxType.none,
                          placeholder: "18",
                          className: "h-7 text-[10px] text-right"
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-1 py-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          value: line.discount,
                          onChange: (e) => updateLine(idx, "discount", e.target.value),
                          placeholder: "0",
                          className: "h-7 text-[10px] text-right"
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-1 py-1 text-right tabular-nums font-medium", children: formatINR(total) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-1 py-1", children: lines.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => removeLine(idx),
                          className: "text-muted-foreground hover:text-destructive",
                          "data-ocid": `invoices.remove_line_button.${idx + 1}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" })
                        }
                      ) })
                    ]
                  },
                  `line-${line.itemName || idx}`
                );
              }) })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 border border-border rounded p-3 min-w-[220px] space-y-1 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Subtotal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: formatINR(totals.subtotal) })
            ] }),
            totals.totalDiscount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-red-600 dark:text-red-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Discount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums", children: [
                "- ",
                formatINR(totals.totalDiscount)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Total Tax" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: formatINR(totals.totalTax) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-semibold border-t border-border pt-1.5 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Grand Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: formatINR(totals.grandTotal) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] text-muted-foreground uppercase tracking-wide", children: "Notes (optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                value: notes,
                onChange: (e) => setNotes(e.target.value),
                placeholder: "Add any internal notes or remarks…",
                className: "text-xs resize-none",
                rows: 2,
                "data-ocid": "invoices.notes_textarea"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                onClick: onClose,
                "data-ocid": "invoices.modal_cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                size: "sm",
                onClick: handleSubmit,
                disabled: createInvoice.isPending,
                "data-ocid": "invoices.modal_submit_button",
                children: createInvoice.isPending ? "Creating…" : `Create ${invoiceType === InvoiceType.sales ? "Invoice" : "Bill"}`
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function calcLineAmounts(item) {
  const base = item.quantity * item.rate;
  const disc = base * (item.discount / 100);
  const taxable = base - disc;
  const taxAmt = taxable * (item.taxPercent / 100);
  return { taxable, taxAmt, total: taxable + taxAmt };
}
function GSTSummary({ lineItems }) {
  const byRate = {};
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1", children: "GST Summary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-[10px] border border-border rounded", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/50 text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-2 py-1 font-medium", children: "Tax Rate" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-2 py-1 font-medium", children: "Taxable Amt" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-2 py-1 font-medium", children: "IGST" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-2 py-1 font-medium", children: "CGST" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-2 py-1 font-medium", children: "SGST" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map(([key, g]) => {
        const [taxTypeStr, rateStr] = key.split("-");
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-2 py-1", children: [
            taxTypeStr === TaxType.igst ? "IGST" : taxTypeStr === TaxType.cgstSgst ? "CGST+SGST" : "None",
            " ",
            rateStr,
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1 text-right tabular-nums", children: formatINR(g.taxable) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1 text-right tabular-nums", children: g.igst > 0 ? formatINR(g.igst) : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1 text-right tabular-nums", children: g.cgst > 0 ? formatINR(g.cgst) : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1 text-right tabular-nums", children: g.sgst > 0 ? formatINR(g.sgst) : "—" })
        ] }, key);
      }) })
    ] })
  ] });
}
function InvoiceDetailPanel({
  invoice,
  parties,
  onClose
}) {
  var _a;
  const [confirmCancel, setConfirmCancel] = reactExports.useState(false);
  const partyName = ((_a = parties.find((p) => p.id === invoice.partyId)) == null ? void 0 : _a.name) ?? `Party #${invoice.partyId}`;
  const { data: payments = [], isLoading: paymentsLoading } = usePaymentsForInvoice(invoice.id);
  const updateStatus = useUpdateInvoiceStatus();
  const cancelInvoice = useCancelInvoice();
  const balanceDue = invoice.grandTotal - invoice.amountPaid;
  const handleMarkSent = () => {
    updateStatus.mutate(
      { id: invoice.id, status: InvoiceStatus.sent },
      { onSuccess: () => ue.success("Invoice marked as Sent") }
    );
  };
  const handleCancel = () => {
    cancelInvoice.mutate(invoice.id, {
      onSuccess: () => {
        ue.success("Invoice cancelled");
        onClose();
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-[420px] flex-shrink-0 flex flex-col bg-background overflow-hidden",
      "data-ocid": "invoices.detail_panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-2.5 bg-card border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground font-mono", children: invoice.invoiceNumber }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: invoice.status })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              className: "text-muted-foreground hover:text-foreground",
              "data-ocid": "invoices.close_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-x-4 gap-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide", children: "Party" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: partyName })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide", children: "Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: invoice.invoiceType === "sales" ? "Sales Invoice" : "Purchase Bill" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide", children: "Invoice Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: formatDate(invoice.createdAt) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide", children: "Due Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: invoice.dueDate ? formatDate(invoice.dueDate) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1", children: "Line Items" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border border-border rounded text-[10px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/50 text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-2 py-1 font-medium", children: "Item" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-2 py-1 font-medium", children: "Qty" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-2 py-1 font-medium", children: "Rate" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-2 py-1 font-medium", children: "Tax" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-2 py-1 font-medium", children: "Amount" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: invoice.lineItems.map((item, i) => {
                const { total } = calcLineAmounts(item);
                const taxLabel = item.taxType === TaxType.igst ? `IGST ${item.taxPercent}%` : item.taxType === TaxType.cgstSgst ? `CGST+SGST ${item.taxPercent}%` : "No Tax";
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: "border-t border-border",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-2 py-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: item.itemName }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-muted-foreground", children: [
                          item.unit,
                          item.discount > 0 ? ` · ${item.discount}% disc` : ""
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1 text-right tabular-nums", children: item.quantity }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1 text-right tabular-nums", children: formatINR(item.rate) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1 text-right", children: taxLabel }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1 text-right tabular-nums font-medium", children: formatINR(total) })
                    ]
                  },
                  `${item.itemName}-${i}`
                );
              }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(GSTSummary, { lineItems: invoice.lineItems }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 rounded border border-border p-3 space-y-1.5 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Subtotal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: formatINR(invoice.subtotal) })
            ] }),
            invoice.totalDiscount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-red-600 dark:text-red-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Discount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums", children: [
                "- ",
                formatINR(invoice.totalDiscount)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Total Tax" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: formatINR(invoice.totalTax) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-semibold border-t border-border pt-1.5 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Grand Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: formatINR(invoice.grandTotal) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-green-700 dark:text-green-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Amount Paid" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: formatINR(invoice.amountPaid) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `flex justify-between font-semibold ${balanceDue > 0 ? "text-red-600 dark:text-red-400" : "text-green-700 dark:text-green-400"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Balance Due" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: formatINR(balanceDue) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1", children: "Payment History" }),
            paymentsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-full" }) : payments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-[10px] italic", children: "No payments recorded yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: payments.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex justify-between items-center py-1 border-b border-border last:border-0",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: formatINR(p.amount) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground ml-2 uppercase", children: p.method })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: formatDate(p.paymentDate) })
                ]
              },
              String(p.id)
            )) })
          ] }),
          invoice.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1", children: "Notes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: invoice.notes })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border px-4 py-2.5 bg-card flex items-center gap-2 flex-wrap", children: [
          invoice.status === InvoiceStatus.draft && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "h-7 text-xs",
              onClick: handleMarkSent,
              disabled: updateStatus.isPending,
              "data-ocid": "invoices.mark_sent_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3.5 w-3.5 mr-1" }),
                "Mark Sent"
              ]
            }
          ),
          invoice.status !== InvoiceStatus.cancelled && invoice.status !== InvoiceStatus.paid && (confirmCancel ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Confirm cancel?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "destructive",
                className: "h-6 text-[10px] px-2",
                onClick: handleCancel,
                disabled: cancelInvoice.isPending,
                "data-ocid": "invoices.confirm_cancel_button",
                children: "Yes, Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "ghost",
                className: "h-6 text-[10px] px-2",
                onClick: () => setConfirmCancel(false),
                "data-ocid": "invoices.cancel_button",
                children: "No"
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "ghost",
              className: "h-7 text-xs text-destructive hover:text-destructive",
              onClick: () => setConfirmCancel(true),
              "data-ocid": "invoices.cancel_invoice_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3.5 w-3.5 mr-1" }),
                "Cancel Invoice"
              ]
            }
          ))
        ] })
      ]
    }
  );
}
const STATUS_LABELS = {
  [InvoiceStatus.draft]: "Draft",
  [InvoiceStatus.sent]: "Sent",
  [InvoiceStatus.paid]: "Paid",
  [InvoiceStatus.partiallyPaid]: "Partial",
  [InvoiceStatus.overdue]: "Overdue",
  [InvoiceStatus.cancelled]: "Cancelled"
};
const STATUS_CLASS = {
  [InvoiceStatus.draft]: "bg-muted text-muted-foreground border-border",
  [InvoiceStatus.sent]: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  [InvoiceStatus.paid]: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
  [InvoiceStatus.partiallyPaid]: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  [InvoiceStatus.overdue]: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  [InvoiceStatus.cancelled]: "bg-muted text-muted-foreground border-border line-through"
};
function StatusBadge({ status }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${STATUS_CLASS[status]}`,
      children: STATUS_LABELS[status]
    }
  );
}
function getPartyName(partyId, parties) {
  var _a;
  return ((_a = parties.find((p) => p.id === partyId)) == null ? void 0 : _a.name) ?? `Party #${partyId}`;
}
function InvoicesPage() {
  const [activeTab, setActiveTab] = reactExports.useState("sales");
  const [search, setSearch] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState(
    "all"
  );
  const [selectedInvoiceId, setSelectedInvoiceId] = reactExports.useState(
    null
  );
  const [showCreateModal, setShowCreateModal] = reactExports.useState(false);
  const invoiceType = activeTab === "sales" ? InvoiceType.sales : InvoiceType.purchase;
  const { data: invoices = [], isLoading } = useInvoices(
    invoiceType,
    statusFilter !== "all" ? statusFilter : null
  );
  const { data: parties = [] } = useParties(null);
  const filtered = reactExports.useMemo(() => {
    if (!search.trim()) return invoices;
    const q = search.toLowerCase();
    return invoices.filter(
      (inv) => inv.invoiceNumber.toLowerCase().includes(q) || getPartyName(inv.partyId, parties).toLowerCase().includes(q)
    );
  }, [invoices, search, parties]);
  const selectedInvoice = selectedInvoiceId ? invoices.find((i) => i.id === selectedInvoiceId) ?? null : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full", "data-ocid": "invoices.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `flex flex-col flex-1 min-w-0 ${selectedInvoice ? "border-r border-border" : ""}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-2.5 bg-card border-b border-border flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex rounded border border-border overflow-hidden text-xs font-medium", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setActiveTab("sales");
                    setSelectedInvoiceId(null);
                  },
                  className: `px-3 py-1.5 transition-colors ${activeTab === "sales" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"}`,
                  "data-ocid": "invoices.sales_tab",
                  children: "Sales Invoices"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setActiveTab("purchase");
                    setSelectedInvoiceId(null);
                  },
                  className: `px-3 py-1.5 transition-colors border-l border-border ${activeTab === "purchase" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"}`,
                  "data-ocid": "invoices.purchase_tab",
                  children: "Purchase Bills"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[160px] max-w-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  placeholder: "Invoice # or party name…",
                  className: "pl-7 h-7 text-xs",
                  "data-ocid": "invoices.search_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: statusFilter,
                onValueChange: (v) => setStatusFilter(v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "h-7 text-xs w-32",
                      "data-ocid": "invoices.status_filter",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Status" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Status" }),
                    Object.values(InvoiceStatus).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: STATUS_LABELS[s] }, s))
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "h-7 text-xs ml-auto",
                onClick: () => setShowCreateModal(true),
                "data-ocid": "invoices.create_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 mr-1" }),
                  activeTab === "sales" ? "New Invoice" : "New Bill"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-2", "data-ocid": "invoices.loading_state", children: [...Array(6)].map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders have no stable id
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full" }, `skel-${i}`)
          )) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center h-48 text-center",
              "data-ocid": "invoices.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-8 w-8 text-muted-foreground mb-2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground", children: [
                  "No ",
                  activeTab === "sales" ? "invoices" : "bills",
                  " found"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                  "Create your first",
                  " ",
                  activeTab === "sales" ? "invoice" : "purchase bill",
                  " to get started"
                ] })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs border-collapse", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/50 text-muted-foreground border-b border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 font-medium w-28", children: "Invoice #" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 font-medium", children: "Party" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 font-medium w-24", children: "Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 font-medium w-24", children: "Due Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2 font-medium w-28", children: "Grand Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-2 font-medium w-24", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2 font-medium w-24", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((inv, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              InvoiceRow,
              {
                invoice: inv,
                index: idx + 1,
                parties,
                isSelected: selectedInvoiceId === inv.id,
                onClick: () => setSelectedInvoiceId(
                  inv.id === selectedInvoiceId ? null : inv.id
                )
              },
              String(inv.id)
            )) })
          ] }) })
        ]
      }
    ),
    selectedInvoice && /* @__PURE__ */ jsxRuntimeExports.jsx(
      InvoiceDetailPanel,
      {
        invoice: selectedInvoice,
        parties,
        onClose: () => setSelectedInvoiceId(null)
      }
    ),
    showCreateModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CreateInvoiceModal,
      {
        defaultType: invoiceType,
        parties,
        onClose: () => setShowCreateModal(false)
      }
    )
  ] });
}
function InvoiceRow({
  invoice,
  index,
  parties,
  isSelected,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "tr",
    {
      className: `border-b border-border cursor-pointer transition-colors ${isSelected ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-muted/30"}`,
      onClick,
      tabIndex: 0,
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      },
      "data-ocid": `invoices.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono text-primary", children: invoice.invoiceNumber }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            className: "px-3 py-2 truncate max-w-[180px]",
            title: getPartyName(invoice.partyId, parties),
            children: getPartyName(invoice.partyId, parties)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground", children: formatDate(invoice.createdAt) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground", children: invoice.dueDate ? formatDate(invoice.dueDate) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-border", children: "—" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right font-medium tabular-nums", children: formatINR(invoice.grandTotal) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: invoice.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            className: "px-3 py-2 text-right",
            onClick: (e) => e.stopPropagation(),
            onKeyDown: (e) => e.stopPropagation(),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick,
                className: "text-primary hover:underline text-[10px]",
                "data-ocid": `invoices.view_button.${index}`,
                children: "View"
              }
            )
          }
        )
      ]
    }
  );
}
export {
  StatusBadge,
  InvoicesPage as default
};
