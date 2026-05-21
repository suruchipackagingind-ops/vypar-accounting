import List "mo:core/List";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import PaymentLib "../lib/payment";
import InvoiceLib "../lib/invoice";
import PaymentTypes "../types/payment";
import InvoiceTypes "../types/invoice";

mixin (
  accessControlState : AccessControl.AccessControlState,
  payments : List.List<PaymentTypes.Payment>,
  invoices : List.List<InvoiceTypes.Invoice>,
  paymentState : { var nextPaymentId : Nat }
) {
  public query ({ caller }) func listPaymentsForInvoice(invoiceId : Nat) : async [PaymentTypes.Payment] {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    PaymentLib.listPaymentsForInvoice(payments, invoiceId);
  };

  public shared ({ caller }) func recordPayment(req : PaymentTypes.RecordPaymentRequest) : async PaymentTypes.Payment {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    let payment = PaymentLib.recordPayment(payments, paymentState, req);
    ignore InvoiceLib.applyPayment(invoices, req.invoiceId, req.amount);
    payment;
  };
};
