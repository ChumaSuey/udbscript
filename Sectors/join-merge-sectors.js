`#version 4`;
`#name Join/merge same sectors`;
`#author Xulgonoth and boris`;
`#description Joins or merges sectors with the same properties. Note that this can cause problems with sound propagation and other stuff. Either processes the selected sectors or all sectors in the map.`;
`#scriptoptions
    method { description = "Method"; type = 11; default = 1; enumvalues { 0 = "Join"; 1 = "Merge"; } }
`;

// Try to get all selected sectors
let sectors = UDB.Map.getSelectedSectors();

// No sectors!?
if(sectors.length == 0)
    UDB.die('There are no sectors to process');

// Keep going as long as there are sectors to process
while(sectors.length > 0)
{
    // Get the firstmost sector in the list
    const currentSector = sectors.shift()

    // Find all sectors with the same properties of the current sector
    let sameSectors = sectors.filter(s => 
        currentSector.brightness == s.brightness &&
        currentSector.ceilingHeight == s.ceilingHeight &&
        currentSector.ceilingTexture == s.ceilingTexture &&
        currentSector.floorHeight == s.floorHeight &&
        currentSector.floorTexture == s.floorTexture &&
        currentSector.special == s.special &&
        currentSector.tag == s.tag
    );

    // Remove the sectors we're about to join/merge from the list of all sectors
    sectors = sectors.filter(s => !sameSectors.includes(s));

    // Join or merge the sectors
    if(UDB.ScriptOptions.method == 0)
        UDB.Map.joinSectors([...sameSectors, currentSector ]);
    else
        UDB.Map.mergeSectors([...sameSectors, currentSector ]);
}