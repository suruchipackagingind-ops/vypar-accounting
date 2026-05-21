import List "mo:core/List";
import PaymentTypes "../types/payment";
import Time "mo:core/Time";

module {
  public func listPaymentsForInvoice(
    payments : List.List<PaymentTypes.Payment>,
    invoiceId : Nat
  ) : [PaymentTypes.Payment] {
    payments.values().filter(func(p) { p.invoiceId == invoiceId }).toArray();
  };

  public func recordPayment(
    payments : List.List<PaymentTypes.Payment>,
    state : { var nextPaymentId : Nat },
    req : PaymentTypes.RecordPaymentRequest
  ) : PaymentTypes.Payment {
    let id = state.nextPaymentId;
    state.nextPaymentId += 1;
    let payment : PaymentTypes.Payment = {
      id;
      invoiceId = req.invoiceId;
      amount = req.amount;
      paymentDate = req.paymentDate;
      method = req.method;
      notes = req.notes;
      recordedAt = Time.now();
    };
    payments.add(payment);
    payment;
  };
};
