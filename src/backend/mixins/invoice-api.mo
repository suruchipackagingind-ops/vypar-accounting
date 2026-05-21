import List "mo:core/List";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import InvoiceLib "../lib/invoice";
import InvoiceTypes "../types/invoice";

mixin (
  accessControlState : AccessControl.AccessControlState,
  invoices : List.List<InvoiceTypes.Invoice>,
  invoiceState : { var nextSalesInvoiceId : Nat; var nextPurchaseInvoiceId : Nat }
) {
  public query ({ caller }) func listInvoices(
    invoiceType : ?InvoiceTypes.InvoiceType,
    status : ?InvoiceTypes.InvoiceStatus
  ) : async [InvoiceTypes.InvoiceInfo] {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    InvoiceLib.listInvoices(invoices, invoiceType, status);
  };

  public query ({ caller }) func getInvoice(id : Nat) : async ?InvoiceTypes.InvoiceInfo {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    InvoiceLib.getInvoice(invoices, id);
  };

  public shared ({ caller }) func createInvoice(req : InvoiceTypes.CreateInvoiceRequest) : async InvoiceTypes.InvoiceInfo {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    InvoiceLib.createInvoice(invoices, invoiceState, req);
  };

  public shared ({ caller }) func updateInvoiceStatus(req : InvoiceTypes.UpdateInvoiceStatusRequest) : async ?InvoiceTypes.InvoiceInfo {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    InvoiceLib.updateInvoiceStatus(invoices, req);
  };

  public shared ({ caller }) func cancelInvoice(id : Nat) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    let req : InvoiceTypes.UpdateInvoiceStatusRequest = { id; status = #cancelled };
    switch (InvoiceLib.updateInvoiceStatus(invoices, req)) {
      case (?_) true;
      case null false;
    };
  };
};
