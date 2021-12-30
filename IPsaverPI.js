//run this under Google Apps Script to provide a remote host for your server's local IP address 
function doPost(e) {
  var cache = CacheService.getScriptCache();

  if (e) {
    var json = JSON.parse(e.postData.contents);
    if(json.addr) {
      Logger.log("sent IP");
      //if it's sent in a new IP address, log that with a 24hr expiration
      var addr = JSON.parse(e.postData.contents).addr;
      cache.put("ipCache", addr, (60*60*24));
      return ContentService
      .createTextOutput(JSON.stringify({
        "result": "success",
        "response": "ip saved as " + addr
      }))
      .setMimeType(ContentService.MimeType.JSON);
    } else {
      //send back the current IP
      var ipaddr = cache.get("ipCache");
      return ContentService
      .createTextOutput(JSON.stringify({"ip": ipaddr}))
    .setMimeType(ContentService.MimeType.JSON);
    }
  } else {
    Logger.log("requested ip");
    //send back the current IP
    var ipaddr = cache.get("ipCache");
    Logger.log(ipaddr);

  }
}
function doGet() {
  var cache = CacheService.getScriptCache();
  var ipaddr = cache.get("ipCache");
  return ContentService
    .createTextOutput(ipaddr)
    .setMimeType(ContentService.MimeType.TEXT);
}

