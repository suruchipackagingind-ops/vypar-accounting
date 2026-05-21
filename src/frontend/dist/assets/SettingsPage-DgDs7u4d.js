import { a5 as useProfile, a6 as useAuth, r as reactExports, j as jsxRuntimeExports, B as Button } from "./index-9WJHbuJb.js";
import { L as Label, I as Input, u as ue } from "./index-GatS_aqM.js";
function SettingsPage() {
  const { profile, saveProfile, isSaving } = useProfile();
  const { principal } = useAuth();
  const [name, setName] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (profile == null ? void 0 : profile.name) setName(profile.name);
  }, [profile == null ? void 0 : profile.name]);
  function handleSave(e) {
    e.preventDefault();
    saveProfile(
      { name },
      {
        onSuccess: () => ue.success("Profile saved"),
        onError: () => ue.error("Failed to save profile")
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 max-w-xl space-y-4", "data-ocid": "settings.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-sm font-semibold text-foreground", children: "Settings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded p-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Profile" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSave, className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", className: "text-xs", children: "Display Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "name",
              value: name,
              onChange: (e) => setName(e.target.value),
              placeholder: "Your name",
              className: "h-8 text-sm",
              "data-ocid": "settings.name_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Principal ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[11px] text-muted-foreground bg-muted rounded px-2.5 py-1.5 break-all", children: (principal == null ? void 0 : principal.toString()) ?? "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            size: "sm",
            disabled: isSaving || !name.trim(),
            "data-ocid": "settings.save_button",
            children: isSaving ? "Saving…" : "Save Profile"
          }
        )
      ] })
    ] })
  ] });
}
export {
  SettingsPage as default
};
