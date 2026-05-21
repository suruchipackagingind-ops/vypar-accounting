// Re-export backend types and add UI-specific types
export type {
  RecordPaymentRequest,
  LineItem,
  InvoiceInfo,
  AgingBucket,
  UpdatePartyRequest,
  Payment,
  MonthlyFlow,
  DashboardSummary,
  CreateInvoiceRequest,
  UpdateInvoiceStatusRequest,
  PartyInfo,
  CreatePartyRequest,
} from "@/backend";
export {
  InvoiceStatus,
  InvoiceType,
  PartyType,
  PaymentMethod,
  TaxType,
  UserRole,
  Variant_accountant_owner_viewer,
} from "@/backend";

export interface UserProfile {
  name: string;
  role: import("@/backend").Variant_accountant_owner_viewer;
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

export type GSTType = "IGST" | "CGST+SGST" | "None";

export interface TaxBreakdown {
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
}

/** Format nanosecond timestamp to readable date */
export function formatDate(ns: bigint): string {
  const ms = Number(ns / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Format number as Indian currency (₹) */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Format compact Indian currency (₹1.45L, ₹2.8Cr) */
export function formatINRCompact(amount: number): string {
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(2)}Cr`;
  if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(2)}L`;
  if (amount >= 1_000) return `₹${(amount / 1_000).toFixed(1)}K`;
  return `₹${amount.toFixed(0)}`;
}
