module {
  public type AgingBucket = {
    bucket : Text;  // "0-30", "30-60", "60+"
    count : Nat;
    totalAmount : Float;
  };

  public type MonthlyFlow = {
    year : Int;
    month : Nat;
    inflow : Float;
    outflow : Float;
  };

  public type DashboardSummary = {
    totalSales : Float;
    outstandingReceivables : Float;
    totalPurchases : Float;
    outstandingPayables : Float;
    overdueInvoicesCount : Nat;
  };
};
