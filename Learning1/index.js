const express = require("express")
const bodyParser = require("body-parser")
// const port = 3000
const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())

const users = [{
  name: "John",
  kidneys: [{
    healthy: false
  }
]
}]
app.get('/', (req, res) => {
  const johnKidneys = users[0].kidneys
  const numberOfKidneys = johnKidneys.length
  const numberOfHealthyKidneys = johnKidneys.filter(x => x.healthy === true).length
  const numberOfUnHealthyKidneys = johnKidneys.filter(x => x.healthy === false).length
  res.json({
    numberOfKidneys,
    numberOfHealthyKidneys,
    numberOfUnHealthyKidneys
  })
})

app.post('/', (req, res) => {
  const isHealthy = req.body.isHealthy
  users[0].kidneys.push({
    healthy: isHealthy
  })
  res.json({
    msg: "Done"
  })
})

app.put('/', (req, res) => {
  users[0].kidneys.map(x => x.healthy = true)
  res.json({
    msg: "Updated"
  })
})
app.delete('/', (req, res) => {
  users[0].kidneys = users[0].kidneys.filter(x => x.healthy === true)
  res.json({
    msg: "Deleted"
  })
})
app.post('/post', (req, res) => {
  console.log(req.body)
  // another way to send request is query parameters
  const messag = req.query.message
  res.send("hello post")
})
app.listen(port, () => {
  console.log(`Running on ${port}`)
})