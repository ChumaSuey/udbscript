`#version 4`;
`#name Remove Special Sector Selected`;
`#description Sets the Special to 0 on all selected Sectors.`;
`#author Chuma`;

// Get all sectors
const sectors = UDB.Map.getSectors();

if (sectors.length === 0) {
    UDB.showMessage("No sectors found in the map.");
    UDB.die();
}

let count = 0;

sectors.forEach(s => {
    if (!s.selected) return;

    // Reset the special
    if (s.special !== 0) {
        s.special = 0;
        count++;
    }
});

if (count === 0) {
    UDB.showMessage("No sectors selected or specials were already 0.");
} else {
    UDB.showMessage(`Removed special from ${count} sector(s).`);
}
