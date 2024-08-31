const { ethers } = require("hardhat");

async function main() {

    let signers = await ethers.getSigners();

    const [deployer] = await ethers.getSigners();

    // Dirección del contrato ERC-20
    const tokenAddress = '0x6b9bb36519538e0C073894E964E90172E1c0B41F';

    // ABI mínimo necesario para interactuar con el balanceOf
    const abi = [
        "function balanceOf(address owner) view returns (uint256)"
    ];

    // Conexión con el contrato
    const tokenContract = new ethers.Contract(tokenAddress, abi, deployer);

    // Dirección para la cual queremos consultar el balance
    const address = signers[0].address;

    // Obtener el balance
    const balance = await tokenContract.balanceOf(address);

    console.log(`El balance de ${address} es: ${ethers.utils.formatUnits(balance, 18)} tokens`);
}

// Ejecuta el script
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
