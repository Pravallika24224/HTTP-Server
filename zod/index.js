const express = require('express')
const zod = require('zod')
const app = express()
app.use(express.json())

const schema = zod.array(zod.number())

// array of objects
const arrayObjectsSchema = zod.array(zod.object({
  email: zod.string().email(),
  password: zod.string().minLength(8),
  country: zod.literal('IN').or(zod.literal('US'))
}))

// custom validation messages
const dataSchema = zod.object({
  body: zod.object({
    fullName: zod.string({
      required_error: "Full name is required",
    }),
    email: zod
      .string({
        required_error: "Email is required",
      })
      .email("Not a valid email"),
  }),
});

app.get('/health-checkup', (req, res) => {
  const kidneys = req.body.kidneys
  const response = schema.safeParse(kidneys)
  if(!response.success) {
    res.json({
      msg: "invalid input"
    })
  }
  else {
    res.send(response)
  }
})

app.listen(3000, () => console.log("listening to port 3000"))