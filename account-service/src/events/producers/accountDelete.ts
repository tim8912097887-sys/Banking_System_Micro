import { USER_TOPICS } from "@/constants/index.js"
import { producer } from "../kafka.js"
import { logger } from "@/configs/logger.js";


export const publishAccountDelete = async(data: any) => {

    const topic = USER_TOPICS.ACCOUNT_DELETED;

    logger.info(`Publishing message to topic ${topic} with message ${JSON.stringify(data.value)}`);

    await producer.send({
        topic,
        messages: [
            {
                key: data.key,
                value: JSON.stringify(data.value)
            }
        ]
    })

}