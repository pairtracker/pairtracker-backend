import { ethers } from "ethers";
import { Server } from "socket.io";
import prisma from '../utils/prisma'; // Import Prisma client

export class PancakeSwapListener {
    private provider: ethers.JsonRpcProvider | null;
    private factoryContract: ethers.Contract | null;
    private io: Server;

    constructor(io: Server) {
        this.io = io;
        this.provider = null;
        this.factoryContract = null;
    }

    async startListening() {
        console.log("Starting PancakeSwapListener");

        // Fetch network and AMM details similar to RaydiumListener
        const amm = await prisma.aMM.findUnique({
            where: {
                name: 'pancakeswap'
            }
        });

        if (!amm) {
            console.error(`AMM with name 'pancakeswap' not found`);
            return;
        }

        const network = await prisma.network.findUnique({
            where: {
                id: amm.networkId
            }
        });

        if (!network) {
            console.error(`Network with id ${amm.networkId} not found`);
            return;
        }

        if (!network.rpcUrl) {
            console.error(`Network with id ${amm.networkId} does not have RPC URL`);
            return;
        }

        this.provider = new ethers.JsonRpcProvider(network.rpcUrl);

        const factoryAddress = "0xCA143Ce32Fe78f1f7019d7d551a6402fC5350c73";
        const factoryABI = [
            "event PairCreated(address indexed token0, address indexed token1, address pair, uint)"
        ];

        this.factoryContract = new ethers.Contract(factoryAddress, factoryABI, this.provider);

        this.factoryContract.on("PairCreated", async (token0: string, token1: string, pair: string) => {
            console.log(`New Pair Created: ${token0} - ${token1} at pair address: ${pair}`);
            this.io.emit('newPair', { token0, token1, pair });

            // Save to database
            try {
                const networkId = amm.networkId;
                await prisma.swapPair.create({
                    data: {
                        token0Id: await this.createOrGetTokenId(token0, networkId),
                        token1Id: await this.createOrGetTokenId(token1, networkId),
                        ammId: amm.id,
                        pairAddress: pair
                    }
                });
                console.log('Pair saved to database');
            } catch (error) {
                console.error('Error saving pair to database:', error);
            }

            this.fetchPairInfo(pair, token0, token1);
        });
    }

    private async createOrGetTokenId(tokenAddress: string, networkId: number): Promise<number> {
        let token = await prisma.token.findUnique({
            where: {
                address_networkId: {
                    address: tokenAddress,
                    networkId: networkId
                }
            }
        });

        if (!token) {
            // If the token does not exist, create it
            token = await prisma.token.create({
                data: {
                    address: tokenAddress,
                    networkId: networkId,
                    // symbol: "UNKNOWN",
                    // name: "Unknown Token"
                }
            });
        }

        return token.id;
    }

    private async fetchPairInfo(pair: string, token0: string, token1: string): Promise<void> {
        const pairABI = [
            "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
            "function token0() external view returns (address)",
            "function token1() external view returns (address)",
        ];

        const pairContract = new ethers.Contract(pair, pairABI, this.provider);
        const [reserve0, reserve1] = await pairContract.getReserves();

        try {
            const reserve0BN = ethers.toBigInt(reserve0);
            const reserve1BN = ethers.toBigInt(reserve1);
            const price = reserve1BN / reserve0BN;
            console.log(`Price: ${price}`);
            console.log(`Liquidity: ${reserve0BN.toString()} ${token0}, ${reserve1BN.toString()} ${token1}`);
        } catch (error) {
            console.error("Error calculating price:", error);
        }
    }
}
