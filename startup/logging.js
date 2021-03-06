const winston = require('winston');
require('winston-mongodb'); /* For saving logs in db*/
require('express-async-errors');

module.exports = function (){
  
winston.handleExceptions(
  new winston.transports.Console({colorize : true , prettyPrint : true }),

  new winston.transports.File({
  filename : 'uncaughtException.log',
  humanReadableUnhandledException : true,
  handleExceptions : true,
  prettyPrint : true,
  colorize : true 
}));

//   catching unhandledRejection(Unresolved Promise Errors) and logging it
process.on('unhandledRejection', (ex) =>{
    winston.error(ex.message, ex);
    throw ex
    // process.exit(1);
  });
  
//   Logging errors to local log file
winston.add( winston.transports.File , { filename : 'logFile.log'});


//   Loggin errors to MongoDB
winston.add( winston.transports.MongoDB, {
    db : `mongodb+srv://vidlyuser:admin1234@vidly.hsmmg.mongodb.net/vidlystore?retryWrites=true&w=majority`,
    level : 'error'
});

};
