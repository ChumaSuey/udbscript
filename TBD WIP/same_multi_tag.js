`#version 4`;
`#name Same Multi Tag`;
`#description Assigns a new unique tag to selected elements. If sectors are selected, it only tags sectors. If not, it checks linedefs, then things.`;
`#author Chuma`;

/**
 * Same Multi Tag Script
 * 
 * Sets the next available unique tag to selected elements.
 * 
 * MODE-AWARE DIFFERENTIATION:
 * 1. If any Sectors are selected, it ONLY tags those sectors.
 * 2. Otherwise, if Linedefs are selected, it ONLY tags those linedefs.
 * 3. Otherwise, if Things are selected, it ONLY tags those things.
 * 4. Failing all selection, it tags the single Highlighted element.
 */

// Get a new unique tag automatically
const newTag = UDB.Map.getNewTag();

// Get selections
function getSelectedItems(all) {
    return all.filter(function (i) { return i.selected; });
}

const selSectors = getSelectedItems(UDB.Map.getSectors());
const selLines = getSelectedItems(UDB.Map.getLinedefs());
const selThings = getSelectedItems(UDB.Map.getThings ? UDB.Map.getThings() : []);

let itemsToTag = [];
let typeName = "";

// DIFFERENTIATION LOGIC: Priority based on what is actually selected
if (selSectors.length > 0) {
    itemsToTag = selSectors;
    typeName = "Sector(s)";
} else if (selLines.length > 0) {
    itemsToTag = selLines;
    typeName = "Linedef(s)";
} else if (selThings.length > 0) {
    itemsToTag = selThings;
    typeName = "Thing(s)";
} else {
    // Fallback to highlighted if nothing is selected
    const hThing = UDB.Map.getHighlightedThing ? UDB.Map.getHighlightedThing() : null;
    const hLine = UDB.Map.getHighlightedLinedef ? UDB.Map.getHighlightedLinedef() : null;
    const hSector = UDB.Map.getHighlightedSector ? UDB.Map.getHighlightedSector() : null;

    if (hThing) { itemsToTag.push(hThing); typeName = "Highlighted Thing"; }
    else if (hLine) { itemsToTag.push(hLine); typeName = "Highlighted Linedef"; }
    else if (hSector) { itemsToTag.push(hSector); typeName = "Highlighted Sector"; }
}

if (itemsToTag.length === 0) {
    UDB.showMessage("Nothing selected or highlighted. Please point at or select elements to tag.");
    UDB.die();
}

// Assign the tag
itemsToTag.forEach(function (item) {
    if (item && item.tag !== undefined) {
        item.tag = newTag;
    }
});

UDB.showMessage("Mode-Aware: Assigned Tag " + newTag + " to " + itemsToTag.length + " " + typeName + ".");
