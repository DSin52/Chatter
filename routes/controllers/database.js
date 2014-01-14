var MongoClient = require("mongodb").MongoClient;
var Server = require("mongodb").Server;
var Db = require("mongodb").Db;
var mailer = require("nodemailer");

var mongoDB = null;
var smtpTransport = mailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "noderunner52@gmail.com",
        pass: "noderunner"
    }
});


function connectToDB(callback) {

    if(mongoDB) {
      callback(null, mongoDB);
      return;
    }

    MongoClient.connect("mongodb://127.0.0.1:27017/ChatterDB", function (err, db) {
    	
    	if (err) {
    		throw err;
    	}

    	mongoDB = db.collection("Users");
    		if (err) {
    			throw err;
    		}
    		callback();
    });
}

function closeDB(callback) {
	mongoDB.close();
	mongoDB = null;
}

function insertIntoDB(account, callback) {

	mongoDB.findOne({Email: account.Email}, function (err, acct) {
		if (acct) {
			callback(new Error("Email already exists"));
			return;
		}
		else {
			mongoDB.insert(account, function (err, docs) {
				if (err) {
					throw err;
				}
				callback(null);
			});
		}
	});
}

function checkExists(account, callback) {
	
	mongoDB.findOne(account, function (err, acct) {

		var verification = {
			exists: false
		};

		if (acct) {
			verification.exists = true;
		}

		callback(err, verification);
	});
}

function sendPassword(account, callback) {
	var emailQuery = {
		"Email": account
	};
	mongoDB.findOne(emailQuery, function (err, acct) {
		var password = acct.Password;

		var mailOptions = {
			"from": "Chatter <noderunner52@gmail.com>",
			"to": account,
			"subject": "Password Retrieval",
			"text": "Hello Chatterhead, your password is " + password
		};

		smtpTransport.sendMail(mailOptions, function (err, response) {
			callback(err);
		});	
	});
}

module.exports.connectToDB = connectToDB;
module.exports.insertIntoDB = insertIntoDB;
module.exports.checkExists = checkExists;
module.exports.sendPassword = sendPassword;
