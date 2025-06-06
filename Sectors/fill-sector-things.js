`#version 5`;
`#author taviow`;
`#name Fill sector with things`;

`#description Fill the current sector with things.`;

`#scriptoptions

type
{
    description = "Type of thing to be placed";
    type = 18;
}

grid
{
    description = "Spacing";
    default = 64;
    type = 0; // Integer
}
offset
{
    description = "Random offset interval (+- value)";
    default = 0;
    type = 0; // Integer
}
cautious
{
    description = "Cautious placement";
    default = "True";
    type = 3; // Boolean
}
`;

const padding = 32;
const stepSize = UDB.ScriptOptions.grid;
const blockmap = new UDB.BlockMap(true, false, false, false); //Lines only

UDB.Map.getSelectedSectors().forEach(s => {
    const vertices = [...new Set(s.getSidedefs().map(sd => [ sd.line.start, sd.line.end ]).flat()) ]
    
    const xValues = [...new Set(vertices.map(v => v.position.x)) ];
    xValues.sort((a, b) => a - b);

    const yValues = [... new Set(vertices.map(v => v.position.y)) ];
    yValues.sort((a, b) => a - b);

    for(let x=xValues[0] + padding; x <= xValues[xValues.length-1] - padding; x += stepSize)
    {
        for(let y=yValues[0] + padding; y <= yValues[yValues.length-1] - padding; y += stepSize)
        {
            offsetX = randomInt(-UDB.ScriptOptions.offset,UDB.ScriptOptions.offset);
            offsetY = randomInt(-UDB.ScriptOptions.offset,UDB.ScriptOptions.offset);
            
            x += offsetX;
            y += offsetY;
            
            if(s.intersect([ x, y ])){
                if (UDB.ScriptOptions.cautious){
                    if (!(blockmap.getBlockAt([x,y])).getLinedefs().some(l => UDB.Line2D.getDistanceToLine(l.start.position, l.end.position, [ x, y ])<stepSize/Math.sqrt(2))){
                        UDB.Map.createThing([ x, y], UDB.ScriptOptions.type);
                    }
                } else {
                    UDB.Map.createThing([ x, y], UDB.ScriptOptions.type);
                }                
            }
        }
    }
});

function randomInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}