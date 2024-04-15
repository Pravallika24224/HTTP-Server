const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require('../db')

async function userExists(userName) {
  try {
    const data = await User.findOne({ userName: userName })
    if (data) {
      return true;
    }
    else {
      return false
    }
  } catch (err) {
    console.error(err, "err");
    return false;
  }
}

// User Routes
router.post('/signup', async (req, res) => {
  const userName = req.body.userName
  const password = req.body.password
  const isExist = await userExists(userName)
  if (!isExist) {
    await User.create({
      userName: userName,
      password: password
    })
    res.json({
      message: 'User created successfully'
    })
  }
  else {
    res.json({
      message: "User already exists"
    })
  }
});

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
  const UserDetails = await User.findOne({userName: userName})
  const courses = await Course.find({
    _id: {
        "$in": UserDetails.purchasedCourses
    }
});
  res.status(200).send(courses)
});

module.exports = router