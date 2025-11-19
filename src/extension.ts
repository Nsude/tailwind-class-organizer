import * as vscode from 'vscode';
import { sortClasses } from './sorter';
import { findClassAttributes } from './parser';
import { formatClasses } from './formatter';
import { TailwindHoverProvider } from './hoverProvider';
import { updateDiagnostics } from './diagnostics';
import { TailwindFoldingProvider } from './folding';

export function activate(context: vscode.ExtensionContext) {
    console.log('Tailwind Class Organizer is now active!');

    // Command: Sort Selection
    let sortCommand = vscode.commands.registerCommand('tailwind-organizer.sort', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const document = editor.document;
        const selection = editor.selection;
        const text = document.getText(selection);

        if (text.trim().length > 0) {
            // If user selected text, just sort that text (assuming it's a list of classes)
            const sorted = sortClasses(text);
            editor.edit(editBuilder => {
                editBuilder.replace(selection, sorted);
            });
        } else {
            // If no selection, sort ALL class attributes in the file
            const fullText = document.getText();
            const attributes = findClassAttributes(fullText);
            
            editor.edit(editBuilder => {
                // Process in reverse order to avoid messing up indices
                for (let i = attributes.length - 1; i >= 0; i--) {
                    const attr = attributes[i];
                    const sorted = sortClasses(attr.content);
                    if (sorted !== attr.content) {
                        const range = new vscode.Range(
                            document.positionAt(attr.start),
                            document.positionAt(attr.end)
                        );
                        editBuilder.replace(range, sorted);
                    }
                }
            });
        }
    });

    // Command: Format (Multiline)
    let formatCommand = vscode.commands.registerCommand('tailwind-organizer.format', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const config = vscode.workspace.getConfiguration('tailwindOrganizer');
        const threshold = config.get<number>('multilineThreshold', 80);

        const document = editor.document;
        const fullText = document.getText();
        const attributes = findClassAttributes(fullText);

        editor.edit(editBuilder => {
            for (let i = attributes.length - 1; i >= 0; i--) {
                const attr = attributes[i];
                const formatted = formatClasses(attr.content, threshold);
                if (formatted !== attr.content) {
                    const range = new vscode.Range(
                        document.positionAt(attr.start),
                        document.positionAt(attr.end)
                    );
                    editBuilder.replace(range, formatted);
                }
            }
        });
    });


    context.subscriptions.push(sortCommand);
    context.subscriptions.push(formatCommand);

    // Hover Provider
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            ['html', 'javascript', 'typescript', 'javascriptreact', 'typescriptreact', 'vue', 'svelte'],
            new TailwindHoverProvider()
        )
    );

    // Diagnostics
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('tailwind-organizer');
    context.subscriptions.push(diagnosticCollection);

    if (vscode.window.activeTextEditor) {
        updateDiagnostics(vscode.window.activeTextEditor.document, diagnosticCollection);
    }

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(editor => {
            if (editor.document) {
                updateDiagnostics(editor.document, diagnosticCollection);
            }
        })
    );


    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) {
                updateDiagnostics(editor.document, diagnosticCollection);
            }
        })
    );

    // Folding Provider
    context.subscriptions.push(
        vscode.languages.registerFoldingRangeProvider(
            ['html', 'javascript', 'typescript', 'javascriptreact', 'typescriptreact', 'vue', 'svelte'],
            new TailwindFoldingProvider()
        )
    );
}

export function deactivate() {}
