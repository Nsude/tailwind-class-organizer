"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFoldingRanges = getFoldingRanges;
const parser_1 = require("./parser");
function getFoldingRanges(text) {
    const ranges = [];
    const attributes = (0, parser_1.findClassAttributes)(text);
    attributes.forEach(attr => {
        const startLine = text.substring(0, attr.start).split('\n').length - 1;
        const endLine = text.substring(0, attr.end).split('\n').length - 1;
        if (startLine !== endLine) {
            ranges.push({ startLine, endLine });
        }
    });
    return ranges;
}
//# sourceMappingURL=folding-utils.js.map