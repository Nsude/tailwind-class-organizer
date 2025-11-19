"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortOrder = void 0;
exports.sortClasses = sortClasses;
exports.sortOrder = [
    "Layout",
    "Display",
    "Flex/Grid",
    "Positioning",
    "Spacing",
    "Sizing",
    "Typography",
    "Colors",
    "Backgrounds",
    "Borders",
    "Effects",
    "Transitions / Animation",
    "Interactivity",
    "Miscellaneous"
];
// Simplified mapping of prefixes to categories. 
// In a real-world scenario, this would be much more comprehensive or use Tailwind's metadata.
var prefixMap = {
    // Layout
    "container": "Layout", "columns": "Layout", "break": "Layout", "box": "Layout", "float": "Layout", "clear": "Layout", "isolate": "Layout", "object": "Layout", "overflow": "Layout", "overscroll": "Layout", "z": "Layout",
    // Display
    "block": "Display", "inline": "Display", "flex": "Display", "grid": "Display", "table": "Display", "hidden": "Display", "contents": "Display", "list": "Display",
    // Flex/Grid
    "basis": "Flex/Grid", "flex-": "Flex/Grid", "grow": "Flex/Grid", "shrink": "Flex/Grid", "order": "Flex/Grid", "grid-": "Flex/Grid", "col-": "Flex/Grid", "row-": "Flex/Grid", "auto-cols": "Flex/Grid", "auto-rows": "Flex/Grid", "gap": "Flex/Grid", "justify": "Flex/Grid", "content": "Flex/Grid", "items": "Flex/Grid", "self": "Flex/Grid", "place": "Flex/Grid",
    // Positioning
    "static": "Positioning", "fixed": "Positioning", "absolute": "Positioning", "relative": "Positioning", "sticky": "Positioning", "top": "Positioning", "right": "Positioning", "bottom": "Positioning", "left": "Positioning", "inset": "Positioning",
    // Spacing
    "p-": "Spacing", "px-": "Spacing", "py-": "Spacing", "pt-": "Spacing", "pr-": "Spacing", "pb-": "Spacing", "pl-": "Spacing",
    "m-": "Spacing", "mx-": "Spacing", "my-": "Spacing", "mt-": "Spacing", "mr-": "Spacing", "mb-": "Spacing", "ml-": "Spacing",
    "space-": "Spacing",
    // Sizing
    "w-": "Sizing", "min-w": "Sizing", "max-w": "Sizing", "h-": "Sizing", "min-h": "Sizing", "max-h": "Sizing",
    // Typography
    "font-": "Typography", "text-": "Typography", "tracking": "Typography", "leading": "Typography", "align": "Typography", "whitespace": "Typography", "break-": "Typography", "hyphens": "Typography", "content-": "Typography", "uppercase": "Typography", "lowercase": "Typography", "capitalize": "Typography", "normal-case": "Typography", "truncate": "Typography", "decoration": "Typography", "underline": "Typography", "overline": "Typography", "line-through": "Typography", "no-underline": "Typography", "indent": "Typography",
    // Colors (Text color is usually under Typography, but user asked for Colors separate. 
    // Often text-red-500 is typography, but bg-red-500 is background. 
    // Let's put text color in Colors if it matches text-{color})
    // Actually, standard tailwind puts text color in typography. 
    // But let's try to respect the user's wish if possible. 
    // "text-" is ambiguous. Let's stick "text-" in Typography for now as it includes size/weight etc.
    // If the user strictly meant "Colors" as a standalone category, it usually implies text/bg/border colors.
    // However, "Backgrounds" and "Borders" are separate categories.
    // So "Colors" likely refers to text color or fill/stroke.
    // Let's map specific color related prefixes if they don't fit elsewhere.
    "fill": "Colors", "stroke": "Colors",
    // Backgrounds
    "bg-": "Backgrounds", "from-": "Backgrounds", "via-": "Backgrounds", "to-": "Backgrounds",
    // Borders
    "border": "Borders", "divide": "Borders", "outline": "Borders", "ring": "Borders",
    // Effects
    "shadow": "Effects", "opacity": "Effects", "mix": "Effects", "blur": "Effects", "brightness": "Effects", "contrast": "Effects", "drop": "Effects", "grayscale": "Effects", "hue": "Effects", "invert": "Effects", "saturate": "Effects", "sepia": "Effects", "backdrop": "Effects",
    // Transitions / Animation
    "transition": "Transitions / Animation", "duration": "Transitions / Animation", "ease": "Transitions / Animation", "delay": "Transitions / Animation", "animate": "Transitions / Animation",
    // Interactivity
    "accent": "Interactivity", "appearance": "Interactivity", "cursor": "Interactivity", "caret": "Interactivity", "pointer": "Interactivity", "resize": "Interactivity", "scroll": "Interactivity", "snap": "Interactivity", "touch": "Interactivity", "select": "Interactivity", "will-change": "Interactivity",
    // Miscellaneous
    // (Everything else falls here)
};
function getCategory(className) {
    // Handle arbitrary values like w-[10px]
    var cleanClass = className.split('[')[0];
    // Check for exact matches first
    if (prefixMap[cleanClass])
        return prefixMap[cleanClass];
    // Check for prefix matches
    for (var prefix in prefixMap) {
        if (cleanClass.startsWith(prefix)) {
            return prefixMap[prefix];
        }
    }
    // Special handling for "text-" which can be sizing (text-xl) or color (text-red-500)
    if (className.startsWith('text-')) {
        // Heuristic: if it matches a size (xs, sm, base, lg, xl, 2xl...), it's Typography.
        // If it matches a color, it's Colors.
        if (/^text-(xs|sm|base|lg|xl|\d+xl)/.test(className))
            return "Typography";
        return "Colors";
    }
    return "Miscellaneous";
}
function sortClasses(classString) {
    var classes = classString.split(/\s+/).filter(function (c) { return c.length > 0; });
    var grouped = {};
    exports.sortOrder.forEach(function (g) { return grouped[g] = []; });
    classes.forEach(function (c) {
        var category = getCategory(c);
        grouped[category].push(c);
    });
    var result = [];
    exports.sortOrder.forEach(function (g) {
        // Sort alphabetically within groups for consistency
        grouped[g].sort();
        result = result.concat(grouped[g]);
    });
    return result.join(" ");
}
