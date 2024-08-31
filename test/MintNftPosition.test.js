const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LiquidityExamples", function () {
  let wewe
  let weth
  let owner;
  let weweAddress = "0x6b9bb36519538e0C073894E964E90172E1c0B41F";
  let wethAddress = "0x4200000000000000000000000000000000000006";
  let nftpositionManager = "0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1"

  it("should mint a new position with WEWE and WETH", async function () {

    [owner] = await ethers.getSigners();

    console.log('Address', await owner.getAddress())

    // Deploy the MintNftPosition contract
    const MintNftPositionFactory = await ethers.getContractFactory("MintNftPosition");
    mintNftPosition = await MintNftPositionFactory.deploy(wethAddress, weweAddress, nftpositionManager);
    await mintNftPosition.deployed();

    // Get references to the DAI and USDC tokens
    wewe = await ethers.getContractAt("IERC20", weweAddress);
    weth = await ethers.getContractAt("IERC20", wethAddress);

    console.log('Balance original address WEWE', await wewe.balanceOf(await owner.getAddress()))
    console.log('Balance original address WETH',await weth.balanceOf(await owner.getAddress()))

    // Define the amount of tokens to mint for liquidity
    const amountWEWE = ethers.utils.parseUnits("293179", 18);
    const amountWETH = ethers.utils.parseUnits("0.01", 18);
    
    // Mint some DAI and USDC to the owner (in a real test, you would need a mock or funded tokens)
    // await dai.connect(owner).mint(await owner.getAddress(), amountDAI);
    // await usdc.connect(owner).mint(await owner.getAddress(), amountUSDC);

    // Approve the MintNftPosition contract to spend DAI and USDC
    await wewe.connect(owner).approve(await mintNftPosition.address, amountWEWE);
    await weth.connect(owner).approve(await mintNftPosition.address, amountWETH);

    // Call mintNewPosition
    const tx = await mintNftPosition.connect(owner).mintNewPosition(amountWETH, amountWEWE, { gasLimit: 30000000 });
    const receipt = await tx.wait();

    // Parse logs to find the Mint event
    const event = receipt.events?.find((event) => event.event === "Mint");
    const [tokenId, liquidity, amount0, amount1] = event?.args ?? [];

    // Assertions
    expect(tokenId).to.be.a("number");
    expect(liquidity).to.be.gt(0);
    expect(amount0).to.be.eq(amountWETH);
    expect(amount1).to.be.eq(amountWEWE);

    console.log(`Minted new position with Token ID: ${tokenId}, Liquidity: ${liquidity}`);
  });
});
