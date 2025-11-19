
// import * as vscode from 'vscode';

export function formatClasses(classString: string, threshold: number = 80): string {
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
