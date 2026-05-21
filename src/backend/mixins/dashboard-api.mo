import List "mo:core/List";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import DashboardLib "../lib/dashboard";
import InvoiceTypes "../types/invoice";
import DashboardTypes "../types/dashboard";
import Time "mo:core/Time";

mixin (
  accessControlState : AccessControl.AccessControlState,
  invoices : List.List<InvoiceTypes.Invoice>
) {
  public query ({ caller }) func getDashboardSummary() : async DashboardTypes.DashboardSummary {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    DashboardLib.getSummary(invoices);
  };

  public query ({ caller }) func getAgingReport(
    invoiceType : InvoiceTypes.InvoiceType
  ) : async [DashboardTypes.AgingBucket] {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    DashboardLib.getAgingReport(invoices, invoiceType, Time.now());
  };

  public query ({ caller }) func getMonthlyCashFlow(months : Nat) : async [DashboardTypes.MonthlyFlow] {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    DashboardLib.getMonthlyCashFlow(invoices, months);
  };
};
