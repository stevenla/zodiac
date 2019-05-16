#!/usr/bin/env node
const fs = require('fs');
const util = require('util');
const path = require('path');
const _glob = require('glob');

const glob = util.promisify(_glob);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

(async function() {
  const [, , source, destination] = process.argv;
  const filenames = await glob(`${source}/*.csv`);
  const promises = [];

  for (const filename of filenames) {
    if (filename.includes('key.csv')) {
      continue;
    }
    const basename = path.basename(filename, '.csv');
    const csv = await readFile(filename, 'utf8');
    const lines = csv
      .split(/\r?\n/)
      .map(line => line.split(',').map(cell => (cell === '' ? null : cell)));
    const contents = JSON.stringify(lines);
    const destinationPath = path.join(destination, `${basename}.json`);
    promises.push(writeFile(destinationPath, contents, 'utf8'));
  }
})();
