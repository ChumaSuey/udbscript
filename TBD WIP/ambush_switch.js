`#version 4`;
`#name Ambush Switch`;
`#description Toggles the Ambush flag on the most recently created Thing.`;
`#author Chuma`;

// Get all things
const things = UDB.Map.getThings();

if (things.length === 0) {
    UDB.showMessage("No things found in the map.");
    UDB.die(); // Stop execution
}

// Find the thing with the highest index (assumed to be the last created)
let lastThing = things[0];

things.forEach(t => {
    if (t.index > lastThing.index) {
        lastThing = t;
    }
});

// Determine flag name based on map format
const isUDMF = UDB.Map.isUDMF;
let flagName = '8'; // Standard Doom/Hexen "Ambush" flag is 8

if (isUDMF) {
    flagName = 'ambush';
}

// Toggle the flag
const currentVal = lastThing.flags[flagName];
const newVal = !currentVal;
lastThing.flags[flagName] = newVal;

// Construct message
const statusText = newVal ? "enabled" : "disabled";
UDB.showMessage(`Ambush flag ${statusText} on Thing ${lastThing.index}.`);
