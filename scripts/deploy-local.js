const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  try {
    // 部署 CYToken
    console.log("Deploying CYToken...");
    const CYToken = await ethers.getContractFactory("CYToken");
    const cyToken = await CYToken.deploy();
    // 等待部署完成
    await cyToken.waitForDeployment();
    const cyTokenAddress = await cyToken.getAddress();
    console.log("CYToken deployed to:", cyTokenAddress);

    // 部署 DepositContract
    console.log("Deploying DepositContract...");
    const DepositContract = await ethers.getContractFactory("DepositContract");
    const depositContract = await DepositContract.deploy(cyTokenAddress);
    // 等待部署完成
    await depositContract.waitForDeployment();
    const depositContractAddress = await depositContract.getAddress();
    console.log("DepositContract deployed to:", depositContractAddress);

    // 打印代币余额
    const tokenBalance = await cyToken.balanceOf(deployer.address);
    console.log("Deployer CYToken balance:", ethers.formatEther(tokenBalance));

    // 保存合约地址到文件中
    const fs = require("fs");
    const addresses = {
      cyToken: cyTokenAddress,
      depositContract: depositContractAddress
    };
    fs.writeFileSync("contract-addresses.json", JSON.stringify(addresses, null, 2));
    console.log("Contract addresses saved to contract-addresses.json");

  } catch (error) {
    console.error("Deployment error:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });