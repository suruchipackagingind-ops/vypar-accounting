import Time "mo:core/Time";

module {
  public type UserId = Principal;
  public type PartyId = Nat;
  public type InvoiceId = Nat;
  public type PaymentId = Nat;
  public type Timestamp = Int;

  public func now() : Timestamp { Time.now() };
};
