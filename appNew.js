const express = require('express');
const cors = require('cors');
const appNew = express();
const port = 3000;

// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

const dialogflow = require('dialogflow');
const uuid = require('uuid');
const dotenv = require('dotenv').config();

const projectId = 'mabellemort-6e5b9';

console.log('projectId :', projectId);

/* Express config */

appNew.use(cors());

appNew.get('/', (req, res) => res.send('Hello World!'));

const server = appNew.listen(port, () => console.log(`Server listening on port ${port}!`));

const io = require('./socket').init(server);

io.on('connection', socket => {
    console.log('connection');

    socket.on('dialogflow request', (text) => {
        dialogflowRequest(projectId);
    });
});



// Creates a client
const storage = new Storage();

/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
const bucketName = 'bucket-name';

async function createBucket() {
    // Creates the new bucket
    await storage.createBucket(bucketName);
    console.log(`Bucket ${bucketName} created.`);
}

createBucket();

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */

async function dialogflowRequest(projectId) {
    // A unique identifier for the given session
    const sessionId = uuid.v4();

    // Create a new session
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    /*
    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: 'bonjour',
                // The language used by the client (en-US)
                languageCode: 'fr-FR',
            },
        },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
        console.log(`  Intent: ${result.intent.displayName}`);
    } else {
        console.log(`  No intent matched.`);
    }

     */
}

dialogflowRequest(projectId);

