# Change Log

All notable changes to the "Tailwind Class Organizer" extension will be documented in this file.

## [0.0.3] - 2025-11-26
- Fixed: Template literal parsing now supports embedded expressions (e.g., `className={\`${condition ? 'class1' : 'class2'} other-classes\`}`)
- Improved: Parser rewritten to use character-by-character approach for better handling of complex JSX patterns
- Fixed: Properly handles nested curly braces and ternary operators within template literals

## [0.0.2] - 2025-11-26
- Added: Plugin thumbnail/icon

## [0.0.1] - 2025-11-19
- Initial release
- Feature: Sort Tailwind classes (Layout -> Display -> ... -> Misc)
- Feature: Multiline formatting with configurable threshold
- Feature: Auto-Truncation for single-line classes
- Feature: Auto-Folding for multiline classes
- Feature: Hover previews for CSS
- Feature: Diagnostics for conflicting and duplicate classes
- Feature: Auto-Run on Save (Sort & Format)
- Feature: Status Bar controls
