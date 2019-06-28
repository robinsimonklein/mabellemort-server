const express = require('express');
var messagesCtrl = require('./routes/messagesCtrl');

// Router

exports.router = (() => {
    let apiRouter = express.Router();

    // Messages routes
    apiRouter.route('/messages').post(messagesCtrl.messages);
    apiRouter.route('/choices').post(messagesCtrl.userChoices);

    return apiRouter;
})();