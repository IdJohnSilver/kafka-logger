import { kafkaAdmin } from '../../../kafka.ts';

export const groupList = async (req, res) => {
  console.log(req.body);
  const list = await kafkaAdmin.listGroups();
  res.send(list);
};
