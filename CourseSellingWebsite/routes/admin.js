const { Router } = require("express");
const jwt = require("jsonwebtoken")
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db")
const router = Router();
const {JWT_SECRET} = require('../config')

// Admin Routes
router.post('/signup', async (req, res) => {
  const userName = req.body.userName
  const password = req.body.password
  const ifExists = await Admin.findOne({ userName: userName })
  if (!ifExists) {
    await Admin.create({
      userName: userName,
      password: password
    })
    const token = jwt.sign({ userName: userName }, JWT_SECRET)
    res.json({
      message: 'Admin created successfully',
      token: token
    })
  }
  else {
    res.json({
      message: "Admin already exists"
    })
  }
});

router.post('/login', async (req, res) => {
  const userName = req.body.userName
  const password = req.body.password
  const ifExists = await Admin.findOne({ userName: userName })
  if (ifExists) {
    const validateCreds = await Admin.findOne({ userName: userName, password: password })
    if (validateCreds) {
      var token = jwt.sign({ userName: userName }, JWT_SECRET)
      res.status(200).json({
        message: "Admin logged in successfully",
        token: token
      })
    }
    else {
      res.status(403).json({
        message: "Incorrect userName or Password"
      })
    }
  }
  else {
    res.json({
      message: "Please Signin first"
    })
  }
})

router.post('/courses', adminMiddleware, async (req, res) => {
  const title = req.body.title
  const description = req.body.description
  const price = req.body.price
  const imageLink = req.body.imageLink
  const newCourse = await Course.create({
    title: title,
    description: description,
    price: price,
    imageLink: imageLink
  })
  res.json({
    message: 'Course created successfully',
    courseId: newCourse._id
  })
});

router.get('/courses', adminMiddleware, async (req, res) => {
  const courses = await Course.findOne({})
  res.status(200).json({
    output: courses
  })

});

module.exports = router;