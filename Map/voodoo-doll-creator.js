`#version 4`;

`#name Draw Voodoo Doll Creator`;

`#author Chuma`;

`#description Creates a voodoo doll creator at the mouse cursor's position. Requires Boom actions. If linedefs are selected when the script is run, those linedefs will have actions assigned that spawn a voodoo doll: if they have a SW1/SW2 texture a S1 action will be applied, if they are double-sided a W1 action will be applied.`;

`#scriptoptions

direction
{
    description = "Direction";
    default = 0;
    type = 11; // Enum
    enumvalues {
        0 = "East";
        45 = "North East";
        90 = "North";
        135 = "North West";
        180 = "West";
        225 = "South West";
        270 = "South";
        315 = "South East";
    }
}

`

// Get the mouse position in the map, snapped to the grid
let basepos = UDB.Map.snappedToGrid(UDB.Map.mousePosition);

// Compute the new voodoo doll position.
let newpos = basepos;

// Get all player 1 starts
let playerthings = UDB.Map.getThings().filter(o => o.type == 1);

// Player 1 Start swapping
// If there are no player 1 starts, it will create a new one at the new position.
if(playerthings.length > 0)
{
    // Sort them by their index, so that the first element is the last player 1 start
    let pt = playerthings.sort((a, b) => b.index - a.index)[0];

    // Store old position and angle
    let oldpos = pt.position;
    let oldangle = pt.angle;

    // Move the last player 1 start to the new position and set its angle.
    pt.position = newpos;
    pt.angle = UDB.ScriptOptions.direction;
    pt.snapToAccuracy();

    // Create a new player 1 start at the old position and restore its angle.
    let t = UDB.Map.createThing(oldpos, 1);
    t.angle = oldangle;
    t.snapToAccuracy();
}
// If there are no player 1 starts, create a new one at the new position.
else
{
    let t = UDB.Map.createThing(newpos, 1);
    t.angle = UDB.ScriptOptions.direction;
    t.snapToAccuracy();
}


// Credits
// Chuma (Programmer).

// My development team Absolute Quantum: Special shoutout to Nepta and Dany. (support and testing)

// Shoutouts
// Special thanks and hugs to Boris and Taviow.
// Special thanks to the Doomworld community for being awesome and supportive.
// Special shoutout to Pacifist Paradise community for existing, long live Meowgi!
// Special shoutout to my team in Skillmaster (Ekate, Boris SdK, Fellow)
// Special Shoutout to the Quake mapping community, especially to the Quake Mapping Discord.
// Hugs for everyone who uses this script!
// HUGS HUGS FOR EVERYONE!