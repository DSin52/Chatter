var MongoClient = require("mongodb").MongoClient;
var Server = require("mongodb").Server;
var Db = require("mongodb").Db;
var bcrypt = require("bcrypt");
var mailer = require("nodemailer");
var async = require("async");

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

function insertIntoDB(account, done) {

	async.waterfall([
		function (callback) {
			mongoDB.findOne({Email: account.Email}, callback);
		},
		function (acct, callback) {
			if (acct) {
				callback(new Error("Email already exists!"));
			} else {
				callback();
			}
		},
		function (callback) {
			bcrypt.genSalt(3, callback);
		},
		function (salt, callback) {
			bcrypt.hash(account.Password, salt, callback);
		},
		function (hashedPassword, callback) {
			var userAccount = {
				"Email": account.Email,
				"Username": account.Username,
				"Password": hashedPassword
			};
			mongoDB.insert(userAccount, callback);
		}
		],
		function (err, results) {
			if (err) {
				return done(err);
			} else {
				done(null);
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

function find(query, callback) {
	async.waterfall([
		function (next) {
			bcrypt.genSalt(3, next);
		},
		function (salt, next) {
			bcrypt.hash(query.Password, salt, next);
		},
		function (hashedPassword, next) {
			mongoDB.findOne({"Email": query.Email}, function (err, account) {
				next(err, hashedPassword, account);
			});
		},
		function (hashedPassword, account, next) {
			if (!account) {
				return callback(null, null);
			} else {
				bcrypt.compare(account.Password, hashedPassword, function (err, res) {
					next(err, account, res);
				});
			}
		}
		], function (err, account, result) {
				return callback(err, account);
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
module.exports.find = find;
