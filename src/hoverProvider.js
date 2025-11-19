"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TailwindHoverProvider = void 0;
var vscode = require("vscode");
// Mock CSS data for hover preview
// In a real extension, this would come from Tailwind's generated CSS or metadata.
var cssPreviewMap = {
    "flex": "display: flex;",
    "block": "display: block;",
    "hidden": "display: none;",
    "p-4": "padding: 1rem;",
    "m-4": "margin: 1rem;",
    "text-red-500": "color: #ef4444;",
    "bg-blue-500": "background-color: #3b82f6;",
    // ... add more examples or a generic generator
};
var TailwindHoverProvider = /** @class */ (function () {
    function TailwindHoverProvider() {
    }
    TailwindHoverProvider.prototype.provideHover = function (document, position, token) {
        var range = document.getWordRangeAtPosition(position, /[\w-:]+/);
        if (!range)
            return undefined;
        var word = document.getText(range);
        // Simple lookup or generation
        var css = cssPreviewMap[word];
        // Generic fallback for simple cases
        if (!css) {
            if (word.startsWith('w-'))
                css = "width: ".concat(word.replace('w-', ''), "; /* approximate */");
            else if (word.startsWith('h-'))
                css = "height: ".concat(word.replace('h-', ''), "; /* approximate */");
        }
        if (css) {
            var markdown = new vscode.MarkdownString();
            markdown.appendCodeblock(css, 'css');
            return new vscode.Hover(markdown, range);
        }
        return undefined;
    };
    return TailwindHoverProvider;
}());
exports.TailwindHoverProvider = TailwindHoverProvider;
