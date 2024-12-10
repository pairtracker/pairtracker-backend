import {
    Connection,
    ParsedInstruction,
    PartiallyDecodedInstruction,
    PublicKey,
    ParsedTransactionWithMeta
} from '@solana/web3.js';

const RAYDIUM_AMM_PROGRAM_ID: PublicKey = new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8');
const RPC_ENDPOINT: string = 'https://api.mainnet-beta.solana.com';
const WS_ENDPOINT: string = 'wss://api.mainnet-beta.solana.com';

const connection: Connection = new Connection(RPC_ENDPOINT, {
    wsEndpoint: WS_ENDPOINT,
    commitment: 'finalized',
});

connection.onLogs(RAYDIUM_AMM_PROGRAM_ID, async (logInfo: { logs: string[]; signature: string }) => {
    const { logs, signature } = logInfo;
    if (logs.some((log: string) => log.includes('initialize2'))) {
        console.log(`New liquidity pool created. Transaction signature: ${signature}`);
        // Further processing can be done here
        await fetchPoolDetails(signature);
    }
}, 'finalized');

async function fetchPoolDetails(signature: string): Promise<void> {
    const transaction: ParsedTransactionWithMeta | null = await connection.getParsedTransaction(signature, {
        commitment: 'confirmed',
        maxSupportedTransactionVersion: 0
    });

    if (transaction) {
        const instruction = transaction.transaction.message.instructions.find(
            (instr: ParsedInstruction | PartiallyDecodedInstruction) => instr.programId.equals(RAYDIUM_AMM_PROGRAM_ID)
        );

        if (instruction) {
            let accounts: string[] = [];
            if ('accounts' in instruction) {
                accounts = instruction.accounts.map((acc: PublicKey) => acc.toBase58());
            } else if ('parsed' in instruction && 'info' in instruction.parsed) {
                accounts = instruction.parsed.info.accounts.map((acc: string) => acc);
            }
            const [tokenA, tokenB] = [accounts[8], accounts[9]]; // Indices may vary
            console.log(`New pool with Token A: ${tokenA} and Token B: ${tokenB}`);
        }
    }
}