`#version 5`;

`#name Invert Thing angle`;

`#author taviow`;

`#description For each selected thing, adds 180 degrees to its current angle.`;

let things = UDB.Map.getSelectedThings();

if (things.length === 0) {
   UDB.die('You need to select at least one Thing.');
}

for (let thing of things) {
   thing.angle += 180;
}

