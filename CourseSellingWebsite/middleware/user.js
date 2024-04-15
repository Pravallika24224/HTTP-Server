const { User } = require('../db')

async function userMiddleware(req, res, next) {
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const userName = req.headers.username
    const password = req.headers.password
    try {
      const data = await User.findOne({ userName: userName, password: password })
      if (data) {
        return next()
      }
      else {
        return res.status(403).json({
          message: "User does not exist"
        })
      }
    } catch (err) {
      console.error(err, "err");
      return res.json({
        error: err
      });
    }
}

module.exports = userMiddleware;