import { r as reactExports, p as PaymentMethod, j as jsxRuntimeExports, B as Button, q as useDirection, s as useControllableState, t as Primitive, v as useId, R as Root, w as Item, f as composeEventHandlers, x as createRovingFocusGroupScope, k as createContextScope, y as Presence, d as cn, I as InvoiceType, n as InvoiceStatus, z as useActor, A as useQuery, C as CreditCard, D as createActor } from "./index-9WJHbuJb.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, S as Select, d as SelectTrigger, e as SelectValue, f as SelectContent, g as SelectItem, h as DialogFooter } from "./select-DSCHxrCU.js";
import { L as Label, I as Input, u as ue } from "./index-GatS_aqM.js";
import { p as useRecordPayment, b as formatINR, d as useInvoices, c as useAgingReport, e as useParties, S as Skeleton, g as formatDate } from "./types-DrzT-PkP.js";
import { T as TrendingUp, a as TrendingDown, C as CircleAlert } from "./trending-up-DdkQYAkT.js";
import "./index-BCeTUzrl.js";
const METHOD_LABELS = {
  [PaymentMethod.cash]: "Cash",
  [PaymentMethod.bank]: "Bank Transfer",
  [PaymentMethod.cheque]: "Cheque",
  [PaymentMethod.upi]: "UPI"
};
function todayNs() {
  return BigInt(Date.now()) * 1000000n;
}
function nsToInputDate(ns) {
  const d = new Date(Number(ns / 1000000n));
  return d.toISOString().split("T")[0];
}
function RecordPaymentModal({
  open,
  onOpenChange,
  invoices,
  parties,
  preselectedInvoiceId
}) {
  const recordPayment = useRecordPayment();
  const partyMap = new Map(parties.map((p) => [p.id.toString(), p]));
  const outstanding = invoices.filter(
    (inv) => inv.grandTotal - inv.amountPaid > 0
  );
  const [invoiceId, setInvoiceId] = reactExports.useState(
    preselectedInvoiceId ? preselectedInvoiceId.toString() : ""
  );
  const [amount, setAmount] = reactExports.useState("");
  const [paymentDate, setPaymentDate] = reactExports.useState(
    nsToInputDate(todayNs())
  );
  const [method, setMethod] = reactExports.useState(PaymentMethod.cash);
  const [notes, setNotes] = reactExports.useState("");
  const [search, setSearch] = reactExports.useState("");
  const selectedInvoice = outstanding.find(
    (i) => i.id.toString() === invoiceId
  );
  const balance = selectedInvoice ? selectedInvoice.grandTotal - selectedInvoice.amountPaid : 0;
  const filteredInvoices = outstanding.filter((inv) => {
    const party = partyMap.get(inv.partyId.toString());
    const q = search.toLowerCase();
    return inv.invoiceNumber.toLowerCase().includes(q) || ((party == null ? void 0 : party.name) ?? "").toLowerCase().includes(q);
  });
  function handleInvoiceSelect(id) {
    setInvoiceId(id);
    const inv = outstanding.find((i) => i.id.toString() === id);
    if (inv) setAmount(String(inv.grandTotal - inv.amountPaid));
  }
  async function handleSubmit() {
    if (!invoiceId) {
      ue.error("Select an invoice");
      return;
    }
    const amt = Number.parseFloat(amount);
    if (!amt || amt <= 0) {
      ue.error("Enter a valid amount");
      return;
    }
    if (amt > balance) {
      ue.error(
        `Amount cannot exceed outstanding balance ${formatINR(balance)}`
      );
      return;
    }
    const dateMs = new Date(paymentDate).getTime();
    if (Number.isNaN(dateMs)) {
      ue.error("Invalid payment date");
      return;
    }
    try {
      await recordPayment.mutateAsync({
        invoiceId: BigInt(invoiceId),
        amount: amt,
        paymentDate: BigInt(dateMs) * 1000000n,
        method,
        notes: notes || void 0
      });
      ue.success("Payment recorded");
      onOpenChange(false);
      setInvoiceId("");
      setAmount("");
      setNotes("");
      setSearch("");
    } catch {
      ue.error("Failed to record payment");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", "data-ocid": "record-payment.dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-sm font-semibold", children: "Record Payment" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium mb-1 block", children: "Invoice" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search invoice # or party...",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "h-7 text-xs mb-1",
            "data-ocid": "record-payment.search_input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: invoiceId, onValueChange: handleInvoiceSelect, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectTrigger,
            {
              className: "h-7 text-xs",
              "data-ocid": "record-payment.invoice_select",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select invoice" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "max-h-48", children: [
            filteredInvoices.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 text-xs text-muted-foreground", children: "No outstanding invoices" }),
            filteredInvoices.map((inv) => {
              const party = partyMap.get(inv.partyId.toString());
              const bal = inv.grandTotal - inv.amountPaid;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                SelectItem,
                {
                  value: inv.id.toString(),
                  className: "text-xs",
                  children: [
                    inv.invoiceNumber,
                    " — ",
                    (party == null ? void 0 : party.name) ?? "Unknown",
                    " —",
                    " ",
                    formatINR(bal)
                  ]
                },
                inv.id.toString()
              );
            })
          ] })
        ] }),
        selectedInvoice && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
          "Outstanding balance:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: formatINR(balance) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium mb-1 block", children: "Amount (₹)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            min: "0",
            step: "0.01",
            value: amount,
            onChange: (e) => setAmount(e.target.value),
            className: "h-7 text-xs",
            "data-ocid": "record-payment.amount_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium mb-1 block", children: "Payment Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "date",
              value: paymentDate,
              onChange: (e) => setPaymentDate(e.target.value),
              className: "h-7 text-xs",
              "data-ocid": "record-payment.date_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium mb-1 block", children: "Method" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: method,
              onValueChange: (v) => setMethod(v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "h-7 text-xs",
                    "data-ocid": "record-payment.method_select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.values(PaymentMethod).map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: m, className: "text-xs", children: METHOD_LABELS[m] }, m)) })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium mb-1 block", children: "Notes (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: notes,
            onChange: (e) => setNotes(e.target.value),
            placeholder: "Cheque no., UPI ref...",
            className: "h-7 text-xs",
            "data-ocid": "record-payment.notes_input"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          onClick: () => onOpenChange(false),
          "data-ocid": "record-payment.cancel_button",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          size: "sm",
          onClick: handleSubmit,
          disabled: recordPayment.isPending,
          "data-ocid": "record-payment.submit_button",
          children: recordPayment.isPending ? "Saving..." : "Record Payment"
        }
      )
    ] })
  ] }) });
}
var TABS_NAME = "Tabs";
var [createTabsContext] = createContextScope(TABS_NAME, [
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      dir,
      activationMode = "automatic",
      ...tabsProps
    } = props;
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: TABS_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabsProvider,
      {
        scope: __scopeTabs,
        baseId: useId(),
        value,
        onValueChange: setValue,
        orientation,
        dir: direction,
        activationMode,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            "data-orientation": orientation,
            ...tabsProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Tabs$1.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation: context.orientation,
        dir: context.dir,
        loop,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            role: "tablist",
            "aria-orientation": context.orientation,
            ...listProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
TabsList$1.displayName = TAB_LIST_NAME;
var TRIGGER_NAME = "TabsTrigger";
var TabsTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: isSelected,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": isSelected,
            "aria-controls": contentId,
            "data-state": isSelected ? "active" : "inactive",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            id: triggerId,
            ...triggerProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onValueChange(value);
              } else {
                event.preventDefault();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => {
              const isAutomaticActivation = context.activationMode !== "manual";
              if (!isSelected && !disabled && isAutomaticActivation) {
                context.onValueChange(value);
              }
            })
          }
        )
      }
    );
  }
);
TabsTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "TabsContent";
var TabsContent = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME, __scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = reactExports.useRef(isSelected);
    reactExports.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || isSelected, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": isSelected ? "active" : "inactive",
        "data-orientation": context.orientation,
        role: "tabpanel",
        "aria-labelledby": triggerId,
        hidden: !present,
        id: contentId,
        tabIndex: 0,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
        },
        children: present && children
      }
    ) });
  }
);
TabsContent.displayName = CONTENT_NAME;
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
var Root2 = Tabs$1;
var List = TabsList$1;
var Trigger = TabsTrigger$1;
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
const METHOD_BADGE = {
  [PaymentMethod.cash]: {
    label: "Cash",
    className: "bg-muted text-muted-foreground"
  },
  [PaymentMethod.bank]: {
    label: "Bank",
    className: "bg-primary/10 text-primary"
  },
  [PaymentMethod.cheque]: {
    label: "Cheque",
    className: "bg-accent/10 text-accent-foreground"
  },
  [PaymentMethod.upi]: {
    label: "UPI",
    className: "bg-chart-1/10 text-chart-1"
  }
};
function useAllPayments(invoices) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["all-payments", invoices.map((i) => i.id.toString()).join(",")],
    queryFn: async () => {
      if (!actor || invoices.length === 0) return [];
      const results = await Promise.all(
        invoices.map(async (inv) => {
          const payments = await actor.listPaymentsForInvoice(inv.id);
          return payments.map((p) => ({
            payment: p,
            invoiceNumber: inv.invoiceNumber,
            partyId: inv.partyId
          }));
        })
      );
      return results.flat().sort((a, b) => Number(b.payment.paymentDate - a.payment.paymentDate));
    },
    enabled: !!actor && !isFetching && invoices.length > 0
  });
}
function daysOverdue(dueDateNs) {
  if (!dueDateNs) return 0;
  const nowMs = Date.now();
  const dueMs = Number(dueDateNs / 1000000n);
  return dueMs < nowMs ? Math.floor((nowMs - dueMs) / 864e5) : 0;
}
function AgingTable({
  buckets,
  loading
}) {
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border rounded overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "bg-muted/60", children: ["0–30 Days", "30–60 Days", "60+ Days"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "th",
      {
        className: "px-3 py-1.5 text-muted-foreground font-medium text-right first:text-left",
        children: h
      },
      h
    )) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "bg-card", children: ["0-30", "31-60", "60+"].map((key) => {
      const bucket = buckets.find((b) => b.bucket === key);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "td",
        {
          className: "px-3 py-1.5 text-right first:text-left font-mono",
          children: bucket ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: key === "60+" && bucket.totalAmount > 0 ? "text-destructive font-semibold" : "",
              children: [
                formatINR(bucket.totalAmount),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground ml-1", children: [
                  "(",
                  bucket.count.toString(),
                  ")"
                ] })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" })
        },
        key
      );
    }) }) })
  ] }) });
}
function InvoiceTable({
  invoices,
  parties,
  filter,
  onRecord
}) {
  const partyMap = new Map(parties.map((p) => [p.id.toString(), p]));
  const filtered = invoices.filter((inv) => {
    if (filter === "outstanding")
      return inv.grandTotal - inv.amountPaid > 0.01 && inv.status !== InvoiceStatus.cancelled;
    if (filter === "paid") return inv.status === InvoiceStatus.paid;
    return inv.status !== InvoiceStatus.cancelled;
  });
  if (filtered.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-12 gap-2",
        "data-ocid": "payments.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-8 h-8 text-muted-foreground/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "No invoices found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Adjust the filter or create new invoices" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs min-w-[700px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "bg-muted/60 border-b border-border", children: [
      "Invoice #",
      "Party",
      "Total",
      "Paid",
      "Balance",
      "Due Date",
      "Overdue",
      "Action"
    ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "th",
      {
        className: "px-3 py-2 text-muted-foreground font-medium text-left last:text-right",
        children: h
      },
      h
    )) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: filtered.map((inv, idx) => {
      const party = partyMap.get(inv.partyId.toString());
      const balance = inv.grandTotal - inv.amountPaid;
      const overdue = daysOverdue(inv.dueDate);
      const isOverdue = overdue > 0 && inv.status !== InvoiceStatus.paid;
      const canRecord = balance > 0.01 && inv.status !== InvoiceStatus.cancelled && inv.status !== InvoiceStatus.paid;
      const ocidIdx = idx + 1;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "hover:bg-muted/30 transition-colors",
          "data-ocid": `payments.item.${ocidIdx}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono font-medium text-foreground", children: inv.invoiceNumber }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-foreground max-w-[160px] truncate", children: (party == null ? void 0 : party.name) ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right font-mono", children: formatINR(inv.grandTotal) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right font-mono text-chart-1", children: inv.amountPaid > 0 ? formatINR(inv.amountPaid) : "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right font-mono font-semibold", children: balance > 0.01 ? formatINR(balance) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-chart-1", children: "Paid" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground", children: inv.dueDate ? formatDate(inv.dueDate) : "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: isOverdue ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-destructive font-semibold", children: [
              overdue,
              "d"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right", children: canRecord && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                size: "sm",
                variant: "outline",
                className: "h-6 text-xs px-2",
                onClick: () => onRecord(inv.id),
                "data-ocid": `payments.record_button.${ocidIdx}`,
                children: "Record"
              }
            ) })
          ]
        },
        inv.id.toString()
      );
    }) })
  ] }) });
}
function PaymentHistoryTable({
  payments,
  parties,
  loading
}) {
  const partyMap = new Map(parties.map((p) => [p.id.toString(), p]));
  if (loading)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1 p-4", children: [...Array(5)].map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders have no stable id
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full" }, `skel-${i}`)
    )) });
  if (payments.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-10",
        "data-ocid": "payments-history.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-7 h-7 text-muted-foreground/40 mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No payment records yet" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs min-w-[600px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "bg-muted/60 border-b border-border", children: ["Invoice #", "Party", "Date", "Amount", "Method", "Notes"].map(
      (h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "px-3 py-2 text-muted-foreground font-medium text-left last:text-left",
          children: h
        },
        h
      )
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: payments.map(({ payment, invoiceNumber, partyId }, idx) => {
      const party = partyMap.get(partyId.toString());
      const mb = METHOD_BADGE[payment.method];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "hover:bg-muted/30",
          "data-ocid": `payment-history.item.${idx + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono font-medium", children: invoiceNumber }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 max-w-[160px] truncate", children: (party == null ? void 0 : party.name) ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground", children: formatDate(payment.paymentDate) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono font-semibold", children: formatINR(payment.amount) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${mb.className}`,
                children: mb.label
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground", children: payment.notes ?? "—" })
          ]
        },
        payment.id.toString()
      );
    }) })
  ] }) });
}
function PaymentsPage() {
  const [tab, setTab] = reactExports.useState("receivables");
  const [filter, setFilter] = reactExports.useState("outstanding");
  const [section, setSection] = reactExports.useState("invoices");
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const [preselectedId, setPreselectedId] = reactExports.useState();
  const invoiceType = tab === "receivables" ? InvoiceType.sales : InvoiceType.purchase;
  const { data: invoices = [], isLoading: invLoading } = useInvoices(invoiceType);
  const { data: agingBuckets = [], isLoading: agingLoading } = useAgingReport(invoiceType);
  const { data: parties = [] } = useParties();
  const { data: allPayments = [], isLoading: paymentsLoading } = useAllPayments(invoices);
  const totalOutstanding = reactExports.useMemo(
    () => invoices.filter((i) => i.status !== InvoiceStatus.cancelled).reduce((sum, i) => sum + Math.max(0, i.grandTotal - i.amountPaid), 0),
    [invoices]
  );
  function openRecord(id) {
    setPreselectedId(id);
    setModalOpen(true);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", "data-ocid": "payments.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-2 border-b border-border bg-card gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Tabs,
          {
            value: tab,
            onValueChange: (v) => {
              setTab(v);
              setFilter("outstanding");
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "h-7", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TabsTrigger,
                {
                  value: "receivables",
                  className: "text-xs px-3 h-6",
                  "data-ocid": "payments.receivables_tab",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-3 h-3 mr-1" }),
                    "Receivables"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TabsTrigger,
                {
                  value: "payables",
                  className: "text-xs px-3 h-6",
                  "data-ocid": "payments.payables_tab",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "w-3 h-3 mr-1" }),
                    "Payables"
                  ]
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: section,
              onValueChange: (v) => setSection(v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "h-7 text-xs w-36",
                    "data-ocid": "payments.section_select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "invoices", className: "text-xs", children: "Invoice List" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "history", className: "text-xs", children: "Payment History" })
                ] })
              ]
            }
          ),
          section === "invoices" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: filter,
              onValueChange: (v) => setFilter(v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "h-7 text-xs w-36",
                    "data-ocid": "payments.filter_select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", className: "text-xs", children: "All Invoices" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "outstanding", className: "text-xs", children: "Outstanding Only" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "paid", className: "text-xs", children: "Paid Only" })
                ] })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right hidden sm:block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide", children: tab === "receivables" ? "Total Outstanding Receivables" : "Total Outstanding Payables" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold font-mono text-foreground", children: formatINR(totalOutstanding) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            size: "sm",
            className: "h-7 text-xs",
            onClick: () => openRecord(void 0),
            "data-ocid": "payments.record_payment_button",
            children: "Record Payment"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 bg-muted/30 border-b border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5 font-medium", children: [
        "Aging Summary — ",
        tab === "receivables" ? "Receivables" : "Payables"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AgingTable, { buckets: agingBuckets, loading: agingLoading })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto bg-background", children: section === "invoices" ? invLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-2", children: [...Array(8)].map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders have no stable id
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full" }, `skel-${i}`)
    )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      InvoiceTable,
      {
        invoices,
        parties,
        filter,
        onRecord: openRecord
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      PaymentHistoryTable,
      {
        payments: allPayments,
        parties,
        loading: paymentsLoading
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      RecordPaymentModal,
      {
        open: modalOpen,
        onOpenChange: setModalOpen,
        invoices,
        parties,
        preselectedInvoiceId: preselectedId
      }
    )
  ] });
}
export {
  PaymentsPage as default
};
