import { kafkaAdmin } from '../../../kafka.ts';

export const resetOffsets = async (req, res) => {
  console.log(req.body);
  const { groupId, topic, earliest = true } = req.body;
  const result = await kafkaAdmin.resetOffsets({
    groupId,
    topic,
    earliest,
  });
  res.send(result);
};
