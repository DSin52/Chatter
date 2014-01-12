/*
* This file handles all the routing in this web application.
*/


function route(req, res, webpage, callback)
{
	if (webpage == null)
	{
		throw err;
	}
	
	if (webpage === "home")
	{
		res.render("home");
	}
	else if (webpage === "login")
	{
		res.render("login");
	}
	else
	{
		res.render("not_found");
	}

	if (callback)
	{
		callback();
	}
}

module.exports.route = route;

