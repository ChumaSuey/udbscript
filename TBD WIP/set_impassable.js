`#version 4`;
`#name Set Impassable`;
`#description Sets the Impassable flag on selected lines. Skips lines that are already impassable.`;
`#author Chuma`;

// Get all linedefs
const lines = UDB.Map.getLinedefs();
let count = 0;
let skipped = 0;

// Determine if we are in UDMF to use named flags, otherwise use numbered flags (Doom/Hexen)
// We can check if one of the standard flags exists as a string property
const isUDMF = UDB.Map.isUDMF;

lines.forEach(line => {
    if (!line.selected) return;

    if (isUDMF) {
        // UDMF format - named flags
        if (line.flags['impassable'] === true) {
            skipped++;
            return;
        }
        line.flags['impassable'] = true;
        count++;
    } else {
        // Doom/Hexen format - numbered flags. '1' is Impassable / Block All.
        // Note: In UDBscript, keys for numbered flags are usually strings, e.g. '1'
        if (line.flags['1'] === true) {
            skipped++;
            return;
        }
        line.flags['1'] = true;
        count++;
    }
});

// Show message after function
if (count === 0 && skipped === 0) {
    UDB.showMessage("No lines selected.");
} else {
    UDB.showMessage(`Set Impassable on ${count} lines. Skipped ${skipped} lines already set.`);
}


// Made by Chuma