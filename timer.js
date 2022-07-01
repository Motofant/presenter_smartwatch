// just presentation
var layout = require("Layout");
var page = new layout({
	type: "v", c:[{
		type:"str",label:"", id:"page"
	},
	{
		type:"str",label:"", id:"total"
	}]
})


// variables --> later found in settings
var total_time = 500; // seconds 
var page_times = [5,6,19]; // seconds per silde
var start_time_pres = new Date.now();
var start_time_slide = new Date.now();
var time_to_go = total_time;

// timer
function page_timer_reset(slide_time){

}
function sleep(milliseconds) {
  // aditional sleep to avoid double slide change
  const date = Date.now();
  var currentDate = Date.now();
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}


while (time_to_go > 0){
	time_to_go = start_time_pres + total_time - Date.now();
	print(time_to_go); 
}

//var i = setTimeout(function(){Bangle.buzz(50,1);},100);
Bangle.buzz(100,.1).then(() =>{setTimeout(()=>Bangle.buzz(100,1),400);});
//Bangle.buzz(100,1).then(() =>{setTimeout(()=>Bangle.buzz(100,1),500);});

print("next slide")
//Bangle.buzz(100,1)