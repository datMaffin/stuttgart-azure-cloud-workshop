import { OnError, Sender, ServiceBusClient, ServiceBusMessage } from '@azure/service-bus'
import * as bodyparser from 'body-parser'
import express, { NextFunction, Request, Response } from 'express'

import { connectionString, queueName } from '../config.json'

const port = 8080

const loggerMiddleware = (request: Request, _response: Response, next: NextFunction) => {
    console.log(`${request.method} ${request.path}`)
    next()
}

const app = express()
app.use(loggerMiddleware)
app.use(bodyparser.json())

const client = ServiceBusClient.createFromConnectionString(connectionString)
const queueClient = client.createQueueClient(queueName)
const sender = queueClient.createSender()

// define a route handler for the default home page
app.post('/', async (request: Request, response: Response) => {
    if (request.body.bike === undefined) {
        response.status(400).send('Not a bike')
    } else {
        const bike: string = request.body.bike
        sender
            .send({
                body: bike,
                label: 'Test'
            })
            .then(() => {
                response.sendStatus(200)
            })
            .catch(err => {
                response.status(500).send(err)
            })

        // Dont wait for the queueClient to close as we always create a new one
        queueClient.close().catch(err => console.log(err))
    }
})

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`)
})
