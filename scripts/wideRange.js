const { ethers } = require("hardhat");
const TickMath = {
  MIN_TICK: -887272,
  MAX_TICK: 887272,
};

async function main() {
  // Supongamos que quieres aportar 1 ETH
  const amount1Desired = ethers.utils.parseUnits("1.0", 18); // 1 ETH en wei
  
  // Precio actual (P_current) y sqrtPriceX96
  const poolAddress = "0x5E9BB3d7682A9537DB831060176C4247aB80D1Ec"; // Dirección del pool
  const IUniswapV3PoolABI = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json').abi;
  const provider = ethers.provider;
  const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, provider);
  
  const slot0 = await poolContract.slot0();
  const sqrtPriceX96 = slot0.sqrtPriceX96;
  
  const P_current = ethers.BigNumber.from(sqrtPriceX96).mul(sqrtPriceX96).div(ethers.BigNumber.from(2).pow(192));
  
  // Calcular las raíces cuadradas de los precios del rango completo
  const sqrtPriceLower = Math.pow(1.0001, TickMath.MIN_TICK / 2);
  const sqrtPriceUpper = Math.pow(1.0001, TickMath.MAX_TICK / 2);
  const sqrtPriceCurrent = Math.sqrt(P_current);
  
  // Calcular la cantidad de token0 necesaria (WEWE)
  const amount0 = amount1Desired.mul(sqrtPriceUpper - sqrtPriceCurrent)
    .div(sqrtPriceUpper.mul(sqrtPriceLower).toNumber());
  
  console.log("Cantidad de WEWE necesaria:", ethers.utils.formatUnits(amount0, 18));
  console.log("Cantidad de ETH aportada:", ethers.utils.formatUnits(amount1Desired, 18));
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
