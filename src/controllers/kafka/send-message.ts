import { kafka } from '../../kafka.ts';
import { Partitioners } from 'kafkajs';
import { TOPIC_ID } from '../../main.ts';

export const sendMessageController = async (req, res) => {
  console.log(req.body);
  const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
  });

  await producer.connect();

  for (let i = 0; i < 5; i++) {
    await producer.send({
      topic: TOPIC_ID,
      messages: [{ value: `Hello KafkaJS user! Message ${i + 1}` }],
    });
    console.log(`Message ${i + 1} sent`);
  }

  await producer.disconnect();
  res.send('Messages sent successfully');
};
