const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const multer = require("multer");
const _ = require("lodash");
var cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const { User, validate } = require("../models/user_model");
const {
  mailTransporter,
  sendMail,
  mailConfig,
} = require("../helperFunctions/mailService");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

cloudinary.config({
  cloud_name: config.get("cloud_name"),
  api_key: config.get("api_key"),
  api_secret: config.get("api_secret"),
});

// const storage = CloudinaryStorage({
//   cloudinary: cloudinary,
//   folder: "Vidly-userImages",
//   allowedFormats: ["jpg", "png"],
//   transformation: [{ width: 500, height: 500, crop: "limit" }]
//   });

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Vidly-userImages",
    allowedFormats: ["jpg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
    filename: (req, file) => file.originalname,
    public_id: (req, file) => {
      req.user._id;
    },
  },
});

const upload = multer({ storage: storage });

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1024 * 1024 * 5 },
// });

// for getting all the users
router.get("/", [auth, admin], async (req, res) => {
  const user = await User.find().select("-password").sort("name");
  res.send(user);
});

// For Getting Current LoggedIn User
router.get("/current", async (req, res) => {
  const token = req.header("Authorization");
  res.cookie("test", "cookies_form_backend");
  const decodedToken = jwt.decode(token);
  let user = await User.findById(decodedToken._id).select("-password");
  if (!user) {
    return res.status(400).send({ message: "user not found with provided ID" });
  }
  return res.status(200).send(user);
});

// update password, needs current password for user password change

router.post("/update-password", auth, async (req, res) => {
  const userID = req.user._id;
  // console.log(userID);

  // console.log(req.body);

  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(userID);

  if (!user) {
    return res.status(400).send({ message: "user not found with provided ID" });
  }

  const validPass = await bcrypt.compare(oldPassword, user.password);
  if (!validPass) {
    return res
      .status(202)
      .send("Old password is incorrect. New password cannot be updated!");
  }

  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(newPassword, salt);

  await user.save();
  res.status(200).send({ message: "Password Updated Successfully" });
});

router.post("/updateUserInfo", auth, async (req, res) => {
  const userID = req.user._id;
  const { name, address, mobile, email } = req.body;

  let user = await User.findById(userID).select("-password");
  if (!user) {
    return res.status(400).send({ message: "user not found with provided ID" });
  }

  // console.log(req.body);

  if (name && !address && !mobile && !email) {
    user.name = name;
    user = await user.save();
    return res.send(user);
  } else if (!name && address && !mobile && !email) {
    user.address = address;
    user = await user.save();
    return res.send(user);
  } else if (!name && !address && mobile && !email) {
    user.mobile = mobile;
    user = await user.save();
    return res.send(user);
  } else if (!name && !address && !mobile && email) {
    user.email = email;
    user = await user.save();
    return res.send(user);
  }
});

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  // validating body of request
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // checking if user exists by email
  user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send("User Already Registered");
  }

  // generating jwttoken to send as activation link

  const payload = {
    name: name,
    email: email,
    password: password,
  };
  const token = jwt.sign(payload, config.get("signupAccKey"), {
    expiresIn: "20m",
  });

  // activation mail sending
  // console.log(config.get(frontendLink))
  let obj = {
    to: email,
    subject: "Account Activation Email",
    html: `
    <h1>To activate your account follow bellow steps</h1>
    <br>
    <p>Link is only valid for 20 Minutes</p>
    <p>First click on "click here" it will navigate you to our account activation page where you have to click on activate account button</p>
    <a href = "${
      config.get("frontendLink") + "/account-activation?token=" + token
    }" >Click Here</a>
    `,
  };
  // console.log(obj)
  sendMail(mailConfig(obj), mailTransporter, res, req);
});

// Activating account with jwt token
router.post("/activateAcc", async (req, res) => {
  const { token } = req.body;

  jwt.verify(token, config.get("signupAccKey"), async function (err, decoded) {
    if (err) {
      console.log(err);
      return res.send(err.message);
    } else {
      const { name, email, password } = decoded;

      user = await User.findOne({ email: email });
      if (user) {
        return res.status(400).send("User Already Registered");
      }

      user = new User({
        name: name,
        email: email,
        password: password,
      });

      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(user.password, salt);
      user = await user.save();

      const token = user.genrateAuthToken();

      return res.send({
        message: "Your Account is Activated now! Please login now..",
      });
    }
  });
});

router.post("/pass_reset_request", async (req, res) => {
  const { email } = req.body;

  // checking user exists by email
  user = await User.findOne({ email: email }).select("-password");
  if (!user) {
    return res.status(400).send("No user found with provided email!");
  }

  // creating jwt token using email
  const payload = {
    email: email,
  };
  const token = jwt.sign(payload, config.get("signupAccKey"), {
    expiresIn: "20m",
  });

  // forgot pass mail sending

  let obj = {
    to: email,
    subject: "Password Reset",
    html: `
    <h1>To reset password of your account follow bellow steps</h1>
    <br>
    <p>Link is only valid for 20 Minutes</p>
    <p>First click on "click here" it will navigate you to our 'Password Reset' page.</p>
    <a href = "${
      config.get("frontendLink") + "/forgot-password?resetPass=" + token
    }" >Click Here</a>
    `,
  };
  sendMail(mailConfig(obj), mailTransporter, res, req);
});

router.post("/reset_pass", async (req, res) => {
  const { token, password } = req.body;

  jwt.verify(token, config.get("signupAccKey"), async function (err, decoded) {
    if (err) {
      console.log(err);
      return res.send(err.message);
    } else {
      const { email } = decoded;

      let user = await User.findOne({ email: email });
      if (!user) {
        return res
          .status(400)
          .send({ message: "User not find with provided token" });
      }

      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(password, salt);
      user = await user.save();

      return res.send({
        message:
          "Password reseted Successfully, Please login using your new password!",
      });
    }
  });
});

router.post(
  "/profilePic",
  [auth, upload.single("profile")],
  async (req, res) => {
    const userID = req.user._id;

    let user = await User.findById(userID).select("-password");
    if (!user) {
      return res
        .status(400)
        .send({ message: "User not find with provided token" });
    }
    user.photo = req.file.path;
    user = await user.save();

    return res.send({
      message: "Profile Pic Uploaded Successfully",
      data: user,
    });
  }
);

module.exports = router;
