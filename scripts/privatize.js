/* eslint-env node */
const { readdirSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const REGEXP = /@private(?<suffix>[\n\r\s\w]+)\*\/(?<whitespace>[\n\r\s]+)(?<memberName>[\w]+)\b/g;

const ds = readdirSync(join(__dirname, '../')).filter(f => f.includes('.d.ts'));

ds.forEach(name => {
  const path = join(__dirname, `../${name}`);
  const source = readFileSync(path, 'utf-8');
  const output = source
    .replace(REGEXP, '@private$<suffix>*/$<whitespace>private $<memberName>');
  writeFileSync(path, output);
});
