`#version 4`;
`#name Create 242 Invisible Wall from Floor`;
`#description Creates an invisible wall from the floor, assigns a tag, and creates a control sector at cursor position.`;
`#author Chuma`;

// This script is designed to assist in creating invisible walls using the 242 transfer effect.
// It sets up a control sector (at the mouse cursor) to create a "fake floor", allowing the
// selected sector to be raised (Floor = Ceiling - 1) to block movement while remaining invisible.
// Check if any sector is selected
const sectors = UDB.Map.getSelectedSectors();

if (sectors.length === 0) {
    UDB.showMessage("Please select at least one sector to link.");
    UDB.die();
}

// Get mouse position for the new sector
// Note: This requires the script to be run via hotkey while mouse is in the map view
const pos = UDB.Map.mousePosition;

// Calculate Triangle Coordinates (equilateral-ish 30 units)
// Center at pos
// Height ~ 26 units
const size = 30;
const h = size * Math.sqrt(3) / 2;
const half = size / 2;
// Centroid offset: center of mass is h/3 from base
const centY = h / 3;

// Vertices relative to center (pos)
// We need to determine orientation.
// Let's make it compatible with standard Doom drawing.
// V1 Top, V2 Bottom Right, V3 Bottom Left.
const v1Pos = new UDB.Vector2D(pos.x, pos.y + (2 * h / 3));
const v2Pos = new UDB.Vector2D(pos.x + half, pos.y - (h / 3));
const v3Pos = new UDB.Vector2D(pos.x - half, pos.y - (h / 3));

// Draw Triangle
// We need 4 points to close the loop: V1 -> V2 -> V3 -> V1
const vertices = [v1Pos, v2Pos, v3Pos, v1Pos];

// Draw lines
UDB.Map.drawLines(vertices);

// Get the new sector (assumed to be the last one created)
const sectorsList = UDB.Map.getSectors();
const newSector = sectorsList[sectorsList.length - 1];

if (!newSector) {
    UDB.showMessage("Created geometry but failed to retrieve new sector.");
    UDB.die();
}

// Get the lines we just drew. 
// Assumption: They are the last 3 lines in the map.
// This is a common pattern in UDB scripts since drawLines doesn't return the objects.
// Note: If drawing crossed other lines, this might be slightly off, but for a control sector in void it's fine.
const allLines = UDB.Map.getLinedefs();
const l1 = allLines[allLines.length - 3];
const l2 = allLines[allLines.length - 2];
const l3 = allLines[allLines.length - 1];

// Get a unique tag
const newTag = UDB.Map.getNewTag();

// Apply Tag to Selected Sectors and Raise Floor (Invisible Wall)
let taggedCount = 0;
sectors.forEach(s => {
    s.tag = newTag;
    // Invisible wall logic: Floor meets Ceiling (almost)
    s.floorHeight = s.ceilingHeight - 1;
    taggedCount++;
});

// Configure Control Sector
// Linedef Action 242 on ONE linedef (l1)
l1.action = 242;
l1.tag = newTag;

// SetTextures to "-" (None) and hide on automap
[l1, l2, l3].forEach(l => {
    l.flags['128'] = true;
    if (l.front) {
        l.front.upperTexture = "-";
        l.front.middleTexture = "-";
        l.front.lowerTexture = "-";
    }
    if (l.back) {
        l.back.upperTexture = "-";
        l.back.middleTexture = "-";
        l.back.lowerTexture = "-";
    }
});

UDB.showMessage(`Created 242 Control Sector with Tag ${newTag} linked to ${taggedCount} sector(s).`);
