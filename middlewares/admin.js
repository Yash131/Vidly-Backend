module.exports = function ( req, res, next){
    // 401 = Unauthrized 
    // 403 = Forbidden
    if(!req.user.isAdmin) {
        return res.status(403).send('Access Denied');
    }
    next();
}