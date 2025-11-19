
const fs = require('fs');
const { sortClasses } = require('./out/sorter');
const { findClassAttributes } = require('./out/parser');

const filePath = process.argv[2];
if (!filePath) {
  console.error("Please provide a file path");
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');
const attributes = findClassAttributes(content);

// Sort in reverse to keep indices valid
let newContent = content;
// We need to be careful with string replacement. 
// Since findClassAttributes returns indices based on the original string,
// we should reconstruct the string or use a library. 
// For this demo, let's just split and rejoin or use the indices carefully.

// Actually, let's just use the indices from right to left.
for (let i = attributes.length - 1; i >= 0; i--) {
  const attr = attributes[i];
  const sorted = sortClasses(attr.content);

  const before = newContent.substring(0, attr.start);
  const after = newContent.substring(attr.end);
  newContent = before + sorted + after;
}

fs.writeFileSync(filePath, newContent);
console.log(`Sorted classes in ${filePath}`);
