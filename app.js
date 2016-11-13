const express = require('express');
const rootRouter = require('./api/index.js');
const app = express();

app.set('port', process.env.PORT || 5000);
app.use(express.static(`${__dirname}/public`));

app.use(rootRouter);

app.listen(app.get('port'), function () {
  console.info(`Node app is running at localhost: ${app.get('port')}`);
});
