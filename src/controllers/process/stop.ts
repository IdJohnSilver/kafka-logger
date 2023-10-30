import { kafkaProcessor } from '../../main.ts';

export const stopProcess = async (req, res) => {
  console.log(req.body);
  kafkaProcessor.stop();
  res.send({ status: 'RUNNING' });
};
