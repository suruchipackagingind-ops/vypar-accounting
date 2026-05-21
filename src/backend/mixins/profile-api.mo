import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";

mixin (
  accessControlState : AccessControl.AccessControlState,
  userProfiles : Map.Map<Principal, { name : Text; role : { #owner; #accountant; #viewer } }>
) {
  public query ({ caller }) func getCallerUserProfile() : async ?{ name : Text; role : { #owner; #accountant; #viewer } } {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : { name : Text; role : { #owner; #accountant; #viewer } }) : async () {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?{ name : Text; role : { #owner; #accountant; #viewer } } {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    userProfiles.get(user);
  };
};
