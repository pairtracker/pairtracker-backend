import { ethers } from "ethers";

// Binance Smart Chain Mainnet RPC URL (use Infura, Alchemy or other providers)
const BSC_RPC_URL: string = "https://bsc-dataseed.binance.org/";

// Create a provider
const provider: ethers.JsonRpcProvider = new ethers.JsonRpcProvider(BSC_RPC_URL);

// PancakeSwap Factory contract address and ABI
const FACTORY_ADDRESS: string = "0xCA143Ce32Fe78f1f7019d7d551a6402fC5350c73"; // PancakeSwap factory address

const FACTORY_ABI: string[] = [
    "event PairCreated(address indexed token0, address indexed token1, address pair, uint)"
];

// Create a contract instance
const factoryContract: ethers.Contract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);

const fetchPairInfo = async (pair: string, token0: string, token1: string): Promise<void> => {
    const PAIR_ABI: string[] = [
        "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
        "function token0() external view returns (address)",
        "function token1() external view returns (address)",
    ];

    // Create a contract instance for the new pair
    const pairContract: ethers.Contract = new ethers.Contract(pair, PAIR_ABI, provider);

    try {
        // Fetch reserves from the pair contract
        const [reserve0, reserve1]: [ethers.BigNumberish, ethers.BigNumberish] = await pairContract.getReserves();

        // Calculate the price based on the reserves
        const reserve0BN: bigint = ethers.toBigInt(reserve0);
        const reserve1BN: bigint = ethers.toBigInt(reserve1);
        const price: bigint = reserve1BN / reserve0BN;  // Price of token0 in terms of token1

        console.log(`Price: ${price}`);
        console.log(`Liquidity: ${reserve0BN.toString()} ${token0}, ${reserve1BN.toString()} ${token1} -----------------\n`);
    } catch (error) {
        console.error("Error calculating price:", error);
    }
};

// Listen for PairCreated event
factoryContract.on("PairCreated", (token0: string, token1: string, pair: string) => {
    console.log(`-------------- \n New Pair Created: ${token0} - ${token1} at pair address: ${pair}`);

    // You can handle additional logic here, like fetching initial liquidity and price
    const pancakeSwapLink: string = `https://pancakeswap.finance/swap?outputCurrency=${token0}&inputCurrency=${token1}`;
    console.log(`PancakeSwap Trading Link: ${pancakeSwapLink}`);

    fetchPairInfo(pair, token0, token1);
});