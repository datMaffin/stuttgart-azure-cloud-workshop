import * as bodyparser from 'body-parser'
import express, { NextFunction, Request, Response } from 'express'

const port = 8080

const loggerMiddleware = (request: Request, _response: Response, next: NextFunction) => {
    console.log(`${request.method} ${request.path}`)
    next()
}

const app = express()
app.use(loggerMiddleware)
app.use(bodyparser.json())

// define a route handler for the default home page
app.post('/', (request: Request, response: Response) => {
    if (request.body.bike === undefined) {
        response.status(400).send('Not a bike')
    } else {
        response.status(200).json(request.body.bike)
    }
})

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`)
})
