# Sample Hardhat Project
npx hardhat test

npx hardhat ignition deploy ./ignition/modules/Lock.js

// scripts/deploy-local
npx hardhat run scripts/deploy-local.js --network ganache 

npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia

// 扁平化处理 合约 flattened 
npx hardhat flatten contracts/CYToken.sol > contracts/CYToken_flat.sol
npx hardhat flatten contracts/DepositContract.sol > contracts/DepositContract_flat.sol

// 合约代码测试网还未开源

部署结果汇总: CY
-------------------
网络名称: sepolia
链 ID: 11155111
CYToken: 0x203B35f4C767b9146D97281A3dF5F435B1Fd9595
DepositContract: 0x33918D60cBf53715A3598fe076abC2d9Cc12A8F8
部署账户: 0x46980A88cc8D13eebe1D8BD14e51f3Bc273Fe565
-------------------

npx hardhat verify --network sepolia <合约地址> <构造函数参数>
 测试网发布代币
 1. 编写 Solidity 合约
 • 使用 Solidity 0.8.x 版本
 • 需要包含 deposit、withdraw 和 ownerWithdraw 方法
 • 记录每个用户的存款金额
 2. 实现功能
 • ✅允许用户存款
 • ✅允许用户取款
 • ✅仅限存入资金的人提取所有资金
 • ✅记录用户的存款余额
 3. 部署到测试网
 • 可选择 Remix + MetaMask 部署到 Goerli/ Sepolia 测试网(需通过水龙头领取测试代币)、部署到本地Ganache
```


