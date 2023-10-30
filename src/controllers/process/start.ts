import { kafkaProcessor } from '../../main.ts';

export const startProcess = async (req, res) => {
  console.log(req.body);
  kafkaProcessor.start();
  res.send({ status: 'RUNNING' });
};
