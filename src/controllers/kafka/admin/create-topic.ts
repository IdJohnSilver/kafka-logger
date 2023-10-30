import { kafkaAdmin } from '../../../kafka.ts';

export const createTopic = async (req, res) => {
  const { topic } = req.body;
  await kafkaAdmin.createTopics({
    topics: [{ topic }],
  });
  const list = await kafkaAdmin.listTopics();
  res.send(list);
};
