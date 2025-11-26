// Removed vscode import to allow standalone testing
// import * as vscode from 'vscode';

export interface ClassAttribute {
    start: number;
    end: number;
    content: string;
}

/**
 * Finds class attributes in the given text, including complex cases like:
 * - class="..." className="..." :class="..." [class]="..."
 * - className={"..."} className={'...'} className={`...`}
 * - Template literals with embedded expressions: className={`${expr} classes`}
 */
export function findClassAttributes(text: string): ClassAttribute[] {
    const matches: ClassAttribute[] = [];
    const classPatterns = ['class', 'className', ':class', '[class]'];
    
    for (const pattern of classPatterns) {
        let searchIndex = 0;
        
        while (searchIndex < text.length) {
            const patternIndex = text.indexOf(pattern, searchIndex);
            if (patternIndex === -1) break;
            
            // Check if this is actually an attribute (followed by =)
            let i = patternIndex + pattern.length;
            while (i < text.length && /\s/.test(text[i])) i++;
            
            if (i >= text.length || text[i] !== '=') {
                searchIndex = patternIndex + 1;
                continue;
            }
            
            // Skip past the '=' and any whitespace
            i++;
            while (i < text.length && /\s/.test(text[i])) i++;
            
            if (i >= text.length) break;
            
            // Check what type of value we have
            const char = text[i];
            let content = '';
            let contentStart = -1;
            let contentEnd = -1;
            
            if (char === '"' || char === "'") {
                // Simple quoted string: class="..." or class='...'
                const quote = char;
                contentStart = i + 1;
                i++;
                while (i < text.length && text[i] !== quote) {
                    if (text[i] === '\\') i++; // Skip escaped characters
                    i++;
                }
                contentEnd = i;
                content = text.substring(contentStart, contentEnd);
            } else if (char === '{') {
                // JSX expression: className={...}
                i++; // Skip opening {
                while (i < text.length && /\s/.test(text[i])) i++;
                
                if (i < text.length) {
                    const innerChar = text[i];
                    if (innerChar === '"' || innerChar === "'" || innerChar === '`') {
                        // className={"..."} or className={'...'} or className={`...`}
                        const quote = innerChar;
                        contentStart = i + 1;
                        i++;
                        
                        if (quote === '`') {
                            // Template literal - need to handle ${...} expressions
                            let depth = 0;
                            while (i < text.length) {
                                if (text[i] === '\\') {
                                    i += 2; // Skip escaped character
                                    continue;
                                }
                                if (text[i] === '$' && i + 1 < text.length && text[i + 1] === '{') {
                                    depth++;
                                    i += 2;
                                    continue;
                                }
                                if (text[i] === '}' && depth > 0) {
                                    depth--;
                                    i++;
                                    continue;
                                }
                                if (text[i] === '`' && depth === 0) {
                                    break;
                                }
                                i++;
                            }
                        } else {
                            // Regular string
                            while (i < text.length && text[i] !== quote) {
                                if (text[i] === '\\') i++; // Skip escaped characters
                                i++;
                            }
                        }
                        
                        contentEnd = i;
                        content = text.substring(contentStart, contentEnd);
                    }
                }
            }
            
            if (contentStart !== -1 && contentEnd !== -1 && content) {
                matches.push({
                    start: contentStart,
                    end: contentEnd,
                    content: content
                });
            }
            
            searchIndex = patternIndex + 1;
        }
    }
    
    return matches;
}
