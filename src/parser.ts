
// Removed vscode import to allow standalone testing
// import * as vscode from 'vscode';

// Regex to find class attributes. 
// Matches class="..." className="..." :class="..." [class]="..."
// Captures the content inside quotes.
const CLASS_ATTRIBUTE_REGEX = /(?:class|className|:class|\[class\])\s*=\s*["']([^"']*)["']/g;

export interface ClassAttribute {
    start: number;
    end: number;
    content: string;
}

export function findClassAttributes(text: string): ClassAttribute[] {
    const matches: ClassAttribute[] = [];
    let match;
    while ((match = CLASS_ATTRIBUTE_REGEX.exec(text)) !== null) {
        matches.push({
            start: match.index + match[0].indexOf(match[1]), // Start of the content
            end: match.index + match[0].indexOf(match[1]) + match[1].length, // End of the content
            content: match[1]
        });
    }
    return matches;
}
