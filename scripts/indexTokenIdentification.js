const IUniswapV3PoolABI = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json').abi;

async function identifyTokens() {
    const provider = ethers.provider;
    const poolContract = new ethers.Contract("0x5E9BB3d7682A9537DB831060176C4247aB80D1Ec", IUniswapV3PoolABI, provider);

    // Obtener las direcciones de token0 y token1
    const token0 = await poolContract.token0();
    const token1 = await poolContract.token1();

    console.log("Token0:", token0);
    console.log("Token1:", token1);
}

identifyTokens("0xYourPoolAddressHere")
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
