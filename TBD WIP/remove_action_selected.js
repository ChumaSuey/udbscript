`#version 4`;
`#name Remove Action Selected`;
`#description Sets the Action to 0 on all selected Linedefs.`;
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

    // Reset the action
    if (l.action !== 0) {
        l.action = 0;
        count++;
    }
});

if (count === 0) {
    UDB.showMessage("No linedefs selected or actions were already 0.");
} else {
    UDB.showMessage(`Removed action from ${count} linedef(s).`);
}
