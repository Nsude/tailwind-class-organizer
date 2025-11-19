
import * as vscode from 'vscode';
import { getFoldingRanges } from './folding-utils';

export class TailwindFoldingProvider implements vscode.FoldingRangeProvider {
    provideFoldingRanges(document: vscode.TextDocument, context: vscode.FoldingContext, token: vscode.CancellationToken): vscode.ProviderResult<vscode.FoldingRange[]> {
        const text = document.getText();
        const ranges = getFoldingRanges(text);
        
        return ranges.map(r => new vscode.FoldingRange(r.startLine, r.endLine, vscode.FoldingRangeKind.Region));
    }
}
