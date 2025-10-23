import express from 'express';
import { prisma } from '../db.js';

const historyRouter = express.Router();

// 1. GET /api/history - Get all items in the user's viewing history
historyRouter.get('/', async (req, res) => {
  try {
    const items = await prisma.viewingHistory.findMany({
      where: { userId: req.userId },
      orderBy: { viewedAt: 'desc' },
    });
    res.json(items);
  } catch (err) {
    console.error('Error fetching viewing history:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. POST /api/history - Add a new item to the user's viewing history
historyRouter.post('/', async (req, res) => {
  const { tmdbId } = req.body; 

  if (!tmdbId) {
    return res.status(400).json({ error: 'tmdbId is required to add to viewing history.' });
  }

  try {
    // Create a new viewing history entry (viewedAt defaults to now)
    const newItem = await prisma.viewingHistory.create({
      data: {
        userId: req.userId,
        tmdbId: parseInt(tmdbId),
      },
    });
    res.status(201).json(newItem);

  } catch (err) {
    // Handle the unique constraint violation
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'This item is already in your viewing history.' });
    }
    console.error('Error adding to viewing history:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. DELETE /api/history/:tmdbId - Remove an item from the user's viewing history
historyRouter.delete('/:tmdbId', async (req, res) => {
  const tmdbId = parseInt(req.params.tmdbId);

  try {
    const deletedItem = await prisma.viewingHistory.deleteMany({
      where: {
        userId: req.userId,
        tmdbId: tmdbId,
      },
    });

    if (deletedItem.count === 0) {
      return res.status(404).json({ error: 'Item not found in your viewing history.' });
    }

    res.status(200).json({ message: 'Item removed from viewing history successfully.' });
  } catch (err) {
    console.error('Error removing from viewing history:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default historyRouter;
