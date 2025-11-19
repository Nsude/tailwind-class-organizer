import * as vscode from 'vscode';
import { sortClasses } from './sorter';
import { findClassAttributes } from './parser';
import { formatClasses } from './formatter';
import { TailwindHoverProvider } from './hoverProvider';
import { updateDiagnostics } from './diagnostics';
import { TailwindFoldingProvider } from './folding';
import { updateDecorations, clearDecorations } from './decorator';
import { updateAutoFolding } from './foldingManager';

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
        
        const tabSize = typeof editor.options.tabSize === 'number' ? editor.options.tabSize : 4;

        editor.edit(editBuilder => {
            for (let i = attributes.length - 1; i >= 0; i--) {
                const attr = attributes[i];
                
                const startPos = document.positionAt(attr.start);
                const line = document.lineAt(startPos.line);
                const baseIndent = line.text.substring(0, line.firstNonWhitespaceCharacterIndex);

                const formatted = formatClasses(attr.content, threshold, baseIndent, tabSize);
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

    // Truncation / Decorator
    let truncationEnabled = true; // Default to true for now, or make it configurable
    
    // Initial update
    if (vscode.window.activeTextEditor) {
        updateDecorations(vscode.window.activeTextEditor);
    }

    context.subscriptions.push(
        vscode.window.onDidChangeTextEditorSelection(event => {
            if (truncationEnabled && event.textEditor === vscode.window.activeTextEditor) {
                updateDecorations(event.textEditor);
                updateAutoFolding(event.textEditor);
            }
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(event => {
            if (truncationEnabled && vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {
                updateDecorations(vscode.window.activeTextEditor);
                updateAutoFolding(vscode.window.activeTextEditor);
            }
        })
    );
    
    // Status Bar Item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'tailwind-organizer.showMenu';
    context.subscriptions.push(statusBarItem);

    function updateStatusBar() {
        const config = vscode.workspace.getConfiguration('tailwindOrganizer');
        const autoSort = config.get('enableAutoSort', false);
        const autoMulti = config.get('enableAutoMultiline', false);
        // Truncation is managed by local variable 'truncationEnabled' currently, but we should sync it with config
        // For now, let's rely on the config for persistence.
        const trunc = config.get('enableTruncation', true);
        
        statusBarItem.text = `$(paintcan) Tailwind: Sort: ${autoSort ? 'ON' : 'off'} Multi: ${autoMulti ? 'ON' : 'off'} Trunc: ${trunc ? 'ON' : 'off'}`;
        statusBarItem.show();
        
        // Sync local truncation state
        if (trunc !== truncationEnabled) {
            truncationEnabled = trunc;
            if (vscode.window.activeTextEditor) {
                if (truncationEnabled) {
                    updateDecorations(vscode.window.activeTextEditor);
                    updateAutoFolding(vscode.window.activeTextEditor);
                } else {
                    clearDecorations(vscode.window.activeTextEditor);
                    // We don't explicitly unfold everything when disabled, but maybe we should?
                    // For now, let's leave it. The user can manually unfold.
                }
            }
        }
    }

    // Initial update
    updateStatusBar();
    
    // Listen for config changes
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('tailwindOrganizer')) {
            updateStatusBar();
        }
    }));

    // Menu Command
    context.subscriptions.push(vscode.commands.registerCommand('tailwind-organizer.showMenu', async () => {
        const config = vscode.workspace.getConfiguration('tailwindOrganizer');
        const autoSort = config.get('enableAutoSort', false);
        const autoMulti = config.get('enableAutoMultiline', false);
        const trunc = config.get('enableTruncation', true);

        const items = [
            { label: `Auto-Sort: ${autoSort ? 'ON' : 'OFF'}`, description: 'Toggle Auto-Sort on Save', action: 'sort' },
            { label: `Auto-Multiline: ${autoMulti ? 'ON' : 'OFF'}`, description: 'Toggle Auto-Multiline on Save', action: 'multi' },
            { label: `Truncation: ${trunc ? 'ON' : 'OFF'}`, description: 'Toggle Class Truncation & Folding', action: 'trunc' }
        ];

        const selected = await vscode.window.showQuickPick(items, { placeHolder: 'Tailwind Class Organizer Settings' });
        if (selected) {
            if (selected.action === 'sort') await config.update('enableAutoSort', !autoSort, vscode.ConfigurationTarget.Global);
            if (selected.action === 'multi') await config.update('enableAutoMultiline', !autoMulti, vscode.ConfigurationTarget.Global);
            if (selected.action === 'trunc') await config.update('enableTruncation', !trunc, vscode.ConfigurationTarget.Global);
        }
    }));

    // Auto-Run on Save
    context.subscriptions.push(vscode.workspace.onWillSaveTextDocument(e => {
        const config = vscode.workspace.getConfiguration('tailwindOrganizer');
        const autoSort = config.get('enableAutoSort', false);
        const autoMulti = config.get('enableAutoMultiline', false);

        if (!autoSort && !autoMulti) return;

        const document = e.document;
        // Only supported languages
        if (!['html', 'javascript', 'typescript', 'javascriptreact', 'typescriptreact', 'vue', 'svelte'].includes(document.languageId)) return;

        const edits: vscode.TextEdit[] = [];
        const fullText = document.getText();
        const attributes = findClassAttributes(fullText);
        const threshold = config.get<number>('multilineThreshold', 80);
        const tabSize = typeof vscode.window.activeTextEditor?.options.tabSize === 'number' ? vscode.window.activeTextEditor.options.tabSize : 4;

        // We need to process attributes. 
        // Note: onWillSaveTextDocument allows waitUntil with a promise of TextEdits.
        
        attributes.forEach(attr => {
            let content = attr.content;
            let changed = false;

            if (autoSort) {
                const sorted = sortClasses(content);
                if (sorted !== content) {
                    content = sorted;
                    changed = true;
                }
            }

            if (autoMulti) {
                // We need baseIndent. This is hard to get efficiently in onWillSave without an active editor reference for the specific line,
                // but we can parse it from the document text.
                const startPos = document.positionAt(attr.start);
                const line = document.lineAt(startPos.line);
                const baseIndent = line.text.substring(0, line.firstNonWhitespaceCharacterIndex);
                
                const formatted = formatClasses(content, threshold, baseIndent, tabSize);
                if (formatted !== content) {
                    content = formatted;
                    changed = true;
                }
            }

            if (changed) {
                const range = new vscode.Range(
                    document.positionAt(attr.start),
                    document.positionAt(attr.end)
                );
                edits.push(new vscode.TextEdit(range, content));
            }
        });

        e.waitUntil(Promise.resolve(edits));
    }));

    // Update toggleTruncation command to use config
    context.subscriptions.push(vscode.commands.registerCommand('tailwind-organizer.toggleTruncation', async () => {
        const config = vscode.workspace.getConfiguration('tailwindOrganizer');
        const current = config.get('enableTruncation', true);
        await config.update('enableTruncation', !current, vscode.ConfigurationTarget.Global);
    }));
}

export function deactivate() {}
