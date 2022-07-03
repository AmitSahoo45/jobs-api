require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const auth = require('./middleware/authentication');

// connectDB
const connectDB = require('./db/connect');

// routers
const authenticationRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());

app.use('/api/v1/auth', authenticationRouter);
app.use('/api/v1/jobs', auth, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3500;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
