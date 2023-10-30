import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { SQL } from './sql.ts';
import { sendMessageController } from './controllers/kafka/send-message.ts';
import { topicList } from './controllers/kafka/admin/topic-list.ts';
import { groupList } from './controllers/kafka/admin/group-list.ts';
import { resetOffsets } from './controllers/kafka/admin/reset-offsets.ts';
import { createTopic } from './controllers/kafka/admin/create-topic.ts';
import { KafkaProcessor } from './processor.ts';
import { getProcessStatus } from './controllers/process/get.ts';
import { startProcess } from './controllers/process/start.ts';
import { stopProcess } from './controllers/process/stop.ts';

dotenv.config();
const app = express();
const jsonParser = bodyParser.json();

export const GROUP_ID: string = 'consumer_group_1';
export const TOPIC_ID: string = 'topic_1';

const PROCESS_BATCH_SIZE = 1000;
const sqlService = new SQL();
const kafkaProcessor = new KafkaProcessor({
  maxBatchSize: PROCESS_BATCH_SIZE,
  processFromBeginning: false,
});

app.get('/kafka/admin/topicList', jsonParser, topicList);
app.get('/kafka/admin/groupList', jsonParser, groupList);
app.get('/kafka/admin/resetOffsets', jsonParser, resetOffsets);
app.get('/kafka/admin/createTopic', jsonParser, createTopic);

app.get('/kafka/sendMessage', jsonParser, sendMessageController);

app.get('/process/status', jsonParser, getProcessStatus);
app.get('/process/start', jsonParser, startProcess);
app.get('/process/stop', jsonParser, stopProcess);

app.listen(8080, async () => {
  try {
    await sqlService.connect({
      database: process.env.DB_NAME,
      server: process.env.DB_SERVER,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      options: {
        trustServerCertificate: true,
      },
    });
  } catch (e) {
    console.error(e.message);
    throw new Error(
      `SQL ERROR: unable connect to database ${process.env.DB_NAME}`,
    );
  }

  await kafkaProcessor.init();
  await kafkaProcessor.start();

  console.log(`Server is running on port 8080.`);
});

export { kafkaProcessor };
export default sqlService;
