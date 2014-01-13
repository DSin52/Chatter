$(document).ready(function(){
	
	function validate(acct, callback) {
		$.post("/validation", acct, callback);
	};

	$("#loginButton").click(function(event) {

		var username = $("#user").val();
		var password = $("#pass").val();

		if (!username || !password) {
			event.preventDefault();
			alert("Username and/or password is empty");
			return;
		}

		event.preventDefault();
		validate({"Email": username, "Password": password}, function (data) {
			if (data.exists === false) {
				alert("Account not recognized!");
				return;
			} else {
				$("#login").submit();
			}
		});
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
			validate({"Email": email}, function (data) {
				if (data.exists === true) {
					alert("Email already exists!");
				} else {
					$.post("/create", {"Email": email, "Password": pass}, function (statusCode) {
						alert("Account Created!");
					});
				}
			});
		}
	});

	$("#forgotEmail").click(function(event) {
		
		var email = $("#forgotEmailAddress").val();

		//temporary fix
		event.preventDefault();
		
		if (!email) {
			alert("Please enter a valid email");
			return;
		}

		validate({"Email": email}, function (data) {
			if (data.exists === true) {
				alert("Password change request has been sent to your email!");
			} else {
				alert("Account with this email doesn't exist!");
			}
		});
	});

	$('.carousel').carousel({
	  interval:4000,
	  pause:"hover"
	});
});
