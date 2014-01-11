$(document).ready(function(){
	
	$("#loginButton").click(function(event) {

		var username = $("#user").val();
		var password = $("#pass").val();

		if (!username || !password)
		{
			event.preventDefault();
			alert("Username and/or password is empty");
		}
	});

	$("#createAccountButton").click(function(event) {
		
		var email = $("#createEmailAddress").val();
		var verifyEmail = $("#verifyEmailAddress").val();

		var pass = $("#createPassword").val();
		var verifyPass = $("#verifyPassword").val();

		if (!email || !verifyEmail || !pass || !verifyPass) {
			alert("Please complete entering in all the information");
		} else if (email !== verifyEmail) {
			alert("The two emails do not match up!");
		} else if (pass !== verifyPass) {
			alert("The passwords do not match up!");
		} else if (email.indexOf("@") === -1) {
			alert("Enter a valid email address: Missing the '@' symbol!");
		} else {
			alert("Account created!");
			$("#create").submit();
		}
	});

	$('.carousel').carousel({
	  interval:4000,
	  pause:"hover"
	});
});
