const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next){
    const token = req.header('Authorization');
    if(!token) { return res.status(401).send('Access Denied. No Token Provided')};

    try{
      const payload = jwt.verify(token, config.get('jwtPrivateKey'));
      req.user = payload;
      next();
    }    
    catch(ex){
        res.status(400).send('Invalid Token');
        console.error(ex.message);
    }
};