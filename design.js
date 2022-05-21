// design default screen
var Layout = require("Layout");


// infos:
var pres_title = "test.pptx";
var settings = ["10", "done"];

var titles= ["F1","F2"];
var notes = ["N1a\nN1b","N2"];
var length = titles.length;


/**
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
  type: "v",fillx:1, filly:1, bgCol: g.theme.bg2 ,c:[
    {type:"h",pad:5, filly:1, valign:-1,c:[
      {type: "v",fillx:1,  c:[
          {type: "txt", font: "15%", label: "done", id: "title",halign:-1},
      ]},
      {type: "v",fillx:1, c:[
          {type: "txt", font: "8%", label: "", id: "page",halign:1},
      ]},
    ], id:"top"},

    {type:"h",fillx:1,pad:5,filly:5,valign:-1,c:[
      {type:"v",fillx:3, valign:-1,c:[
          {type: "txt", font: "12%", label: "", id: "notes",halign: -1},
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
    {type: "txt", pad: 3, font: "8%", label:"", id: "settings",halign: 0},
    {type: "btn", pad: 3, font: "8%", label:"Press to continue", id: "start_btn"},
    ]
});

function show_page(titles, note, length, point){

  page.clear();

  page.title.label = titles[point];
  page.page.label = String(point+1)+"/"+String(length);

  page.notes.label = note[point];
  page.next_title.label = "Next:\n"+titles[point+1];
  
  page.page_time.label = "2:00";
  //TODO
  if (false){
    page.page_time.col = 0xF800;
  }else{
    page.page_time.col = 0x03E0;
  }
  page.gen_time.label = "22:00";
  
  if (false){
    page.gen_time.col = 0xF800;
  }else{
    page.gen_time.col = 0x03E0;
  }
  page.render();
  
}

function show_start(name, settings){
  title.clear();
  title.pres_title.label = name;
  title.settings.label = "setting1: "+settings[0]+"\nsetting2: "+settings[1];
  title.render();
}

function show_fin(){
  g.clear()
  fin.clear();
  fin.render();
}


//Bangle.loadWidgets();
g.clear(1);
Bangle.drawWidgets();
//show_page(titles, notes, length,0);
show_start(pres_title,settings)
var i = 0;
var start = true;
Bangle.on('touch', function(zone,location){
  if (i<length){
    
    show_page(titles, notes, length,i);
    i++;
  }else{
    show_fin();
  }

});