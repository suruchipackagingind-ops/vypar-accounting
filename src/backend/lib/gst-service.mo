import Text "mo:core/Text";
import Outcall "mo:caffeineai-http-outcalls/outcall";

module GSTService {

  public type GSTINData = {
    legalName : Text;
    tradeName : Text;
    principalAddress : Text;
    state : Text;
    pincode : Text;
    isActive : Bool;
  };

  // Extract a JSON string field value from raw JSON text.
  // Searches for "key":"value" or "key": "value" patterns.
  func extractJsonField(json : Text, key : Text) : Text {
    let searchKey = "\"" # key # "\":\"";
    let searchKey2 = "\"" # key # "\": \"";

    if (json.contains(#text searchKey)) {
      let parts = json.split(#text searchKey);
      let partsArr = parts.toArray();
      if (partsArr.size() >= 2) {
        let afterKey = partsArr[1];
        let valueParts = afterKey.split(#text "\"");
        let valueArr = valueParts.toArray();
        if (valueArr.size() >= 1) {
          return valueArr[0];
        };
      };
    } else if (json.contains(#text searchKey2)) {
      let parts = json.split(#text searchKey2);
      let partsArr = parts.toArray();
      if (partsArr.size() >= 2) {
        let afterKey = partsArr[1];
        let valueParts = afterKey.split(#text "\"");
        let valueArr = valueParts.toArray();
        if (valueArr.size() >= 1) {
          return valueArr[0];
        };
      };
    };
    return "";
  };

  // Build a readable address from JSON pradr.addr fields.
  func buildAddress(json : Text) : Text {
    let bno = extractJsonField(json, "bno");
    let st = extractJsonField(json, "st");
    let loc = extractJsonField(json, "loc");
    let dst = extractJsonField(json, "dst");
    let stcd = extractJsonField(json, "stcd");
    let pncd = extractJsonField(json, "pncd");
    var addr = "";
    if (bno != "") { addr := addr # bno };
    if (st != "") { addr := (if (addr == "") st else addr # ", " # st) };
    if (loc != "") { addr := (if (addr == "") loc else addr # ", " # loc) };
    if (dst != "") { addr := (if (addr == "") dst else addr # ", " # dst) };
    if (stcd != "") { addr := (if (addr == "") stcd else addr # ", " # stcd) };
    if (pncd != "") { addr := (if (addr == "") pncd else addr # ", " # pncd) };
    addr
  };

  public func lookupGSTIN(gstin : Text, transform : Outcall.Transform) : async { #ok : GSTINData; #err : Text } {
    let url = "https://services.gst.gov.in/services/api/search?action=TP&gstin=" # gstin;

    try {
      let bodyText = await Outcall.httpGetRequest(
        url,
        [{ name = "Accept"; value = "application/json" }],
        transform
      );

      if (bodyText.contains(#text "\"errorCode\"")) {
        return #err("GSTIN not found or invalid");
      };

      let legalName = extractJsonField(bodyText, "lgnm");
      let tradeName = extractJsonField(bodyText, "tradeNam");
      let status    = extractJsonField(bodyText, "sts");
      let address   = buildAddress(bodyText);
      let state     = extractJsonField(bodyText, "stj");
      let pincode   = extractJsonField(bodyText, "pncd");

      if (legalName == "" and tradeName == "") {
        return #err("GSTIN not found");
      };

      #ok({
        legalName         = legalName;
        tradeName         = tradeName;
        principalAddress  = address;
        state             = state;
        pincode           = pincode;
        isActive          = (status == "Active" or status == "active");
      });
    } catch (_) {
      #err("Network error: lookup failed");
    };
  };
};
