`#version 4`;
`#name Revert Selected Sky Tag`;
`#description Reverts selected sectors' ceiling to map default, brightness to 192, and clears tag and effect.`;
`#author Chuma`;

/**
 * Automates the process of reverting sky sector setup.
 * - Reverts ceiling texture based on adjacent sectors (or CEIL1_1)
 * - Reverts brightness (light level) to 192 (default)
 * - Cleans the sector tag
 * - Cleans the sector effect
 */

// Get selected sectors
const sectors = UDB.Map.getSelectedSectors();

if (sectors.length === 0) {
    UDB.showMessage("No sectors selected. Please select at least one sector.");
    UDB.die();
}

let count = 0;

sectors.forEach(s => {
    // Revert basic properties
    s.brightness = 192;
    s.tag = 0;
    s.effect = 0;
    
    // Algorithm to find a default ceiling texture by looking at adjacent sectors
    let neighborTextures = {};
    s.getSidedefs().forEach(side => {
        let otherSide = side.other;
        if (otherSide && otherSide.sector) {
            let tex = otherSide.sector.ceilingTexture;
            // Ignore sky or null textures when looking for a fallback
            if (tex !== "F_SKY1" && tex !== "-") {
                if (!neighborTextures[tex]) neighborTextures[tex] = 0;
                neighborTextures[tex] += side.line.length; // Weight by shared linedef length
            }
        }
    });

    let bestTex = "CEIL1_1"; // Ultimate fallback if no neighbors are found
    let maxLen = -1;
    
    for (let tex in neighborTextures) {
        if (neighborTextures[tex] > maxLen) {
            maxLen = neighborTextures[tex];
            bestTex = tex;
        }
    }
    
    s.ceilingTexture = bestTex;
    count++;
});

UDB.showMessage(`Reverted Sky Settings (default ceiling, brightness 192, tag 0, effect 0) on ${count} sector(s).`);
