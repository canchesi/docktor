const jwt = require("jsonwebtoken");
const goTo = require('../utils/goTo.js');

const config = require("../config/config")[process.env.NODE_ENV || "development"];

const verifyToken = (req, res, next) => {
  	const token = req.body.token || req.query.token || req.headers["x-access-token"];
	
  	try{
  	 	req.user = jwt.verify(token, config.token);
  	} catch (err) {
		goTo("login");
  	}

  	next();
};

module.exports = verifyToken;