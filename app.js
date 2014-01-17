
/**
 * Module depencies.
 */
var express = require("express");
var path = require("path");
var router = require("./routes/router.js");
var db = require("./routes/controllers/database.js");
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var app = express();
var numUsers = -1;

// all environments
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.logger("dev"));
app.use(express.json());
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(passport.session());
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

passport.use(new LocalStrategy({
	"usernameField": "Email",
	"passwordField": "Password"
},
  function(username, password, done) {
    db.find({ "Email": username, "Password": password }, function (err, user, info) {
    	if (user) {
	      user.id = user._id;
	      done(err, user, "Succesfully Authenticated!");
	  	} else {
	  		done(err, null, "No User found!");
	  	}
    });
	}
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.find({"_id": id}, function (err, user) {
    done(err, user);
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

app.post("/login", function(req, res, next) {
  passport.authenticate("local", {"session": true}, function(err, user, info) {
    if (err) { 
    	return next(err);
    }
    if (!user) { 
    	return router.route("/"); 
    }
    req.logIn(user, function(err) {
      if (err) { 
      	return next(err); 
      }
      return router.route(req, res, "login", {"Email": user.Email});
    });
  })(req, res, next);
});

app.get("/login", function (req, res) {
	console.log("REq " + req);
	// TODO: Have to figure out a way to store cookies and recognize that session is still logged in
	//router.route(req, res, "login", {"Email": req.});
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

app.post("/logout", function (req, res) {
	req.logOut();
	res.redirect("/");
});

var io = require("socket.io").listen(app.listen(app.get("port"), function () {
	console.log("Server is listening to port: " + app.get("port"));
	}
));

io.sockets.on("connection", function (socket) {
	numUsers++;

	io.sockets.emit("handshake", {
		"numUsers": numUsers
	});
	
	socket.on("message_sent", function (data) {
		io.sockets.emit("message", {
			"username": data.username,
			"message": data.message
		});
	});

	socket.on("disconnect", function(data) {
		numUsers--;
		io.sockets.emit("bye", {
			"numUsers": numUsers
		});
	});
});
