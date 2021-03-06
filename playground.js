const func = require('joi/lib/types/func');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt')

// const decode = jwt.decode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjUxMmU5ODYwOThhNDIzMjQ3MTFjYWEiLCJuYW1lIjoiTXIuIEFkbWluIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1OTkzNzQ3ODV9.uKfDp5h8WmoQxakYAoWFzyaAs_7JH1fChjETqpR4of0')
// console.log(decode);


pass = "Yash@131"

function test() {
  bcrypt.compare(pass, '$2b$10$bIJBJbBAU.4iKi9gZjJMVORa1mHmhza0qXCXjUV9oh4YPnjUqSmvi').then(
      (res) => {
        console.log(res)
      }
  )
    
}
// if (!validPass) {
//   return res.status(400).send("Invalid Email or Password ");
// }
console.log(test())