`#version 4`;

`#name Ceiling to Floor Selected`;
`#description Lowers the ceiling of selected or highlighted sectors to their floor height.`;
`#author Chuma`;

let sectors = UDB.Map.getSelectedSectors();

if (sectors.length === 0) {
    // Try to get the highlighted sector if nothing is selected
    let highlightedSector = UDB.Map.getHighlightedSector();
    if (highlightedSector) {
        sectors = [highlightedSector];
    }
}

if (sectors.length === 0) {
    UDB.die('Please select or highlight at least one sector.');
}

// Loop through each sector and set its ceiling height to its floor height
for (let i = 0; i < sectors.length; i++) {
    sectors[i].ceilingHeight = sectors[i].floorHeight;
}

UDB.showMessage("Lowered ceiling to floor for " + sectors.length + " sector(s).");
