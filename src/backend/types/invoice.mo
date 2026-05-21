module {
  public type InvoiceType = {
    #sales;
    #purchase;
  };

  public type InvoiceStatus = {
    #draft;
    #sent;
    #paid;
    #partiallyPaid;
    #overdue;
    #cancelled;
  };

  public type TaxType = {
    #igst;
    #cgstSgst;
    #none;
  };

  public type LineItem = {
    itemName : Text;
    quantity : Float;
    unit : Text;
    rate : Float;
    taxPercent : Float;
    taxType : TaxType;
    discount : Float;
  };

  public type Invoice = {
    id : Nat;
    invoiceNumber : Text;
    invoiceType : InvoiceType;
    partyId : Nat;
    lineItems : [LineItem];
    subtotal : Float;
    totalDiscount : Float;
    totalTax : Float;
    grandTotal : Float;
    notes : ?Text;
    dueDate : ?Int;
    createdAt : Int;
    updatedAt : Int;
    var status : InvoiceStatus;
    var amountPaid : Float;
  };

  // Shared API type (no var fields)
  public type InvoiceInfo = {
    id : Nat;
    invoiceNumber : Text;
    invoiceType : InvoiceType;
    partyId : Nat;
    lineItems : [LineItem];
    subtotal : Float;
    totalDiscount : Float;
    totalTax : Float;
    grandTotal : Float;
    notes : ?Text;
    dueDate : ?Int;
    createdAt : Int;
    updatedAt : Int;
    status : InvoiceStatus;
    amountPaid : Float;
  };

  public type CreateInvoiceRequest = {
    invoiceType : InvoiceType;
    partyId : Nat;
    lineItems : [LineItem];
    notes : ?Text;
    dueDate : ?Int;
  };

  public type UpdateInvoiceStatusRequest = {
    id : Nat;
    status : InvoiceStatus;
  };
};
