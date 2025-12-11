`#version 4`;
`#name Assign Last Used Tag`;
`#description Assigns the highest currently used Tag to selected Linedefs and Sectors.`;
`#author Chuma`;

// Find the highest used tag in the map
let maxTag = 0;

UDB.Map.getSectors().forEach(s => {
    if (s.tag > maxTag) maxTag = s.tag;
});

UDB.Map.getLinedefs().forEach(l => {
    if (l.tag > maxTag) maxTag = l.tag;
});

if (maxTag === 0) {
    UDB.showMessage("No tags found in the map.");
    UDB.die();
}

// Get selection
const selectedSectors = UDB.Map.getSelectedSectors();
const lines = UDB.Map.getLinedefs().filter(l => l.selected);

if (selectedSectors.length === 0 && lines.length === 0) {
    UDB.showMessage("No Sectors or Linedefs selected.");
    UDB.die();
}

let count = 0;

// Apply tag
if (selectedSectors.length > 0) {
    selectedSectors.forEach(s => {
        if (s.tag !== maxTag) {
            s.tag = maxTag;
            count++;
        }
    });

    if (count === 0) {
        UDB.showMessage("Selected sectors already have Tag " + maxTag + ".");
    } else {
        UDB.showMessage("Assigned Tag " + maxTag + " to " + count + " sector(s).");
    }
} else {
    lines.forEach(l => {
        if (l.tag !== maxTag) {
            l.tag = maxTag;
            count++;
        }
    });

    if (count === 0) {
        UDB.showMessage("Selected linedefs already have Tag " + maxTag + ".");
    } else {
        UDB.showMessage("Assigned Tag " + maxTag + " to " + count + " linedef(s).");
    }
}
