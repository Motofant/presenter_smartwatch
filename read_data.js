// read data and convert to valid input

var filename = "newin.json";

// define file
var file = require("Storage").readJSON(filename);
var settings = file.settings;
var page_info = file.page_info;

print(settings);
print(page_info.p0);
print(Object.keys(settings).length)
print(settings.total_time+2)