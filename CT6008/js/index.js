/*
 * TODO
 * 1. Team page
 * 2. rest rellax properties
 * 3. sort out rest of home page
 * 4. fix button and add functionality
 */


//CODE FOR second pop-up fixed menu when scorlling past first section
$(document).ready(function() {
  // fix menu when passed
  $('.parallax-container')
    .visibility({
      once: false,
      onBottomPassed: function() {
        $('.fixed.menu').transition('fade in');
      },
      onBottomPassedReverse: function() {
        $('.fixed.menu').transition('fade out');
      }
    });
  // create sidebar and attach to menu open
  $('.ui.sidebar').sidebar('attach events', '.toc.item');
});	

var scrollEvents = function () {
	//add animation for black fading background
	var distanceTop = getPositionFromTop(document.getElementById("secondSection"));

	var scrollTop = $(window).scrollTop(),
    	elementOffset = distanceTop.y,
    	distance = (elementOffset - scrollTop);

    var opacity_multiplier = 1;
    var opacity_diff = distance / elementOffset;
    var output_opacity = opacity_multiplier - (opacity_diff * opacity_multiplier);
    //output_opacity = Math.pow(output_opacity, 5) + 0.7;
    msg_log("x: " + opacity_diff + " y: " + output_opacity);

    //used to increase change of opacity near the end higher half so that the graident 
    //is not linear
    var multiplier_logo1 = (opacity_diff < 0.5) ? output_opacity * 1.3: output_opacity;
    var logo1_opacity = 1 - multiplier_logo1;
    document.getElementById("blackDiv").style.opacity = (output_opacity+0.25).toString();
	document.getElementById("logo1").style.opacity = logo1_opacity.toString();
	//document.getElementById("logo2").style.opacity = output_opacity.toString();
	document.getElementById("second_section_video").style.opacity = (output_opacity - 0.2).toString();	
}

var addPlayButton = function (top) {
	//Add play button
    var play_button_str = "<div id='trailer_button_grid' class='ui grid' style='visibility:hidden; position:absolute; z-index:500; left:50px; top:" + (top).toString() + "px;'>" + 
    					  "<h1 class = 'ui header' id='trailer_button'>" + 
    					  "Play trailer <i id='player_button_icon' class='play circle outline icon'></i></h1></div>";
    document.getElementById("intro").insertAdjacentHTML( 'afterend', play_button_str );

	var trailer=document.getElementById("second_section_video"); 

	$('#trailer_button').click(function () {
		msg_log("trailer button was clicked");
		if (trailer.paused) {
		    trailer.play();
		    document.getElementById('player_button_icon').className = "pause circle outline icon"; 
            if (logo_two_once != true) {  
		      $('#logo2').transition('fade out');
            } else {
                document.getElementById('logo2').style.opacity = "0"; 
            }
		    logo_two_once = true;
		} else { 
			trailer.pause();
		    document.getElementById('player_button_icon').className = "play circle outline icon";
		    document.getElementById('logo2').style.opacity = "0";
		    logo_two_once = true;
		}
	}); 	
}

var animateEnemyShip = function (posX, posY, ship_dom) {

	//posY should be fixed

	msg_log("animating " + ship_dom);
	//get available window width
	var window_width = window.screen.width
		|| document.documentElement.clientWidth
		|| document.body.clientWidth;


	var parallax_height = getPositionFromTop(document.getElementById("first-panel"));
		parallax_height = parallax_height.y;

		parallax_height += posY;
		window_width += posX;

	var translateStr = 'translate(' + window_width.toString() + 'px, ' + parallax_height.toString() + 'px)'

	var target = document.querySelector(ship_dom);
	var transformStr = 'translate(' + (posX-posY).toString() + 'px, ' + (-posY).toString() + 'px)';
	msg_log("start: " + transformStr);
	msg_log("end: " + translateStr);
	var player = target.animate([
	  {transform: transformStr },
	  {transform: translateStr }
	], 7000);
	player.addEventListener('finish', function() {
	  target.style.transform = translateStr;
	});	
}

var animationOfShips = function () {

	//for turning off animations
	if (animateFlag === false) {
		return;
	}

	animateEnemyShip(500, 500, '#e_ship');
	setInterval(function(){
		animateEnemyShip(-500, 500, '#e_ship'); 
	}, 10000);
	setInterval(function(){
		animateEnemyShip(0, 500, '#e_ship2'); 
	}, 13000);	
	setInterval(function(){
		animateEnemyShip(700, 500, '#e_ship3'); 
	}, 12000);	
	setInterval(function(){
		animateEnemyShip(1000, 500, '#e_ship4'); 
	}, 11000);	
}

//function to get distance of element to top of window, no matter where scroll position is
var getPositionFromTop = function(element) {
    var xPosition = 0;
    var yPosition = 0;

    while(element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    return { x: xPosition, y: yPosition };
}


var add_logo = function(imgSize, imgPx, imgSpeed, imgFile, zIndex, id, rellaxZindex, parentNode, isVisibile){
	//add logo
	var g_logo = document.createElement("img");
	g_logo.id = id;
	g_logo.src = imgFile;
	g_logo.style.zIndex = zIndex;
	g_logo.className += "ui centered " + imgSize + "  image rellax parallax-layer";

	//to position logo dynamically
	g_logo.style.top = ((window.innerHeight / 2) - imgPx).toString() +  "px";
	g_logo.setAttribute("data-rellax-speed", imgSpeed);
	g_logo.setAttribute("data-rellax-zindex", rellaxZindex);	
	if (isVisibile == false) {
		g_logo.style.visibility = "hidden";
	} else {
		g_logo.style.visibility = "visible";
	}		

	document.getElementById(parentNode).appendChild(g_logo);	
}


// id = img element id
// size = the size class used in semantic ui determines how big img will be
// file = file path of image file
var add_enemy_ships = function (id, size, file) {
    //Add enemy ship
    var enemy_ship = document.createElement('img');

    enemy_ship.id = id;
    enemy_ship.src = file;
    enemy_ship.className += "ui " + size + " image";
    enemy_ship.style.zIndex = "280";
    enemy_ship.style.position = "absolute";
    enemy_ship.style.top = "-500px";
    enemy_ship.style.left = "-500px";
    document.getElementById('intro').appendChild(enemy_ship);
}


var errorScreen = function (e) {
	msg_log("----------------------------------ERROR-----------------------------------------");
	msg_log(e);
	$('#loader').dimmer('hide');
	$('#error').dimmer('setting', {
        closable: false,
        debug: false
    });
	$('#error').dimmer('show');
	$('#error .button').click(function () {
		msg_log("refresh screen clicked");
		location.reload();
	});
}
window.onload = function () {

	//get available window width
	var window_width = window.screen.width
		|| document.documentElement.clientWidth
		|| document.body.clientWidth;			

	msg_log(window_width);

	var size;
	var imgSize;
	var imgSpeed;
	var imgPx;
	var enemyShipSize;
	var logoFile;
	var logoFile2;
	var logo2Speed;

	//if the screen's resolution is above 1920px in width then switch to "medium mode"
	if (window_width > 1920) {
		size = "m";
		imgSize = "huge";
		imgSpeed = -10;
		logo2Speed = -8;
		imgPx = 373;
		enemyShipSize = "large"
		logoFile = "img/game_logo.png";
		logoFile2 = "img/game_logo_2.png";
	} else {
		size = "s";
		imgSize = "large";
		imgSpeed = -8;
		logo2Speed = -5;
		imgPx = 210;
		enemyShipSize = "medium";
		logoFile = "img/game_logo_s.png";
		logoFile2 = "img/game_logo_2_s.png";
	}

	try {

		//if device is mobile
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 			$('#intro').remove();
 			$('#first-panel')[0].style.marginTop = 0;
 			return;
		}

		//ADDS black parallax tiles
		add_tiles("blank", size);
        var left = add_tiles("padding",size); 

        //Add background image
        var img = new Image();
        img.src = (size == "m") ? "img/bckgnd_tiles_m.png" : "img/bckgnd_tiles_s.png";
        img.style.left = left.toString() + "px";
        img.style.position = "absolute";
        img.style.zIndex = "10";      
		var node = document.getElementById('intro');
		node.insertBefore(img,node.firstChild);

		img.onload = function () {
			try {
				//add buildings	
				add_tiles("building", size);
		        //this adijust the maring top of the next div base on the height of the background tile image
		    	var bckgnd_tiles_height = $('#intro img')[0].height;
		    	var blackDivOverlayHeight = bckgnd_tiles_height;
		        bckgnd_tiles_height = (bckgnd_tiles_height-100).toString();

		        //Add enemy ship
		        add_enemy_ships("e_ship", enemyShipSize ,"img/obj/e_ship.png");
		        add_enemy_ships("e_ship2", enemyShipSize ,"img/obj/e_ship.png");
		        add_enemy_ships("e_ship3", enemyShipSize ,"img/obj/e_ship.png");
		        add_enemy_ships("e_ship4", enemyShipSize ,"img/obj/e_ship.png");

		        var secondSection = document.createElement('div');
		        secondSection.id += "secondSection";
		        secondSection.style.top = (blackDivOverlayHeight) + "px"; //this is only to suit 1280px projector in COMX
		        secondSection.style.height = blackDivOverlayHeight.toString() + "px";
		        secondSection.style.minHeight = "900px";
		        secondSection.style.position = "absolute";
		        secondSection.style.width = "100%";
		        secondSection.style.zIndex = "300";

		        $('#intro').append(secondSection);

		        var second_section_video = document.createElement('video');
		        second_section_video.id = "second_section_video";
		        second_section_video.src = "img/trailer.mp4";
		        second_section_video.poster = "img/second_section.png";
		        second_section_video.style.height = "100%";
		        second_section_video.style.zIndex = "-100";

		        $('#secondSection').append(second_section_video);

		        
		        //add second section divider
		        var second_section_bar = document.createElement("div");
		        second_section_bar.className += "second_section_bar";
		        second_section_bar.style.position = "absolute";
		        second_section_bar.style.top = (blackDivOverlayHeight - 50).toString() + "px";
		        second_section_bar.style.left = "0";

		        $('#intro').append(second_section_bar); 

		        //offset first panel
	        	var videoHeight = $('#second_section_video')[0].offsetHeight;
	        	var position = getPositionFromTop(document.getElementById("second_section_video"));

	        	document.getElementById("first-panel").style.marginTop = (position.y + videoHeight).toString() + "px";	

		        //Add black overlay behind logo
		        var blackDiv = document.createElement("div");
		        blackDiv.style.height = (blackDivOverlayHeight).toString() + "px";
		        blackDiv.style.width = "100%";
		        blackDiv.style.position = "absolute";
		        blackDiv.style.backgroundColor = "#000";
		        blackDiv.style.top = "0";
		        blackDiv.style.left = "0";
		        blackDiv.style.zIndex = "300";

		        blackDiv.style.opacity = "0";
		        blackDiv.id = "blackDiv";

		        document.getElementById("intro").appendChild(blackDiv);

				//add logo
				add_logo(imgSize, imgPx, imgSpeed, logoFile, "500", "logo1", 10, "intro", true);
				add_logo(imgSize, imgPx, logo2Speed, logoFile2, "320", "logo2", 10, "intro", false);
				  
				  $('.second_section_bar')
				    .visibility({
				      once: false,
				      onTopPassed: function() {
				      	if (logo_two_once == false) {
				        	$('#logo2').transition('fade in');
				    	} else {
				    		document.getElementById('logo2').style.opacity = "0";
				    	}
				    	$('#trailer_button_grid').transition('fade in');
				      },
				      onTopPassedReverse: function() {
                          if (logo_two_once == false) {
				            $('#logo2').transition('fade out');
                          } else {
				    		document.getElementById('logo2').style.opacity = "0";
				    	}
				    	// $('#trailer_button_grid').transition('fade out');
				      }
				    });

				//Activates parallax effect
				if (rellaxFlag !== false) {
					var rellax = new Rellax('.rellax');
				}

		        //adjust height of the parallax div
		        //this doesnt really change anything visually, but is used by 
		        //the second menu in hompage to determine when to appear
		        //get the height of everything before first-panel
		        var parallaxAreaHeight = getPositionFromTop(document.getElementById("first-panel"));
		        $('#intro')[0].style.height = (parallaxAreaHeight.y).toString() + "px";

				function otherEvents() {
					//trigger scroll event when page load
					scrollEvents();
					addPlayButton(blackDivOverlayHeight);
					window.onscroll = function () {
						scrollEvents();
					}
				}

		        //a delay is used (as a work around). What really needs to happen, is when all the rendering is complete and everything in the DOM is fully loaded, the then the dimmer should turn off.
				var delay_time = 2000; // 2 seconds
				//removes loading screen dimmer
				var loaded = function() {
		        	$('#loader').dimmer('hide');
		        	otherEvents();
		        	animationOfShips();
				}
				setTimeout( loaded, delay_time );			        
			} catch (e) {
				errorScreen(e);
			}
		}
	} catch (e) {
		//CODE TO REMOVE LOADER
		//CODE TO SHOW ERROR
		errorScreen(e);
	}
}	