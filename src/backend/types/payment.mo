module {
  public type PaymentMethod = {
    #cash;
    #bank;
    #cheque;
    #upi;
  };

  public type Payment = {
    id : Nat;
    invoiceId : Nat;
    amount : Float;
    paymentDate : Int;
    method : PaymentMethod;
    notes : ?Text;
    recordedAt : Int;
  };

  public type RecordPaymentRequest = {
    invoiceId : Nat;
    amount : Float;
    paymentDate : Int;
    method : PaymentMethod;
    notes : ?Text;
  };
};
