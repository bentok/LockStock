const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

router.get('/', function (request, response) {
  response.sendFile('index.html', { 'root': './views' });
});

router.get('/peerKey', function (request, response) {
  response.send({ apiKey: process.env.PEER_JS_KEY });
});

module.exports = router;
