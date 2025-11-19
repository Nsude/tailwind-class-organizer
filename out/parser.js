"use strict";
// Removed vscode import to allow standalone testing
// import * as vscode from 'vscode';
Object.defineProperty(exports, "__esModule", { value: true });
exports.findClassAttributes = findClassAttributes;
// Regex to find class attributes. 
// Matches class="..." className="..." :class="..." [class]="..."
// Captures the content inside quotes.
const CLASS_ATTRIBUTE_REGEX = /(?:class|className|:class|\[class\])\s*=\s*["']([^"']*)["']/g;
function findClassAttributes(text) {
    const matches = [];
    let match;
    while ((match = CLASS_ATTRIBUTE_REGEX.exec(text)) !== null) {
        matches.push({
            start: match.index + match[0].indexOf(match[1]), // Start of the content
            end: match.index + match[0].indexOf(match[1]) + match[1].length, // End of the content
            content: match[1]
        });
    }
    return matches;
}
//# sourceMappingURL=parser.js.map