import { Router } from 'express';
import prisma from '../utils/prisma';

const router = Router();

router.get('/amms', async (req, res) => {
  try {
    const amms = await prisma.aMM.findMany();
    res.json(amms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/swap-pairs/:ammId', async (req, res) => {
  const { ammId } = req.params;
  try {
    const pairs = await prisma.swapPair.findMany({
      where: { ammId: parseInt(ammId, 10) },
      include: {
        token0: true,
        token1: true,
      },
    });
    res.json(pairs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
