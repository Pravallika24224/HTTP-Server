const express = require("express")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const jwtPassword = "12345"

const app = express()
app.use(express.json())

mongoose.connect("mongodb+srv://pravallika:Pravallika%4010@cluster0.kxj574s.mongodb.net/user-app")

const User = mongoose.model('Users', {
  userName: String,
  password: String,
})

async function userExists(userName) {
  try {
    const data = await User.findOne({ userName: userName }).exec();
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

async function validateUserNameAndPassword(userName, password) {
  try {
    const data = await User.findOne({ userName: userName, password: password }).exec();
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


app.post('/signup', async (req, res) => {
  const password = req.body.password
  const userName = req.body.userName
  try {
    const user = new User({
      userName: userName,
      password: password,
    })
    const isExist = await userExists(userName)
    if (!isExist) {
      var token = jwt.sign({ userName: userName }, jwtPassword)
      user.save().then(data => {
        res.status(200).json({
          msg: "User created successfully",
          token: token
        })
      })
    }
    else {
      res.status(403).json({
        msg: "User already existes plese login"
      })
    }
  }
  catch (err) {
    res.status(400).json({
      msg: err
    })
  }
})

app.post('/login', async (req, res) => {
  const password = req.body.password
  const userName = req.body.userName
  try {
    if (await userExists(userName)) {
      const loginValidation = await validateUserNameAndPassword(userName, password)
      if (!loginValidation) {
        res.status(403).json({
          msg: "Incorrect userName or Password"
        })
      }
      else {
        var token = jwt.sign({ userName: userName }, jwtPassword)
        res.status(200).json({
          msg: "User logged in successfully",
          token: token
        })
      }
    }
    else {
      res.status(403).json({
        msg: "User does not exist please signin"
      })
    }
  }
  catch (err) {
    res.status(400).send(err)
  }
})

app.get('/allUsers', async (req, res) => {
  const token = req.headers.authorization
  try {
    const decode = jwt.verify(token, jwtPassword)
    const userName = decode.userName
    const data = await User.find({ userName: userName });
    if (data) {
      const allData = await User.find({})
      res.json({
        users: allData
      })
    }
  }
  catch (err) {
    return res.json({
      msg: "Invalid token"
    })
  }
})

app.get('/users', async (req, res) => {
  const token = req.headers.authorization
  try {
    const decode = jwt.verify(token, jwtPassword)
    const userName = decode.userName
    const data = await User.find({ userName: userName });
    if (data) {
      const allData = await User.find({})
      const filteredUsers = allData.filter(x => x.userName !== userName)
      res.json({
        users: filteredUsers
      })
    }
  }
  catch (err) {
    return res.json({
      msg: "Invalid token"
    })
  }
})

app.delete('/remove-user', async (req, res) => {
  const token = req.headers.authorization
  try {
    const decode = jwt.verify(token, jwtPassword)
    const userName = decode.userName
    const data = await User.deleteOne({ userName: userName });
    if (data.deletedCount === 1) {
      res.json({
        msg: "User deleted Successfully"
      })
    }
    else {
      res.status(400).json({
        msg: "user cannot be removed"
      })
    }
  }
  catch (err) {
    return res.json({
      msg: "Invalid token"
    })
  }
})

app.listen(3000, () => console.log("listening to port 3000"))