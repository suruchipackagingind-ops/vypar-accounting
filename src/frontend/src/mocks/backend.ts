import type { backendInterface } from "../backend";
import {
  InvoiceStatus,
  InvoiceType,
  PartyType,
  PaymentMethod,
  TaxType,
  UserRole,
  Variant_accountant_owner_viewer,
} from "../backend";

const sampleParties = [
  {
    id: BigInt(1),
    name: "Sharma Traders Pvt Ltd",
    gstNumber: "07AABCS1429B1ZP",
    email: "sharma@example.com",
    address: "23, Karol Bagh, New Delhi - 110005",
    partyType: PartyType.customer,
    phone: "9811234567",
    isActive: true,
    createdAt: BigInt(1700000000000000000),
  },
  {
    id: BigInt(2),
    name: "Gupta & Sons Wholesale",
    gstNumber: "27AABCG5432B1ZP",
    email: "gupta@example.com",
    address: "45, Dadar, Mumbai - 400014",
    partyType: PartyType.vendor,
    phone: "9922345678",
    isActive: true,
    createdAt: BigInt(1700100000000000000),
  },
  {
    id: BigInt(3),
    name: "Verma Electronics",
    gstNumber: "06AABCV3219B1ZP",
    email: "verma@example.com",
    address: "12, Lajpat Nagar, Delhi - 110024",
    partyType: PartyType.both,
    phone: "9833456789",
    isActive: true,
    createdAt: BigInt(1700200000000000000),
  },
];

const sampleLineItems = [
  {
    itemName: "Laptop HP EliteBook",
    quantity: 2,
    unit: "Nos",
    rate: 55000,
    discount: 0,
    taxType: TaxType.cgstSgst,
    taxPercent: 18,
  },
  {
    itemName: "Office Chair",
    quantity: 5,
    unit: "Nos",
    rate: 4500,
    discount: 5,
    taxType: TaxType.cgstSgst,
    taxPercent: 18,
  },
];

const sampleInvoices = [
  {
    id: BigInt(1),
    invoiceNumber: "INV-2024-001",
    invoiceType: InvoiceType.sales,
    status: InvoiceStatus.paid,
    partyId: BigInt(1),
    lineItems: sampleLineItems,
    subtotal: 132500,
    totalTax: 23850,
    totalDiscount: 1125,
    grandTotal: 155225,
    amountPaid: 155225,
    createdAt: BigInt(1700300000000000000),
    updatedAt: BigInt(1700400000000000000),
    dueDate: BigInt(1700500000000000000),
    notes: "Payment received via NEFT",
  },
  {
    id: BigInt(2),
    invoiceNumber: "INV-2024-002",
    invoiceType: InvoiceType.sales,
    status: InvoiceStatus.overdue,
    partyId: BigInt(3),
    lineItems: [sampleLineItems[0]],
    subtotal: 110000,
    totalTax: 19800,
    totalDiscount: 0,
    grandTotal: 129800,
    amountPaid: 0,
    createdAt: BigInt(1700600000000000000),
    updatedAt: BigInt(1700700000000000000),
    dueDate: BigInt(1698000000000000000),
  },
  {
    id: BigInt(3),
    invoiceNumber: "PUR-2024-001",
    invoiceType: InvoiceType.purchase,
    status: InvoiceStatus.sent,
    partyId: BigInt(2),
    lineItems: [sampleLineItems[1]],
    subtotal: 21375,
    totalTax: 3847.5,
    totalDiscount: 1125,
    grandTotal: 24097.5,
    amountPaid: 0,
    createdAt: BigInt(1700800000000000000),
    updatedAt: BigInt(1700900000000000000),
    dueDate: BigInt(1701200000000000000),
  },
  {
    id: BigInt(4),
    invoiceNumber: "INV-2024-003",
    invoiceType: InvoiceType.sales,
    status: InvoiceStatus.draft,
    partyId: BigInt(1),
    lineItems: sampleLineItems,
    subtotal: 132500,
    totalTax: 23850,
    totalDiscount: 1125,
    grandTotal: 155225,
    amountPaid: 0,
    createdAt: BigInt(1701000000000000000),
    updatedAt: BigInt(1701000000000000000),
  },
  {
    id: BigInt(5),
    invoiceNumber: "INV-2024-004",
    invoiceType: InvoiceType.sales,
    status: InvoiceStatus.partiallyPaid,
    partyId: BigInt(3),
    lineItems: sampleLineItems,
    subtotal: 110000,
    totalTax: 19800,
    totalDiscount: 0,
    grandTotal: 129800,
    amountPaid: 60000,
    createdAt: BigInt(1701100000000000000),
    updatedAt: BigInt(1701200000000000000),
    dueDate: BigInt(1702000000000000000),
  },
];

export const mockBackend: backendInterface = {
  assignCallerUserRole: async () => undefined,

  cancelInvoice: async () => true,

  createInvoice: async () => sampleInvoices[0],

  createParty: async () => sampleParties[0],

  deactivateParty: async () => true,

  getAgingReport: async () => [
    { bucket: "0-30 days", totalAmount: 129800, count: BigInt(1) },
    { bucket: "31-60 days", totalAmount: 55000, count: BigInt(1) },
    { bucket: "61-90 days", totalAmount: 24097.5, count: BigInt(1) },
    { bucket: "90+ days", totalAmount: 85000, count: BigInt(2) },
  ],

  getCallerUserProfile: async () => ({
    name: "Rajesh Kumar",
    role: Variant_accountant_owner_viewer.owner,
  }),

  getCallerUserRole: async () => UserRole.admin,

  getDashboardSummary: async () => ({
    totalSales: 440250,
    totalPurchases: 72292.5,
    outstandingReceivables: 259625,
    outstandingPayables: 24097.5,
    overdueInvoicesCount: BigInt(2),
  }),

  getInvoice: async (id) => sampleInvoices.find((inv) => inv.id === id) ?? null,

  getMonthlyCashFlow: async () => [
    { month: BigInt(7), year: BigInt(2024), inflow: 55000, outflow: 24097.5 },
    { month: BigInt(8), year: BigInt(2024), inflow: 129800, outflow: 0 },
    { month: BigInt(9), year: BigInt(2024), inflow: 0, outflow: 72292.5 },
    { month: BigInt(10), year: BigInt(2024), inflow: 155225, outflow: 0 },
    { month: BigInt(11), year: BigInt(2024), inflow: 100000, outflow: 0 },
    { month: BigInt(12), year: BigInt(2024), inflow: 60000, outflow: 0 },
  ],

  getParty: async (id) => sampleParties.find((p) => p.id === id) ?? null,

  getUserProfile: async () => ({
    name: "Rajesh Kumar",
    role: Variant_accountant_owner_viewer.owner,
  }),

  isCallerAdmin: async () => true,

  listInvoices: async (invoiceType, status) => {
    let result = [...sampleInvoices];
    if (invoiceType !== null) result = result.filter((inv) => inv.invoiceType === invoiceType);
    if (status !== null) result = result.filter((inv) => inv.status === status);
    return result;
  },

  listParties: async (partyType) => {
    if (partyType === null) return sampleParties;
    return sampleParties.filter((p) => p.partyType === partyType);
  },

  listPaymentsForInvoice: async () => [
    {
      id: BigInt(1),
      invoiceId: BigInt(1),
      amount: 155225,
      method: PaymentMethod.bank,
      paymentDate: BigInt(1700450000000000000),
      recordedAt: BigInt(1700450000000000000),
      notes: "NEFT transfer received",
    },
  ],

  recordPayment: async () => ({
    id: BigInt(2),
    invoiceId: BigInt(5),
    amount: 60000,
    method: PaymentMethod.upi,
    paymentDate: BigInt(1701100000000000000),
    recordedAt: BigInt(1701100000000000000),
  }),

  saveCallerUserProfile: async () => undefined,

  _initializeAccessControl: async () => undefined,

  updateInvoiceStatus: async (req) =>
    sampleInvoices.find((inv) => inv.id === req.id) ?? null,

  updateParty: async (req) =>
    sampleParties.find((p) => p.id === req.id) ?? null,

  gstTransform: async (raw) => ({
    status: BigInt(200),
    body: raw.response.body,
    headers: raw.response.headers,
  }),

  lookupGSTIN: async (gstin) => {
    if (gstin === "07AABCS1429B1ZP") {
      return {
        __kind__: "ok" as const,
        ok: {
          legalName: "Sharma Traders Private Limited",
          tradeName: "Sharma Traders",
          principalAddress: "23, Karol Bagh, New Delhi",
          state: "Delhi",
          pincode: "110005",
          isActive: true,
        },
      };
    }
    return { __kind__: "err" as const, err: "GSTIN not found" };
  },
};
