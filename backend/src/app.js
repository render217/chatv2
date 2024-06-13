require('express-async-errors');
const { createServer } = require('node:http');
const morgan = require('morgan');
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);

// set cors option
const corsOption = {
  origin: process.env.CORS_ORIGIN,
  // origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
};
const io = new Server(httpServer, {
  cors: corsOption,
});

//==========================middleware============================//
app.set('io', io); // allows to access io from req.app.get('io')
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
//==========================file imports==========================//
const authRoutes = require('./routes/auth.route');
const messageRoutes = require('./routes/message.route');
const chatRoutes = require('./routes/chat.route');
//
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const { inializeSocketIO } = require('./socket');

//==========================ROUTES================================//

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'server is ok good to go' });
});
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/chat', chatRoutes);

// inialize our socket io instance
inializeSocketIO(io);

app.use('*', notFound);

app.use(errorHandler);

module.exports = httpServer;
