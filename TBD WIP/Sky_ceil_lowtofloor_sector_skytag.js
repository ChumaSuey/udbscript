`#version 4`;
`#name SKY Ceiling Lower to Floor (Sky Tag)`;
`#description Sets the selected sector's ceiling height to floor height + 1, sets ceiling texture to F_SKY1, and sets the sector tag to 1.`;
`#author Chuma`;

/**
 * SKY Ceiling Lower to Floor (Sky Tag) script.
 * 
 * Sets the selected sector's ceiling height to floor height plus 1 unit
 * (so it does not touch the ground fully, preventing standard rendering/collision issues),
 * sets the ceiling texture to F_SKY1, and assigns sector tag 1.
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
    
    // Set brightness to 256 to keep workflow (Chuma's workflow)
    s.brightness = 256;
    
    // Set the sector tag to 1.
    // Note: This is part of the "Selected Skytag workflow" and can be changed if a different tag is needed.
    s.tag = 1;
    
    count++;
});

UDB.showMessage(`Set ceiling to floor + 1, texture to F_SKY1, brightness to 256, and tag to 1 on ${count} sector(s).`);
UDB.log(`SKY Ceiling (Sky Tag): Modified ${count} sector(s).`);
