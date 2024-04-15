const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db")
const router = Router();


async function userExists(userName) {
  try {
    const data = await Admin.findOne({ userName: userName }).exec();
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


// Admin Routes
router.post('/signup', async (req, res) => {
  const userName = req.body.userName
  const password = req.body.password
  const isExist = await userExists(userName)
  if (!isExist) {
    await Admin.create({
      userName: userName,
      password: password
    })
    res.json({
      message: 'Admin created successfully'
    })
  }
  else {
    res.json({
      message: "User already exists"
    })
  }
});

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