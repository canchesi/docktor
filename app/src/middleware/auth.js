const jwt = require("jsonwebtoken");
const config = require("../config/config")[process.env.NODE_ENV || "development"];
const User = require("../models/userModel");

const verifyToken = async (req, res, next) => {
  	const token = req.headers["X-Access-Token"] || req.cookies.token;
  	try{
		if (await User.findOne({where: {token: token}})) {
			req.user = jwt.verify(token, config.token);
			if (req.user)
				next();
			else
				throw new Error("Token scaduto");
		} else
			throw new Error("Token non valido");
   	} catch (err) {
		res.cookie("token", "", {maxAge: 0});
		switch (err.message) {
			case "Token scaduto":
				res.redirect(307, "/login?sessioneScaduta=true");
				break;
			case "Token non valido":
				res.redirect(307, "/login?tokenInvalido=true");
				break;
			default:
				res.redirect(307, "/login");
		}
	} 
};

module.exports = verifyToken;