`#version 4`;
`#name Clean Total Override`;
`#description Mega cleanup: cleans selected sectors and ALL their linedefs (preserving tangents).`;
`#author Chuma`;

// Get selected sectors
const sectors = UDB.Map.getSelectedSectors();

// Get explicitly selected linedefs
const lines = UDB.Map.getLinedefs().filter(l => l.selected);

// Check if anything is selected
if (sectors.length === 0 && lines.length === 0) {
    UDB.showMessage("No Sectors or Linedefs selected.");
    UDB.die();
}

let countSectors = 0;
let countLines = 0;

if (sectors.length > 0) {
    const selectedSectorIndices = new Set();
    sectors.forEach(s => selectedSectorIndices.add(s.index));

    // Clean Sectors
    sectors.forEach(s => {
        if (s.special !== 0 || s.tag !== 0) {
            s.special = 0;
            s.tag = 0;
            countSectors++;
        }
    });

    // Mega cleanup: Find all linedefs belonging to the selected sectors
    const allLines = UDB.Map.getLinedefs();

    allLines.forEach(l => {
        let frontSect = l.front !== null ? l.front.sector : null;
        let backSect = l.back !== null ? l.back.sector : null;

        let frontSelected = frontSect !== null && selectedSectorIndices.has(frontSect.index);
        let backSelected = backSect !== null && selectedSectorIndices.has(backSect.index);

        // If this linedef touches at least one selected sector
        if (frontSelected || backSelected) {
            let isTangent = false;

            // It's a tangent if it borders a selected sector AND an unselected sector
            if (l.front !== null && l.back !== null) {
                if ((frontSelected && !backSelected) || (!frontSelected && backSelected)) {
                    isTangent = true;
                }
            }

            // Only clean if it is NOT a tangent linedef (meaning it's fully inside the selection, or a 1-sided outer wall)
            if (!isTangent) {
                if (l.action !== 0 || l.tag !== 0) {
                    l.action = 0;
                    l.tag = 0;
                    countLines++;
                }
            }
        }
    });
} else if (lines.length > 0) {
    // If no sectors are selected, but linedefs are selected, just clean those linedefs explicitly
    lines.forEach(l => {
        if (l.action !== 0 || l.tag !== 0) {
            l.action = 0;
            l.tag = 0;
            countLines++;
        }
    });
}

// Build result message
let msgParts = [];
if (countSectors > 0) {
    msgParts.push(countSectors + " sector(s)");
}
if (countLines > 0) {
    msgParts.push(countLines + " linedef(s)");
}

if (msgParts.length === 0) {
    UDB.showMessage("Selected items are already clean (tangents were preserved).");
} else {
    UDB.showMessage("Mega Cleanup: Cleaned " + msgParts.join(" and ") + ".");
}
