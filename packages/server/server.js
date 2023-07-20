import cors from 'cors'
import mongoose from 'mongoose'
import http from 'http'

import app from './app.js'
import apolloServer from './apollo/apolloServer.js'

const PORT = process.env.PORT ?? 9000
const GQL_PATH = process.env.GQL_PATH ?? '/gql'

app.use(cors())

mongoose.set('strictQuery', false)
mongoose.connect('mongodb://dct:test@67.205.180.46:27017/dct')

app.server = http.createServer(app)

const apollo = apolloServer(app, GQL_PATH)

await apollo.start()

apollo.applyMiddleware({
    app,
    path: GQL_PATH
})

app.server.listen(PORT, () => {
    console.log(`🍆 Server is listening at http://localhost:${PORT}`)
    console.log(`🍆 Graphql is on http://localhost:${PORT}${GQL_PATH}`)
})