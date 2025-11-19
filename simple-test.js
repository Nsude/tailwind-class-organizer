
// Standalone test runner to verify logic without VS Code extension host overhead
// This is faster and less prone to environment issues for pure logic tests.

const assert = require('assert');
const { sortClasses } = require('./out/sorter');
const { findClassAttributes } = require('./out/parser');
const { formatClasses } = require('./out/formatter');

console.log("Running Standalone Logic Tests...");

try {
  // Test 1: Sorter
  const input1 = "text-red-500 container p-4";
  const expected1 = "container p-4 text-red-500";
  const result1 = sortClasses(input1);
  assert.strictEqual(result1, expected1, `Expected '${expected1}' but got '${result1}'`);
  console.log("✅ Sorter Test 1 Passed");

  // Test 2: Sorter Complex
  const input2 = "bg-blue-500 w-full items-center flex";
  const expected2 = "flex items-center w-full bg-blue-500";
  const result2 = sortClasses(input2);
  assert.strictEqual(result2, expected2, `Expected '${expected2}' but got '${result2}'`);
  console.log("✅ Sorter Test 2 Passed");

  // Test 3: Parser
  const html = '<div class="p-4 flex"></div>';
  const attributes = findClassAttributes(html);
  assert.strictEqual(attributes.length, 1);
  assert.strictEqual(attributes[0].content, "p-4 flex");
  console.log("✅ Parser Test Passed");

  // Test 4: Formatter
  const input3 = "flex items-center";
  const formatted = formatClasses(input3, 5); // Low threshold
  assert.ok(formatted.includes('\n'), "Formatter should break lines");
  console.log("✅ Formatter Test Passed");

  console.log("All tests passed successfully!");
} catch (e) {
  console.error("❌ Test Failed:", e);
  process.exit(1);
}
