const TokenDistributor = artifacts.require('TokenDistributor');
const { logger } = require('./util');

async function deploy () {
  const { log, logAddress } = logger(config.network);
  const [deployer] = await web3.eth.getAccounts();

  const distributor = await TokenDistributor.new({ from: deployer });
  log(`TokenDistributor deployed: @address{${distributor.address}}`);
  logAddress('TokenDistributor', distributor.address);

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
