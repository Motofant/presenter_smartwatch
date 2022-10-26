// Variables
  // libraries 
var Layout = require("Layout");
var kb = require("ble_hid_keyboard");

  //default settings
var right_arm = true;
var nat_scroll = true; 

  // get configs
var files = {};
var file;

  // generell
var total_timeleft = 0;
var current_page = -1;
var settings;
var page_info;
var timeout_length = 1000;
var last;
var page = new Layout({});
var pages=[];
var time_col = 0x03E0;

  // Layout
var fin = new Layout({
  type:"txt",label: "Finished the Presentation",id:"quote",font:"10%",
});

var title = new Layout({
  type:"v", bgCol: g.theme.bg2,fillx:1, filly:1, c:[
    {type: "txt", pad: 3, font: "13%", label:"", id: "pres_title", valign: 0},
    {type: "txt", pad: 3,font: "8%", label:"", id: "pages",halign: 0},
    {type: "txt", pad: 3,font: "8%", label:"", id: "arm", halign: 0},
    {type: "txt", pad: 3,font: "8%", label:"", id: "scroll_dir",halign: 0},
    {type: "txt", pad: 3,font: "8%", label:"", id: "total_time",halign: 0},
    {type: "txt", pad: 3, font: "8%", label:"", id: "page_time",halign: 0},
    {type: "txt", pad: 3,font: "8%", label:"", id: "final_q",halign: 0},
    {type: "btn", pad: 3, font: "8%", label:"Press to continue", id: "start_btn"},
    ]
});


// Functions 	
  // get Layouts
  // needed to hget working buttons
function getLayoutPage(page_no){
  var this_page = String("p"+page_no)
  next = page_no+1
  var next_page =String("p"+next)

  return page = new Layout({
  type: "v",fillx:1, filly:1 ,c:[
    {type:"h", filly:1, valign:-1,c:[
      {type: "v", c:[
          {type: "txt", font: "12%",  label: g.wrapString(page_info[this_page].titel,140).join("\n"), id: "title",valign: -1,halign:-1},
      ]},
      {type: "v",fillx:1, c:[
          {type: "txt", font: "8%", width:30,label: String(next)+"/"+String(settings.pages), id: "page",halign:1},
      ]},
    ], id:"top"},

    {type:"h",fillx:1,filly:1,valign:-1,c:[
      {type:"v",fillx:0, valign:-1,c:[
          {type: "txt", font: "8%",label: g.wrapString(page_info[this_page].note,150).join("\n"), id: "notes",halign: -1, valign:-1},
      ]},
      {type:"v", fillx:1, c:[
          {type: "txt", font: "8%", label: (next < settings.pages) ? "Next:\n"+page_info[next_page].titel : "Last Page", id: "next_title",halign: 1, col:0x7BEF},
      ]},
    ], id:"middle"},

    {type:"h",pad:5, filly:1,c:[
      {type:"v", fillx:1,c:[
          {type: "txt", font: "10%", width:70,col:0x03E0, label: writeTime(Number(page_info[this_page].time)*60), id: "page_time",halign:-1,},
      ]},
      {type:"v", fillx:1, c:[  
          {type: "txt", font: "10%", width:70,col:time_col,label: writeTime(Number(settings.total_time)*60), id: "gen_time",halign:1},
      ]},
    ], id:"bottom"},
    ]
  });
}

function get_layout_submit(){
    // creates layout if presentation is selected
    return new Layout({
        type:"v", bgCol: g.theme.bg2,fillx:1, filly:1, c:[
            {type: "txt", font: "10%", label:"Presentation:" , valign: 0},
            {type: "txt", font: "10%", label: "test" , id: "pres_name", valign: 0},
            {},
            {type: "txt", font: "8%", label: "Selected Config:" , valign: -1},
            {type: "txt", font: "8%", label: "test2" , id:"file_name", valign: 1},
            {},
            {type: "txt", font: "13%", label: "Correct?", valign: 0},
            {type: "h",fillx:4,c:[
                {type: "btn",pad:10, font: "15%",label: "NO" , col:0xF3F0, cb: l=> response_submit(false, true),valign:-1},
                {type: "btn", pad:10,font: "15%",label: "YES" , cb: l=> response_submit(true,true),valign:1},
            ]},
        ]
    })
}

function get_layout_submit_empty(){
  // creates layout if no presentation is selected 
  return submit_empty = new Layout({
      type:"v", bgCol: g.theme.bg2,fillx:1, filly:1, c:[
          {type: "txt", font: "13%", label:"No Config Selected" , valign: 0},
          {type: "txt", font: "13%", label: "Correct?", valign: 0},
          {type: "h",c:[
              {type: "btn",pad:10, font: "15%",label: "NO" ,col:0xF3F0, cb: l => response_submit(false, false), valign: -1},
              {type: "btn",pad:10, font: "15%",label: "YES" , cb: l => response_submit(true,false), valign: 1},
          ]},
      ]
  })
}

	//Layout interaction
function show_page(settings, infos,location){
  // renders page containing infos of current slides
  // render Layout pages
  page.clear()
  page = pages[location];
  // reset pagetime
  page.page_time.label = writeTime(Number(page_info[String("p"+location)].time)*60)
  page.render();
}

function show_start(settings){
  // renders page containing generell info of selected Presentation
  g.clear();
  // modify Layout title
  title.pres_title.label = settings.name;
  title.pages.label = "Pages: " + settings.pages;
  title.arm.label = (settings.right_arm) ?"Arm: Right":"Arm: Left";
  title.scroll_dir.label = (settings.nat_scroll)? "Scrolldir.: Natural": "Scrolldir.: Inverted";
  title.total_time.label = "Total time: " + settings.total_time;
  title.page_time.label = "Page times: " + settings.page_time;
  title.final_q.label = (settings.final_quote)?"Final Quote: Yes":"Final Quote: No";
  
  total_timeleft = settings.total_time * 60;

  // Render Layout title
  title.clear();
  title.render();
}

function show_fin(){
  // renders final page
  g.clear()
  fin.quote.label = (settings.final_quote) ? g.wrapString(settings.final_quote,160).join("\n") : "done"
  fin.clear();
  fin.render();
}	

function draw_empty(){
  E.showMenu()
  get_layout_submit_empty().render()
}

function draw_submit(select_file){
  E.showMenu()
  var submit = get_layout_submit()
  submit.file_name.label = files[select_file];
  submit.pres_name.label = settings_file;
  g.clear()
  submit.render();
}

function response_submit(accept,settings){
  if(accept){
      if(settings){
          file = require("Storage").readJSON(files[settings_file]);
      }else{
          file = false;
          current_page = 0;
          g.drawString("swipe Left / Right")
      }
      initPresMode(file)
  }else{
      E.showMenu(menu)
  }
}


  // Time functions
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
      Bangle.buzz(100,.5)
      page.page_time.col =  0xF3F0;//0x03E0;
    }

  }else{
    page.page_time.label = "0";
  }
  if(current_page > -1 && current_page < settings.pages){
    page.clear();
    page.render();  
  }
}

function countDownTotal(){
  counter = total_timeleft;
  if(counter){
    counter = Math.max(counter-1, 0);
    page.gen_time.label = writeTime(counter);
    if(counter == 300){
      Bangle.buzz(1000,.8);
      time_col = 0xF3FF00
      page.gen_time.col = time_col;
    }else if(counter <= 0){
      time_col = 0xF3F0
      page.gen_time.col = time_col;
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
	// slide change in Presentation
  if (next_slide){
	    kb.tap(kb.KEY.RIGHT,0);
      //sleep(100)
      current_page = Math.min(current_page + 1, (settings) ? settings.pages : current_page+2)  
  } else {
    	kb.tap(kb.KEY.LEFT,0);
      //sleep(100)
      current_page = Math.max(current_page - 1, (settings) ? -1 : 0)
  };
  Bangle.buzz(100,1);
  //NRF.sendHIDReport([0,0,0,0,0,0,0,0],function(){})
  // slide change on watch
  if(settings){
    if (current_page == -1){
      show_start(settings);
  
    }else if (current_page < settings.pages){
      show_page(settings,page_info,current_page);
    }else{
      show_fin();
    };
  }
  
  // necessary for clean 
  // sleep(100);
  return current_page;
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

// states of Programm

function initPresMode(file){
  E.showMenu()
  if(file){
    settings = file.settings;
    page_info = file.page_info;
    // get all pages
    var i = 0;
    Object.keys(page_info).forEach(element => {
      pages.push(getLayoutPage(i))
      pages[i].render()
      i++;
    });

    var totalInterval = setInterval("print('start')",1000)
    var slideInterval = setInterval("print('start')",1000)
    total_timeleft = settings.total_time * 60
    // define Layouts
    g.clear(1);
    Bangle.drawWidgets();
    
    show_start(settings);
  
  }

  // implement slidechange
  var Start_time = new Date.now();
  var last_timestemp = new Date.now();
  var last_i, last_j,last_k = 0;
  var block_change = current_page > -1;

  // define touchevents
  Bangle.on("touch",function(zone,location){
    if(file){
      if(current_page == -1){
        current_page = 0;
        show_page(settings,page_info,current_page);
        clearInterval(slideInterval)
        clearInterval(totalInterval)
        totalInterval = setInterval(countDownTotal,1000);   
        slideInterval = setInterval(countDownPage,1000);   
      }else if (location.x < 70){
        current_page = slide_change(false, current_page ,settings,page_info)
        sleep(10)
      }else{
        current_page = slide_change(true, current_page ,settings,page_info)
        sleep(10)
      }
    }
  });

  // define motion detection
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
      if (!block_change && a.y > .8 && a.y <1.1 && Math.abs(a.x) < .7 && Math.abs(i) < 8 && k > 8 && last_k > 8){
          // next slide
        print("swipe --> Forward");
        next_slide = nat_scroll == right_arm;
        print(next_slide)
        current_page = slide_change(next_slide,current_page,settings,page_info);
        Start_time = new Date.now();
        if(current_page > -1 && file){
          clearInterval(slideInterval)
          slideInterval = setInterval(countDownPage,1000);   
        };

        // Bewegung von links nach rechts
        //}else if(!block_change && Math.abs(a.x) < .4  && a.y >0.5 && Math.abs(a.z) <.2 && Math.abs(j) < 5 && k < -3 ){
        }else if(!block_change && a.y < -.7 && a.y > -1.2 && Math.abs(a.x) > .1&&Math.abs(a.x) < .8 && Math.abs(i) < 7 && k > 5 ){
          print("<-- swipe  Back");
          next_slide = nat_scroll != right_arm;  
          current_page = slide_change(next_slide,current_page,settings,page_info);
          Start_time = new Date.now();
          if(current_page > -1 && file){
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

function initMainMenu(menu){
  json = require("Storage").list(/\.json$/)
  Object(json).forEach(file => {
      var info = require("Storage").readJSON(file)
      if(info["settings"]){
          files[info.settings.name] = file      
      }else{
          console.log("file not valid: " + file)
      };
  });
  
  // build menu showing json files

  Object.keys(files).forEach(file => {
    menu[file] = (function(file){
        return function(){
            settings_file = file
            draw_submit(file)   
        }
    })(file);
  });
  
  menu["no Config-File"] = (function(){
    return function(){
        draw_empty()
    }
  })();
  
  // draw Menu
  E.showMenu(menu)  
}

// start App
var menu = {
  "": {title: "-- Settings --"}
}
initMainMenu(menu)