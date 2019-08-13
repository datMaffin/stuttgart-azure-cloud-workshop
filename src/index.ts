import { OnError, ReceiveMode, ServiceBusClient, ServiceBusMessage } from '@azure/service-bus'

import { delay } from 'rhea-promise'
import { connectionString, queueName } from '../config.json'

const client = ServiceBusClient.createFromConnectionString(connectionString)
const queueClient = client.createQueueClient(queueName)
const receiver = queueClient.createReceiver(ReceiveMode.peekLock)

async function receiveMessages(sbClient: ServiceBusClient, sessionId: string): Promise<void> {
    const onMessage = async (brokeredMessage: ServiceBusMessage) => {
        console.log(`Received: ${brokeredMessage.sessionId} - ${brokeredMessage.body} `)
    }

    const onError: OnError = (err): void => {
        console.log('>>>>> Error occured: ', err)
    }
    receiver.registerMessageHandler(onMessage, onError)
    await delay(5000)
}

async function main(): Promise<void> {
    await receiveMessages(client, 'session-1')
}

main().catch(err => {
    console.log('>>>>> Error occured: ', err)
})
