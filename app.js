const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const dotenv = require('dotenv').config();

const uuidv1 = require('uuid/v1');

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const AI_SESSION_ID = uuidv1();

const dialogflow = require('apiai');
const ai = dialogflow(ACCESS_TOKEN);


app.use(cors());

app.get('/', (req, res) => res.send('Hello World!'));

const server = app.listen(port, () => console.log(`Server listening on port ${port}!`));

const io = require('./socket').init(server);


io.on('connection', socket => {
    console.log('connection');
    socket.emit('request', () => {console.log('connect')}); // emit an event to the socket
    io.emit('broadcast', /* … */); // emit an event to all connected sockets
    socket.on('dialogflow request', (text) => {

        console.log('User request : ', text);

        // Get a reply from API.ai

        const aiReq = ai.textRequest(text, {
            sessionId: AI_SESSION_ID
        });

        aiReq.on('response', (response) => {
            const aiResponse = response.result.fulfillment.speech;
            console.log('AI Response: ' + aiResponse);
            socket.emit('dialogflow response', aiResponse);
        });

        aiReq.on('error', (error) => {
            console.log(error);
        });

        aiReq.end();
    }); // listen to the event


});