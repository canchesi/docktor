const jwt = require("jsonwebtoken");
const config = require("../config/config")[process.env.NODE_ENV || "development"];
const User = require("../models/userModel");

const verifyToken = async (req, res, next) => {
  	const token = req.headers["X-Access-Token"] || req.cookies.token;
  	try{

		if (await User.findOne({where: {token: token}})) {
			// Se il token è valido, lo decodifica e lo salva in nell'header della richiesta, altrimenti lancia un errore
			req.user = jwt.verify(token, config.token);
			if (req.user)
				next();
			else
				throw new Error("Token scaduto");
		} else
			throw new Error("Token non valido");
   	} catch (err) {
		// Se il token non è valido, lo elimina dal cookie e reindirizza l'utente alla pagina di login con relativo messaggio di errore
		res.cookie("token", "", {maxAge: 0});
		switch (err.message) {
			case "jwt expired" || "Token scaduto":
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