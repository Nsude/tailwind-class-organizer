
import { findClassAttributes } from './src/parser';

const testCases = [
    { input: 'className="text-red-500 p-4"', expected: 'text-red-500 p-4' },
    { input: "className='text-blue-500 p-4'", expected: 'text-blue-500 p-4' },
    { input: 'className={"text-green-500 p-4"}', expected: 'text-green-500 p-4' },
    { input: "className={'text-yellow-500 p-4'}", expected: 'text-yellow-500 p-4' },
    { input: 'className={`text-purple-500 p-4`}', expected: 'text-purple-500 p-4' },
];

console.log('Running tests...');
let passed = 0;
let failed = 0;

testCases.forEach((test, index) => {
    const matches = findClassAttributes(test.input);
    if (matches.length > 0 && matches[0].content === test.expected) {
        console.log(`Test ${index + 1} PASSED`);
        passed++;
    } else {
        console.log(`Test ${index + 1} FAILED`);
        console.log(`  Input: ${test.input}`);
        console.log(`  Expected: ${test.expected}`);
        console.log(`  Found: ${matches.length > 0 ? matches[0].content : 'No match'}`);
        failed++;
    }
});

console.log(`\nSummary: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
