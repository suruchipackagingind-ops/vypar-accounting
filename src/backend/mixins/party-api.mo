import List "mo:core/List";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Outcall "mo:caffeineai-http-outcalls/outcall";
import GSTService "../lib/gst-service";
import PartyLib "../lib/party";
import Types "../types/party";

mixin (
  accessControlState : AccessControl.AccessControlState,
  parties : List.List<Types.Party>,
  partyState : { var nextPartyId : Nat }
) {
  public query ({ caller }) func listParties(partyType : ?Types.PartyType) : async [Types.PartyInfo] {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    PartyLib.listParties(parties, partyType);
  };

  public query ({ caller }) func getParty(id : Nat) : async ?Types.PartyInfo {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    PartyLib.getParty(parties, id);
  };

  public shared ({ caller }) func createParty(req : Types.CreatePartyRequest) : async Types.PartyInfo {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    PartyLib.createParty(parties, partyState, req);
  };

  public shared ({ caller }) func updateParty(req : Types.UpdatePartyRequest) : async ?Types.PartyInfo {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    PartyLib.updateParty(parties, req);
  };

  public shared ({ caller }) func deactivateParty(id : Nat) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    PartyLib.deactivateParty(parties, id);
  };

  public query func gstTransform(raw : Outcall.TransformationInput) : async Outcall.TransformationOutput {
    Outcall.transform(raw);
  };

  public func lookupGSTIN(gstin : Text) : async { #ok : GSTService.GSTINData; #err : Text } {
    await GSTService.lookupGSTIN(gstin, gstTransform);
  };
};
