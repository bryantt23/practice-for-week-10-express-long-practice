const express = require('express');
const app = express();
const dogsRouters = require('./routes/dogs');
require('express-async-errors');

app.use('/static', express.static('assets'));
app.use(express.json());

// https://codesource.io/creating-a-logging-middleware-in-expressjs/
const demoLogger = (req, res, next) => {
  res.on('finish', () => {
    // read and log the status code of the response
    console.log(req.method, req.url);
  });
  next();
};
app.use(demoLogger);

// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json(
    'Express server running. No content provided at root level. Please use another route.'
  );
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json({ h1: 123, body: req.body });
  next();
  res.end();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error('Hello World!');
});

app.use('/dogs', dogsRouters);

app.use((req, res, next) => {
  if (!req.route) {
    res.statusCode = 404;
    throw new Error("The requested resource couldn't be found");
  }
});

// https://github.com/davidbanham/express-async-errors
app.use((err, req, res, next) => {
  if (err) {
    res.status(403);
    res.json({
      error: err.message,
      statusCode: err.statusCode || 500,
      stack: err.stack
    });
  }

  next(err);
});

const port = 5000;
app.listen(port, () => console.log('Server is listening on port', port));
