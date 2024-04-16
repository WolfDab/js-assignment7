const express = require('express')
const app = express()
const path = require('path')
const apiRoutes = require('./api-routes')

const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.static('public'))
const { MongoClient } = require('mongodb')

const url = process.env.MONGODB_URI || require('./secrets/mongodb.json').url
const client = new MongoClient(url)

app.use(express.json())
app.use(express.static('public'))

app.get('/', (_, response) => {
    response.sendFile('index.html', { root: path.join(__dirname, 'public') })
})

app.use('/api/todos', apiRoutes)

app.use((request, response) => {
    response.status(404).sendFile('404.html', { root: path.join(__dirname, 'public') })
})

const getCollection = async (todo, todoAPI) => {
    await client.connect()
    return client.db('todoAPI').collection(todoAPI)
}

app.locals.getCollection = getCollection

const message = `Server running: http://localhost:${port}`
app.listen(port, () => console.log(message))

app.get('/', (_, response) => {
    response.sendFile('index.html', { root: path.join(__dirname, 'public') })
})

app.use('/', apiRoutes)

app.use((request, response) => {
    response.status(404).sendFile('404.html', { root: path.join(__dirname, 'public') })
})