`#version 4`;
`#name Selected Sky Tag`;
`#description Sets selected sectors' ceiling to F_SKY1, brightness to 256, and tag to 1.`;
`#author Chuma`;

/**
 * Automates the process of setting up sky sectors.
 * - Sets ceiling texture to F_SKY1
 * - Sets brightness (light level) to 256
 * - Sets sector tag to 1
 */

// Get selected sectors
const sectors = UDB.Map.getSelectedSectors();

if (sectors.length === 0) {
    UDB.showMessage("No sectors selected. Please select at least one sector.");
    UDB.die();
}

let count = 0;

sectors.forEach(s => {
    // Apply changes
    s.ceilingTexture = "F_SKY1";
    s.brightness = 256;
    s.tag = 1; // Change this value if you want to setup a custom sky sector tag number
    count++;
});

UDB.showMessage(`Applied Sky Settings (F_SKY1, brightness 256, Tag 1) to ${count} sector(s).`);
