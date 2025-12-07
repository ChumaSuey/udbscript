`#version 4`;
`#name Remove Action & Tag Selected`;
`#description Sets both Action and Tag to 0 on all selected Linedefs.`;
`#author Chuma`;

// Get all linedefs
const lines = UDB.Map.getLinedefs();

if (lines.length === 0) {
    UDB.showMessage("No linedefs found in the map.");
    UDB.die();
}

let count = 0;

lines.forEach(l => {
    if (!l.selected) return;

    // Reset action and tag
    if (l.action !== 0 || l.tag !== 0) {
        l.action = 0;
        l.tag = 0;
        count++;
    }
});

if (count === 0) {
    UDB.showMessage("No linedefs selected or properties were already 0.");
} else {
    UDB.showMessage(`Removed action and tag from ${count} linedef(s).`);
}
