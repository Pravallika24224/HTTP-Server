const {Admin} = require('../db')

// Middleware for handling auth
async function adminMiddleware(req, res, next) {
  // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
  const userName = req.headers.username
  const password = req.headers.password
  try {
    const data = await Admin.findOne({ userName: userName, password: password })
    console.log(data, userName, password, req.headers)
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