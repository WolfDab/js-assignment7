const express = require('express')
const router = express.Router()
const { MongoClient, ObjectId } = require('mongodb')

const url = process.env.MONGODB_URI || require('./secrets/mongodb.json').url
const client = new MongoClient(url)

const getCollection = async (todoAPI) => {
    await client.connect()
    return client.db('todoAPI').collection(todoAPI)
}

router.get('/random/exclude/:id', async (request, response) => {
    const { id } = request.params
    const collection = await getCollection('todos')
    const todos = await collection.find().toArray()
    const filteredTodos = todos.filter(todo => todo._id.toString() !== id)
    if (filteredTodos.length === 0) {
        return response.json(null)
    }
    const randomIndex = Math.floor(Math.random() * filteredTodos.length)
    response.json(filteredTodos[randomIndex])
})

router.post('/new', async (request, response) => {
    const { item, complete } = request.body
    const collection = await getCollection('todos')
    const result = await collection.insertOne({ item, complete })
    response.json({ message: 'List item added!' })
})

router.get('/:id', async (request, response) => {
    const { id } = request.params
    const collection = await getCollection('todos')
    const todo = await collection.findOne({ _id: new ObjectId(id) })
    response.json(todo)
})

router.put('/:id', async (request, response) => {
    const { id } = request.params
    const collection = await getCollection('todos')
    const todo = await collection.findOne({ _id: new ObjectId(id) })
    if (!todo) {
        return response.status(404).json({ message: 'Todo not found' })
    }
    const complete = !todo.complete
    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { complete } })
    response.json({ message: 'List item updated!' })
})

module.exports = router
