module {
  public type PartyType = {
    #customer;
    #vendor;
    #both;
  };

  public type Party = {
    id : Nat;
    name : Text;
    email : ?Text;
    phone : ?Text;
    address : ?Text;
    gstNumber : ?Text;
    partyType : PartyType;
    createdAt : Int;
    var isActive : Bool;
  };

  // Shared API type (no var fields)
  public type PartyInfo = {
    id : Nat;
    name : Text;
    email : ?Text;
    phone : ?Text;
    address : ?Text;
    gstNumber : ?Text;
    partyType : PartyType;
    createdAt : Int;
    isActive : Bool;
  };

  public type CreatePartyRequest = {
    name : Text;
    email : ?Text;
    phone : ?Text;
    address : ?Text;
    gstNumber : ?Text;
    partyType : PartyType;
  };

  public type UpdatePartyRequest = {
    id : Nat;
    name : Text;
    email : ?Text;
    phone : ?Text;
    address : ?Text;
    gstNumber : ?Text;
    partyType : PartyType;
  };

  public type GSTINData = {
    legalName : Text;
    tradeName : Text;
    principalAddress : Text;
    state : Text;
    pincode : Text;
    isActive : Bool;
  };
};
