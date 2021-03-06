const config = require('config');
const winston = require('winston')

module.exports = function (){
    if(!config.get('jwtPrivateKey')){
        winston.error('FATAL ERROR : jwtSecretKey Key is Not Defined');
        process.exit(1); /* 0 = success , otherInt = Failed*/
      }; 
}