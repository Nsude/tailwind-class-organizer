
import * as vscode from 'vscode';
import { findClassAttributes } from './parser';

// Decoration to hide the text
const hideDecorationType = vscode.window.createTextEditorDecorationType({
    textDecoration: 'none; display: none;', // Hides the text
});

// Decoration to show the "..." placeholder
// We apply this to the same range, but since the text is hidden, we need to use 'before' or 'after' 
// to show something. Actually, if we hide the text, the range collapses. 
// We can use 'after' on the character *before* the range, or just use a replacement decoration?
// VS Code doesn't support "replace" directly in decorations easily without hiding.
// Let's try adding '...' as 'after' content to the Quote starting the class.
// Wait, if we hide the content, we want `class="..."`.
// So we hide the content `foo bar baz` inside `class="foo bar baz"`.
// And we add `...` to the `class="` part? Or just make the hidden decoration have a `before` or `after` content of `...`.

const placeholderDecorationType = vscode.window.createTextEditorDecorationType({
    before: {
        contentText: '...',
        color: new vscode.ThemeColor('editor.foreground'),
        margin: '0 2px',
        fontStyle: 'italic'
    }
});

export function updateDecorations(editor: vscode.TextEditor) {
    if (!editor) return;

    const document = editor.document;
    const text = document.getText();
    const attributes = findClassAttributes(text);
    const selection = editor.selection;

    const rangesToHide: vscode.Range[] = [];

    attributes.forEach(attr => {
        const startPos = document.positionAt(attr.start);
        const endPos = document.positionAt(attr.end);
        
        // Ignore multiline attributes (handled by foldingManager)
        if (startPos.line !== endPos.line) {
            return;
        }

        const range = new vscode.Range(startPos, endPos);

        // Check if cursor is inside this range
        // We use 'contains' but we might want to be lenient (if cursor is at edges).
        // If selection intersects the range, show it.
        if (range.contains(selection.active) || selection.intersection(range)) {
            // Cursor is here, do NOT hide.
        } else {
            // Cursor is away, hide this content.
            rangesToHide.push(range);
        }
    });

    editor.setDecorations(hideDecorationType, rangesToHide);
    editor.setDecorations(placeholderDecorationType, rangesToHide);
}

export function clearDecorations(editor: vscode.TextEditor) {
    editor.setDecorations(hideDecorationType, []);
    editor.setDecorations(placeholderDecorationType, []);
}
