const express = require("express")
const bodyParser = require("body-parser")

const app = express()
app.use(bodyParser.json())
let todoList = []
let id = 0
app.get('/todos', (req, res) => {
  res.status(200).send(todoList)
})

app.get('/todos/:id', (req, res) => {
  const todoItem = todoList.filter(x => x.id === Number(req.params.id))
  if (todoItem.length === 0)
    return res.status(404).json({msg: 'Not Found'})
  else
    return res.status(200).json(todoItem)
})

app.post('/todos', (req, res) => {
  id++
  const newTodoItem = {
    id: id,
   name: req.body.name,
   description: req.body.description,
   completed: req.body.completed,
  }
  todoList.push(newTodoItem)
  return res.status(201).json({ id: newTodoItem.id })
})

app.put('/todos/:id', (req, res) => {
  const toDoItemId = Number(req.params.id)
  const body = req.body
  const updatingItemIndex = todoList.findIndex(x => x.id === toDoItemId)
  if(updatingItemIndex !== -1) {
    todoList[updatingItemIndex].completed = body.completed,
    todoList[updatingItemIndex].name =  body.name,
    todoList[updatingItemIndex].description = body.description
    return res.status(200).send(todoList[updatingItemIndex])
  }
  else
  return res.status(404).json({msg: 'Not Found'})
})

app.delete('/todos/:id', (req, res) => {
  const toDoItemId = Number(req.params.id)
  const deletingItemIndex = todoList.findIndex(x => x.id === toDoItemId)
  if(deletingItemIndex !== -1) {
    todoList.pop(todoList[deletingItemIndex])
    return res.status(200).send(todoList)
  }
  else
  return res.status(404).json({msg: 'Not Found'})
})

app.listen(3000, () => console.log("Server is running in PORT 3000"))