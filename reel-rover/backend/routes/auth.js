import express from 'express';
// Assuming db.js is one level up
import { prisma } from '../db.js'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; 
import dotenv from 'dotenv';

dotenv.config();


const authRouter = express.Router();


const JWT_SECRET = process.env.VITE_JWT_SECRET || 'your_jwt_secret_key';

// --- Registration Route (POST /register) ---
authRouter.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password || password.length < 8) {
      return res.status(400).json({ error: 'Email is required and password must be at least 8 characters long.' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // FIX 4: Use 'const' or 'let' to declare the passwordHash variable
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash, // Use the declared constant
      },
    });

    res.status(201).json({ message: 'User registered successfully', token, userId: newUser.id });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Login Route (POST /login) ---
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare HASHED passwords
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Issue JWT 
    const token = jwt.sign(
        { userId: user.id, email: user.email }, 
        JWT_SECRET, 
        { expiresIn: '7d' } 
    );

    // 5. Send token to client
    res.status(200).json({ message: 'Login successful', token, userId: user.id });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// FIX 6: Export the Router itself, not a wrapper function
export default authRouter;
