"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("./src/parser");
const testCase = `className={\`
        \${isExtended ? "w-[15.25rem] relative h-[18.4rem] py-[0.75rem]" : 'absolute w-[12rem] p-[0.75rem]'}
        right-0 bg-dark-gray border-2 border-border-gray
        rounded-[12px] text-myWhite text-label-14 opacity-0 pointer-events-none overflow-clip
      \`}`;
console.log('Testing template literal with embedded expressions...');
console.log('Input:', testCase);
console.log('\n');
const matches = (0, parser_1.findClassAttributes)(testCase);
console.log('Matches found:', matches.length);
if (matches.length > 0) {
    console.log('Content:', matches[0].content);
    console.log('Start:', matches[0].start);
    console.log('End:', matches[0].end);
}
else {
    console.log('No matches found!');
}
