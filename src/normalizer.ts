import * as fs from "fs";
import { ether, fromCSV } from './util';
import { BigNumber } from "ethers";
import web3 from 'web3';
import assert = require("assert");
import * as path from "path";

const INPUT_FOLDER = path.join('resources','in');
const OUTPUT_FOLDER = path.join('resources','out');

function parseCSV(filename: string) {
  console.log(`File: ${INPUT_FOLDER}/${filename}`);
  let entries = fromCSV(path.join(INPUT_FOLDER, filename));
  console.log(`CSV parsed. ${entries.length} entries found.`);
  const invalidAddresses = new Map<string, number>();
  const validEntries: {address: string, balance: string}[] = [];
  entries.forEach((entry, index) => {
    const {address} = entry;
    if (!web3.utils.isAddress(address)) {
      invalidAddresses.set(address, index);
    } else {
      validEntries.push(entry);
    }
  })
  if (invalidAddresses.size > 0) {
    const positions = Array.from(invalidAddresses.values()).join(', ');
    const addresses = Array.from(invalidAddresses.keys()).join(', ');
    console.log(`Invalid addresses: ${addresses} on positions: ${positions}`);
  } else {
    console.log('No invalid addresses found');
  }
  const result = new Map<string, BigNumber>();
  const nonUniqueAddresses = new Set<string>();
  validEntries.forEach(({address, balance}) => {
    if (result.has(address)) {
      nonUniqueAddresses.add(address);
      const previousBalance = result.get(address);
      assert(BigNumber.isBigNumber(previousBalance));
      const newBalance = previousBalance.add(ether(balance));
      result.set(address, newBalance);
    } else {
      result.set(address, ether(balance));
    }
  })
  console.log(`${nonUniqueAddresses.size} non-unique addresses found: ${Array.from(nonUniqueAddresses)}`)
  console.log(`${result.size} addresses processed.`)
  console.log(`Total amount to distribute: ${Array.from(result.values()).reduce((a, b) => a.add(b), BigNumber.from(0))}`)
  let index = 0;
  let slice = 0;
  result.forEach((balance, address) => {
    fs.appendFileSync(path.join(OUTPUT_FOLDER, `${filename}_${slice}_addresses.csv`), `${address},`);
    fs.appendFileSync(path.join(OUTPUT_FOLDER, `${filename}_${slice}_balances.csv`), `${balance},`);
    if (index >= 2000 ) {
      slice++
      index = 0;
    } else {
      index++
    }
  });
}

fs.readdirSync(INPUT_FOLDER).forEach(file => {
  parseCSV(file);
});
