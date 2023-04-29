const jwt = require("jsonwebtoken");
const config = require("../config/config");

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"];

  if (!token) {
    res.status(200).send({
      sucess: true,
      msg: "token is required for authetication",
    });
  }
  try {
    const decode = jwt.verify(token, config.key);
    req.user = decode;
  } catch (error) {
    res.status(400).send("Invalid token");
  }
  return next();
};

module.exports = verifyToken;
