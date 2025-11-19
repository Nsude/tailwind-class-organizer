"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const sorter_1 = require("../src/sorter");
const parser_1 = require("../src/parser");
const formatter_1 = require("../src/formatter");
suite('Extension Test Suite', () => {
    test('Sorter - Basic Ordering', () => {
        // Layout > Spacing > Colors
        // container (Layout), p-4 (Spacing), text-red-500 (Colors)
        const input = "text-red-500 container p-4";
        const expected = "container p-4 text-red-500";
        assert.strictEqual((0, sorter_1.sortClasses)(input), expected);
    });
    test('Sorter - Complex Ordering', () => {
        // flex (Display), items-center (Flex/Grid), w-full (Sizing), bg-blue-500 (Backgrounds)
        const input = "bg-blue-500 w-full items-center flex";
        const expected = "flex items-center w-full bg-blue-500";
        assert.strictEqual((0, sorter_1.sortClasses)(input), expected);
    });
    test('Parser - Find Class Attributes', () => {
        const html = '<div class="p-4 flex"></div>';
        const attributes = (0, parser_1.findClassAttributes)(html);
        assert.strictEqual(attributes.length, 1);
        assert.strictEqual(attributes[0].content, "p-4 flex");
    });
    test('Parser - React className', () => {
        const jsx = '<div className="text-center"></div>';
        const attributes = (0, parser_1.findClassAttributes)(jsx);
        assert.strictEqual(attributes.length, 1);
        assert.strictEqual(attributes[0].content, "text-center");
    });
    test('Formatter - Multiline', () => {
        const input = "flex items-center justify-center p-4 m-4 text-red-500 bg-blue-500 border-2 border-black";
        // Threshold 20 should force multiline
        const formatted = (0, formatter_1.formatClasses)(input, 20);
        assert.ok(formatted.includes('\n'));
        assert.ok(formatted.includes('  flex'));
    });
});
//# sourceMappingURL=extension.test.js.map