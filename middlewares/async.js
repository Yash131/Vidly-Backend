module.exports = function (handler){
    return async (req, res, next) =>{
        try{
            await handler(req,res);
        }
        catch(ex){
            next(ex);
        }
    }
};

// handler is just a router handler function 
// we need to pass handler function inside out async middleware, now we don't need to use try catch
// inside every route handler  