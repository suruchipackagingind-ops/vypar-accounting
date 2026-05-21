import List "mo:core/List";
import Types "../types/party";
import Common "../types/common";
import Array "mo:core/Array";

module {
  public func listParties(
    parties : List.List<Types.Party>,
    partyType : ?Types.PartyType
  ) : [Types.PartyInfo] {
    parties.values()
      .filter(func(p) {
        p.isActive and (switch partyType {
          case null true;
          case (?pt) p.partyType == pt or p.partyType == #both or pt == #both;
        });
      })
      .map<Types.Party, Types.PartyInfo>(func(p) { toPublic(p) })
      .toArray();
  };

  public func getParty(
    parties : List.List<Types.Party>,
    id : Nat
  ) : ?Types.PartyInfo {
    switch (parties.find(func(p) { p.id == id })) {
      case (?p) ?toPublic(p);
      case null null;
    };
  };

  public func createParty(
    parties : List.List<Types.Party>,
    state : { var nextPartyId : Nat },
    req : Types.CreatePartyRequest
  ) : Types.PartyInfo {
    let id = state.nextPartyId;
    state.nextPartyId += 1;
    let party : Types.Party = {
      id;
      name = req.name;
      email = req.email;
      phone = req.phone;
      address = req.address;
      gstNumber = req.gstNumber;
      partyType = req.partyType;
      createdAt = Common.now();
      var isActive = true;
    };
    parties.add(party);
    toPublic(party);
  };

  public func updateParty(
    parties : List.List<Types.Party>,
    req : Types.UpdatePartyRequest
  ) : ?Types.PartyInfo {
    var found : ?Types.Party = null;
    parties.mapInPlace(func(p) {
      if (p.id == req.id) {
        let updated : Types.Party = {
          id = p.id;
          name = req.name;
          email = req.email;
          phone = req.phone;
          address = req.address;
          gstNumber = req.gstNumber;
          partyType = req.partyType;
          createdAt = p.createdAt;
          var isActive = p.isActive;
        };
        found := ?updated;
        updated;
      } else p;
    });
    switch found {
      case (?p) ?toPublic(p);
      case null null;
    };
  };

  public func deactivateParty(
    parties : List.List<Types.Party>,
    id : Nat
  ) : Bool {
    var found = false;
    parties.forEach(func(p) {
      if (p.id == id) {
        p.isActive := false;
        found := true;
      };
    });
    found;
  };

  public func toPublic(party : Types.Party) : Types.PartyInfo {
    {
      id = party.id;
      name = party.name;
      email = party.email;
      phone = party.phone;
      address = party.address;
      gstNumber = party.gstNumber;
      partyType = party.partyType;
      createdAt = party.createdAt;
      isActive = party.isActive;
    };
  };
};
