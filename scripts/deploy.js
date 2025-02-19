const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // 获取部署账户
        const [deployer] = await ethers.getSigners();
        console.log("\n开始部署合约...");
        console.log("部署账户:", deployer.address);
        
        // 检查账户余额
        const balance = await deployer.provider.getBalance(deployer.address);
        console.log("账户余额:", ethers.formatEther(balance), "ETH");
        
        if (balance === 0n) {
            throw new Error("部署账户余额为0，请确保有足够的ETH支付gas费用");
        }

        // 1. 部署 CYToken
        console.log("\n1. 部署 CYToken 合约...");
        const CYToken = await ethers.getContractFactory("CYToken");
        const cyToken = await CYToken.deploy();
        await cyToken.waitForDeployment();
        const cyTokenAddress = await cyToken.getAddress();
        console.log("   CYToken 已部署到:", cyTokenAddress);

        // 检查 CYToken 基本信息
        const name = await cyToken.name();
        const symbol = await cyToken.symbol();
        const totalSupply = await cyToken.totalSupply();
        console.log("   代币名称:", name);
        console.log("   代币符号:", symbol);
        console.log("   总供应量:", ethers.formatEther(totalSupply), "CY");
        console.log("   部署者代币余额:", ethers.formatEther(await cyToken.balanceOf(deployer.address)), "CY");

        // 2. 部署 DepositContract
        console.log("\n2. 部署 DepositContract 合约...");
        const DepositContract = await ethers.getContractFactory("DepositContract");
        const depositContract = await DepositContract.deploy(cyTokenAddress);
        await depositContract.waitForDeployment();
        const depositContractAddress = await depositContract.getAddress();
        console.log("   DepositContract 已部署到:", depositContractAddress);

        // 3. 验证 DepositContract 配置
        console.log("\n3. 验证合约配置...");
        const isCYTokenSupported = await depositContract.supportedTokens(cyTokenAddress);
        console.log("   CY代币是否支持:", isCYTokenSupported);

        // 4. 准备部署信息
        const network = await ethers.provider.getNetwork();
        const deployInfo = {
            network: {
                name: network.name === 'homestead' ? 'mainnet' : network.name,
                chainId: Number(network.chainId)
            },
            cyToken: {
                address: cyTokenAddress,
                name,
                symbol,
                totalSupply: ethers.formatEther(totalSupply),
                decimals: Number(await cyToken.decimals()),
                abi: JSON.parse(cyToken.interface.formatJson())
            },
            depositContract: {
                address: depositContractAddress,
                supportedTokens: [cyTokenAddress],
                abi: JSON.parse(depositContract.interface.formatJson())
            },
            deployer: deployer.address,
            timestamp: new Date().toISOString()
        };

        // 5. 保存部署信息
        const deploymentPath = path.join(__dirname, '../deployments.json');
        fs.writeFileSync(
            deploymentPath,
            JSON.stringify(deployInfo, null, 2)
        );
        console.log("\n部署信息已保存到:", deploymentPath);

        // 6. 部署结果汇总
        console.log("\n部署结果汇总:");
        console.log("-------------------");
        console.log("网络名称:", deployInfo.network.name);
        console.log("链 ID:", deployInfo.network.chainId);
        console.log("CYToken:", deployInfo.cyToken.address);
        console.log("DepositContract:", deployInfo.depositContract.address);
        console.log("部署账户:", deployInfo.deployer);
        console.log("-------------------");

    } catch (error) {
        console.error("\n部署过程中发生错误:");
        if (error.message.includes('BigInt')) {
            console.error("BigInt 序列化错误，请检查所有数值是否正确转换");
        }
        console.error(error);
        process.exit(1);
    }
}

main()
    .then(() => {
        console.log("\n部署完成！");
        process.exit(0);
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });