
import { findClassAttributes } from './parser';

export interface SimpleRange {
    startLine: number;
    endLine: number;
}

export function getFoldingRanges(text: string): SimpleRange[] {
    const ranges: SimpleRange[] = [];
    const attributes = findClassAttributes(text);

    attributes.forEach(attr => {
        const startLine = text.substring(0, attr.start).split('\n').length - 1;
        const endLine = text.substring(0, attr.end).split('\n').length - 1;

        if (startLine !== endLine) {
            ranges.push({ startLine, endLine });
        }
    });

    return ranges;
}
