const express = require('express');
const hpp = require('hpp');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
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
  origin: ['http://localhost:3000'], // replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies to be sent and received
};

app.use(cors(corsOptions));
app.use(mongoSanitize());
app.use(limiter);
app.use(xss());
app.use(hpp());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [
          "'self'",
          'https://api.themoviedb.org',
          'https://*.tmdb.org',
        ],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://cdn.example.com',
          'https://api.themoviedb.org',
          'https://*.tmdb.org',
        ],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: [
          "'self'",
          'data:',
          'https:',
          'https://api.themoviedb.org',
          'https://*.tmdb.org',
          'https://image.tmdb.org',
        ],
        frameSrc: [
          "'self'",
          'https://*.youtube.com',
          'https://*.embed.su', // Explicitly allow embed.su domains
          'https://embed.su', // Include the base domain as well
          'https://api.themoviedb.org',
          'https://*.tmdb.org',
        ],
        connectSrc: [
          "'self'",
          'https://api.themoviedb.org',
          'https://*.tmdb.org',
        ],
        fontSrc: ["'self'", 'https:'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);
app.use(morgan('dev'));

app.use('/api/auth', authRouter);
const frontendPath = path.resolve(__dirname, '..', 'Frontend', 'build');
app.use(express.static(frontendPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});
app.use(errorHandler);
const server = app.listen(PORT, () => {
  console.log(`Server started listening at port ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
  server.close(() => {
    process.exit(1);
  });
});
