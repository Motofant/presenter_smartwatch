// design default screen
var Layout = require("Layout");

// import from file
var setting_file = true


/*
// page layout
var page = new Layout({
  type: "v",fillx: 1,filly: 1, bgCol: g.theme.bg2 ,c:[
    {type:"h", c:[
      {type: "txt", font: "15%", label: "", id: "title",halign: 1,valign:-1,},
      {type: "txt", font: "10%", label: "", id: "page",halign: 1,valign:-1,},
    ], id:"top",filly: 0},

    {type:"h", c:[
      {type: "txt", font: "10%", label: "", id: "notes",halign: 0,valign:-1},
      {type: "txt", font: "8%", label: "", id: "next_title",halign: 0,valign:0, col:0x7BEF},
    ], id:"middle",filly: 0},

    {type:"h", fillx:1,filly: 0,c:[
      {type: "txt", font: "10%", label: "", id: "page_time",fillx:0,halign:-1,valign:1,},
      {type: "txt", font: "10%", label: "", id: "gen_time",fillx:2,halign:1,valign:1,},
    ], id:"bottom"},
  ]

});
*/
var page = new Layout({
  type: "v",fillx:1, filly:1 ,c:[
    {type:"h",pad:5, filly:1, valign:-1,c:[
      {type: "v", c:[
          {type: "txt", font: "15%", label: "done", id: "title",width:10,halign:-1},
      ]},
      {type: "v",fillx:1, c:[
          {type: "txt", font: "8%", label: "", id: "page",halign:1},
      ]},
    ], id:"top"},

    {type:"h",fillx:1,pad:5,filly:5,valign:-1,c:[
      {type:"v",fillx:3, valign:-1,c:[
          {type: "txt", font: "12%", label: "", id: "notes",halign: -1, valign:-1},
      ]},
      {type:"v", fillx:1, c:[
          {type: "txt", font: "8%", label: "", id: "next_title",halign: 1, col:0x7BEF},
      ]},
    ], id:"middle"},

    {type:"h",pad:5, filly:1,c:[
      {type:"v", fillx:1,c:[
          {type: "txt", font: "10%", label: "", id: "page_time",halign:-1,},
      ]},
      {type:"v", fillx:1, c:[  
          {type: "txt", font: "10%", label: "", id: "gen_time",halign:1},
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

function show_page(settings, infos,location){
  var this_page = String("p"+location)
  next = location+1
  var next_page =String("p"+next)
  
  page.clear();

  page.title.label = infos[this_page].titel;
  page.page.label = String(next)+"/"+String(settings.pages);

  page.notes.label = infos[this_page].note;
  
  if (next < settings.pages){
    page.next_title.label = "Next:\n"+infos[next_page].titel;  
  }else{
    page.next_title.label = "Last Page";
  }
  
  page.page_time.label = infos[this_page].time;
  //TODO
  if (false){
    page.page_time.col = 0xF800;
  }else{
    page.page_time.col =  0xF3F0;//0x03E0;
  }
  page.gen_time.label = settings.total_time;
  
  if (false){
    page.gen_time.col = 0xF800;
  }else{
    page.gen_time.col = 0x03E0;
  }
  page.render();
  
}

function show_start(settings){
  title.clear();
  g.clear();
  title.pres_title.label = settings.name;
  title.pages.label = "Pages: " + settings.pages;
  title.comments.label = "Comments: " + settings.comments;
  title.gesture.label = "Gestures: " + settings.gesture;
  title.total_time.label = "Total time: " + settings.total_time;
  title.page_time.label = "Page times: " + settings.page_time;

  title.render();
}

function show_fin(){
  g.clear()
  fin.clear();
  fin.render();
}


// Main 

// infos:
if (setting_file){
  // read data and convert to valid input

  var filename = "newin.json";

  // define file
  var file = require("Storage").readJSON(filename);
  var settings = file.settings;
  var page_info = file.page_info;


  console.log(settings);
  console.log(page_info.p0);
  console.log(Object.keys(settings).length)
  console.log(settings.total_time)
}else{

  var pres_title = "test.pptx";
  //var settings = ["2", "yes"];

  var titles= ["Einleitung","Hauptteil"];
  var notes = ["Info\nInfo2","cooler\nFakt\nhier"];
  var length = titles.length;

}

//Bangle.loadWidgets();
g.clear(1);
Bangle.drawWidgets();
//show_page(titles, notes, length,0);
show_start(settings)
var i = 0;
var start = true;
Bangle.on('touch', function(zone,location){
  if (i<settings.pages){
    g.clear(1);
    show_page(settings,page_info,i);
    i++;
  }else{
    show_fin();
  }

});