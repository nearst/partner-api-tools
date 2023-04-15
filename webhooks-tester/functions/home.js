import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });

export const handler = async () => {
    // Get recent inventory items
    const command = new ScanCommand({
        TableName: process.env.TABLE_NAME,
        Limit: 100
    });
    const { Items } = await client.send(command);

    // Render HTML
    const rows = Items.map((item) => {
        const inventoryItem = unmarshall(item);
        const imageUrl = inventoryItem.product?.images?.[0]
        return `
            <tr>
                <td>${imageUrl ? `<img src="${imageUrl}" height="100" />` : ''}</td>
                <td>${inventoryItem.id}</td>
                <td>${inventoryItem.barcode}</td>
                <td>${inventoryItem.price}</td>
                <td>${inventoryItem.status}</td>
                <td><pre>${JSON.stringify(inventoryItem.product, null, 2)}</p></td>
            </tr>
        `;
    }).join('');

    const html = ` 
        <h2>Webhook setup</h2>
        <p>Add a webhook with <code>enhancedProductData</code> set to true, and the following URL:</p>
        <pre>${process.env.APP_URL}/webhook</pre>
        <p><a href="https://developers.near.st/partner-api/endpoints/channels/webhooks">Read the docs &rarr;</a></p>
        
        <h2>Iventory items</h2>
        <p>First ${Items.length} items received:</p>
        <table cellspacing="0">
            <thead>
                <tr>
                    <th colspan="2">ID</th>
                    <th>Barcode</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Product</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
        
        <meta http-equiv="refresh" content="5" />
        
        <style>
            body {
                font-family: Helvetica;
                margin: 4rem; 
            }
            h2 {
                margin-top: 4rem;
            }
            a {
                color: #4d7cdc;
                text-decoration: none;
            }
            table {
                width: 100%;
            }
            td, th {
                border-top: 1px solid #eee;
                padding: 1rem;
                padding-left: 0;
                overflow: hidden;
                font-size: 0.9rem;
                text-align: left;
            }
            th {
                border-bottom: 1px solid #eee;
            }
        </style>
    `;

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html'
        },
        body: html
    };
};
