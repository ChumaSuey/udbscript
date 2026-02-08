`#version 4`;
`#name Raise Floor 64`;
`#description Raises the floor height of selected sectors by 64 units.`;
`#author Chuma`;

// Get selected sectors
const sectors = UDB.Map.getSelectedSectors();

if (sectors.length === 0) {
    UDB.showMessage("No sectors selected. Please select at least one sector.");
    UDB.die();
}

let count = 0;

sectors.forEach(s => {
    s.floorHeight += 64;
    count++;
});

UDB.showMessage(`Raised floor height by 64 units for ${count} sector(s).`);
