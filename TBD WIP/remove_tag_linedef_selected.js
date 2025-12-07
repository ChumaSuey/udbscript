`#version 4`;
`#name Remove Tag Linedef Selected`;
`#description Sets the Tag to 0 on all selected Linedefs.`;
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

    // Reset the tag
    if (l.tag !== 0) {
        l.tag = 0;
        count++;
    }
});

if (count === 0) {
    UDB.showMessage("No linedefs selected or tags were already 0.");
} else {
    UDB.showMessage(`Removed tag from ${count} linedef(s).`);
}
