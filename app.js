
/**
 * Module depencies.
 */

var express = require("express");
var path = require("path");
var router = require("./routes/router.js");
var app = express();

// all environments
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.logger("dev"));
app.use(express.json());
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, "public")));

// development only
if ("development" == app.get("env")) {
  app.use(express.errorHandler());
}

app.get("/", function (req, res) {
	router.route(req, res, "home");
});

app.post("/login", function (req, res) {
	router.route(req, res, "login");
});

app.get("/forgot", function (req, res) {
	router.route(req, res, "forgot");
});

app.post("/", function (req, res) {
	router.route(req, res, "home");
});

app.listen(app.get("port"), function() {
	console.log("Server is listening at port: " + app.get("port"));
});
