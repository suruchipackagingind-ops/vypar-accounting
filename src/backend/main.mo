import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import PartyTypes "types/party";
import InvoiceTypes "types/invoice";
import PaymentTypes "types/payment";
import ProfileMixin "mixins/profile-api";
import PartyMixin "mixins/party-api";
import InvoiceMixin "mixins/invoice-api";
import PaymentMixin "mixins/payment-api";
import DashboardMixin "mixins/dashboard-api";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profiles
  let userProfiles = Map.empty<Principal, { name : Text; role : { #owner; #accountant; #viewer } }>();
  include ProfileMixin(accessControlState, userProfiles);

  // Party (clients & vendors)
  let parties = List.empty<PartyTypes.Party>();
  let partyState = { var nextPartyId : Nat = 1 };
  include PartyMixin(accessControlState, parties, partyState);

  // Invoices (sales & purchase)
  let invoices = List.empty<InvoiceTypes.Invoice>();
  let invoiceState = { var nextSalesInvoiceId : Nat = 1; var nextPurchaseInvoiceId : Nat = 1 };
  include InvoiceMixin(accessControlState, invoices, invoiceState);

  // Payments
  let payments = List.empty<PaymentTypes.Payment>();
  let paymentState = { var nextPaymentId : Nat = 1 };
  include PaymentMixin(accessControlState, payments, invoices, paymentState);

  // Dashboard (reads invoices)
  include DashboardMixin(accessControlState, invoices);
};
