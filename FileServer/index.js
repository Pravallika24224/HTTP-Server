const express = require("express")
const body = require("body-parser")
const fs = require("fs")

const app = express()

app.get('/files', (req, res) => {
  const files = fs.readdirSync('./files')
  // res.json({
  //   status: "200 OK",
  //   data: files
  // })
  if (files !== null)
    res.status(200).send(files)
  else
    res.status(500).send({})
})

app.get('/files/:fileName', (req, res) => {
  const fileName = req.params.fileName
  fs.readFile(`./files/${fileName}`, 'utf-8', (err, data) => {
    console.log(err, data)
    if(err === undefined)
    return res.status(200).send(data)
    else
    return res.status(404).send('File not Found')
  })
})

app.listen(3000, () => {
  console.log("Listening to post 3000")
})