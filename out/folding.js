"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TailwindFoldingProvider = void 0;
const vscode = require("vscode");
const folding_utils_1 = require("./folding-utils");
class TailwindFoldingProvider {
    provideFoldingRanges(document, context, token) {
        const text = document.getText();
        const ranges = (0, folding_utils_1.getFoldingRanges)(text);
        return ranges.map(r => new vscode.FoldingRange(r.startLine, r.endLine, vscode.FoldingRangeKind.Region));
    }
}
exports.TailwindFoldingProvider = TailwindFoldingProvider;
//# sourceMappingURL=folding.js.map