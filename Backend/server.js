const express = require('express');
const hpp = require('hpp');
const cors = require('cors');
const helmet = require('helmet');

const morgan = require('morgan');
const errorHandler = require('./Middlewares/error');
const connectdb = require('./DB/DB');
const dotenv = require('dotenv');
const authRouter = require('./Routes/authRoutes');
const { xss } = require('express-xss-sanitizer');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const { rateLimit } = require('express-rate-limit');
const app = express();
dotenv.config({ path: './config/config.env' });
const PORT = process.env.PORT;
app.use(express.json());
connectdb();
app.use(cookieParser());
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
});

const corsOptions = {
  origin: ['https://infiniteflix.onrender.com'], // replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies to be sent and received
};

app.use(cors(corsOptions));
app.use(mongoSanitize());
app.use(limiter);
app.use(xss());
app.use(hpp());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api/auth', authRouter);
app.use(errorHandler);
const server = app.listen(PORT, () => {
  console.log(`Server started listening at port ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
  server.close(() => {
    process.exit(1);
  });
});
