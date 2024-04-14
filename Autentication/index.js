const express = require("express")
const jwt = require("jsonwebtoken")
const jwtPassward = "12345"

const app = express()
app.use(express.json())

const ALL_USERS = [
  {
    userName: "pravallika@gmail.com",
    password: "123",
    name: "Pothireddy Pravallika",
  },
  {
    userName: "raman@gmail.com",
    password: "123321",
    name: "Raman singh",
  },
  {
    userName: "priya@gmail.com",
    password: "123321",
    name: "Priya kumari",
  },
];

function userCheck(userName, password) {
  let userFound = false
  ALL_USERS.find(x => {
    if (x.userName === userName && x.password === password)
      return userFound = true
    else
      return userFound = false
  })
  return userFound
}
app.post('/signin', (req, res) => {
  const userName = req.body.userName
  const password = req.body.password
  userCheck(userName, password)
  if (!userCheck(userName, password)) {
    res.status(403).json({
      msg: "user doesnot exist in our in memory db"
    })
  }
  else {
    var token = jwt.sign({ userName: userName }, jwtPassward)
    res.json({
      token
    })
  }
})

app.get('/users', (req, res) => {
  const token = req.headers.authorization
  try {
    const decode = jwt.verify(token, jwtPassward)
    console.log(decode)
    const userName = decode.userName
    res.json({
      users: ALL_USERS.filter(x => x.userName !==userName)
    })
  }
  catch(err) {
    return res.json({
      msg: "Invalid token"
    })
  }
})

app.listen(3000, () => console.log("Listening to port 3000"))