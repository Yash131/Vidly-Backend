const { User } = require('../models/user_model');

module.exports = async function ( req, res, next){
    // 401 = Unauthrized 
    // 403 = Forbidden
    const user = req.user;
    if(!user) {
        return res.status(403).send('Access Denied');
    }
    const userInfo = await User.findById(user._id).select('-password');
    // console.log(userInfo)
    if(!userInfo) {
        return res.status(403).send('Access Denied');
    }

    const isAdmin = userInfo.isAdmin;
    // console.log(isAdmin)
    if(!isAdmin) {
        return res.status(403).send('Access Denied');
    }

    next();
}