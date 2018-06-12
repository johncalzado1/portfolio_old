var loggingOn = false;
function msg_log(input) {
	if (loggingOn) {
		console.log(input);
	}
}

//turn off enemyship animations on index.html
var animateFlag = true;
//stops rellax parallax from activating
var rellaxFlag = true;
//used to make sure that logo2 disappears once trailer played
var logo_two_once = false;