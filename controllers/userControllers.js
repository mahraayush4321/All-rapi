const bcryptjs = require("bcryptjs");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

const sendResetpassword = async (name, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword,
      },
    });

    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: "For reset password",
      html:
        "<p> Hii" +
        name +
        ',Copy the link and <a href="http://127.0.0.1:3000/api/reset-password?token=' +
        token +
        '"> reset your password</a>',
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("email has been sent successfully", info.response);
      }
    });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const createToken = async (id) => {
  try {
    const token = await jwt.sign({ _id: id }, config.key);
    return token;
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const securepassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const register_user = async (req, res) => {
  try {
    const spassword = await securepassword(req.body.password);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: spassword,
      image: req.file.filename,
      mobile: req.body.mobile,
      type: req.body.type,
    });

    const userData = await User.findOne({ email: req.body.email });
    if (userData) {
      res.status(400).send({ sucess: false, msg: "this email already exists" });
    } else {
      const user_data = await user.save();
      res.status(200).send({ sucess: true, data: user_data });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//login method

const user_login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({ email: email });
    if (userData) {
      const passwordMatch = await bcryptjs.compare(password, userData.password);
      if (passwordMatch) {
        const tokenData = await createToken(userData._id);
        const userResult = {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          password: userData.password,
          image: userData.image,
          mobile: userData.mobile,
          type: userData.type,
          token: tokenData,
        };
        const response = {
          success: true,
          msg: "user details",
          data: userResult,
        };
        res.status(200).send(response);
      } else {
        res
          .status(200)
          .send({ success: false, msg: "Login details are incorrect" });
      }
    } else {
      res
        .status(200)
        .send({ success: false, msg: "Login details are incorrect" });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//update password

const update_password = async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const password = req.body.password;

    const data = await User.findOne({ _id: user_id }); //checking id userid exists or not

    if (data) {
      const newpassword = await securepassword(password); //convert password to hash call secure password from above

      const userData = await User.findByIdAndUpdate(
        { _id: user_id },
        {
          $set: {
            password: newpassword,
          },
        }
      );

      res.status(200).send({ success: true, msg: "password has been updated" });
    } else {
      res.status(200).send({ success: false, msg: "user id not found" });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//forget-password

const forget_password = async (req, res) => {
  try {
    const email = req.body.email;
    const userData = await User.findOne({ email: email });
    if (userData) {
      const randomString = randomstring.generate();
      const data = await User.updateOne(
        { email: email },
        {
          $set: {
            token: randomString,
          },
        }
      );
      sendResetpassword(userData.name, userData.email, randomString);
      res
        .status(200)
        .send({ success: true, msg: "check your email in your inbox" });
    } else {
      res
        .status(200)
        .send({ success: true, msg: "no user found with this email" });
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

module.exports = {
  register_user,
  user_login,
  update_password,
  forget_password,
};
