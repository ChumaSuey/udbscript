`#version 5`;

`#name Dot landscape with decorations`;

`#author taviow`;

`#description Fills each selected sector with user specified decorations.`;

`#scriptoptions

chance
{
    description = "Chance to spawn";
    default = 0.05;
    type = 1;    
}

grid
{
    description = "Space between Things";
    default = 64;
    type = 0; // Integer
}

offset
{
    description = "Random offset interval (+- value)";
    default = 16;
    type = 0; // Integer
}
`;

const blockmap = new UDB.BlockMap(true, false, false, false); //Lines only
const qoNumThingTypes = new UDB.QueryOptions();
const taken = [];

qoNumThingTypes.addOption('numthingtypes', 'Number of thing types', 0, 1);

if(!qoNumThingTypes.query())
    UDB.die('Canceled');

const qoThingTypes = new UDB.QueryOptions();

for(let i=1; i <= qoNumThingTypes.options.numthingtypes; i++)
    qoThingTypes.addOption(`thingtype${i}`, `Thing type #${i}`, 18, 3001);

if(!qoThingTypes.query())
    UDB.die('Canceled');

let positions = new Set();
for(let i=1; i <= qoNumThingTypes.options.numthingtypes; i++){
    
    const stepSize = UDB.ScriptOptions.grid;
    
    UDB.Map.getSelectedSectors().forEach(s => {
        const vertices = [...new Set(s.getSidedefs().map(sd => [ sd.line.start, sd.line.end ]).flat()) ]
        
        const xValues = [...new Set(vertices.map(v => v.position.x)) ];
        xValues.sort((a, b) => a - b);
    
        const yValues = [... new Set(vertices.map(v => v.position.y)) ];
        yValues.sort((a, b) => a - b);
    
        for(let x=xValues[0]; x <= xValues[xValues.length-1]; x += stepSize)
        {
            for(let y=yValues[0]; y <= yValues[yValues.length-1]; y += stepSize)
            {                
                if(s.intersect([ x, y ]) 
                && !(blockmap.getBlockAt([x,y])).getLinedefs().some(l => UDB.Line2D.getDistanceToLine(l.start.position, l.end.position, [ x, y ])<UDB.ScriptOptions.grid)){
                    if (Math.random() < UDB.ScriptOptions.chance){                        
                        if (!taken.some(t => (t.x === x) && (t.y === y))){
                            taken.push(new UDB.Vector2D(x,y));

                            offsetX = randomInt(-UDB.ScriptOptions.offset,UDB.ScriptOptions.offset);
                            offsetY = randomInt(-UDB.ScriptOptions.offset,UDB.ScriptOptions.offset);                           
                            
                            UDB.Map.createThing([x+offsetX, y+offsetY], qoThingTypes.options[`thingtype${i}`]);                            
                        }
                    }
                }
            }
        }
    });
}
    
function randomInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}