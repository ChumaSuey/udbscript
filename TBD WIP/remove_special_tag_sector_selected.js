`#version 4`;
`#name Remove Special & Tag Selected`;
`#description Sets both Special and Tag to 0 on all selected Sectors.`;
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

    // Reset special and tag
    if (s.special !== 0 || s.tag !== 0) {
        s.special = 0;
        s.tag = 0;
        count++;
    }
});

if (count === 0) {
    UDB.showMessage("No sectors selected or properties were already 0.");
} else {
    UDB.showMessage(`Removed special and tag from ${count} sector(s).`);
}
