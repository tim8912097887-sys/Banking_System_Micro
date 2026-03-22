import { USER_TOPICS } from "@/constants/index.js"
import { producer } from "../kafka.js";
import { logger } from "@/configs/logger.js";


export const publishAccountCreate = async(data: any) => {

    const topic = USER_TOPICS.ACCOUNT_CREATED;

    logger.info(`Publishing message to topic ${topic} with message ${JSON.stringify(data.value)}`);

    await producer.send({
        topic,
        messages: [{
            key: data.id,
            value: JSON.stringify(data.value)
        }]
    })
}