#!/usr/bin/env node
const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

(async function() {
  const csv = await readFile(process.argv[2], 'utf8');
  const lines = csv
    .split(/\r?\n/)
    .map(line => line.split(',').map(cell => (cell === '' ? null : cell)));

  const ret = {};
  const fieldNames = lines[0];
  for (const line of lines.slice(1)) {
    const obj = {};
    line.forEach((value, index) => {
      obj[fieldNames[index]] = value;
    });
    ret[line[0]] = obj;
  }
  console.log('module.exports =', JSON.stringify(ret), ';');
})();
