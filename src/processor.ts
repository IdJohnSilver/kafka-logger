// @ts-nocheck
import { Consumer, KafkaMessage } from 'kafkajs';
import { kafka } from './kafka.ts';
import sql from 'mssql';
import sqlService, { GROUP_ID, TOPIC_ID } from './main.ts';

type ProcessorStatusType = 'RUNNING' | 'STOPPED';
export class KafkaProcessor {
  private status: ProcessorStatusType;
  private groupId: string;
  private topic: string;
  private maxBatchSize: number;
  private processFromBeginning: boolean;
  private consumer: Consumer;

  constructor({ maxBatchSize = 50, processFromBeginning = false }) {
    this.groupId = GROUP_ID;
    this.topic = TOPIC_ID;
    this.maxBatchSize = maxBatchSize;
    this.processFromBeginning = processFromBeginning;
  }

  private bulkInsert(messageList: KafkaMessage[]): Promise<sql.IBulkResult> {
    const logTable = new sql.Table('TMP_LOG_TABLE');
    logTable.columns.add('LOG_DATETIME', sql.DateTime2());
    logTable.columns.add('LOG_ID', sql.VarChar(50));
    logTable.columns.add('LOG_TEXT', sql.VarChar(1000));
    logTable.columns.add('LOG_OFFSET', sql.BigInt());

    messageList.forEach((message: KafkaMessage) => {
      logTable.rows.add(
        new Date(+message.timestamp),
        `ID-${message.timestamp}`,
        `${message.value}`,
        message.offset,
      );
    });

    const request = sqlService.getPool().request();
    return new Promise((resolve, reject) => {
      request.bulk(logTable, (err, result) => {
        if (err) {
          reject('BULK ERROR: ' + err.message);
          return;
        }
        resolve(result);
      });
    });
  }

  public async start() {
    this.status = 'RUNNING';
    await this.process();
  }

  public async stop() {
    this.status = 'STOPPED';
    await this.consumer.stop();
    await this.consumer.disconnect();
  }

  public getStatus() {
    return this.status;
  }

  public async init() {
    this.consumer = kafka.consumer({ groupId: this.groupId });
  }

  public async process(): Promise<void> {
    if (this.status === 'STOPPED') {
      return;
    }
    await this.consumer.connect();
    // await this.consumer.subscribe({
    //   topic: this.topic,
    //   fromBeginning: this.processFromBeginning,
    // });
    // let currentBatch: KafkaMessage[] = [];
    // await this.consumer.run({
    //   autoCommit: false,
    //   eachMessage: async ({ message, partition }) => {
    //     console.log({
    //       value: message.value.toString(),
    //       datetime: message.timestamp,
    //     });
    //     currentBatch.push(message);
    //     if (currentBatch.length >= this.maxBatchSize) {
    //       console.log('PROCESSOR:: pause consumer');
    //       this.consumer.pause([{ topic: this.topic }]);
    //       console.log('PROCESSOR:: writing to db');
    //       await this.bulkInsert(currentBatch);
    //       this.consumer.commitOffsets([
    //         {
    //           topic: this.topic,
    //           partition: partition,
    //           offset: currentBatch[currentBatch.length - 1].offset,
    //         },
    //       ]);
    //       currentBatch = [];
    //       this.consumer.resume([{ topic: this.topic }]);
    //       console.log('PROCESSOR:: resume consumer');
    //     }
    //   },
    // });
    // return this.status;
  }
}
