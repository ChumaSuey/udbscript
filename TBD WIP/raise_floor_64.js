`#version 4`;
`#name Raise Floor 64`;
`#description Raises the floor height of selected sectors by 64 units.`;
`#author Chuma`;

// Revision: Added overrun check. Sectors where raising the floor by 64 would exceed
// the ceiling height are skipped and logged.

// Get selected sectors
const sectors = UDB.Map.getSelectedSectors();

if (sectors.length === 0) {
    UDB.showMessage("No sectors selected. Please select at least one sector.");
    UDB.die();
}

let count = 0;

sectors.forEach(s => {
    let newFloor = s.floorHeight + 64;

    // Revision: Overrun check -- skip if new floor would be at or above ceiling
    if (newFloor >= s.ceilingHeight) {
        UDB.log('Skipping sector ' + s.index + ': raising floor by 64 (' + s.floorHeight + ' -> ' + newFloor + ') would overrun ceiling height (' + s.ceilingHeight + ').');
        return;
    }

    s.floorHeight = newFloor;
    count++;
});

if (count === 0) {
    UDB.showMessage('No sectors raised. All either have insufficient ceiling clearance or none were selected.');
} else {
    UDB.showMessage('Raised floor height by 64 units for ' + count + ' sector(s).');
}
