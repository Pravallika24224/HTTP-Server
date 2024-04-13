const express = require("express")

const app = express()
app.use(express.json())


// Middlewares
function userValidationMiddleWare(req, res, next) {
  const userName = req.body.userName
  const password = req.body.password
  if(!(userName === 'Pravallika' && password === 'Pravallika@10')) {
    res.status(403).json({
      msg: 'Incorrect UserName and Password'
    })
  }
  else {
  next()
  }
}

function kidneyalidationMiddleWare(req, res, next) {
  const noOfKidneys = req.body.noOfKidneys
  if(noOfKidneys !== 1 && noOfKidneys !== 2) {
    res.status(403).json({
      msg: 'Incorrect Kidney number'
    })
  }
  else {
    next()
  }
}

app.get('/health-checkup', userValidationMiddleWare, kidneyalidationMiddleWare, (req, res) => {
  res.send("your kidney is healthy")
})

app.get('/heart-checkup', userValidationMiddleWare, (req, res) => {
  res.send("Your heart is healthy")
})

app.post('/kidney-checkup', (req, res) => {
  const noOfKidneys = req.body.noOfKidneys
  const kidneysLength = noOfKidneys.length
  res.send("You have " + kidneysLength +  " Kidneys")
})

// Global catches
// Error handling Middleware
app.use((err, req, res, next) => {
  res.json({
    msg: "Sorry something is wrong with the server"
  })
})

app.listen(3000, () => console.log("listening to port 3000"))
