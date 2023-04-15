import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb"
import { marshall } from "@aws-sdk/util-dynamodb";


const client = new DynamoDBClient({ region: "eu-west-1" });

export const handler = async (event) => {
    const body = JSON.parse(event.body);
    console.log(body);

    if (body.action !== "inventory.update") {
        console.log('Ignoring action', body.action);
        return { ok: true };
    }

    const command = new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: marshall(body.data)
    });
    await client.send(command);

    return { ok: true };
};
