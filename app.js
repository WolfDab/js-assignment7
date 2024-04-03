
const express = require('express')
const app = express()
const path = require('path')

const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.static('public'))

const todos = [
	{ id: 1, item: 'Learn JavaScript', complete: false },
	{ id: 2, item: 'Learn Express', complete: false },
	{ id: 3, item: 'Build a To Do App', complete: false }
]

app.get('/', (_, response) => {
	response.sendFile('index.html', { root: path.join(__dirname, 'public') })
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

app.post('/api/todos/new',  (request, response) => {
    const { item, complete } = request.body
    todos.push({ id: todos.length + 1, item, complete })
    response.json({ message: 'List item added!' })
})

app.use((request, response) => {
    response.status(404).sendFile('404.html', { root })
})

const message = `Server running: http://localhost:3000`
app.listen(port, () => console.log(message))
