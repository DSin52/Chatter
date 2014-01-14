
/**
 * Module depencies.
 */

var express = require("express");
var path = require("path");
var router = require("./routes/router.js");
var db = require("./routes/controllers/database.js");
var app = express();

// all environments
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.logger("dev"));
app.use(express.json());
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/validation", function (req, res, next) {
	db.connectToDB(function (error, database) {
		if (error) {
			next(error);
		}
		else {
			app.settings.db = database;
			next();
		}
	});
});
app.use("/create", function (req, res, next) {
	db.connectToDB(function (error, database) {
		if (error) {
			next(error);
		}
		else {
			app.settings.db = database;
			next();
		}
	});
});


// development only
if ("development" == app.get("env")) {
  app.use(express.errorHandler());
}

app.get("/", function (req, res) {
	router.route(req, res, "home");
});

app.get("/create", function (req, res) {
	router.route(req, res, "home");
});

app.post("/login", function (req, res) {
	router.route(req, res, "login");
});

app.get("/login", function (req, res) {
	router.route(req, res, "login");
});

app.post("/create", function (req, res) {
	var User = {
		Email: req.body.Email,
		Password: req.body.Password
	};

	db.insertIntoDB(User, function(err) {
		if (err) {
			res.send(res.statusCode);
			console.log(err);
		}
		router.route(req, res, "home");
	});
	res.send(res.statusCode);
});

app.post("/validation", function (req, res) {

	db.checkExists(req.body, function(err, acct) {
		if (err) {
			res.send(500, {Error: "Something went wrong!"});
			return;
		}
		res.json(200, acct);
	});
});

app.post("/forgot", function (req, res) {
	db.sendPassword(req.body.Email, function (err) {
		res.send(err);
	});
});

app.listen(app.get("port"), function() {
	console.log("Server is listening at port: " + app.get("port"));
});
