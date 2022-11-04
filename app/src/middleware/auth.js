const jwt = require("jsonwebtoken");
const path = require('path');

const config = require("../config/config")[process.env.NODE_ENV || "development"];

const verifyToken = (req, res, next) => {
  	const token = req.body.token || req.query.token || req.headers["x-access-token"];
	
 	// 	if (!token)
	//	return res.status(403).send("A token is required for authentication");

  	try{
  	 	req.user = jwt.verify(token, config.token);
  	} catch (err) {
  	 	return res.status(401).sendFile(path.join(__dirname, '../public/login.html'));
  	}

  	return next();
};

module.exports = verifyToken;