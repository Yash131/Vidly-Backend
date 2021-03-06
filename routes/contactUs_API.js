const router = require("express").Router();
const { ContactUs, contactUsValidator } = require("../models/contactUs_model");
const validateObjId = require("../middlewares/validateObjId");
const admin = require("../middlewares/admin");
const auth = require("../middlewares/auth");
const nodemailer = require('nodemailer');
const config = require('config');
// const pass = config.get("pass")

// let mailTransporter = nodemailer.createTransport({ 
//   service: 'gmail', 
//   auth: { 
//       type: "login",
//       user: 'yashchouriya9@gmail.com', 
//       pass: pass
//   } 
// }); 


router.get("/",[auth,admin], async (req, res) => {
  const contact = await ContactUs.find().sort("name");
  res.send(contact);
});

router.post("/", async (req, res) => {
  const { error } = contactUsValidator(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

//   let mailDetails = { 
//     from: 'yashchouriya9@gmai.com', 
//     to: req.body.email, 
//     subject: 'Thanks for the feedback', 
//     text: req.body.message
// };

  let contact = new ContactUs({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
  });
  await contact.save();

  // mailTransporter.sendMail(mailDetails, function(err, data) { 
  //   if(err) { 
  //       console.log('Error Occurs',err.message); 
  //   } else { 
  //       console.log('Email sent successfully : ',req.body.email); 
  //       console.log(data); 
  //   } 
  // }); 

  res.send(contact);

});

router.delete("/:id", [validateObjId, auth,admin], async (req, res) => {
  const contact = await ContactUs.findByIdAndDelete(req.params.id);
  if (!contact) {
    return res.status(404).send("The contact with the given ID was not found.");
  }
  res.send(contact);
});

module.exports = router;
