const jwt = require("jsonwebtoken");
const parseCookie = require('../utils/parseCookie.js');
const config = require("../config/config")[process.env.NODE_ENV || "development"];
const User = require("../models/userModel");

const verifyToken = async (req, res, next) => {
  	const token = req.headers["X-Access-Token"] || parseCookie(req).token;
  	try{
		if (await User.findOne({where: {token: token}}))
			req.user = jwt.verify(token, config.token);
		next();
   	} catch (err) {
		res.redirect(303, "/login");
   	}
   
};

module.exports = verifyToken;