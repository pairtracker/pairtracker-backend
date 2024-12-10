import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import { PancakeSwapListener } from './listeners/PancakeSwapListener';
import { RaydiumListener } from './listeners/RaydiumListener';
import prisma from './utils/prisma';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(cors());
app.use(express.json());

// Initialize AMM Listeners
const pancakeSwapListener = new PancakeSwapListener(io);
pancakeSwapListener.startListening();

const raydiumListener = new RaydiumListener(io);
raydiumListener.startListening();

app.get('/', (req, res) => {
  res.send('Blockchain Pair Detector Backend');
});

app.get('/amms', async (req, res) => {
  try {
    const amms = await prisma.aMM.findMany();
    res.json(amms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/networks', async (req, res) => {
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

app.get('/swap-pairs/:ammId', async (req, res) => {
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

// Start Server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
