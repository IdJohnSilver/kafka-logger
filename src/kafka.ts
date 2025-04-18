import { Kafka } from "kafkajs";

export const kafka = new Kafka({
    clientId: 'logger-app',
    brokers: ['localhost:9092', 'localhost:9094'],
    // brokers: ['185.102.74.250:9092', '185.102.74.250:9094'],
});

export const kafkaAdmin = kafka.admin();