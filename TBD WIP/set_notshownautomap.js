`#version 4`;
`#name Set Not Shown on Automap`;
`#description Sets the 'Not shown on automap' flag on selected lines.`;
`#author Chuma`;

// Get all linedefs
const lines = UDB.Map.getLinedefs();
let count = 0;
let skipped = 0;

// Determine if we are in UDMF to use named flags, otherwise use numbered flags (Doom/Hexen)
const isUDMF = UDB.Map.isUDMF;

lines.forEach(line => {
    if (!line.selected) return;

    if (isUDMF) {
        // UDMF format - named flags
        // 'dontdraw' is typically used for "Not shown on automap" (ML_DONTDRAW)
        if (line.flags['dontdraw'] === true) {
            skipped++;
            return;
        }
        line.flags['dontdraw'] = true;
        count++;
    } else {
        // Doom/Hexen format - numbered flags. '128' is Not shown on automap.
        if (line.flags['128'] === true) {
            skipped++;
            return;
        }
        line.flags['128'] = true;
        count++;
    }
});

// Show message after function
if (count === 0 && skipped === 0) {
    UDB.showMessage("No lines selected.");
} else {
    UDB.showMessage(`Set Not Shown on Automap on ${count} lines. Skipped ${skipped} lines already set.`);
}
