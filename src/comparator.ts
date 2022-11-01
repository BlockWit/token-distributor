import * as fs from "fs";
import web3 from 'web3';
import * as path from "path";

const INPUT_FOLDER = path.join('resources','in');

function fromCSV (filename: string): { address: string }[] {
  const file = fs.readFileSync(filename, 'utf-8');
  const lines = file.split(/\r\n|\n/).filter(s => s);
  return lines.map(line => ({ address: line }));
}

function parseCSV(filename: string): Set<string> {
  console.log(`File: ${INPUT_FOLDER}/${filename}`);
  let entries = fromCSV(path.join(INPUT_FOLDER, filename));
  console.log(`CSV parsed. ${entries.length} entries found.`);
  const invalid = new Map<string, number>();
  const valid: string[] = [];
  entries.forEach(({address}, index) => {
    if (!web3.utils.isAddress(address)) {
      invalid.set(address, index);
    } else {
      valid.push(address);
    }
  })
  if (invalid.size > 0) {
    const positions = Array.from(invalid.values()).join(', ');
    const addresses = Array.from(invalid.keys()).join(', ');
    console.log(`Invalid addresses: ${addresses} on positions: ${positions}`);
  } else {
    console.log('No invalid addresses found');
  }
  const result = new Set<string>();
  const nonUniqueAddresses = new Set<string>();
  valid.forEach(address => {
    if (result.has(address)) {
      nonUniqueAddresses.add(address);
    } else {
      result.add(address);
    }
  })
  console.log(`${nonUniqueAddresses.size} non-unique addresses found.`)
  console.log(`${result.size} addresses processed.`)
  return result;
}

const list2 = parseCSV('whitelist2.csv');
const list3 = parseCSV('whitelist3.csv');
const diff: string[] = [];

list3.forEach(address => {
  if (list2.has(address)) diff.push(address);
})

if (diff.length > 0) {
  console.log('Overlap found. Addresses:');
  console.log(diff.toString());
} else {
  console.log('No overlap found.')
}
