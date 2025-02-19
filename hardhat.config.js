require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
module.exports = {
  defaultNetwork: "sepolia",// ganache
  solidity: "0.8.20",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
    viaIR: true, // 添加此配置
    evmVersion: "paris", // 指定 EVM 版本
    outputSelection: {
      "*": {
        "*": ["evm.bytecode", "evm.deployedBytecode", "abi"],
      },
    },
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [process.env.PRIVATE_KEY],
      // 添加超时配置
      timeout: 60000, // 60 秒
      // 添加确认数
      confirmations: 2,
    },

    // 单元测试
    hardhat: {
      mining: {
        auto: true,
        interval: 0,
      },
    },
    ganache: {
      url: "HTTP://127.0.0.1:7545", // Ganache CLI 运行的地址
      chainId: 1337,
      accounts: [
        "0x5d8b9e92e3e77d0d42047e46c3c5e0fbc3e89f564ac68b1b6f56f647faccddb5",
        "0xda299e4989f81302c02a161d1f78d4c21de73e5524e67ad372db05fab7308f5f",
      ],
    },
  },
};
