`#version 4`;
`#name Floor to Ceiling Selected`;
`#description Sets the floor height of selected sectors to match their ceiling height.`;
`#author Chuma`;

// Get selected sectors
const sectors = UDB.Map.getSelectedSectors();

if (sectors.length === 0) {
    UDB.showMessage("No sectors selected. Please select at least one sector.");
    UDB.die();
}

let count = 0;

sectors.forEach(s => {
    // Only update if they aren't already equal
    if (s.floorHeight !== s.ceilingHeight) {
        s.floorHeight = s.ceilingHeight;
        count++;
    }
});

if (count === 0) {
    UDB.showMessage("Selected sectors already have floor height matching ceiling height.");
} else {
    UDB.showMessage(`Set floor to ceiling height for ${count} sector(s).`);
}
