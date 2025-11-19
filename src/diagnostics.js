"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDiagnostics = updateDiagnostics;
var vscode = require("vscode");
var parser_1 = require("./parser");
// Simple conflict map: Category -> List of prefixes that conflict
// e.g. you can't have two different "display" properties (block, flex, hidden)
// or two different paddings of the same type (p-4, p-8)
var conflicts = {
    "display": ["block", "flex", "grid", "hidden", "inline", "inline-block"],
    "position": ["static", "fixed", "absolute", "relative", "sticky"],
    "textAlign": ["text-left", "text-center", "text-right", "text-justify"],
    // Add more...
};
function updateDiagnostics(document, collection) {
    var diagnostics = [];
    var text = document.getText();
    var attributes = (0, parser_1.findClassAttributes)(text);
    attributes.forEach(function (attr) {
        var classes = attr.content.split(/\s+/).filter(function (c) { return c.length > 0; });
        var _loop_1 = function (category) {
            var conflictingPrefixes = conflicts[category];
            var found = classes.filter(function (c) { return conflictingPrefixes.includes(c); });
            if (found.length > 1) {
                // Found a conflict!
                found.forEach(function (c) {
                    var index = attr.content.indexOf(c);
                    var start = document.positionAt(attr.start + index);
                    var end = document.positionAt(attr.start + index + c.length);
                    var range = new vscode.Range(start, end);
                    var diagnostic = new vscode.Diagnostic(range, "Conflict: ".concat(found.join(', '), " are in the same category '").concat(category, "'."), vscode.DiagnosticSeverity.Warning);
                    diagnostics.push(diagnostic);
                });
            }
        };
        // Check for conflicts
        for (var category in conflicts) {
            _loop_1(category);
        }
        // Also check for duplicate classes
        var seen = new Set();
        classes.forEach(function (c) {
            if (seen.has(c)) {
                var index = attr.content.lastIndexOf(c); // Just highlight the last one for simplicity
                var start = document.positionAt(attr.start + index);
                var end = document.positionAt(attr.start + index + c.length);
                var range = new vscode.Range(start, end);
                var diagnostic = new vscode.Diagnostic(range, "Duplicate class: ".concat(c), vscode.DiagnosticSeverity.Warning);
                diagnostics.push(diagnostic);
            }
            seen.add(c);
        });
    });
    collection.set(document.uri, diagnostics);
}
