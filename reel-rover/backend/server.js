import { prisma, testPrismaConnection } from './db.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import contentRouter from './routes/content.js';
import authRouter from './routes/auth.js'; 
import watchlistRouter from './routes/watchlist.js'; 
import historyRouter from './routes/history.js'; 

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware
app.use(cors());
app.use(express.json());

// --- AUTHORIZATION MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  // Get token from "Bearer TOKEN" format
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }

    // Attach user data to request
    req.userId = user.userId;
    req.email = user.email;

    next();
  });
};

// --- API Routes ---

app.get('/', (req, res) => {
  res.send('Welcome to the Reel Rover API (Prisma Ready)');
});

// Authentication routes
app.use('/api/auth', authRouter);

// PHASE 2: CONTENT ROUTES (Protected by authenticateToken)
app.use('/api/watchlist', authenticateToken, watchlistRouter);
app.use('/api/history', authenticateToken, historyRouter);

//external route
app.use('/api/content', contentRouter);

const startServer = async () => {
    try {
        console.log('Attempting to connect to Supabase via Prisma...');

        await testPrismaConnection();
        app.listen(port, () => {
            console.log(`Server is now running on port ${port}`);
            console.log(`Open http://localhost:${port} in your browser.`);
        });

    } catch (err) {
        console.error('❌ FATAL ERROR: Server failed to start due to database connection issue.', err.message);
        process.exit(1); 
    }
};

startServer();
