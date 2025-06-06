`#version 5`;

`#name Select sector each thing belongs to`;

`#author taviow`;

`#description For each selected thing, select the sector it belongs to.`;

const things = UDB.Map.getSelectedThings();
const sectors = UDB.Map.getSectors();

if (things.length === 0) {
   UDB.die('You need to select at least one Thing.');
}
things.forEach(t => t.selected = false);

sectors.forEach(s => {
    if(things.some(t => s.intersect(t.position))){
        s.selected = true;
    }
});