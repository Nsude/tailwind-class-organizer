
const fs = require('fs');
const { getFoldingRanges } = require('./out/folding-utils');

const filePath = process.argv[2];
if (!filePath) {
  console.error("Please provide a file path");
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');
const ranges = getFoldingRanges(content);

console.log(`Found ${ranges.length} folding ranges in ${filePath}:`);
ranges.forEach(r => {
  console.log(`- Fold from line ${r.startLine + 1} to ${r.endLine + 1}`);
  // Show a snippet of the content
  const lines = content.split('\n');
  console.log(`  Content: ${lines[r.startLine].trim()} ... ${lines[r.endLine].trim()}`);
});
