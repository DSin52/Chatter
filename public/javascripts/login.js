$(document).ready(function(){


	var panelHeight = $("#chatPanel").height();
	var textHeight = $("#chat_message").height();
	var top = $("#chat_message").position().top + textHeight;

	$("#messages").css("max-height", panelHeight - textHeight - 35 + "px");
	// $("#messages").css("bottom", textHeight - 35 + "px");
	$("#chat_message").keypress(function (e) {
		if (e.which == 13) {
			e.preventDefault();
			var message = $("#chat_message").val();
			addMessage(message);
		}
	});

	function addMessage(msg) {
	   $("#messages").append('<div class="message"><p>Username said: ' + msg + '</p></div>').slideDown("fast");
	   $("#chat_message").val("");
	   changeChatHeight();
	}

	$("#chatPanel").draggable();
	$("#chatPanel").resizable();

	function changeChatHeight() {
		var messageHeight = $("#messages").height();
		$("#chat_message").css("margin-top", $("#chat_message").position() - messageHeight + "px");
	}
});