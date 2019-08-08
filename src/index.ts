import { delay, OnError, ReceiveMode, ServiceBusClient, ServiceBusMessage } from '@azure/service-bus'
import config from '../config.json'

async function main(): Promise<void> {
    const client = ServiceBusClient.createFromConnectionString(config.connectionString)
    await sendMessage(client, 'session-1', 'test')
    await receiveMessages(client, 'session-1')
}

async function sendMessage(sbClient: ServiceBusClient, sessionId: string, body: string): Promise<void> {
    // https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/servicebus/service-bus/#key-concepts
    const queueClient = sbClient.createQueueClient(config.queueName)
    const sender = queueClient.createSender()

    await sender.send({
        body,
        label: 'Test',
        sessionId
    })

    await queueClient.close()
}

async function receiveMessages(sbClient: ServiceBusClient, sessionId: string): Promise<void> {
    // https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/servicebus/service-bus/#receive-messages
    const queueClient = sbClient.createQueueClient(config.queueName)
    const receiver = queueClient.createReceiver(ReceiveMode.peekLock, { sessionId })

    // https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/servicebus/service-bus/#register-message-handler
    const onMessage = async (brokeredMessage: ServiceBusMessage) => {
        console.log(`Received: ${brokeredMessage.sessionId} - ${brokeredMessage.body} `)
    }
    const onError: OnError = (err): void => {
        console.log('>>>>> Error occurred: ', err)
    }
    receiver.registerMessageHandler(onMessage, onError)
    await delay(5000)

    await queueClient.close()
}

main().catch(err => {
    console.log('Error occurred: ', err)
})
