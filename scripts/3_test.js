const TokenDistributor = artifacts.require('TokenDistributor');
const ERC20Mock = artifacts.require('ERC20Mock');
const { logger } = require('./util');
const {execSync} = require("child_process");

async function deploy () {
  const { addresses, log, logAddress } = logger(config.network);
  const [deployer] = await web3.eth.getAccounts();

  const { TokenDistributor: DISTRIBUTOR_ADDRESS } = addresses.claim([ 'TokenDistributor' ])
  const distributor = await TokenDistributor.at(DISTRIBUTOR_ADDRESS);

  const erc20Mock = await ERC20Mock.new({from: deployer});
  log(`ERC20Mock deployed: @address{${erc20Mock.address}}`);
  logAddress('ERC20Mock', erc20Mock.address);
  execSync(`npx truffle run verify ERC20Mock@${erc20Mock.address} --network ${config.network}`, {stdio: 'inherit'});

  {
    log(`TokenDistributor. Set ERC20 token.`);
    const tx = await distributor.setToken(erc20Mock.address, { from: deployer });
    log(`Result: successful tx: @tx{${tx.receipt.transactionHash}}`);
  }

  {
    log(`ERC20Mock. Transfer to TokenDistributor`);
    const tx = await erc20Mock.transfer(DISTRIBUTOR_ADDRESS, '5049000000000000000000', { from: deployer });
    log(`Result: successful tx: @tx{${tx.receipt.transactionHash}}`);
  }

}

module.exports = async function main (callback) {
  try {
    await deploy();
    console.log('success');
    callback(null);
  } catch (e) {
    console.log('error');
    console.log(e);
    callback(e);
  }
};
