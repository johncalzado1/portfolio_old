(window.onload = function(){
	$('.message .close')
	  .on('click', function() {
	    $(this)
	      .closest('.message')
	      .transition('fade');
	});	
	$('#email_inp')
		.popup({
			on: 'manual',
			transition: "slide down",
			duration: "300",
			content : 'you must enter an email at least 5 characters long.'
		});	  

	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyBTMX40czfTG04TWspGuzMwhtEvB6IZJfw",
		authDomain: "johncalzado1.firebaseapp.com",
		databaseURL: "https://johncalzado1.firebaseio.com",
		projectId: "johncalzado1",
		storageBucket: "johncalzado1.appspot.com",
		messagingSenderId: "198600549918"
	};
	if (!firebase.apps.length) {
	    //firebase.initializeApp({});
		firebase.initializeApp(config);
	}	

	function emailFormCB (result)
	{
		var err_div = $('.ui.negative.message');
		var suc_div = $('.ui.success.message');

		switch (result) {
			case "s":
				suc_div.show();
				err_div.hide();
				break;
			
			case "e":
				suc_div.hide();
				err_div.show();			
				break;

			default:
				suc_div.hide();
				err_div.hide();							
				break;
		}
	}

	function writeUserData(email) {
		var newPOST = firebase.database().ref('emails/').push(); 
		newPOST.set({
			email: email
		}, function(error) {
		    if (error) {
		      emailFormCB("e");
		      console.log("ERROR");
		    } else {
		      emailFormCB("s");
		      console.log("SUCCESS");
		    }
		});
	}	

	$('.ui.submit.animated.fade.button').on("click", function (){
		var email_input = $('#email_inp').val();
		if (email_input.length > 5) {
			writeUserData(email_input);
		} else {

			//shows pop up for 1500 ms
			$('#email_inp').popup('show');
			setTimeout(function(){
				$('#email_inp').popup('hide');				
			}, 1500);
		}
	});	
})();
