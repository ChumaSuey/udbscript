`#version 4`;
`#name Randomize sector properties`;
`#description Randomizes a given property of each selected sector based on a given step size. Step size supports negative values.`;
`#scriptoptions
    type { description = "Type"; type = 11; default = 0; enumvalues { 0 = "Floor"; 1 = "Ceiling"; 2 = "Brightness"; } }
    step { description = "Step size"; type = 0; default = 32;}
    multiplier { description = "Maximum multiplier value"; type = 0; default = 4;}
`;

// Try to get all selected sectors
let sectors = UDB.Map.getSelectedSectors();

if(sectors.length == 0){
    UDB.ShowMessage("No sectors selected");
}

let previousValue = 0;
for (let sector of sectors){    
    do { //Ensures different values each time
        currentValue = randomNumber(0,UDB.ScriptOptions.multiplier);
    } while (currentValue === previousValue);
    
    if (UDB.ScriptOptions.type === 0){
        sector.floorHeight = sector.floorHeight + UDB.ScriptOptions.step*currentValue;        
    }
    if (UDB.ScriptOptions.type === 1){
        sector.ceilingHeight = sector.ceilingHeight + UDB.ScriptOptions.step*currentValue;
    }
    if (UDB.ScriptOptions.type === 2){
        sector.brightness = sector.brightness + UDB.ScriptOptions.step*currentValue;
    }
    previousValue = currentValue;    
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}