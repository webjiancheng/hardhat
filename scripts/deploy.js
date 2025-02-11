// 导入ethers
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    const CYToken = await ethers.getContractFactory("CYToken");

    // 部署合约
    const cyToken = await CYToken.deploy();
    console.log("CYToken contract deployed to:", cyToken.address);
  
    const DepositContract = await ethers.getContractFactory("DepositContract");
    const depositContract = await DepositContract.deploy(cyToken.address);
    console.log("DepositContract deployed to:", depositContract.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  