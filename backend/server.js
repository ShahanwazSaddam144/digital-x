const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimit = require('express-rate-limit'); 
const botProtection = require('./middleware/bot');
const newsletter = require('./controller/newsletter');
const contact = require('./controller/contact');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// === Middlewares ===
app.use(cors());
app.use(express.json());
app.use(botProtection);

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`, req.body);
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: 'Too many requests. Please try again later.',
});
app.use(limiter);

// Contact route
app.use('/', newsletter);
app.use('/', contact);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error('❌ MongoDB error:', err));
