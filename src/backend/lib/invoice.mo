import List "mo:core/List";
import InvoiceTypes "../types/invoice";
import Common "../types/common";
import Float "mo:core/Float";

module {
  public func listInvoices(
    invoices : List.List<InvoiceTypes.Invoice>,
    invoiceType : ?InvoiceTypes.InvoiceType,
    status : ?InvoiceTypes.InvoiceStatus
  ) : [InvoiceTypes.InvoiceInfo] {
    invoices.values()
      .filter(func(inv) {
        let typeMatch = switch invoiceType {
          case null true;
          case (?t) inv.invoiceType == t;
        };
        let statusMatch = switch status {
          case null true;
          case (?s) inv.status == s;
        };
        typeMatch and statusMatch;
      })
      .map<InvoiceTypes.Invoice, InvoiceTypes.InvoiceInfo>(func(inv) { toPublic(inv) })
      .toArray();
  };

  public func getInvoice(
    invoices : List.List<InvoiceTypes.Invoice>,
    id : Nat
  ) : ?InvoiceTypes.InvoiceInfo {
    switch (invoices.find(func(inv) { inv.id == id })) {
      case (?inv) ?toPublic(inv);
      case null null;
    };
  };

  public func createInvoice(
    invoices : List.List<InvoiceTypes.Invoice>,
    state : { var nextSalesInvoiceId : Nat; var nextPurchaseInvoiceId : Nat },
    req : InvoiceTypes.CreateInvoiceRequest
  ) : InvoiceTypes.InvoiceInfo {
    let totals = computeTotals(req.lineItems);
    let (invoiceNumber, id) = switch (req.invoiceType) {
      case (#sales) {
        let n = state.nextSalesInvoiceId;
        state.nextSalesInvoiceId += 1;
        let numStr = if (n < 10) "000" # n.toText()
          else if (n < 100) "00" # n.toText()
          else if (n < 1000) "0" # n.toText()
          else n.toText();
        ("INV-" # numStr, n);
      };
      case (#purchase) {
        let n = state.nextPurchaseInvoiceId;
        state.nextPurchaseInvoiceId += 1;
        let numStr = if (n < 10) "000" # n.toText()
          else if (n < 100) "00" # n.toText()
          else if (n < 1000) "0" # n.toText()
          else n.toText();
        ("BILL-" # numStr, n);
      };
    };
    let now = Common.now();
    let invoice : InvoiceTypes.Invoice = {
      id;
      invoiceNumber;
      invoiceType = req.invoiceType;
      partyId = req.partyId;
      lineItems = req.lineItems;
      subtotal = totals.subtotal;
      totalDiscount = totals.totalDiscount;
      totalTax = totals.totalTax;
      grandTotal = totals.grandTotal;
      notes = req.notes;
      dueDate = req.dueDate;
      createdAt = now;
      updatedAt = now;
      var status = #draft;
      var amountPaid = 0.0;
    };
    invoices.add(invoice);
    toPublic(invoice);
  };

  public func updateInvoiceStatus(
    invoices : List.List<InvoiceTypes.Invoice>,
    req : InvoiceTypes.UpdateInvoiceStatusRequest
  ) : ?InvoiceTypes.InvoiceInfo {
    var result : ?InvoiceTypes.InvoiceInfo = null;
    invoices.forEach(func(inv) {
      if (inv.id == req.id) {
        inv.status := req.status;
        result := ?toPublic(inv);
      };
    });
    result;
  };

  public func applyPayment(
    invoices : List.List<InvoiceTypes.Invoice>,
    invoiceId : Nat,
    amount : Float
  ) : ?InvoiceTypes.InvoiceInfo {
    var result : ?InvoiceTypes.InvoiceInfo = null;
    invoices.forEach(func(inv) {
      if (inv.id == invoiceId) {
        inv.amountPaid += amount;
        if (inv.amountPaid >= inv.grandTotal) {
          inv.status := #paid;
        } else if (inv.amountPaid > 0.0) {
          inv.status := #partiallyPaid;
        };
        result := ?toPublic(inv);
      };
    });
    result;
  };

  public func computeTotals(
    lineItems : [InvoiceTypes.LineItem]
  ) : { subtotal : Float; totalDiscount : Float; totalTax : Float; grandTotal : Float } {
    var subtotal : Float = 0.0;
    var totalDiscount : Float = 0.0;
    var totalTax : Float = 0.0;
    for (item in lineItems.values()) {
      let lineTotal = item.quantity * item.rate;
      let discAmt = lineTotal * item.discount / 100.0;
      let taxBase = lineTotal - discAmt;
      let taxAmt = switch (item.taxType) {
        case (#none) 0.0;
        case (#igst) taxBase * item.taxPercent / 100.0;
        case (#cgstSgst) taxBase * item.taxPercent / 100.0; // combined CGST+SGST
      };
      subtotal += lineTotal;
      totalDiscount += discAmt;
      totalTax += taxAmt;
    };
    {
      subtotal;
      totalDiscount;
      totalTax;
      grandTotal = subtotal - totalDiscount + totalTax;
    };
  };

  public func toPublic(invoice : InvoiceTypes.Invoice) : InvoiceTypes.InvoiceInfo {
    {
      id = invoice.id;
      invoiceNumber = invoice.invoiceNumber;
      invoiceType = invoice.invoiceType;
      partyId = invoice.partyId;
      lineItems = invoice.lineItems;
      subtotal = invoice.subtotal;
      totalDiscount = invoice.totalDiscount;
      totalTax = invoice.totalTax;
      grandTotal = invoice.grandTotal;
      notes = invoice.notes;
      dueDate = invoice.dueDate;
      createdAt = invoice.createdAt;
      updatedAt = invoice.updatedAt;
      status = invoice.status;
      amountPaid = invoice.amountPaid;
    };
  };
};
