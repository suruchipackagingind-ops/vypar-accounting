import { c as createLucideIcon, j as jsxRuntimeExports, X, d as cn, r as reactExports, P as PartyType, B as Button, L as LoaderCircle, e as useComposedRefs, f as composeEventHandlers, h as createSlottable, k as createContextScope, l as buttonVariants, S as Slot, m as cva, U as Users } from "./index-9WJHbuJb.js";
import { L as Label, I as Input, u as ue } from "./index-GatS_aqM.js";
import { R as Root, C as Content, a as Close, T as Title, P as Portal, O as Overlay, W as WarningProvider, D as Description, c as createDialogScope, b as Trigger, d as ChevronUp, e as ChevronDown } from "./index-BCeTUzrl.js";
import { S as Search, T as Textarea } from "./textarea-FibJKKIa.js";
import { h as useCreateParty, i as useUpdateParty, j as useLookupGSTIN, e as useParties, d as useInvoices, k as useDeactivateParty, S as Skeleton, g as formatDate, f as formatINRCompact } from "./types-DrzT-PkP.js";
import { P as Plus } from "./plus-hpJf09Zu.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "17", x2: "22", y1: "8", y2: "13", key: "3nzzx3" }],
  ["line", { x1: "22", x2: "17", y1: "8", y2: "13", key: "1swrse" }]
];
const UserX = createLucideIcon("user-x", __iconNode);
function Sheet({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { "data-slot": "sheet", ...props });
}
function SheetPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay,
    {
      "data-slot": "sheet-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function SheetContent({
  className,
  children,
  side = "right",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Content,
      {
        "data-slot": "sheet-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        ),
        ...props,
        children: [
          children,
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function SheetHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "sheet-header",
      className: cn("flex flex-col gap-1.5 p-4", className),
      ...props
    }
  );
}
function SheetFooter({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "sheet-footer",
      className: cn("mt-auto flex flex-col gap-2 p-4", className),
      ...props
    }
  );
}
function SheetTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title,
    {
      "data-slot": "sheet-title",
      className: cn("text-foreground font-semibold", className),
      ...props
    }
  );
}
const EMPTY_FORM = {
  name: "",
  partyType: PartyType.customer,
  phone: "",
  email: "",
  address: "",
  gstNumber: ""
};
function ClientFormDrawer({ open, onClose, editParty }) {
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const [errors, setErrors] = reactExports.useState({});
  const createParty = useCreateParty();
  const updateParty = useUpdateParty();
  const lookupGSTIN = useLookupGSTIN();
  reactExports.useEffect(() => {
    if (editParty) {
      setForm({
        name: editParty.name,
        partyType: editParty.partyType,
        phone: editParty.phone ?? "",
        email: editParty.email ?? "",
        address: editParty.address ?? "",
        gstNumber: editParty.gstNumber ?? ""
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [editParty]);
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (form.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
      form.gstNumber
    )) {
      e.gstNumber = "Invalid GST number format (e.g. 22AAAAA0000A1Z5)";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleSubmit = async () => {
    if (!validate()) return;
    const req = {
      name: form.name.trim(),
      partyType: form.partyType,
      phone: form.phone.trim() || void 0,
      email: form.email.trim() || void 0,
      address: form.address.trim() || void 0,
      gstNumber: form.gstNumber.trim().toUpperCase() || void 0
    };
    try {
      if (editParty) {
        await updateParty.mutateAsync({ id: editParty.id, ...req });
        ue.success("Client updated");
      } else {
        await createParty.mutateAsync(req);
        ue.success("Client added");
      }
      onClose();
    } catch {
      ue.error("Failed to save client");
    }
  };
  const isPending = createParty.isPending || updateParty.isPending;
  const typeOptions = [
    { value: PartyType.customer, label: "Customer" },
    { value: PartyType.vendor, label: "Vendor" },
    { value: PartyType.both, label: "Both" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "right", className: "w-[380px] flex flex-col gap-0 p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { className: "px-5 py-4 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { className: "text-sm font-semibold", children: editParty ? "Edit Client" : "Add New Client" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-5 py-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium", children: "Name *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "client_form.name_input",
            className: "h-8 text-xs",
            value: form.name,
            onChange: (e) => setForm((f) => ({ ...f, name: e.target.value })),
            placeholder: "e.g. Ramesh Enterprises"
          }
        ),
        errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs text-destructive",
            "data-ocid": "client_form.name_field_error",
            children: errors.name
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium", children: "Type *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", "data-ocid": "client_form.type_toggle", children: typeOptions.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setForm((f) => ({ ...f, partyType: opt.value })),
            className: `flex-1 h-8 text-xs rounded border transition-colors ${form.partyType === opt.value ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-border hover:bg-muted"}`,
            children: opt.label
          },
          opt.value
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium", children: "Phone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "client_form.phone_input",
            className: "h-8 text-xs",
            value: form.phone,
            onChange: (e) => setForm((f) => ({ ...f, phone: e.target.value })),
            placeholder: "+91 98765 43210"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "client_form.email_input",
            type: "email",
            className: "h-8 text-xs",
            value: form.email,
            onChange: (e) => setForm((f) => ({ ...f, email: e.target.value })),
            placeholder: "contact@example.com"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium", children: "GST Number" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "client_form.gst_input",
              className: "h-8 text-xs font-mono uppercase flex-1",
              value: form.gstNumber,
              onChange: (e) => setForm((f) => ({
                ...f,
                gstNumber: e.target.value.toUpperCase()
              })),
              placeholder: "22AAAAA0000A1Z5",
              maxLength: 15
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              "data-ocid": "client_form.gst_autofetch_button",
              className: "h-8 px-2.5 text-xs shrink-0 gap-1.5 border-primary/40 text-primary hover:bg-primary/5",
              disabled: !form.gstNumber || form.gstNumber.length !== 15 || lookupGSTIN.isPending,
              onClick: async () => {
                var _a, _b;
                try {
                  const data = await lookupGSTIN.mutateAsync(form.gstNumber);
                  const name = ((_a = data.tradeName) == null ? void 0 : _a.trim()) || ((_b = data.legalName) == null ? void 0 : _b.trim());
                  const address = [
                    data.principalAddress,
                    data.state,
                    data.pincode
                  ].filter(Boolean).join(", ");
                  setForm((f) => ({
                    ...f,
                    name: name || f.name,
                    address: address || f.address
                  }));
                  ue.success("GST details fetched successfully");
                } catch (err) {
                  ue.error(
                    err instanceof Error ? err.message : "Lookup failed"
                  );
                }
              },
              children: [
                lookupGSTIN.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-3.5 w-3.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Auto-fill" })
              ]
            }
          )
        ] }),
        errors.gstNumber && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs text-destructive",
            "data-ocid": "client_form.gst_field_error",
            children: errors.gstNumber
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium", children: "Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            "data-ocid": "client_form.address_input",
            className: "text-xs min-h-[64px] resize-none",
            value: form.address,
            onChange: (e) => setForm((f) => ({ ...f, address: e.target.value })),
            placeholder: "Street, City, State, PIN"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetFooter, { className: "px-5 py-4 border-t gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          onClick: onClose,
          "data-ocid": "client_form.cancel_button",
          className: "flex-1 h-8 text-xs",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          size: "sm",
          onClick: handleSubmit,
          disabled: isPending,
          "data-ocid": "client_form.submit_button",
          className: "flex-1 h-8 text-xs",
          children: isPending ? "Saving…" : editParty ? "Update" : "Add Client"
        }
      )
    ] })
  ] }) });
}
var ROOT_NAME = "AlertDialog";
var [createAlertDialogContext] = createContextScope(ROOT_NAME, [
  createDialogScope
]);
var useDialogScope = createDialogScope();
var AlertDialog$1 = (props) => {
  const { __scopeAlertDialog, ...alertDialogProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { ...dialogScope, ...alertDialogProps, modal: true });
};
AlertDialog$1.displayName = ROOT_NAME;
var TRIGGER_NAME = "AlertDialogTrigger";
var AlertDialogTrigger = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...triggerProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Trigger, { ...dialogScope, ...triggerProps, ref: forwardedRef });
  }
);
AlertDialogTrigger.displayName = TRIGGER_NAME;
var PORTAL_NAME = "AlertDialogPortal";
var AlertDialogPortal$1 = (props) => {
  const { __scopeAlertDialog, ...portalProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { ...dialogScope, ...portalProps });
};
AlertDialogPortal$1.displayName = PORTAL_NAME;
var OVERLAY_NAME = "AlertDialogOverlay";
var AlertDialogOverlay$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...overlayProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Overlay, { ...dialogScope, ...overlayProps, ref: forwardedRef });
  }
);
AlertDialogOverlay$1.displayName = OVERLAY_NAME;
var CONTENT_NAME = "AlertDialogContent";
var [AlertDialogContentProvider, useAlertDialogContentContext] = createAlertDialogContext(CONTENT_NAME);
var Slottable = createSlottable("AlertDialogContent");
var AlertDialogContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, children, ...contentProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    const cancelRef = reactExports.useRef(null);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      WarningProvider,
      {
        contentName: CONTENT_NAME,
        titleName: TITLE_NAME,
        docsSlug: "alert-dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogContentProvider, { scope: __scopeAlertDialog, cancelRef, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Content,
          {
            role: "alertdialog",
            ...dialogScope,
            ...contentProps,
            ref: composedRefs,
            onOpenAutoFocus: composeEventHandlers(contentProps.onOpenAutoFocus, (event) => {
              var _a;
              event.preventDefault();
              (_a = cancelRef.current) == null ? void 0 : _a.focus({ preventScroll: true });
            }),
            onPointerDownOutside: (event) => event.preventDefault(),
            onInteractOutside: (event) => event.preventDefault(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Slottable, { children }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DescriptionWarning, { contentRef })
            ]
          }
        ) })
      }
    );
  }
);
AlertDialogContent$1.displayName = CONTENT_NAME;
var TITLE_NAME = "AlertDialogTitle";
var AlertDialogTitle$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...titleProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { ...dialogScope, ...titleProps, ref: forwardedRef });
  }
);
AlertDialogTitle$1.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "AlertDialogDescription";
var AlertDialogDescription$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeAlertDialog, ...descriptionProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Description, { ...dialogScope, ...descriptionProps, ref: forwardedRef });
});
AlertDialogDescription$1.displayName = DESCRIPTION_NAME;
var ACTION_NAME = "AlertDialogAction";
var AlertDialogAction$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...actionProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { ...dialogScope, ...actionProps, ref: forwardedRef });
  }
);
AlertDialogAction$1.displayName = ACTION_NAME;
var CANCEL_NAME = "AlertDialogCancel";
var AlertDialogCancel$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...cancelProps } = props;
    const { cancelRef } = useAlertDialogContentContext(CANCEL_NAME, __scopeAlertDialog);
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const ref = useComposedRefs(forwardedRef, cancelRef);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { ...dialogScope, ...cancelProps, ref });
  }
);
AlertDialogCancel$1.displayName = CANCEL_NAME;
var DescriptionWarning = ({ contentRef }) => {
  const MESSAGE = `\`${CONTENT_NAME}\` requires a description for the component to be accessible for screen reader users.

You can add a description to the \`${CONTENT_NAME}\` by passing a \`${DESCRIPTION_NAME}\` component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a description by assigning it an \`id\` and passing the same value to the \`aria-describedby\` prop in \`${CONTENT_NAME}\`. If the description is confusing or duplicative for sighted users, you can use the \`@radix-ui/react-visually-hidden\` primitive as a wrapper around your description component.

For more information, see https://radix-ui.com/primitives/docs/components/alert-dialog`;
  reactExports.useEffect(() => {
    var _a;
    const hasDescription = document.getElementById(
      (_a = contentRef.current) == null ? void 0 : _a.getAttribute("aria-describedby")
    );
    if (!hasDescription) console.warn(MESSAGE);
  }, [MESSAGE, contentRef]);
  return null;
};
var Root2 = AlertDialog$1;
var Portal2 = AlertDialogPortal$1;
var Overlay2 = AlertDialogOverlay$1;
var Content2 = AlertDialogContent$1;
var Action = AlertDialogAction$1;
var Cancel = AlertDialogCancel$1;
var Title2 = AlertDialogTitle$1;
var Description2 = AlertDialogDescription$1;
function AlertDialog({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { "data-slot": "alert-dialog", ...props });
}
function AlertDialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { "data-slot": "alert-dialog-portal", ...props });
}
function AlertDialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay2,
    {
      "data-slot": "alert-dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function AlertDialogContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Content2,
      {
        "data-slot": "alert-dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props
      }
    )
  ] });
}
function AlertDialogHeader({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "alert-dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function AlertDialogFooter({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "alert-dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function AlertDialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title2,
    {
      "data-slot": "alert-dialog-title",
      className: cn("text-lg font-semibold", className),
      ...props
    }
  );
}
function AlertDialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Description2,
    {
      "data-slot": "alert-dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function AlertDialogAction({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Action,
    {
      className: cn(buttonVariants(), className),
      ...props
    }
  );
}
function AlertDialogCancel({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Cancel,
    {
      className: cn(buttonVariants({ variant: "outline" }), className),
      ...props
    }
  );
}
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Comp,
    {
      "data-slot": "badge",
      className: cn(badgeVariants({ variant }), className),
      ...props
    }
  );
}
function partyTypeBadge(type) {
  const map = {
    [PartyType.customer]: {
      label: "Customer",
      className: "bg-primary/10 text-primary border-primary/20"
    },
    [PartyType.vendor]: {
      label: "Vendor",
      className: "bg-chart-2/15 text-chart-2 border-chart-2/20"
    },
    [PartyType.both]: {
      label: "Both",
      className: "bg-chart-3/15 text-chart-3 border-chart-3/20"
    }
  };
  const { label, className } = map[type] ?? { label: type, className: "" };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Badge,
    {
      variant: "outline",
      className: `text-[10px] px-1.5 py-0 h-[18px] ${className}`,
      children: label
    }
  );
}
function InvoiceSummary({
  partyId,
  allInvoices
}) {
  const inv = allInvoices.filter((i) => i.partyId === partyId);
  const totalInvoiced = inv.reduce((s, i) => s + i.grandTotal, 0);
  const totalPaid = inv.reduce((s, i) => s + i.amountPaid, 0);
  const outstanding = totalInvoiced - totalPaid;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6 mt-3 pt-3 border-t", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide", children: "Invoiced" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: formatINRCompact(totalInvoiced) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide", children: "Paid" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-primary", children: formatINRCompact(totalPaid) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide", children: "Outstanding" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: `text-sm font-semibold ${outstanding > 0 ? "text-destructive" : "text-foreground"}`,
          children: formatINRCompact(outstanding)
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide", children: "Invoices" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: inv.length })
    ] })
  ] });
}
function DetailPanel({
  party,
  allInvoices,
  onEdit
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 border-t border-b px-4 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-x-8 gap-y-1 text-xs", children: [
      party.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Phone: " }),
        party.phone
      ] }),
      party.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Email: " }),
        party.email
      ] }),
      party.gstNumber && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "GST: " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: party.gstNumber })
      ] }),
      party.address && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Address: " }),
        party.address
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Added: " }),
        formatDate(party.createdAt)
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(InvoiceSummary, { partyId: party.id, allInvoices }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        size: "sm",
        variant: "outline",
        className: "mt-3 h-7 text-xs",
        onClick: onEdit,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3 w-3 mr-1" }),
          " Edit"
        ]
      }
    )
  ] });
}
function ClientsPage() {
  const [search, setSearch] = reactExports.useState("");
  const [tab, setTab] = reactExports.useState("all");
  const [sortKey, setSortKey] = reactExports.useState("name");
  const [sortDir, setSortDir] = reactExports.useState("asc");
  const [expandedId, setExpandedId] = reactExports.useState(null);
  const [formOpen, setFormOpen] = reactExports.useState(false);
  const [editParty, setEditParty] = reactExports.useState(null);
  const [deactivateTarget, setDeactivateTarget] = reactExports.useState(
    null
  );
  const partyTypeFilter = tab === "customers" ? PartyType.customer : tab === "vendors" ? PartyType.vendor : null;
  const { data: parties = [], isLoading } = useParties(partyTypeFilter);
  const { data: allInvoices = [] } = useInvoices(null, null);
  const deactivateParty = useDeactivateParty();
  const filtered = reactExports.useMemo(() => {
    const q = search.toLowerCase();
    return parties.filter(
      (p) => !q || p.name.toLowerCase().includes(q) || (p.phone ?? "").includes(q) || (p.gstNumber ?? "").toLowerCase().includes(q)
    ).sort((a, b) => {
      const aVal = sortKey === "name" ? a.name.toLowerCase() : Number(a.createdAt);
      const bVal = sortKey === "name" ? b.name.toLowerCase() : Number(b.createdAt);
      return sortDir === "asc" ? aVal > bVal ? 1 : -1 : aVal < bVal ? 1 : -1;
    });
  }, [parties, search, sortKey, sortDir]);
  const tabs = [
    { key: "all", label: "All" },
    { key: "customers", label: "Customers" },
    { key: "vendors", label: "Vendors" }
  ];
  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };
  const SortIcon = ({ k }) => sortKey === k ? sortDir === "asc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3" }) : null;
  const handleDeactivate = async () => {
    if (!deactivateTarget) return;
    try {
      await deactivateParty.mutateAsync(deactivateTarget.id);
      ue.success(`${deactivateTarget.name} deactivated`);
    } catch {
      ue.error("Failed to deactivate");
    } finally {
      setDeactivateTarget(null);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", "data-ocid": "clients.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-2.5 border-b bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "clients.search_input",
            className: "pl-7 h-7 text-xs",
            placeholder: "Search by name, phone, GST…",
            value: search,
            onChange: (e) => setSearch(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex gap-0.5 border rounded-md overflow-hidden",
          "data-ocid": "clients.filter.tab",
          children: tabs.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setTab(t.key),
              className: `px-3 h-7 text-xs transition-colors ${tab === t.key ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`,
              "data-ocid": `clients.filter.${t.key}_tab`,
              children: t.label
            },
            t.key
          ))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          size: "sm",
          className: "h-7 text-xs gap-1",
          onClick: () => {
            setEditParty(null);
            setFormOpen(true);
          },
          "data-ocid": "clients.add_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
            " Add Client"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "table",
      {
        className: "w-full text-xs border-collapse",
        "data-ocid": "clients.table",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/40 border-b text-muted-foreground sticky top-0 z-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                className: "text-left px-3 py-2 font-medium cursor-pointer select-none hover:text-foreground",
                onClick: () => toggleSort("name"),
                onKeyDown: (e) => e.key === "Enter" && toggleSort("name"),
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                  "Name ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { k: "name" })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 font-medium", children: "Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 font-medium", children: "Phone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 font-medium", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 font-medium font-mono", children: "GST Number" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2 font-medium", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
            isLoading && [1, 2, 3, 4, 5, 6].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "tr",
              {
                className: "border-b",
                "data-ocid": `clients.loading_state.item.${n}`,
                children: [1, 2, 3, 4, 5, 6].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Skeleton,
                  {
                    className: "h-4 rounded",
                    style: { width: `${60 + Math.random() * 40}%` }
                  }
                ) }, `col-${m}`))
              },
              `skeleton-${n}`
            )),
            !isLoading && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col items-center justify-center py-16 gap-3",
                "data-ocid": "clients.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-10 w-10 text-muted-foreground/30" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: search ? "No clients match your search" : "No clients yet" }),
                  !search && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      className: "h-7 text-xs gap-1",
                      onClick: () => {
                        setEditParty(null);
                        setFormOpen(true);
                      },
                      "data-ocid": "clients.empty_state.add_button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                        " Add your first client"
                      ]
                    }
                  )
                ]
              }
            ) }) }),
            !isLoading && filtered.map((party, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  className: `border-b cursor-pointer transition-colors ${expandedId === party.id ? "bg-muted/20" : "hover:bg-muted/10"} ${!party.isActive ? "opacity-50" : ""}`,
                  onClick: () => setExpandedId(expandedId === party.id ? null : party.id),
                  tabIndex: 0,
                  onKeyDown: (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setExpandedId(
                        expandedId === party.id ? null : party.id
                      );
                    }
                  },
                  "data-ocid": `clients.item.${idx + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5 font-medium text-foreground min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate block max-w-[180px]", children: party.name }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5", children: partyTypeBadge(party.partyType) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5 text-muted-foreground", children: party.phone ?? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40", children: "—" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5 text-muted-foreground max-w-[160px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate block", children: party.email ?? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40", children: "—" }) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5 font-mono text-muted-foreground", children: party.gstNumber ?? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40", children: "—" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "td",
                      {
                        className: "px-3 py-1.5",
                        onClick: (e) => e.stopPropagation(),
                        onKeyDown: (e) => e.stopPropagation(),
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 justify-end", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              className: "p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors",
                              title: "Edit",
                              onClick: () => {
                                setEditParty(party);
                                setFormOpen(true);
                              },
                              "data-ocid": `clients.edit_button.${idx + 1}`,
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" })
                            }
                          ),
                          party.isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              className: "p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors",
                              title: "Deactivate",
                              onClick: () => setDeactivateTarget(party),
                              "data-ocid": `clients.delete_button.${idx + 1}`,
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserX, { className: "h-3.5 w-3.5" })
                            }
                          )
                        ] })
                      }
                    )
                  ]
                },
                party.id.toString()
              ),
              expandedId === party.id && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                DetailPanel,
                {
                  party,
                  allInvoices,
                  onEdit: () => {
                    setEditParty(party);
                    setFormOpen(true);
                  }
                }
              ) }) }, `${party.id}-detail`)
            ] }))
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ClientFormDrawer,
      {
        open: formOpen,
        onClose: () => setFormOpen(false),
        editParty
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: !!deactivateTarget,
        onOpenChange: (v) => !v && setDeactivateTarget(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "clients.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "text-sm", children: "Deactivate Client?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { className: "text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: deactivateTarget == null ? void 0 : deactivateTarget.name }),
              " will be marked inactive and hidden from active lists. This can be reversed."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogCancel,
              {
                "data-ocid": "clients.cancel_button",
                className: "h-7 text-xs",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                className: "h-7 text-xs bg-destructive hover:bg-destructive/90 text-destructive-foreground",
                onClick: handleDeactivate,
                "data-ocid": "clients.confirm_button",
                children: "Deactivate"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  ClientsPage as default
};
