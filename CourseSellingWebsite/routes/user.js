const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require('../db')
const jwt = require("jsonwebtoken")
const JWT_SECRET = require('../config')

// User Routes
router.post('/signup', async (req, res) => {
  const userName = req.body.userName
  const password = req.body.password
  const ifExists = await User.findOne({ userName: userName })

  if (!ifExists) {
    await User.create({
      userName: userName,
      password: password
    })
    const token = jwt.sign({ userName: userName }, JWT_SECRET)
    res.json({
      message: 'User created successfully',
      token: token
    })
  }
  else {
    res.json({
      message: "User already exists"
    })
  }
});

router.post('/login', async (req, res) => {
  const userName = req.body.userName
  const password = req.body.password
  const ifExists = await User.findOne({ userName: userName })
  if (ifExists) {
    const validateCreds = await User.findOne({ userName: userName, password: password })
    if (validateCreds) {
      var token = jwt.sign({ userName: userName }, JWT_SECRET)
      res.status(200).json({
        message: "User logged in successfully",
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
router.get('/courses', async (req, res) => {
  const courses = await Course.findOne({})
  res.status(200).json({
    output: courses
  })
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
  const courseId = req.params.courseId
  const userName = req.headers.username
  await User.updateOne({
    userName: userName,
  },
    {
      "$push": {
        purchasedCourses: courseId
      }
    }
  )
  res.status(200).json({
    message: "Course Purchsed Sucessfully",
    courseId: courseId
  })
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
  const userName = req.headers.username
  const UserDetails = await User.findOne({ userName: userName })
  const courses = await Course.find({
    _id: {
      "$in": UserDetails.purchasedCourses
    }
  });
  res.status(200).send(courses)
});

module.exports = router