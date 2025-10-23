import express from 'express';
import { prisma } from '../db.js';

const watchlistRouter = express.Router();

// NOTE: All routes here are automatically protected by the authenticateToken middleware
// and have the req.userId available.

// 1. GET /api/watchlist - Get all items in the user's watchlist
watchlistRouter.get('/', async (req, res) => {
  try {
    const items = await prisma.watchlist.findMany({
      where: { userId: req.userId },
      orderBy: { addedAt: 'desc' },
    });
    res.json(items);
  } catch (err) {
    console.error('Error fetching watchlist:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. POST /api/watchlist - Add a new item to the user's watchlist
watchlistRouter.post('/', async (req, res) => {
  const { tmdbId } = req.body; // Assuming the client sends the TMDB ID of the movie/show

  if (!tmdbId) {
    return res.status(400).json({ error: 'tmdbId is required to add to watchlist.' });
  }

  try {
    // Attempt to create a new watchlist entry
    const newItem = await prisma.watchlist.create({
      data: {
        userId: req.userId,
        tmdbId: parseInt(tmdbId), // Ensure tmdbId is an integer
      },
    });
    res.status(201).json(newItem);

  } catch (err) {
    // Handle the unique constraint violation (user already has this item)
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'This item is already in your watchlist.' });
    }
    console.error('Error adding to watchlist:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. DELETE /api/watchlist/:tmdbId - Remove an item from the user's watchlist
watchlistRouter.delete('/:tmdbId', async (req, res) => {
  const tmdbId = parseInt(req.params.tmdbId);

  try {
    const deletedItem = await prisma.watchlist.deleteMany({
      where: {
        userId: req.userId,
        tmdbId: tmdbId,
      },
    });

    if (deletedItem.count === 0) {
      return res.status(404).json({ error: 'Item not found in your watchlist.' });
    }

    res.status(200).json({ message: 'Item removed from watchlist successfully.' });
  } catch (err) {
    console.error('Error removing from watchlist:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default watchlistRouter;
