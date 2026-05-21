import { j as jsxRuntimeExports, d as cn, z as useActor, A as useQuery, a2 as useQueryClient, a3 as useMutation, a4 as QUERY_KEYS, D as createActor } from "./index-9WJHbuJb.js";
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}
function useDashboard() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: QUERY_KEYS.dashboard,
    queryFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.getDashboardSummary();
    },
    enabled: !!actor && !isFetching
  });
}
function useMonthlyCashFlow(months = 6n) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: QUERY_KEYS.cashFlow(months),
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMonthlyCashFlow(months);
    },
    enabled: !!actor && !isFetching
  });
}
function useAgingReport(invoiceType) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: QUERY_KEYS.agingReport(invoiceType),
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAgingReport(invoiceType);
    },
    enabled: !!actor && !isFetching
  });
}
function useParties(partyType) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: QUERY_KEYS.parties(partyType),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listParties(partyType ?? null);
    },
    enabled: !!actor && !isFetching
  });
}
function useCreateParty() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Not connected");
      return actor.createParty(req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
    }
  });
}
function useUpdateParty() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateParty(req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
    }
  });
}
function useDeactivateParty() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.deactivateParty(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
    }
  });
}
function useInvoices(invoiceType, status) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: QUERY_KEYS.invoices(invoiceType, status),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listInvoices(invoiceType ?? null, status ?? null);
    },
    enabled: !!actor && !isFetching
  });
}
function useCreateInvoice() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Not connected");
      return actor.createInvoice(req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
    }
  });
}
function useUpdateInvoiceStatus() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateInvoiceStatus(req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
    }
  });
}
function useCancelInvoice() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.cancelInvoice(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
    }
  });
}
function usePaymentsForInvoice(invoiceId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: QUERY_KEYS.payments(invoiceId),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPaymentsForInvoice(invoiceId);
    },
    enabled: !!actor && !isFetching
  });
}
function useRecordPayment() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Not connected");
      return actor.recordPayment(req);
    },
    onSuccess: (_data, req) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.payments(req.invoiceId)
      });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
    }
  });
}
function useLookupGSTIN() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (gstin) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.lookupGSTIN(gstin);
      if (result.__kind__ === "ok") {
        return result.ok;
      }
      throw new Error(result.err);
    }
  });
}
function formatDate(ns) {
  const ms = Number(ns / 1000000n);
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}
function formatINRCompact(amount) {
  if (amount >= 1e7) return `₹${(amount / 1e7).toFixed(2)}Cr`;
  if (amount >= 1e5) return `₹${(amount / 1e5).toFixed(2)}L`;
  if (amount >= 1e3) return `₹${(amount / 1e3).toFixed(1)}K`;
  return `₹${amount.toFixed(0)}`;
}
export {
  Skeleton as S,
  useMonthlyCashFlow as a,
  formatINR as b,
  useAgingReport as c,
  useInvoices as d,
  useParties as e,
  formatINRCompact as f,
  formatDate as g,
  useCreateParty as h,
  useUpdateParty as i,
  useLookupGSTIN as j,
  useDeactivateParty as k,
  useCreateInvoice as l,
  usePaymentsForInvoice as m,
  useUpdateInvoiceStatus as n,
  useCancelInvoice as o,
  useRecordPayment as p,
  useDashboard as u
};
