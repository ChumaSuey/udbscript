`#version 5`;

`#name Thing selection by type`;

`#author taviow`;

`#description Selects all things of the user-specified types across the map.`;

const qoNumThingTypes = new UDB.QueryOptions();

qoNumThingTypes.addOption('numthingtypes', 'Number of thing types', 0, 1);

if(!qoNumThingTypes.query())
    UDB.die('Canceled');

const qoThingTypes = new UDB.QueryOptions();

for(let i=1; i <= qoNumThingTypes.options.numthingtypes; i++)
    qoThingTypes.addOption(`thingtype${i}`, `Thing type #${i}`, 18, 3001);

if(!qoThingTypes.query())
    UDB.die('Canceled');

for(let i=1; i <= qoNumThingTypes.options.numthingtypes; i++){
    UDB.Map.GetThings().filter(t => t.type === qoThingTypes.options[`thingtype${i}`]).forEach(t => {t.selected = true;})    
}
    