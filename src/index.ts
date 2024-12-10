import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import { PancakeSwapListener } from './listeners/PancakeSwapListener';
import { RaydiumListener } from './listeners/RaydiumListener';
import ammRoutes from './routes/ammRoutes';
import networkRoutes from './routes/networkRoutes';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(cors());
app.use(express.json());

// Use routes
app.use('/api', ammRoutes);
app.use('/api', networkRoutes);

// Initialize AMM Listeners
const pancakeSwapListener = new PancakeSwapListener(io);
pancakeSwapListener.startListening();

const raydiumListener = new RaydiumListener(io);
raydiumListener.startListening();

app.get('/', (req, res) => {
  res.send('Blockchain Pair Detector Backend');
});

// Start Server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
