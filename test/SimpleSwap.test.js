const { expect } = require("chai");
const { ethers } = require("hardhat");

const WETH_ADDRESS = "0x4200000000000000000000000000000000000006";
const WEWE_ADDRESS = "0x6b9bb36519538e0C073894E964E90172E1c0B41F";
const WEWE_DECIMALS = 18; 
const SwapRouterAddress = "0x2626664c2603336E57B271c5C0b26F421741e481"; 
const PermitContract = "0x000000000022D473030F116dDEE9F6B43aC78BA3";

const ercAbi = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool)",
  "function deposit() public payable",
  "function approve(address spender, uint256 amount) returns (bool)",
];

describe("SimpleSwap", function () {
  xit("Should provide a caller with more DAI than they started with after a swap", async function () {
    
    /* Deploy the SimpleSwap contract */
    const simpleSwapFactory = await ethers.getContractFactory("SimpleSwap");
    const simpleSwap = await simpleSwapFactory.deploy(SwapRouterAddress, PermitContract);
    await simpleSwap.deployed();
    let signers = await hre.ethers.getSigners();

    /* Connect to WETH and wrap some eth  */
    const WETH = new hre.ethers.Contract(WETH_ADDRESS, ercAbi, signers[0]);
    const deposit = await WETH.deposit({ value: hre.ethers.utils.parseEther("1") });
    await deposit.wait();

    console.log('WETH balance', await WETH.balanceOf(signers[0].address));
    
    /* Check Initial DAI Balance */ 
    const DAI = new hre.ethers.Contract(WEWE_ADDRESS, ercAbi, signers[0]);
    const expandedDAIBalanceBefore = await DAI.balanceOf(signers[0].address);
    const DAIBalanceBefore = Number(hre.ethers.utils.formatUnits(expandedDAIBalanceBefore, WEWE_DECIMALS));

    console.log('WEWE balance', await DAI.balanceOf(signers[0].address));

    /* Approve the swapper contract to spend WETH for me */
    await WETH.approve(simpleSwap.address, hre.ethers.utils.parseEther("0.1"));

    console.log('apprved previous call', simpleSwap.address)
    
    /* Execute the swap */
    const amountIn = hre.ethers.utils.parseEther("0.1"); 
    console.log('amountIn', amountIn)
    const swap = await simpleSwap.swapWETHForWEWE(amountIn, { gasLimit: 30000000 });
    swap.wait(); 
    
    /* Check DAI end balance */
    const expandedDAIBalanceAfter = await DAI.balanceOf(signers[0].address);
    const DAIBalanceAfter = Number(hre.ethers.utils.formatUnits(expandedDAIBalanceAfter, WEWE_DECIMALS));
    
    expect( DAIBalanceAfter )
      .is.greaterThan(DAIBalanceBefore); 
  });
  xit("Should provide a caller with more WETH than they started with after a swap", async function () {
    
    /* Deploy the SimpleSwap contract */
    const simpleSwapFactory = await ethers.getContractFactory("SimpleSwap");
    const simpleSwap = await simpleSwapFactory.deploy(SwapRouterAddress, PermitContract);
    await simpleSwap.deployed();
    let signers = await hre.ethers.getSigners();

    /* Connect to WETH and wrap some eth  */
    // const WETH = new hre.ethers.Contract(WETH_ADDRESS, ercAbi, signers[0]);
    // const deposit = await WETH.deposit({ value: hre.ethers.utils.parseEther("10") });
    // await deposit.wait();

    // console.log('WETH balance', await WETH.balanceOf(signers[0].address));
    
    /* Check Initial DAI Balance */ 
    const WEWE = new hre.ethers.Contract(WEWE_ADDRESS, ercAbi, signers[0]);
    const expandedDAIBalanceBefore = await WEWE.balanceOf(signers[0].address);
    const WEWEBalanceBefore = Number(hre.ethers.utils.formatUnits(expandedDAIBalanceBefore, WEWE_DECIMALS));

    console.log('WEWE balance', WEWEBalanceBefore);

    /* Approve the swapper contract to spend WETH for me */
    await WEWE.approve(simpleSwap.address, hre.ethers.utils.parseEther("1000000"));

    console.log('apprOved previous call', simpleSwap.address)
    
    /* Execute the swap */
    const amountIn = hre.ethers.utils.parseEther("1000000"); 
    console.log('amountIn', amountIn)
    const swap = await simpleSwap.swapWEWEtoWETH(amountIn, { gasLimit: 30000000 });
    swap.wait(); 
    
    /* Check WEWE end balance */
    const expandedWEWEBalanceAfter = await WEWE.balanceOf(signers[0].address);
    const WEWEBalanceAfter = Number(hre.ethers.utils.formatUnits(expandedWEWEBalanceAfter, WEWE_DECIMALS));
    
    expect( WEWEBalanceAfter )
      .is.greaterThan(WEWEBalanceBefore); 
  });
});
