import { Router } from 'express';
import prisma from '../utils/prisma';

const router = Router();

router.post('/networks', async (req, res) => {
  const { name, rpcUrl, explorerUrl } = req.body;
  try {
    const network = await prisma.network.create({
      data: {
        name,
        rpcUrl,
        explorerUrl,
      },
    });
    res.json(network);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/networks', async (req, res) => {
  const networks = await prisma.network.findMany();
  res.json(networks);
});

export default router;