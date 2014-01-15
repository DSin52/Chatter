$(document).ready(function(){


	var panelHeight = $("#chatPanel").height();
	var textHeight = $("#chat_message").height();
	var socket = io.connect("http://localhost:3000");
	var scrollAmount = $("#messages").height();

	socket.on("connected", function (data) {
		alert("data received");
	});

	$("#messages").css("height", panelHeight - textHeight - 101 + "px");
	$("#chat_message").keypress(function (e) {
		if (e.which == 13) {
			e.preventDefault();
			var message = $("#chat_message").val();
			socket.emit("message_sent", {
			   	"username": "test",
			   	"message": message
		    });
		   	$("#chat_message").val("");
		}
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
});