# Tailwind Class Organizer

**Tailwind Class Organizer** is a powerful VS Code extension designed to tame your Tailwind CSS classes. It helps you keep your code clean, readable, and consistent by automatically sorting, formatting, and managing class attributes in HTML, JSX, TSX, Vue, and Svelte files.

## Features

### 1. Intelligent Class Sorting
Automatically reorders your Tailwind classes based on a logical, 14-step grouping strategy (Layout -> Display -> Spacing -> Typography -> Colors -> etc.). This ensures a consistent class order across your entire project.

- **Command**: `Tailwind: Sort Classes`
- **Auto-Run**: Can be configured to run automatically on save.

### 2. Multiline Formatting
Transforms long, cluttered class strings into readable, multiline blocks. It respects your editor's indentation settings (tabs or spaces).

- **Command**: `Tailwind: Format Classes (Multiline)`
- **Configuration**: Set a character threshold (default: 80) to trigger multiline formatting.

### 3. Smart Auto-Truncation & Folding
Reduces visual noise by hiding class attributes when you're not working on them.
- **Single-line classes**: Visually truncated to `class="..."` using decorations.
- **Multiline classes**: Automatically folded using VS Code's native folding.
- **Interaction**: Classes automatically reveal/unfold when you click inside them and hide/fold when you move the cursor away.
- **Toggle**: Click the status bar item or use the command `Tailwind: Toggle Truncation`.

### 4. Hover Previews
Hover over any Tailwind class to see a preview of the generated CSS.

### 5. Diagnostics & Linting
Detects and warns about:
- **Conflicts**: Classes that override each other (e.g., `p-4` and `p-8`).
- **Duplicates**: Repeated classes in the same attribute.

### 6. Status Bar Control
A convenient status bar item (`Tailwind: ...`) gives you quick access to toggle features:
- **Auto-Sort**: Enable/Disable sorting on save.
- **Auto-Multiline**: Enable/Disable formatting on save.
- **Truncation**: Enable/Disable the auto-hide feature.

## Usage

### Commands
Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and search for:
- `Tailwind: Sort Classes`: Sorts selected classes or all classes in the file.
- `Tailwind: Format Classes (Multiline)`: Formats classes to multiline.
- `Tailwind: Toggle Truncation`: Toggles the auto-truncation feature.

### Configuration
You can customize the extension in your VS Code settings (`settings.json`):

| Setting | Default | Description |
| :--- | :--- | :--- |
| `tailwindOrganizer.multilineThreshold` | `80` | Character limit before breaking classes into multiple lines. |
| `tailwindOrganizer.enableAutoSort` | `false` | Automatically sort classes when saving the file. |
| `tailwindOrganizer.enableAutoMultiline` | `false` | Automatically format classes to multiline when saving. |
| `tailwindOrganizer.enableTruncation` | `true` | Enable the auto-truncation and folding feature. |

## Supported Languages
- HTML
- JavaScript / TypeScript
- React (JSX / TSX)
- Vue
- Svelte

## Development
To run this extension locally:
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Open the project in VS Code.
4. Press `F5` to launch the Extension Development Host.
