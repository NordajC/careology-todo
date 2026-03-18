// ── Tag Styling Helper ──

export function getTagStyle(tag: string): { bg: string; color: string } {
    switch (tag) {
        case "High":   return { bg: "pink.200",   color: "black" };
        case "Medium": return { bg: "yellow.100", color: "black" };
        case "Low":    return { bg: "gray.200",   color: "black" };
        default:       return { bg: "gray.100",   color: "black" };
    }
}