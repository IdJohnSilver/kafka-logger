import { kafkaAdmin } from '../../../kafka.ts';

export const topicList = async (req, res) => {
  console.log(req.body);
  const list = await kafkaAdmin.listTopics();
  res.send(list);
};
