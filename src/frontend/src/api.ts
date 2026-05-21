import { createActor } from "@/backend";
import type {
  CreateInvoiceRequest,
  CreatePartyRequest,
  RecordPaymentRequest,
  UpdateInvoiceStatusRequest,
  UpdatePartyRequest,
} from "@/backend";
import type { InvoiceStatus, InvoiceType, PartyType } from "@/backend";
import type { useActor } from "@caffeineai/core-infrastructure";

// Re-export for convenience
export { createActor };
export type { useActor };

// This module provides typed wrappers used in hooks.
// Import createActor + useActor in hooks; actor methods are called directly.
// Centralized query key constants for React Query cache management.
export const QUERY_KEYS = {
  dashboard: ["dashboard"] as const,
  parties: (type?: PartyType | null) => ["parties", type ?? "all"] as const,
  party: (id: bigint) => ["party", id.toString()] as const,
  invoices: (type?: InvoiceType | null, status?: InvoiceStatus | null) =>
    ["invoices", type ?? "all", status ?? "all"] as const,
  invoice: (id: bigint) => ["invoice", id.toString()] as const,
  payments: (invoiceId: bigint) => ["payments", invoiceId.toString()] as const,
  cashFlow: (months: bigint) => ["cashflow", months.toString()] as const,
  agingReport: (type: InvoiceType) => ["aging", type] as const,
  userProfile: ["userProfile"] as const,
  userRole: ["userRole"] as const,
  isAdmin: ["isAdmin"] as const,
} as const;

// Type-safe request builders
export function buildCreatePartyRequest(
  data: Omit<CreatePartyRequest, never>,
): CreatePartyRequest {
  return data;
}

export function buildCreateInvoiceRequest(
  data: CreateInvoiceRequest,
): CreateInvoiceRequest {
  return data;
}

export function buildRecordPaymentRequest(
  data: RecordPaymentRequest,
): RecordPaymentRequest {
  return data;
}

export function buildUpdatePartyRequest(
  data: UpdatePartyRequest,
): UpdatePartyRequest {
  return data;
}

export function buildUpdateInvoiceStatusRequest(
  data: UpdateInvoiceStatusRequest,
): UpdateInvoiceStatusRequest {
  return data;
}
