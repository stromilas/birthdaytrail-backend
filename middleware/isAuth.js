const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	const authHeader = req.get('Authorization');

	if(authHeader) {
		const token = authHeader.split(' ')[1];
		var decodedToken;

		try {
			decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
			if(decodedToken) {
				req.id = decodedToken.id;
				req.name = decodedToken.name;
				next();
			}
			else {
				res.status(401);
				res.json({message: 'Bad token'});
			}
		}
		catch(err) {
			res.status(401);
			res.json({message: 'Error while decoding'});
		}
	}
	else {
		res.status(401);
		res.json({message: 'No token'});
	}

};
