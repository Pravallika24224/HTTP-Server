const {Admin} = require('../db')
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require('../config')

// Middleware for handling auth
async function adminMiddleware(req, res, next) {
  // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
  const authorization = req.headers.authorization
  const decode = jwt.verify(authorization, JWT_SECRET)
  const userName = decode.userName
  try {
    const data = await Admin.findOne({ userName: userName })
    if (data) {
      return next()
    }
    else {
      return res.status(403).json({
        message: "Admin does not exist"
      })
    }
  } catch (err) {
    console.error(err, "err");
    return res.json({
      error: err
    });
  }
}

module.exports = adminMiddleware;