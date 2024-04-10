const express = require('express')
const app = express()
const path = require('path')

const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.static('public'))

let todos = [
	{ id: 1, item: 'Learn JavaScript', complete: false },
	{ id: 2, item: 'Learn Express', complete: false },
	{ id: 3, item: 'Build a To Do App', complete: false }
]

app.get('/', (_, response) => {
	response.sendFile('index.html', { root: path.join(__dirname, 'public') })
})

app.get('/api/todos', (_, response) => {
    response.json(todos)
})

app.post('/api/todos', (request, response) => {
    const { item, complete } = request.body
    todos.push({ id: todos.length + 1, item, complete })
    response.json({ message: 'List item added!' })
})

app.put('/api/todos/:id', (request, response) => {
    const { id } = request.params
    const { item, complete } = request.body
    todos = todos.map(todo => todo.id.toString() === id ? { id: parseInt(id), item, complete } : todo)
    response.json({ message: 'List item updated!' })
})

app.get('/api/todos/random/exclude/:id', (request, response) => {
    const { id } = request.params
    const filteredTodos = todos.filter(todo => todo.id.toString() !== id)
    if (filteredTodos.length === 0) {
        return response.json(null)
    }
    const randomIndex = Math.floor(Math.random() * filteredTodos.length)
    response.json(filteredTodos[randomIndex])
})

app.use((request, response) => {
    response.status(404).sendFile('404.html', { root: path.join(__dirname, 'public') })
})

const message = `Server running: http://localhost:${port}`
app.listen(port, () => console.log(message))
