`#version 4`;
`#name Ambush Switch Selected`;
`#description Toggles the Ambush flag on all selected Things.`;
`#author Chuma`;

// Get all things
const things = UDB.Map.getThings();

if (things.length === 0) {
    UDB.showMessage("No things found in the map.");
    UDB.die();
}

let count = 0;

// Determine flag name based on map format
const isUDMF = UDB.Map.isUDMF;
let flagName = '8'; // Standard Doom/Hexen "Ambush" flag is 8

if (isUDMF) {
    flagName = 'ambush';
}

things.forEach(t => {
    if (!t.selected) return;

    // Toggle the flag
    const currentVal = t.flags[flagName];
    const newVal = !currentVal;
    t.flags[flagName] = newVal;

    count++;
});

if (count === 0) {
    UDB.showMessage("No things selected.");
} else {
    UDB.showMessage(`Toggled Ambush flag on ${count} thing(s).`);
}
