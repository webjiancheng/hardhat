const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("存款合约测试", function () {
    let cyToken;
    let depositContract;
    let owner;
    let user1;
    let user2;
    let CYToken;
    let DepositContract;
    let depositContractAddress;
    let cyTokenAddress;

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();

        // 部署 CYToken
        CYToken = await ethers.getContractFactory("CYToken");
        cyToken = await CYToken.deploy();
        cyTokenAddress = await cyToken.getAddress();

        // 部署 DepositContract
        DepositContract = await ethers.getContractFactory("DepositContract");
        depositContract = await DepositContract.deploy(cyTokenAddress);
        depositContractAddress = await depositContract.getAddress();

        // 转账测试代币
        const amount = ethers.parseEther("1000");
        await cyToken.transfer(user1.address, amount);
        await cyToken.transfer(user2.address, amount);
    });

    describe("基础功能测试", function () {
        it("应该正确初始化合约", async function () {
            expect(await cyToken.name()).to.equal("cityBull");
            expect(await cyToken.symbol()).to.equal("CY");
            expect(await depositContract.supportedTokens(cyTokenAddress)).to.be.true;
        });

        it("用户应该有正确的初始代币余额", async function () {
            const balance = await cyToken.balanceOf(user1.address);
            expect(balance).to.equal(ethers.parseEther("1000"));
        });
    });

    describe("ETH 存取测试", function () {
        it("应该能存入 ETH", async function () {
            const amount = ethers.parseEther("1.0");
            await depositContract.connect(user1).deposit({ value: amount });

            const balance = await depositContract.getBalance(ethers.ZeroAddress, user1.address);
            expect(balance).to.equal(amount);
        });

        it("存入金额为 0 时应该失败", async function () {
            await expect(
                depositContract.connect(user1).deposit({ value: 0 })
            ).to.be.revertedWith("Amount must be > 0");
        });

        it("应该能提取 ETH", async function () {
            const amount = ethers.parseEther("1.0");
            await depositContract.connect(user1).deposit({ value: amount });

            await depositContract.connect(user1).withdraw(amount);
            const balance = await depositContract.getBalance(ethers.ZeroAddress, user1.address);
            expect(balance).to.equal(0);
        });
    });

    describe("代币存取测试", function () {
        const depositAmount = ethers.parseEther("100");

        beforeEach(async function () {
            await cyToken.connect(user1).approve(depositContractAddress, depositAmount);
        });

        it("应该能存入代币", async function () {
            await depositContract.connect(user1).depositToken(cyTokenAddress, depositAmount);
            const balance = await depositContract.getBalance(cyTokenAddress, user1.address);
            expect(balance).to.equal(depositAmount);
        });

        it("存入未支持的代币应该失败", async function () {
            const fakeToken = "0x1234567890123456789012345678901234567890";
            await expect(
                depositContract.connect(user1).depositToken(fakeToken, depositAmount)
            ).to.be.revertedWith("Token not supported");
        });

        it("应该能提取代币", async function () {
            await depositContract.connect(user1).depositToken(cyTokenAddress, depositAmount);
            await depositContract.connect(user1).withdrawToken(cyTokenAddress, depositAmount);
            const balance = await depositContract.getBalance(cyTokenAddress, user1.address);
            expect(balance).to.equal(0);
        });
    });

    describe("利息计算测试", function () {
        it("ETH 存款应该正确计算利息", async function () {
            const amount = ethers.parseEther("100");
            await depositContract.connect(user1).deposit({ value: amount });

            // 时间推进一年
            await time.increase(365 * 24 * 60 * 60);

            const balance = await depositContract.getBalance(ethers.ZeroAddress, user1.address);
            // 预期利息: 5% = 100 * 0.05 = 5 ETH
            const expectedBalance = amount + (amount * 500n) / 10000n;
            expect(balance).to.equal(expectedBalance);
        });

        it("代币存款应该正确计算利息", async function () {
            const amount = ethers.parseEther("100");
            await cyToken.connect(user1).approve(depositContractAddress, amount);
            await depositContract.connect(user1).depositToken(cyTokenAddress, amount);

            await time.increase(365 * 24 * 60 * 60);

            const balance = await depositContract.getBalance(cyTokenAddress, user1.address);
            const expectedBalance = amount + (amount * 500n) / 10000n;
            expect(balance).to.equal(expectedBalance);
        });
    });

    describe("权限控制测试", function () {
        it("只有所有者能添加支持的代币", async function () {
            const newToken = "0x1234567890123456789012345678901234567890";
            await expect(
                depositContract.connect(user1).addSupportedToken(newToken)
            ).to.be.revertedWith("Only owner");
        });

        it("不能添加零地址作为代币", async function () {
            await expect(
                depositContract.connect(owner).addSupportedToken(ethers.ZeroAddress)
            ).to.be.revertedWith("Cannot add ETH as token");
        });

        it("移除代币后不能存款", async function () {
            await depositContract.connect(owner).removeSupportedToken(cyTokenAddress);
            await expect(
                depositContract.connect(user1).depositToken(cyTokenAddress, ethers.parseEther("1"))
            ).to.be.revertedWith("Token not supported");
        });
    });
});