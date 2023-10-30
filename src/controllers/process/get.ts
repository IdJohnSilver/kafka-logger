import { kafkaProcessor } from '../../main.ts';
import { Request, Response } from 'express';

export const getProcessStatus = async (req: Request, res: Response) => {
  console.log(req.body);
  res.send({ status: kafkaProcessor.getStatus() });
};
