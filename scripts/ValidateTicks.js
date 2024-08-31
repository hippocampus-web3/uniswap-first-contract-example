const IUniswapV3PoolABI = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json').abi;

async function main() {
    // Dirección del pool de Uniswap V3
    const poolAddress = "0x5E9BB3d7682A9537DB831060176C4247aB80D1Ec"; // Reemplaza con la dirección del pool

    // Configurar el contrato del pool
    const provider = ethers.provider;
    const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, provider);

    // Obtener el tickSpacing del pool
    const tickSpacing = await poolContract.tickSpacing();
    console.log("Tick Spacing del pool:", tickSpacing);

    // Verificar si los ticks son válidos
    const tickLower = -244400;
    const tickUpper = -240400;

    if (tickLower % tickSpacing !== 0 || tickUpper % tickSpacing !== 0) {
        console.error("Los ticks no son válidos: deben ser múltiplos del tickSpacing.");
    } else if (tickLower >= tickUpper) {
        console.error("Los ticks no son válidos: tickLower debe ser menor que tickUpper.");
    } else {
        console.log("Los ticks son válidos.");
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
