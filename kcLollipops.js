'use strict';

// Returns the number of pixels the string will take
// when displayed in monospace font.
// Takes a string. Returns an int.
function charsToPixWidth(string) {
	var pixelWidth = $(".fdsa").width();
	return string.length * pixelWidth;
};
function charLenToPixWidth(integer) {
	var pixelWidth = $(".fdsa").width();
	return integer * pixelWidth;
};
function charsToPixHeight(string) {
	var pixelWidth = $(".fdsa").height();
	return string.length * pixelWidth;
};
function charLenToPixHeight(integer) {
	var pixelWidth = $(".fdsa").height();
	return integer * pixelWidth;
};
function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function kcLolis() {
	var game = this;

	// stats will store all numbers and variables in the game, eg resources and ships and whatnot
	this.stats = {};
	this.stats.fuel = 0;
	this.stats.ammo = 0;
	this.stats.steel = 0;
	this.stats.bauxite = 0;
	this.stats.incrCount = 1;

	// Ascii art vars are one-dimensional arrays with strings that represent the art in question
	// Index 0 represents the top row and index n represents the bottom row. 
	this.ascii = {};

	// this.interactables should have the same vars as this.ascii but instead of an array of the art,
	// the values should consist of the interactables that will handle events such as on_click,
	// the text contained within, class/id/etc information and other information relevant.
	// (x,y) coords are the respective displacements of the top-left corner of the "box"
	// from the upper-left corner of the entire game window, which is (0,0). 
	// width and height represent the w/h of the div box
	this.interactables = {};

	//Art loaded from asciiScreens.js
	this.ascii.main = asciiMainSkeleton;

	//Applies to all "frames" of the ascii contained within
	this.ascii.colCount = this.ascii.main[0].length;
	this.ascii.rowCount = this.ascii.main.length;
	this.interactables.main = {
		"menuButton" : {
			"html":["////////","/ Menu /","////////"],
			"x":3, "y":2,
			"width":8, "height":3,
			"callback":"lolis.mainMenu()",
			"classes":["elem-div"],
			"unlocked":true
		}, "shopButton" : {
			"html":["////////","/ Shop /","////////"],
			"x":14, "y":2,
			"width":8, "height":3,
			"callback":"lolis.mainShop()",
			"classes":["elem-div"],
			"unlocked":true
		}, "sortieButton" : {
			"html":["//////////","/ Sortie /","//////////"],
			"x":25, "y":2,
			"width":10, "height":3,
			"callback":"lolis.mainSortie()",
			"classes":["elem-div"],
			"unlocked":true
		}, "mapButton" : {
			"html":["///////","/ Map /","///////"],
			"x":38, "y":2,
			"width":7, "height":3,
			"callback":"lolis.mainMap()",
			"classes":["elem-div"],
			"unlocked":true
		}, "farmButton" : {
			"html":["////////","/ Farm /","////////"],
			"x":48, "y":2,
			"width":8, "height":3,
			"callback":"lolis.mainFarm()",
			"classes":["elem-div"],
			"unlocked":true
		}
	};
	this.currentFrame = {};
	// main, shop, map, farm, menu
	this.currentFrame.screen = "main";
	this.currentFrame.interactables = this.interactables.main;
	this.currentFrame.ascii = this.ascii.main;
	this.currentFrame.render = [];
	// game.currentFrame.changed should only indicate scene changes
	// eg, going from different menus to other menus, different maps, etc. Drastic changes.
	this.currentFrame.changed = true;

	// line is the line as-is with no html. The text to be rendered
	// data is interactable data. Should contain x,y,width,height,html and attributes
	// attributes are
	// - css -> table of css information
	// - class -> array of classes
	// - id -> string
	// Ignore Offset and OffsetToAdd. Being lazy cuz tired.
	this.returnClickableHTMLOffset = 0;
	this.returnClickableHTMLOffsetToAdd = 0;
	this.returnClickableHTML = function(line, subline, data){
		if (typeof(data) === "undefined"){return line };
		if (data.unlocked){
			var span = "<span"
			if (typeof(data) !== "undefined"){
				if (typeof(data["css"]) !== "undefined"){
					span += " style='"
					var stringified = ""
					for (var key in attr["css"]){
						stringified += key + ":" + data["css"][key] + ";"
					};
					span += stringified
					span += "'"
				};
				if (typeof(data["classes"]) !== "undefined"){ 
					span += " class='"
					span += data["classes"].join(" ")
					span += "'"
				};
				if (typeof(data["id"]) !== "undefined"){
					span += " id='"
					span += data["id"]
					span += "'"
				};
				if (typeof(data["callback"]) !== "undefined"){
					span += " onclick='"
					span += data["callback"]
					span += "'"
				};
			};
			span += ">"
			span += subline
			span += "</span>"
			var offset = game.returnClickableHTMLOffset;
			game.returnClickableHTMLOffsetToAdd = span.length-subline.length;
			return line.substring(0,data.x+offset) + span + line.substring(data.x+data.width+offset);
		}
		else{return line;};
	};
	this.foo = function(){alert("a");}
	// clear render
	this.clear = function(){
		$(".elem-div").remove();
		game.currentFrame.render = [];
		game.returnClickableHTMLOffset = 0;
	};
	// draw render
	this.render = function(){
		if (game.currentFrame.changed) {
			// Clear everything
			game.clear();

			game.currentFrame.ascii.forEach(function (data) {
				game.currentFrame.render.push(data);
			});
			for (var button in game.currentFrame.interactables) {
				if (game.currentFrame.interactables.hasOwnProperty(button)){
					var i = 0;
					var data = game.currentFrame.interactables[button];
					for (var buttonLine in data.html) {
						var line = game.currentFrame.render[data.y+i];
						if (typeof(line) === "string"){
							var newline = game.returnClickableHTML(line,data.html[buttonLine],data)
							game.currentFrame.render[data.y+i] = newline
						};
						i++;
					};
					game.returnClickableHTMLOffset += game.returnClickableHTMLOffsetToAdd;
				};
			};
			game.currentFrame.render.forEach(function (data){
				$(".game_area").append(data).append("<br>");
			});
			game.currentFrame.changed = false;
		};
		if (game.currentFrame.screen === "main"){
			$("#fuel_count").html(game.renderRescString(game.stats.fuel));
			$("#ammo_count").html(game.renderRescString(game.stats.ammo));
			$("#steel_count").html(game.renderRescString(game.stats.steel));
			$("#bauxite_count").html(game.renderRescString(Math.floor(game.stats.bauxite)));
		};
	};

	this.save = function() {
		var cookieInfo = ""
		cookieInfo += "fuel:"+game.stats.fuel.toString()+"|";
		cookieInfo += "ammo:"+game.stats.ammo.toString()+"|";
		cookieInfo += "steel:"+game.stats.steel.toString()+"|";
		cookieInfo += "bauxite:"+game.stats.bauxite.toString()+"|";
		var d = new Date();
   	 	d.setTime(d.getTime() + (401*19*8*168*58*24*60*60*1000)); // basically the cookie never expires
		document.cookie = "kcLolisInfo="+cookieInfo+";expires="+d.toUTCString();
	};
	this.load = function() {
		var cookie = getCookie("kcLolisInfo");
		var valArray = cookie.split("|");
		console.log(valArray);
		valArray.forEach(function (data) {
			console.log(data);
			var split = data.split(":");
			var key = split[0];
			var val = split[1];
			//console.log(key+" "+val);
			if (key == "fuel"){game.stats.fuel = Number(val)}
			else if(key == "ammo"){game.stats.ammo = Number(val)}
			else if(key == "steel"){game.stats.steel = Number(val)}
			else if(key == "bauxite"){game.stats.bauxite = Number(val)};
		});
	};

	this.init = function() {

	};

	this.start = function() {
		game.load();
		game.timerLoop();
	};

	this.timerLoop = function() {
		game.rescUpdate();
		game.render();
		game.save();
		setTimeout(game.timerLoop,1000);
	};

	this.rescUpdate = function(){
		game.stats.fuel += game.stats.incrCount;
		game.stats.ammo += game.stats.incrCount;
		game.stats.steel += game.stats.incrCount;
		game.stats.bauxite += game.stats.incrCount/3;
	};
	// returns a padded string of an integer
	this.renderRescString = function(integer){
		var val = numberWithCommas(integer);
		//resources should be 23 chars long, so max pad is 23 chars
		var pad = "                       "
		return pad.substring(0,pad.length-val.length)+val
	};
};




var lolis = new kcLolis();

$(document).ready(function () {
	$("<pre/>").css({"position":"absolute","top":"-100px",
				      "font-family":"monospace",
					  "font-size":"11px"}).attr("class","fdsa").html("p").appendTo("body");

	var $gameArea = $(".game_area");
	$gameArea.css({
		"width":charLenToPixWidth(lolis.ascii.colCount).toString(),
		"height":charLenToPixHeight(lolis.ascii.rowCount).toString(),
		"font-family":"monospace",
		"font-size":"11px",
		"background":"red"
	});
	lolis.start();
});
console.log("done");

