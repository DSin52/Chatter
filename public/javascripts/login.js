$(document).ready(function(){


	var panelHeight = $("#chatPanel").height();
	var textHeight = $("#chat_message").height();
	var socket = io.connect("http://localhost:3000");
	var scrollAmount = $("#messages").height();
	var userId = $("#userId").text();
	socket.on("connected", function (data) {
		alert("data received");
	});

	initialize();

	$("#messages").css("height", panelHeight - textHeight - 101 + "px");
	$("#chat_message").keypress(function (e) {
		if (e.which == 13) {
			e.preventDefault();
			var message = $("#chat_message").val();
			socket.emit("message_sent", {
				"username": userId,
			   	"message": message
		    });
		   	$("#chat_message").val("");
		}
	});

	socket.on("handshake", function (data) {
		$("#numUsers").text("Number of Users Online: " + data.numUsers)
	});

	socket.on("bye", function (data) {
		$("#numUsers").text("Number of Users Online: " + data.numUsers)
	});

	socket.on("message", function (data) {
		var user = data.username;
		var message = data.message;
		addMessage(user, message);
	});

	function addMessage(user, msg) {		
	   $("#messages").append('<div id="message" class="message"><p><b>' + user + ': </b>said: ' + msg + '</p></div>').slideDown("fast");
	   scrollAmount += 100
	   $("#messages").scrollTop(scrollAmount);
	}

	$("#chatPanel").draggable();
	$("#chatPanel").resizable({
		resize: function(event, ui) {
			$("#messages").css("max-width", ui.size.width + "px");
			changeChatHeight(ui.size.height)
		}
	});

	function changeChatHeight(amount) {
		var messageHeight = $("#chat_message").height();
		$("#messages").css("height", amount - messageHeight - 101);
	}

	function initialize() {
	  var mapOptions = {
	    zoom: 15,
	    center: new google.maps.LatLng(-34.397, 150.644)
	  };

	  var myLatlng = new google.maps.LatLng(-34.363882,150.044922);

	  var map = new google.maps.Map(document.getElementById("map-canvas"),
	      mapOptions);

			  // To add the marker to the map, use the 'map' property
		var marker = new google.maps.Marker({
		    position: myLatlng,
		    map: map,
		    title:"Hello World!"
		});
	  }
	 
});