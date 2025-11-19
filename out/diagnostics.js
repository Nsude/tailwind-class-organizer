"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDiagnostics = updateDiagnostics;
const vscode = require("vscode");
const parser_1 = require("./parser");
// Simple conflict map: Category -> List of prefixes that conflict
// e.g. you can't have two different "display" properties (block, flex, hidden)
// or two different paddings of the same type (p-4, p-8)
const conflicts = {
    "display": ["block", "flex", "grid", "hidden", "inline", "inline-block"],
    "position": ["static", "fixed", "absolute", "relative", "sticky"],
    "textAlign": ["text-left", "text-center", "text-right", "text-justify"],
    // Add more...
};
function updateDiagnostics(document, collection) {
    const diagnostics = [];
    const text = document.getText();
    const attributes = (0, parser_1.findClassAttributes)(text);
    attributes.forEach(attr => {
        const classes = attr.content.split(/\s+/).filter(c => c.length > 0);
        // Check for conflicts
        for (const category in conflicts) {
            const conflictingPrefixes = conflicts[category];
            const found = classes.filter(c => conflictingPrefixes.includes(c));
            if (found.length > 1) {
                // Found a conflict!
                found.forEach(c => {
                    const index = attr.content.indexOf(c);
                    const start = document.positionAt(attr.start + index);
                    const end = document.positionAt(attr.start + index + c.length);
                    const range = new vscode.Range(start, end);
                    const diagnostic = new vscode.Diagnostic(range, `Conflict: ${found.join(', ')} are in the same category '${category}'.`, vscode.DiagnosticSeverity.Warning);
                    diagnostics.push(diagnostic);
                });
            }
        }
        // Also check for duplicate classes
        const seen = new Set();
        classes.forEach(c => {
            if (seen.has(c)) {
                const index = attr.content.lastIndexOf(c); // Just highlight the last one for simplicity
                const start = document.positionAt(attr.start + index);
                const end = document.positionAt(attr.start + index + c.length);
                const range = new vscode.Range(start, end);
                const diagnostic = new vscode.Diagnostic(range, `Duplicate class: ${c}`, vscode.DiagnosticSeverity.Warning);
                diagnostics.push(diagnostic);
            }
            seen.add(c);
        });
    });
    collection.set(document.uri, diagnostics);
}
//# sourceMappingURL=diagnostics.js.map