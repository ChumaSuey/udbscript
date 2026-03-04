`#version 4`;
`#name Clean Total`;
`#description Sets Action/Special and Tag to 0 for selected Linedefs or Sectors (individually).`;
`#author Chuma`;

// Get selected sectors
const sectors = UDB.Map.getSelectedSectors();

// Get selected linedefs
const lines = UDB.Map.getLinedefs().filter(l => l.selected);

// Check if anything is selected
if (sectors.length === 0 && lines.length === 0) {
    UDB.showMessage("No Sectors or Linedefs selected.");
    UDB.die();
}

let countSectors = 0;
let countLines = 0;

if (sectors.length > 0) {
    // If sectors are selected, ONLY clean the selected sectors
    sectors.forEach(s => {
        // Check if cleaning is needed
        if (s.special !== 0 || s.tag !== 0) {
            s.special = 0;
            s.tag = 0;
            countSectors++;
        }
    });
} else if (lines.length > 0) {
    // If only linedefs are selected, ONLY clean the selected linedefs
    lines.forEach(l => {
        // Check if cleaning is needed
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
    UDB.showMessage("Selected items are already clean.");
} else {
    UDB.showMessage("Cleaned total: " + msgParts.join(" and ") + ".");
}
