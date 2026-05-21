import List "mo:core/List";
import InvoiceTypes "../types/invoice";
import DashboardTypes "../types/dashboard";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Array "mo:core/Array";

module {
  public func getSummary(
    invoices : List.List<InvoiceTypes.Invoice>
  ) : DashboardTypes.DashboardSummary {
    var totalSales : Float = 0.0;
    var outstandingReceivables : Float = 0.0;
    var totalPurchases : Float = 0.0;
    var outstandingPayables : Float = 0.0;
    var overdueInvoicesCount : Nat = 0;
    let now = Time.now();
    invoices.forEach(func(inv) {
      let remaining = inv.grandTotal - inv.amountPaid;
      switch (inv.invoiceType) {
        case (#sales) {
          totalSales += inv.grandTotal;
          if (inv.status != #paid and inv.status != #cancelled) {
            outstandingReceivables += remaining;
          };
        };
        case (#purchase) {
          totalPurchases += inv.grandTotal;
          if (inv.status != #paid and inv.status != #cancelled) {
            outstandingPayables += remaining;
          };
        };
      };
      switch (inv.dueDate) {
        case (?due) {
          if (due < now and inv.status != #paid and inv.status != #cancelled) {
            overdueInvoicesCount += 1;
          };
        };
        case null {};
      };
    });
    { totalSales; outstandingReceivables; totalPurchases; outstandingPayables; overdueInvoicesCount };
  };

  public func getAgingReport(
    invoices : List.List<InvoiceTypes.Invoice>,
    invoiceType : InvoiceTypes.InvoiceType,
    nowNs : Int
  ) : [DashboardTypes.AgingBucket] {
    let dayNs : Int = 86_400_000_000_000;
    var b0count : Nat = 0; var b0amt : Float = 0.0;
    var b1count : Nat = 0; var b1amt : Float = 0.0;
    var b2count : Nat = 0; var b2amt : Float = 0.0;
    invoices.forEach(func(inv) {
      if (inv.invoiceType == invoiceType and inv.status != #paid and inv.status != #cancelled) {
        switch (inv.dueDate) {
          case (?due) {
            if (due < nowNs) {
              let daysOverdue = (nowNs - due) / dayNs;
              let remaining = inv.grandTotal - inv.amountPaid;
              if (daysOverdue <= 30) {
                b0count += 1; b0amt += remaining;
              } else if (daysOverdue <= 60) {
                b1count += 1; b1amt += remaining;
              } else {
                b2count += 1; b2amt += remaining;
              };
            };
          };
          case null {};
        };
      };
    });
    [
      { bucket = "0-30"; count = b0count; totalAmount = b0amt },
      { bucket = "30-60"; count = b1count; totalAmount = b1amt },
      { bucket = "60+"; count = b2count; totalAmount = b2amt },
    ];
  };

  public func getMonthlyCashFlow(
    invoices : List.List<InvoiceTypes.Invoice>,
    months : Nat
  ) : [DashboardTypes.MonthlyFlow] {
    let now = Time.now();
    let monthNs : Int = 30 * 86_400_000_000_000;

    // Helper: derive (year, month) from nanoseconds since epoch
    let getYearMonth = func(ns : Int) : (Int, Nat) {
      let daysSince : Int = (ns / 1_000_000_000) / 86400;
      let y400 = daysSince / 146097;
      let r1 = daysSince - y400 * 146097;
      let y100 = r1 / 36524;
      let r2 = r1 - y100 * 36524;
      let y4 = r2 / 1461;
      let r3 = r2 - y4 * 1461;
      let y1 = r3 / 365;
      let year : Int = y400 * 400 + y100 * 100 + y4 * 4 + y1 + 1970;
      let doy = r3 - y1 * 365;
      let month : Nat = if (doy < 31) 1 else if (doy < 59) 2
        else if (doy < 90) 3 else if (doy < 120) 4
        else if (doy < 151) 5 else if (doy < 181) 6
        else if (doy < 212) 7 else if (doy < 243) 8
        else if (doy < 273) 9 else if (doy < 304) 10
        else if (doy < 334) 11 else 12;
      (year, month);
    };

    // Build mutable accumulator map: index -> (year, month, inflow, outflow)
    let bucketYears = Array.tabulate(months, func(i) {
      let t = now - (months - 1 - i) * monthNs;
      getYearMonth(t).0;
    });
    let bucketMonths = Array.tabulate(months, func(i) {
      let t = now - (months - 1 - i) * monthNs;
      getYearMonth(t).1;
    });
    let inflows = Array.tabulate(months, func(_) { 0.0 }).toVarArray();
    let outflows = Array.tabulate(months, func(_) { 0.0 }).toVarArray();

    invoices.forEach(func(inv) {
      if (inv.status == #paid or inv.status == #partiallyPaid) {
        let (year, month) = getYearMonth(inv.updatedAt);
        let amount = inv.amountPaid;
        var i = 0;
        while (i < months) {
          if (bucketYears[i] == year and bucketMonths[i] == month) {
            switch (inv.invoiceType) {
              case (#sales) { inflows[i] += amount };
              case (#purchase) { outflows[i] += amount };
            };
          };
          i += 1;
        };
      };
    });

    Array.tabulate<DashboardTypes.MonthlyFlow>(months, func(i) {
      { year = bucketYears[i]; month = bucketMonths[i]; inflow = inflows[i]; outflow = outflows[i] };
    });
  };
};
