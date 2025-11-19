"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
var vscode = require("vscode");
var sorter_1 = require("./sorter");
var parser_1 = require("./parser");
var formatter_1 = require("./formatter");
var hoverProvider_1 = require("./hoverProvider");
var diagnostics_1 = require("./diagnostics");
function activate(context) {
    console.log('Tailwind Class Organizer is now active!');
    // Command: Sort Selection
    var sortCommand = vscode.commands.registerCommand('tailwind-organizer.sort', function () {
        var editor = vscode.window.activeTextEditor;
        if (!editor)
            return;
        var document = editor.document;
        var selection = editor.selection;
        var text = document.getText(selection);
        if (text.trim().length > 0) {
            // If user selected text, just sort that text (assuming it's a list of classes)
            var sorted_1 = (0, sorter_1.sortClasses)(text);
            editor.edit(function (editBuilder) {
                editBuilder.replace(selection, sorted_1);
            });
        }
        else {
            // If no selection, sort ALL class attributes in the file
            var fullText = document.getText();
            var attributes_1 = (0, parser_1.findClassAttributes)(fullText);
            editor.edit(function (editBuilder) {
                // Process in reverse order to avoid messing up indices
                for (var i = attributes_1.length - 1; i >= 0; i--) {
                    var attr = attributes_1[i];
                    var sorted = (0, sorter_1.sortClasses)(attr.content);
                    if (sorted !== attr.content) {
                        var range = new vscode.Range(document.positionAt(attr.start), document.positionAt(attr.end));
                        editBuilder.replace(range, sorted);
                    }
                }
            });
        }
    });
    // Command: Format (Multiline)
    var formatCommand = vscode.commands.registerCommand('tailwind-organizer.format', function () {
        var editor = vscode.window.activeTextEditor;
        if (!editor)
            return;
        var config = vscode.workspace.getConfiguration('tailwindOrganizer');
        var threshold = config.get('multilineThreshold', 80);
        var document = editor.document;
        var fullText = document.getText();
        var attributes = (0, parser_1.findClassAttributes)(fullText);
        editor.edit(function (editBuilder) {
            for (var i = attributes.length - 1; i >= 0; i--) {
                var attr = attributes[i];
                var formatted = (0, formatter_1.formatClasses)(attr.content, threshold);
                if (formatted !== attr.content) {
                    var range = new vscode.Range(document.positionAt(attr.start), document.positionAt(attr.end));
                    editBuilder.replace(range, formatted);
                }
            }
        });
    });
    context.subscriptions.push(sortCommand);
    context.subscriptions.push(formatCommand);
    // Hover Provider
    context.subscriptions.push(vscode.languages.registerHoverProvider(['html', 'javascript', 'typescript', 'javascriptreact', 'typescriptreact', 'vue', 'svelte'], new hoverProvider_1.TailwindHoverProvider()));
    // Diagnostics
    var diagnosticCollection = vscode.languages.createDiagnosticCollection('tailwind-organizer');
    context.subscriptions.push(diagnosticCollection);
    if (vscode.window.activeTextEditor) {
        (0, diagnostics_1.updateDiagnostics)(vscode.window.activeTextEditor.document, diagnosticCollection);
    }
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(function (editor) {
        if (editor.document) {
            (0, diagnostics_1.updateDiagnostics)(editor.document, diagnosticCollection);
        }
    }));
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(function (editor) {
        if (editor) {
            (0, diagnostics_1.updateDiagnostics)(editor.document, diagnosticCollection);
        }
    }));
}
function deactivate() { }
