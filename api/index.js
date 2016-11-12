const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

router.get('/', function (request, response) {
  response.sendFile('index.html', { 'root': './views' });
});

module.exports = router;
