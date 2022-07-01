// VARIABLES
var R = Bangle.appRect;
var kb = require("ble_hid_keyboard");
var timeout_length = 1000;

// motion detection
var motion_detect = true;
var right_arm = true;
var x = 0;
var last;

// FUNCTIONS
function sleep(milliseconds) {
  // aditional sleep to avoid double slide change
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function slide_change(next_slide){
  if (next_slide){
    kb.tap(kb.KEY.RIGHT,0);
  } else {
    kb.tap(kb.KEY.LEFT,0);
  }
  sleep(100);
} 


function load_settings(file_name){
  var file = require("Storage").open(file_name,"r");
  var line = file.readLine();

  while (line!==undefined){
    print(line);
    line = file.readLine;
  }
}

function get_time_diff(time1,time2,diff){
  return ((time2-time1)<diff)
}

Bangle.loadWidgets();
g.clear(1);
Bangle.drawWidgets();

if (motion_detect &&false) {
  // watch on left arm 
  var Start_time = new Date.now();
  var block_change = true
  print("i made a huge mistake")

  Bangle.on('accel', a => {
    g.reset();
    var i,j,k;
    
    if (last){
      i = (last.x - a.x) * 9.81;
      j = (last.y - a.y) * 9.81;
      k = (last.z - a.z) * 9.81;
      print(k);
      //&& Math.abs(j)<2
      // check for direction
    if(!block_change && a.y > 0.9 && Math.abs(a.x)<.3 && a.z > 0 && k > .5){
      // next slide
      print("swipe -->");
      Start_time = new Date.now();
      next_slide = right_arm;
      slide_change(next_slide);

    }else if(!block_change && a.y > 0.9 && Math.abs(a.x)<.3 && a.z < 0 && k < -1 ){
      print("<-- swipe ");
      next_slide = !right_arm;
      Start_time = new Date.now();
      slide_change(next_slide);
    }else if (block_change){
      print("blocked");
    }
  }
    block_change = get_time_diff(Start_time,new Date.now(),timeout_length);
    last = a;
  });
  //
} else if(false) {
  // touchscreen as input
  Bangle.on('touch', function(zone,location){
    //print(location); 
    if(location.x<80 && location.y<80){
      slide_change(false);
    }else if (location.x>96 && location.y<80){
      slide_change(true);
    }
  });
}

// try with velocity
if (motion_detect) {
  // watch on left arm 
  var Start_time = new Date.now();
  var last_timestemp = new Date.now();
  var last_i, last_j,last_k = 0;
  var block_change = true
  print("i made a huge mistake")

  Bangle.on('accel', a => {
    g.reset();
    var i,j,k;
    var current_time = new Date.now();
    if (last){
      i = (last.x - a.x) * (current_time-last_timestemp);
      j = (last.y - a.y) * (current_time-last_timestemp);
      k = (last.z - a.z) * (current_time-last_timestemp);
      print(k);
      // check for direction
    if(!block_change && Math.abs(a.x)<.3 && a.y >0.9  &&  Math.abs(j)<20 && k > 10 && last_k>10 ){
      // next slide
      print("swipe -->");
      Start_time = new Date.now();
      next_slide = right_arm;
      slide_change(next_slide);
      
    }else if(!block_change && Math.abs(a.x)<.3&& a.y >0.9 && Math.abs(j)<20 && k < -10  && last_k < -10){
      print("<-- swipe ");
      next_slide = !right_arm;
      Start_time = new Date.now();
      slide_change(next_slide);
    }else if (block_change){
      print("blocked");
    }
  }
    block_change = get_time_diff(Start_time,new Date.now(),timeout_length);
    last = a;
    last_timestemp = current_time;
    last_i = i;
    last_j = j;
    last_k = k;
  });
  //
}


// wrist wrangle
if (motion_detect && false ) {
  // watch on left arm 
  var Start_time = new Date.now();
  var last_timestemp = new Date.now();
  var block_change = true;
  print("i made a huge mistake");

  Bangle.on('accel', a => {
    g.reset();
    var i,j,k;
    var current_time = new Date.now();
    if (last){
      i = (last.x - a.x) * (current_time-last_timestemp);
      j = (last.y - a.y) * (current_time-last_timestemp);
      k = (last.z - a.z) * (current_time-last_timestemp);
      print(a.z);
      // check for direction

    if(!block_change && a.z > .6 && Math.abs(j) > 5 && k < -10 ){
      // next slide
      print("swipe -->");
      Start_time = new Date.now();
      next_slide = right_arm;
      slide_change(next_slide);
      
    }else if(!block_change && a.z < -.85 && Math.abs(j) > 5){//8 && k > 5){
      print("<-- swipe ");
      next_slide = !right_arm;
      Start_time = new Date.now();
      slide_change(next_slide);
    }else if (block_change){
      print("blocked");
    }
  }
    block_change = get_time_diff(Start_time,new Date.now(),timeout_length);
    last = a;
    last_timestemp = current_time;
  });
  //
}

// wrist last position --> hand nach vorne (rechter Arm)
// nach rechts : a.z = 0.83
// nach links : a.z = -0.85

// wrist movement --> hand nach vorne (rechter Arm)
// nach rechts : j > 10, k < -15
// nach rechts : j > 10, k > 15


// activationmotion followed by swipe
if(motion_detect && false){
  Bangle.on{

  }
}