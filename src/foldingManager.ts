
import * as vscode from 'vscode';
import { findClassAttributes } from './parser';

export async function updateAutoFolding(editor: vscode.TextEditor) {
    if (!editor) return;

    const document = editor.document;
    const text = document.getText();
    const attributes = findClassAttributes(text);
    const selection = editor.selection;

    const linesToFold: number[] = [];
    const linesToUnfold: number[] = [];

    attributes.forEach(attr => {
        const startPos = document.positionAt(attr.start);
        const endPos = document.positionAt(attr.end);
        
        // Check if multiline
        if (startPos.line !== endPos.line) {
            const range = new vscode.Range(startPos, endPos);
            
            // Check if cursor is inside
            if (range.contains(selection.active) || selection.intersection(range)) {
                // Cursor inside -> Unfold
                linesToUnfold.push(startPos.line);
            } else {
                // Cursor outside -> Fold
                linesToFold.push(startPos.line);
            }
        }
    });

    // Execute commands
    // Note: 'editor.fold' and 'unfold' work on selection or specific lines. 
    // We can pass arguments to them.
    // However, calling them repeatedly might be slow or cause flickering. 
    // Ideally we check if they are already folded. But VS Code API doesn't easily expose "isFolded" state for a line.
    // We will try to be smart: only fold if we think it's needed? 
    // Actually, just calling it is the most robust way, but we should be careful.
    // Let's try to batch them.
    
    if (linesToFold.length > 0) {
        await vscode.commands.executeCommand('editor.fold', { selectionLines: linesToFold, levels: 1, direction: 'up' });
    }
    
    if (linesToUnfold.length > 0) {
        await vscode.commands.executeCommand('editor.unfold', { selectionLines: linesToUnfold });
    }
}
