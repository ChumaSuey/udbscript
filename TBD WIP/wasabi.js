`#version 4`;
`#name SKY Ceiling Lower to Floor`;
`#description Sets the selected sector's ceiling height to the floor height + 1 unit and sets the ceiling texture to F_SKY1.`;
`#author Chuma`;

/**
 * SKY Ceiling Lower to Floor script.
 * 
 * Sets the selected sector's ceiling height to floor height plus 1 unit
 * (so it does not touch the ground fully, preventing standard rendering/collision issues)
 * and sets the ceiling texture to F_SKY1.
 */

// Get selected sectors
const sectors = UDB.Map.getSelectedSectors();

if (sectors.length === 0) {
    UDB.showMessage("No sectors selected. Please select at least one sector.");
    UDB.die();
}

let count = 0;

sectors.forEach(s => {
    // Set ceiling height to floor height + 1 unit (ground minus -1)
    s.ceilingHeight = s.floorHeight + 1;
    
    // Set ceiling texture to F_SKY1 for the sky hack/effect
    s.ceilingTexture = "F_SKY1";
    
    count++;
});

UDB.showMessage(`Set ceiling height to floor + 1 and texture to F_SKY1 on ${count} sector(s).`);
UDB.log(`SKY Ceiling: Modified ${count} sector(s).`);
