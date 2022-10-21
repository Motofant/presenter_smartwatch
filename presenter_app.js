// Variables
	// general 
var Layout = require("Layout");
var filename = "newin.json";
var R = Bangle.appRect;
var setting_file = true;
var motion_detect = true;
var right_arm = true;
var nat_scroll = true; // 
var total_timeleft = 0;
// nur signal an rechner senden keystroke emulieren
// how to design & report deisgn experience oder so 
	// Layout
var page = new Layout({
  type: "v",fillx:1, filly:1 ,c:[
    {type:"h",pad:5, filly:1, valign:-1,c:[
      {type: "v", c:[
          {type: "txt", font: "15%", label: "title", id: "title",width:10,halign:-1},
      ]},
      {type: "v",fillx:1, c:[
          {type: "txt", font: "8%", label: "page", id: "page",halign:1},
      ]},
    ], id:"top"},

    {type:"h",fillx:1,pad:5,filly:5,valign:-1,c:[
      {type:"v",fillx:3, valign:0,c:[
          {type: "txt", font: "12%", label: "notes", id: "notes",halign:-1, valign:-1},
      ]},
      {type:"v", fillx:1, c:[
          {type: "txt", font: "8%", label: "next_title", id: "next_title",halign: 1, col:0x7BEF},
      ]},
    ], id:"middle"},

    {type:"h",pad:5, filly:1,c:[
      {type:"v", fillx:1,c:[
          {type: "txt", font: "10%", label: "page_time", id: "page_time",halign:-1,},
      ]},
      {type:"v", fillx:1, c:[  
          {type: "txt", font: "10%", label: "gen_time", id: "gen_time",halign:1},
      ]},
    ], id:"bottom"},
  ]
});

var fin = new Layout({
  type:"txt",label:"done",font:"6x8",
});

var title = new Layout({
  type:"v", bgCol: g.theme.bg2,fillx:1, filly:1, c:[
    {type: "txt", pad: 3, font: "13%", label:"", id: "pres_title", valign: 0},
    {type: "txt", pad: 3,font: "8%", label:"", id: "pages",halign: 0},
    {type: "txt", pad: 3,font: "8%", label:"", id: "comments",halign: 0},
    {type: "txt", pad: 3,font: "8%", label:"", id: "gesture",halign: 0},
    {type: "txt", pad: 3,font: "8%", label:"", id: "total_time",halign: 0},
    {type: "txt", pad: 3, font: "8%", label:"", id: "page_time",halign: 0},
    {type: "btn", pad: 3, font: "8%", label:"Press to continue", id: "start_btn"},
    ]
});


	// motion detection
var kb = require("ble_hid_keyboard");
var timeout_length = 1000;
var last;


// Functions 	
	//Layout
function show_page(settings, infos,location){
  print("show_page")
  var this_page = String("p"+location)
  next = location+1
  var next_page =String("p"+next)
  g.clear();


  page.title.label = infos[this_page].titel;
  page.page.label = String(next)+"/"+String(settings.pages);
  print(g.getWidth())
  page.notes.label = g.wrapString(g.wrapString(infos[this_page].note,60).join(" "),80).join("\n");
  
  if (next < settings.pages){
    page.next_title.label = "Next:\n"+infos[next_page].titel;  
  }else{
    page.next_title.label = "Last Page";
  }
  
  page.page_time.label = writeTime(Number(infos[this_page].time)*60);

  page.gen_time.label = writeTime(Number(settings.total_time)*60);
  page.page_time.col =  0x03E0;
  page.gen_time.col = 0x03E0;  
  page.clear();
  page.render();
}

function show_start(settings, page_info){
  g.clear(1);
  title.clear();
  
  title.pres_title.label = settings.name;
  title.pages.label = "Pages: " + settings.pages;
  title.comments.label = "Comments: " + settings.comments;
  title.gesture.label = "Gestures: " + settings.gesture;
  title.total_time.label = "Total time: " + settings.total_time;
  title.page_time.label = "Page times: " + settings.page_time;
  total_timeleft = settings.total_time * 60;

  Bangle.drawWidgets();
  title.render();
}

function show_fin(){
  g.clear()
  fin.clear();
  fin.render();
}	

	// motion detection
function sleep(milliseconds) {
  // aditional sleep to avoid double slide change
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function countDownPage() {
  counter = readTime(page.page_time.label);
  if (counter){
    counter = Math.max(counter-1,0);
    page.page_time.label = writeTime(counter);
    if (counter != 0){
      page.page_time.col = 0x03E0;
    }else{
      Bangle.buzz(100,1)
      page.page_time.col =  0xF3F0;//0x03E0;
    }

  }else{
    page.page_time.label = "0";
  }
  if(current_page > -1 && current_page <settings.pages){
    page.clear();
    page.render();  
  }
}

function countDownTotal(){
  counter = total_timeleft;
//  counter = parseInt(page.gen_time.label);
  if(counter){
    counter = Math.max(counter-1, 0);
    page.gen_time.label = writeTime(counter);
    if(counter == 300){
      Bangle.buzz(1000,.8);
      page.gen_time.col = 0xF3FF00;
    }else if(counter <= 0){
      page.gen_time.col = 0xF3F0;
      Bangle.buzz(100,.1).then(() =>{Bangle.buzz(1000,1)});
    }
    total_timeleft = counter
  }else{
    page.gen_time.label = "0";
  }
  if(current_page > -1 && current_page <settings.pages){
    page.clear();
    page.render();  
  }
}

function slide_change(next_slide, current_page, settings, page_info){
	// slide change in Presenation
  if (next_slide){
	    kb.tap(kb.KEY.RIGHT,0);
  	} else {
    	kb.tap(kb.KEY.LEFT,0);
  	};
  //NRF.sendHIDReport([0,0,0,0,0,0,0,0],function(){})
  // slide change on watch

  if (current_page == -1){
  	show_start(settings, page_info);

	}else if (current_page < settings.pages){
  	show_page(settings,page_info,current_page);
	}else{
  	show_fin();
	};
  // necessary for clean 
 // setTimeout(function(){},100)
  //sleep(100);
  return current_page;
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
  return ((time2-time1)<diff);
}

function readTime(time_string){
  // reading time from displayed string
  time = time_string.split(':')
  return Number(time[0])*60+Number(time[1])
}

function writeTime(time_int){
  // convert seconds to string to write
  return Math.floor(time_int/60).toString() + ":" + (time_int % 60).toString()
}


// Main

// load settings (design)
Bangle.setLCDPower(1);
if (!setting_file){
	print("No settings found only use slidechange");
  E.showMessage("No settings found \nonly use slidechange");
  // implement slidechange
  var Start_time = new Date.now();
  var last_timestemp = new Date.now();
  var last_i, last_j,last_k = 0;
  var block_change = true;

  Bangle.on('accel', a => {
    var i,j,k, next_slide;
    var current_time = new Date.now();
    // a.x --> g richtung hand (1) / ellebogen(-1)
    // a.y --> g richtung Display oben (1) / display unten (-1)
    // a.z --> g richtung in Display rein (1) / aus display raus (-1) 

    if (last){
      i = (last.x - a.x) * (current_time-last_timestemp);
      j = (last.y - a.y) * (current_time-last_timestemp);
      k = (last.z - a.z) * (current_time-last_timestemp);
      print(a.y);
      // check for direction
      // Bewegung von rechts nach links
      if (!block_change && a.y > .8 && a.y <1.1 && Math.abs(a.x) < .4 && Math.abs(i) < 8 && k > 8 && last_k > 8){
          // next slide
        print("swipe --> Forward");
        next_slide = nat_scroll;
        if (next_slide){
          kb.tap(kb.KEY.RIGHT,0);
        } else {
          kb.tap(kb.KEY.LEFT,0);
        };
        sleep(100);
        Start_time = new Date.now();

        // Bewegung von links nach rechts
        }else if(!block_change && a.y < -.7 && a.y > -1.2 && Math.abs(a.x) < .9 && Math.abs(i) < 7 && k > 5 ){
          print("<-- swipe  Back");
          next_slide = !nat_scroll;  
          if (next_slide){
            kb.tap(kb.KEY.RIGHT,0);
          } else {
            kb.tap(kb.KEY.LEFT,0);
          };
          sleep(100);
          Start_time = new Date.now();

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

}else{
	// define file
	var file = require("Storage").readJSON(filename);
  var settings = file.settings;
  var page_info = file.page_info;
  var totalInterval = setInterval("print('start')",1000)
  var slideInterval = setInterval("print('start')",1000)
  total_timeleft = settings.total_time * 60
  // define Layouts
  g.clear(1);
  Bangle.drawWidgets();
  var current_page = -1;

    // implement slidechange
    var Start_time = new Date.now();
    var last_timestemp = new Date.now();
    var last_i, last_j,last_k = 0;
    var block_change = current_page > -1;
    
    show_start(settings, page_info);
    //g.clear()
    Bangle.on("touch",function(zone,location){
      if (current_page == -1){
        current_page = 0;
        show_page(settings,page_info,current_page);
        clearInterval(slideInterval)
        clearInterval(totalInterval)
        totalInterval = setInterval(countDownTotal,1000);   
        slideInterval = setInterval(countDownPage,1000);   
      }else if (location.x<70){
        // prev page
        current_page = slide_change(false, Math.max(current_page -1,-1),settings,page_info)
        sleep(10)
      }else{
        current_page = slide_change(true, Math.min(current_page +1,settings.pages),settings,page_info)
        sleep(10)
      }
      
    });

    Bangle.on('accel', a => {
      print(current_page)
      var i,j,k, next_slide;
      var current_time = new Date.now();
      // a.x --> g richtung hand (1) / ellebogen(-1)
      // a.y --> g richtung Display oben (1) / display unten (-1)
      // a.z --> g richtung in Display rein (1) / aus display raus (-1) 

      if (last){

        i = (last.x - a.x) * (current_time-last_timestemp);
        j = (last.y - a.y) * (current_time-last_timestemp);
        k = (last.z - a.z) * (current_time-last_timestemp);
        print(a.x);
        // check for direction
        //if(!block_change && Math.abs(a.x) < .4 && a.y < 0 && Math.abs(a.z) <.7 &&  Math.abs(j) < 5 && k <-5 ){
        // test for right arm
        // Bewegung von rechts nach links
        if (!block_change && a.y > .8 && a.y <1.1 && Math.abs(a.x) < .4 && Math.abs(i) < 8 && k > 8 && last_k > 8){
            // next slide
          print("swipe --> Forward");
          next_slide = nat_scroll;
          current_page = slide_change(next_slide,Math.min(current_page +1,settings.pages),settings,page_info);
          Start_time = new Date.now();
          if(current_page > -1 ){
            clearInterval(slideInterval)
            slideInterval = setInterval(countDownPage,1000);   
          };

          // Bewegung von links nach rechts
          //}else if(!block_change && Math.abs(a.x) < .4  && a.y >0.5 && Math.abs(a.z) <.2 && Math.abs(j) < 5 && k < -3 ){
          }else if(!block_change && a.y < -.7 && a.y > -1.2 && Math.abs(a.x) < .9 && Math.abs(i) < 7 && k > 5 ){
            print("<-- swipe  Back");
            next_slide = !nat_scroll;  
            current_page = slide_change(next_slide,Math.max(current_page -1,-1),settings,page_info);
            Start_time = new Date.now();
            if(current_page > -1){
              clearInterval(slideInterval);
              slideInterval = setInterval(countDownPage,1000);   
            }

          }else if (block_change){
            print("blocked");
          }
      }
      block_change = get_time_diff(Start_time,new Date.now(),timeout_length) || current_page == -1;
      last = a;
      last_timestemp = current_time;
      last_i = i;
      last_j = j;
      last_k = k;
    });
  }