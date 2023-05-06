const express = require("express");
const category_route = express();

const bodyParser = require("body-parser");
category_route.use(bodyParser.json());
category_route.use(bodyParser.urlencoded({ extended: true }));

const auth = require("../middleware/auth");

const category_controller = require("../controllers/categroyController");

category_route.post("/add-category", auth, category_controller.add_category);

module.exports = category_route;
