import { kafka } from '../../kafka.ts';
import { Partitioners } from 'kafkajs';
import { TOPIC_ID } from '../../main.ts';

export const sendMessageController = async (req, res) => {
  console.log(req.body);
  const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
  });

  await producer.connect();
  await producer.send({
    topic: TOPIC_ID,
    messages: [{ value: 'Hello KafkaJS user!' }],
  });

  await producer.disconnect();
  res.send('OK');
};
