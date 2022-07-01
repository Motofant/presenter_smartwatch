i = 3;
/*
function check_change() {
    j = require("Storage").readJSON("test.txt", true);
    E.showMessage(String(j));
}
while(true){
  E.showMessage(String(i));
  check_change();
}
*/
/*
  NRF.findDevices(devices => {
    devices.forEach(device =>{
      let deviceName = device.id.substring(0,17);
      print(deviceName)
      if (device.name) {
        deviceName = device.name;
        print(deviceName)
      }
    }); }, { active: true })
*/
/*
Bangle.connect(function(c){
  var connection = c;
  var buffer = ""; 
  connection.on("data",function(d){
    buffer +=d;
    var l = buffer.split("\n")
    buffer = l.pop();
    E.showMessage(buffer)
    print(buffer)
  })
})
*/
var device;
NRF.connect("0C:54:15:34:D1:4F").then(function(d) {
  device = d;
  return d.getPrimaryService("service_uuid");
}).then(function(s) {
  console.log("Service ",s);
  return s.getCharacteristic("characteristic_uuid");
}).then(function(c) {
  c.on('characteristicvaluechanged', function(event) {
    console.log("-> ",event.target.value); // this is a DataView
  });
  return c.startNotifications();
}).then(function(d) {
  console.log("Waiting for notifications");
}).catch(function() {
  console.log("Something's broken.");
});