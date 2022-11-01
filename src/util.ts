import * as fs from "fs";
import web3 from 'web3';
import { BigNumber } from 'ethers';

export function ether(n: string): BigNumber {
  return BigNumber.from(web3.utils.toWei(n, 'ether'));
}

export function fromCSV (filename: string): { address: string, balance: string }[] {
  const file = fs.readFileSync(filename, 'utf-8');
  const lines = file.split(/\r\n|\n/).filter(s => s);
  const entries = lines.map(line => line.split(','));
  return entries.map(([address, balance]) => ({ address, balance }));
}
