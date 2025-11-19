"use strict";
// import * as vscode from 'vscode';
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatClasses = formatClasses;
function formatClasses(classString, threshold = 80) {
    const classes = classString.split(/\s+/).filter(c => c.length > 0);
    if (classString.length <= threshold) {
        return classes.join(' ');
    }
    // Simple multiline strategy: one class per line if it exceeds threshold?
    // Or maybe group by category?
    // For now, let's just wrap them nicely.
    // Better strategy: Try to fit as many as possible on one line, then break.
    // But usually "multiline" in Tailwind context means:
    // class="
    //   flex
    //   items-center
    //   justify-center
    // "
    return '\n' + classes.map(c => `  ${c}`).join('\n') + '\n';
}
//# sourceMappingURL=formatter.js.map