const express = require("express");
const user_route = express();
const bodyParser = require("body-parser");
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));

const multer = require("multer");
const path = require("path");

user_route.use(express.static("public"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/userImages"), (error, success) => {
      if (error) throw error;
    });
    filename: (req, file, cb) => {
      const name = Date.now() + "-" + file.originalname;
      cb(null, name, (error, success) => {
        if (error) throw error;
      });
    };
  },
});

const upload = multer({ storage });

const user_controller = require("../controllers/userControllers");

const auth = require("../middleware/auth");

user_route.post(
  "/register",
  upload.single("image"),
  user_controller.register_user
);

user_route.post("/login", user_controller.user_login);
user_route.get("/test", auth, (req, res) => {
  res.status(200).send({ success: true, msg: "authenticated" });
});

module.exports = user_route;
