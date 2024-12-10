# PairTracker Backend

PairTracker Backend is a backend service designed to monitor and track Automated Market Maker (AMM) pairs on various blockchain networks. It provides real-time updates and stores relevant data in a PostgreSQL database using Prisma ORM.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## Features

- Real-time tracking of AMM pairs on EVM, Solana, and so on.
- WebSocket support for live updates.
- REST API for accessing AMM and network data.
- Prisma ORM for database interactions.
- TypeScript for type-safe development.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express**: Web framework for Node.js.
- **Socket.io**: Real-time, bidirectional communication.
- **Prisma**: Next-generation ORM for Node.js and TypeScript.
- **TypeScript**: Typed superset of JavaScript.
- **PostgreSQL**: Relational database management system.
- **Web3**: JavaScript API for interacting with the blockchain.

## Setup and Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/pairtracker-backend.git
   cd pairtracker-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up the database:**

   Ensure you have a PostgreSQL database running. Update the `DATABASE_URL` in the `.env` file with your database connection string.

4. **Run database migrations:**

   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server:**

   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```plaintext
PORT=4000
DATABASE_URL=your_database_url
```

## Scripts

- **`npm run dev`**: Starts the development server with hot-reloading.
- **`npm run raydium`**: Starts the Raydium listener script for the test purpose.
- **`npm run pancake`**: Starts the PancakeSwap listener script for the test purpose.

## API Endpoints

- **GET /**: Returns a welcome message.
- **GET /amms**: Retrieves a list of all AMMs.
- **POST /networks**: Adds a new network.
- **GET /swap-pairs/:ammId**: Retrieves swap pairs for a specific AMM.

## Database Schema

The database schema is defined using Prisma. Key models include:

- **Network**: Represents a blockchain network.
- **AMM**: Represents an Automated Market Maker.
- **Token**: Represents a token on a network.
- **SwapPair**: Represents a pair of tokens in an AMM.
- **PairDetail**: Stores details about a swap pair.
- **TransactionHistory**: Records transaction history for swap pairs.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.
