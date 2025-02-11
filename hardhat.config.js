require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
// require("@nomiclabs/hardhat-waffle");
// require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.28",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  networks: {
    ganache: {
      url: "HTTP://127.0.0.1:7545",  // Ganache CLI 运行的地址
      accounts: [
        //       url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
        //       accounts: [`0x${process.env.PRIVATE_KEY}`],
        // 在 Ganache 中生成的账户私钥列表（从 Ganache 的 UI 或 CLI 获取）
        "0xfb5ee04029e11aaba7406aae73d7009153ea01dd3e4e040c9aac8d42e1442d9d",
        "0xeeb2eef4c1c323edc76f0b58f2cb3ea367cc602b4a21ce7e0f711427cf522db7",
        // 其他账户私钥...
      ],
    },
  },
};