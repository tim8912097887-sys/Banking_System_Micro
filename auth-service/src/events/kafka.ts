import { Kafka, Partitioners } from 'kafkajs';
import { logger } from '@configs/logger.js';
import { env } from '@/configs/env.js';

const kafka = new Kafka({
  clientId: env.SERVICE_NAME,
  brokers: [env.KAFKA_BROKER],
});

export const producer = kafka.producer({
  createPartitioner: Partitioners.DefaultPartitioner,
});

export const connectKafka = async () => {
  try {
    await producer.connect();
    logger.info('Kafka producer connected');
  } catch (error) {
    logger.error('Failed to connect Kafka producer/consumer', error);
    throw error;
  }
};

export const disconnectKafka = async () => {
  try {
    await producer.disconnect();
    logger.info('Kafka producer disconnected');
  } catch (error) {
    logger.error('Failed to disconnect Kafka producer', error);
  }
};