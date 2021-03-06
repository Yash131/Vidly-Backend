const winston = require("winston");

module.exports = function (err, req, res, next){
    
    winston.error(err.message ,err)

    res.status(500).send('Something Went Wrong...')
};

// This middleware only catching errors which is under express request pipeline.
// Can't catch any error which is out of express scope.