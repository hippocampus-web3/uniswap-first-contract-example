const { ethers } = require("hardhat");
const IUniswapV3PoolABI = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json').abi;

async function main() {
    // Dirección del pool de Uniswap V3
    const poolAddress = "0x5E9BB3d7682A9537DB831060176C4247aB80D1Ec"; // Reemplaza con la dirección del pool

    // Configurar el contrato del pool
    const provider = ethers.provider;
    const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, provider);

    // Obtener datos de slot0 del pool
    const slot0 = await poolContract.slot0();
    const sqrtPriceX96 = slot0.sqrtPriceX96;

    // Calcular el precio actual
    const price = (ethers.BigNumber.from(sqrtPriceX96).mul(sqrtPriceX96)).div(ethers.BigNumber.from(2).pow(192));
    const priceFormatted = ethers.utils.formatUnits(price, 18);

    console.log("Precio actual del pool:", priceFormatted.toString());

    // Definir un rango de precios para los ticks (5% por debajo y 5% por encima del precio actual)
    const lowerPrice = priceFormatted * 0.95;
    const upperPrice = priceFormatted * 1.05;

    // Calcular los ticks a partir de los precios
    const tickLower = Math.log(lowerPrice) / Math.log(1.0001);
    const tickUpper = Math.log(upperPrice) / Math.log(1.0001);

    console.log("tickLower:", Math.floor(tickLower));
    console.log("tickUpper:", Math.ceil(tickUpper));
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
