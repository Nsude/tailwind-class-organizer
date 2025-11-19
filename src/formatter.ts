
// import * as vscode from 'vscode';

export function formatClasses(classString: string, threshold: number = 80, baseIndent: string = '', tabSize: number = 4): string {
    const classes = classString.split(/\s+/).filter(c => c.length > 0);
    
    if (classString.length <= threshold) {
        return classes.join(' ');
    }

    const indent = ' '.repeat(tabSize);
    const childIndent = baseIndent + indent;
    
    return '\n' + classes.map(c => `${childIndent}${c}`).join('\n') + `\n${baseIndent}`;
}
