const express = require('express');
const cors = require('cors');
const appOld = express();
const port = 3000;

const dotenv = require('dotenv').config();

const uuidv1 = require('uuid/v1');

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const AI_SESSION_ID = uuidv1();

console.log('ACCESS_TOKEN', ACCESS_TOKEN);
console.log('AI_SESSION_ID', AI_SESSION_ID);

const dialogflow = require('apiai');
const ai = dialogflow(ACCESS_TOKEN);



appOld.use(cors());

appOld.get('/', (req, res) => res.send('Hello World!'));

const server = appOld.listen(port, () => console.log(`Server listening on port ${port}!`));

const io = require('./socket').init(server);


io.on('connection', socket => {
    console.log('connection');
    socket.emit('request', () => {console.log('connect')}); // emit an event to the socket
    io.emit('broadcast', /* … */); // emit an event to all connected sockets
    socket.on('dialogflow request', (text) => {
        console.log('Message: ', text);

        // Get a reply from API.ai

        let aiReq = ai.textRequest(text, {
            sessionId: AI_SESSION_ID
        });

        aiReq.on('response', (response) => {
            let aiResponse = response.result.fulfillment.speech;
            console.log('AI Response: ' + aiResponse);
            socket.emit('dialogflow response', aiResponse);
        });

        aiReq.on('error', (error) => {
            console.log(error);
        });

        aiReq.end();
    }); // listen to the event


});