import { Connection, PublicKey, ParsedTransactionWithMeta } from '@solana/web3.js';
import { Server } from 'socket.io';
import prisma from '../utils/prisma'; // Import Prisma client

export class RaydiumListener {
    private connection: Connection | null;
    private RAYDIUM_AMM_PROGRAM_ID: PublicKey;
    private io: Server;
    private ammName: string;

    constructor(io: Server) {
        this.io = io;
        this.RAYDIUM_AMM_PROGRAM_ID = new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8');
        this.ammName = 'raydium';
        this.connection = null;
    }

    async startListening() {
        const amm = await prisma.aMM.findUnique({
            where: {
                name: this.ammName
            }
        });


        if (!amm) {
            console.error(`AMM with name ${this.ammName} not found`);
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

        if (!network.rpcUrl || !network.wsUrl) {
            console.error(`Network with id ${amm.networkId} does not have RPC or WS URL`);
            return;
        }

        this.connection = new Connection(network.rpcUrl, {
            wsEndpoint: network.wsUrl,
            commitment: 'finalized',
        });

        console.log("Starting RaydiumListener");
        this.connection.onLogs(this.RAYDIUM_AMM_PROGRAM_ID, async (logInfo) => {
            const { logs, signature } = logInfo;
            if (logs.some(log => log.includes('initialize2'))) {
                console.log(`New liquidity pool created. Transaction signature: ${signature}`);
                this.io.emit('newPool', { signature });
                await this.fetchPoolDetails(signature, amm.id);
            }
        }, 'finalized');
    }

    private async fetchPoolDetails(signature: string, ammId: number): Promise<void> {
        if (!this.connection) {
            console.error('Connection not initialized');
            return;
        }

        const transaction: ParsedTransactionWithMeta | null = await this.connection.getParsedTransaction(signature, {
            commitment: 'confirmed',
            maxSupportedTransactionVersion: 0
        });

        if (transaction) {
            const instruction = transaction.transaction.message.instructions.find(
                (instr) => instr.programId.equals(this.RAYDIUM_AMM_PROGRAM_ID)
            );

            if (instruction) {
                let accounts: string[] = [];
                if ('accounts' in instruction) {
                    accounts = instruction.accounts.map((acc: PublicKey) => acc.toBase58());
                } else if ('parsed' in instruction && 'info' in instruction.parsed) {
                    accounts = instruction.parsed.info.accounts.map((acc: string) => acc);
                }
                const [tokenA, tokenB, pairAddress] = [accounts[8], accounts[9], accounts[4]];
                console.log(`New pool with Token A: ${tokenA} and Token B: ${tokenB} and pairAddress: ${pairAddress} and accounts: ${accounts}`);
                this.io.emit('newPoolDetails', { tokenA, tokenB, pairAddress });

                // Save to database
                try {
                    const networkId = 2;
                    await prisma.swapPair.create({
                        data: {
                            token0Id: await this.createOrGetTokenId(tokenA, networkId),
                            token1Id: await this.createOrGetTokenId(tokenB, networkId),
                            ammId: ammId,
                            pairAddress: pairAddress
                        }
                    });
                    console.log('Pool saved to database');
                } catch (error) {
                    console.error('Error saving pool to database:', error);
                }
            }
        }
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
} 