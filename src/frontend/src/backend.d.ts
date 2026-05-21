import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface RecordPaymentRequest {
    method: PaymentMethod;
    invoiceId: bigint;
    notes?: string;
    paymentDate: bigint;
    amount: number;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface LineItem {
    taxPercent: number;
    rate: number;
    unit: string;
    itemName: string;
    discount: number;
    quantity: number;
    taxType: TaxType;
}
export interface InvoiceInfo {
    id: bigint;
    status: InvoiceStatus;
    lineItems: Array<LineItem>;
    createdAt: bigint;
    dueDate?: bigint;
    totalTax: number;
    amountPaid: number;
    grandTotal: number;
    updatedAt: bigint;
    invoiceNumber: string;
    invoiceType: InvoiceType;
    notes?: string;
    totalDiscount: number;
    partyId: bigint;
    subtotal: number;
}
export interface GSTINData {
    tradeName: string;
    principalAddress: string;
    isActive: boolean;
    legalName: string;
    state: string;
    pincode: string;
}
export interface AgingBucket {
    count: bigint;
    totalAmount: number;
    bucket: string;
}
export interface UpdatePartyRequest {
    id: bigint;
    gstNumber?: string;
    name: string;
    email?: string;
    address?: string;
    partyType: PartyType;
    phone?: string;
}
export interface MonthlyFlow {
    month: bigint;
    year: bigint;
    inflow: number;
    outflow: number;
}
export interface Payment {
    id: bigint;
    method: PaymentMethod;
    invoiceId: bigint;
    recordedAt: bigint;
    notes?: string;
    paymentDate: bigint;
    amount: number;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface DashboardSummary {
    totalSales: number;
    totalPurchases: number;
    outstandingReceivables: number;
    outstandingPayables: number;
    overdueInvoicesCount: bigint;
}
export interface CreateInvoiceRequest {
    lineItems: Array<LineItem>;
    dueDate?: bigint;
    invoiceType: InvoiceType;
    notes?: string;
    partyId: bigint;
}
export interface UpdateInvoiceStatusRequest {
    id: bigint;
    status: InvoiceStatus;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface PartyInfo {
    id: bigint;
    gstNumber?: string;
    name: string;
    createdAt: bigint;
    isActive: boolean;
    email?: string;
    address?: string;
    partyType: PartyType;
    phone?: string;
}
export interface CreatePartyRequest {
    gstNumber?: string;
    name: string;
    email?: string;
    address?: string;
    partyType: PartyType;
    phone?: string;
}
export enum InvoiceStatus {
    cancelled = "cancelled",
    paid = "paid",
    sent = "sent",
    overdue = "overdue",
    partiallyPaid = "partiallyPaid",
    draft = "draft"
}
export enum InvoiceType {
    sales = "sales",
    purchase = "purchase"
}
export enum PartyType {
    customer = "customer",
    both = "both",
    vendor = "vendor"
}
export enum PaymentMethod {
    upi = "upi",
    bank = "bank",
    cash = "cash",
    cheque = "cheque"
}
export enum TaxType {
    igst = "igst",
    none = "none",
    cgstSgst = "cgstSgst"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_accountant_owner_viewer {
    accountant = "accountant",
    owner = "owner",
    viewer = "viewer"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelInvoice(id: bigint): Promise<boolean>;
    createInvoice(req: CreateInvoiceRequest): Promise<InvoiceInfo>;
    createParty(req: CreatePartyRequest): Promise<PartyInfo>;
    deactivateParty(id: bigint): Promise<boolean>;
    getAgingReport(invoiceType: InvoiceType): Promise<Array<AgingBucket>>;
    getCallerUserProfile(): Promise<{
        name: string;
        role: Variant_accountant_owner_viewer;
    } | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDashboardSummary(): Promise<DashboardSummary>;
    getInvoice(id: bigint): Promise<InvoiceInfo | null>;
    getMonthlyCashFlow(months: bigint): Promise<Array<MonthlyFlow>>;
    getParty(id: bigint): Promise<PartyInfo | null>;
    getUserProfile(user: Principal): Promise<{
        name: string;
        role: Variant_accountant_owner_viewer;
    } | null>;
    gstTransform(raw: TransformationInput): Promise<TransformationOutput>;
    isCallerAdmin(): Promise<boolean>;
    listInvoices(invoiceType: InvoiceType | null, status: InvoiceStatus | null): Promise<Array<InvoiceInfo>>;
    listParties(partyType: PartyType | null): Promise<Array<PartyInfo>>;
    listPaymentsForInvoice(invoiceId: bigint): Promise<Array<Payment>>;
    lookupGSTIN(gstin: string): Promise<{
        __kind__: "ok";
        ok: GSTINData;
    } | {
        __kind__: "err";
        err: string;
    }>;
    recordPayment(req: RecordPaymentRequest): Promise<Payment>;
    saveCallerUserProfile(profile: {
        name: string;
        role: Variant_accountant_owner_viewer;
    }): Promise<void>;
    updateInvoiceStatus(req: UpdateInvoiceStatusRequest): Promise<InvoiceInfo | null>;
    updateParty(req: UpdatePartyRequest): Promise<PartyInfo | null>;
}
