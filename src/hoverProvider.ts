
import * as vscode from 'vscode';

// Mock CSS data for hover preview
// In a real extension, this would come from Tailwind's generated CSS or metadata.
const cssPreviewMap: { [key: string]: string } = {
    "flex": "display: flex;",
    "block": "display: block;",
    "hidden": "display: none;",
    "p-4": "padding: 1rem;",
    "m-4": "margin: 1rem;",
    "text-red-500": "color: #ef4444;",
    "bg-blue-500": "background-color: #3b82f6;",
    // ... add more examples or a generic generator
};

export class TailwindHoverProvider implements vscode.HoverProvider {
    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
        const range = document.getWordRangeAtPosition(position, /[\w-:]+/);
        if (!range) return undefined;

        const word = document.getText(range);
        
        // Simple lookup or generation
        let css = cssPreviewMap[word];
        
        // Generic fallback for simple cases
        if (!css) {
            if (word.startsWith('w-')) css = `width: ${word.replace('w-', '')}; /* approximate */`;
            else if (word.startsWith('h-')) css = `height: ${word.replace('h-', '')}; /* approximate */`;
        }

        if (css) {
            const markdown = new vscode.MarkdownString();
            markdown.appendCodeblock(css, 'css');
            return new vscode.Hover(markdown, range);
        }
        
        return undefined;
    }
}
