import { QUERY_KEYS } from "@/api";
import { type GSTINData, createActor } from "@/backend";
import type {
  AgingBucket,
  CreateInvoiceRequest,
  CreatePartyRequest,
  DashboardSummary,
  InvoiceInfo,
  InvoiceStatus,
  InvoiceType,
  MonthlyFlow,
  PartyInfo,
  PartyType,
  Payment,
  RecordPaymentRequest,
  UpdateInvoiceStatusRequest,
  UpdatePartyRequest,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useDashboard() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<DashboardSummary>({
    queryKey: QUERY_KEYS.dashboard,
    queryFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.getDashboardSummary();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMonthlyCashFlow(months = 6n) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<MonthlyFlow[]>({
    queryKey: QUERY_KEYS.cashFlow(months),
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMonthlyCashFlow(months);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAgingReport(invoiceType: InvoiceType) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<AgingBucket[]>({
    queryKey: QUERY_KEYS.agingReport(invoiceType),
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAgingReport(invoiceType);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useParties(partyType?: PartyType | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PartyInfo[]>({
    queryKey: QUERY_KEYS.parties(partyType),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listParties(partyType ?? null);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useParty(id: bigint) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PartyInfo | null>({
    queryKey: QUERY_KEYS.party(id),
    queryFn: async () => {
      if (!actor) return null;
      return actor.getParty(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateParty() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: CreatePartyRequest) => {
      if (!actor) throw new Error("Not connected");
      return actor.createParty(req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
    },
  });
}

export function useUpdateParty() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: UpdatePartyRequest) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateParty(req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
    },
  });
}

export function useDeactivateParty() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deactivateParty(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
    },
  });
}

export function useInvoices(
  invoiceType?: InvoiceType | null,
  status?: InvoiceStatus | null,
) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<InvoiceInfo[]>({
    queryKey: QUERY_KEYS.invoices(invoiceType, status),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listInvoices(invoiceType ?? null, status ?? null);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useInvoice(id: bigint) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<InvoiceInfo | null>({
    queryKey: QUERY_KEYS.invoice(id),
    queryFn: async () => {
      if (!actor) return null;
      return actor.getInvoice(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateInvoice() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: CreateInvoiceRequest) => {
      if (!actor) throw new Error("Not connected");
      return actor.createInvoice(req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
    },
  });
}

export function useUpdateInvoiceStatus() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: UpdateInvoiceStatusRequest) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateInvoiceStatus(req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
    },
  });
}

export function useCancelInvoice() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.cancelInvoice(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
    },
  });
}

export function usePaymentsForInvoice(invoiceId: bigint) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Payment[]>({
    queryKey: QUERY_KEYS.payments(invoiceId),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPaymentsForInvoice(invoiceId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRecordPayment() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: RecordPaymentRequest) => {
      if (!actor) throw new Error("Not connected");
      return actor.recordPayment(req);
    },
    onSuccess: (_data, req) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.payments(req.invoiceId),
      });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
    },
  });
}
export function useLookupGSTIN() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (gstin: string): Promise<GSTINData> => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.lookupGSTIN(gstin);
      if (result.__kind__ === "ok") {
        return result.ok;
      }
      throw new Error(result.err);
    },
  });
}
