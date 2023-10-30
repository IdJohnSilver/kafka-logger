import { Kafka } from "kafkajs";

export const kafka = new Kafka({
    clientId: 'logger-app',
    brokers: ['localhost:9093'],
});

export const kafkaAdmin = kafka.admin();