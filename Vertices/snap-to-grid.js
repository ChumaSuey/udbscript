`#version 5`;

`#name Snap to grid`;

`#description For each selected vertex, snaps it to the current grid. Works also for rotated grid.`;
;


let vertices = UDB.Map.getSelectedVertices();

if (vertices.length === 0) {
   UDB.die('You need to select at least one vertex.');
}

for (let vertex of vertices){
   vertex.snapToGrid();
}

while(vertices.length > 0){
    const current = vertices.shift();
    const toMerge = vertices.filter(v => v.position === current.position);
    vertices = vertices.filter(v => !toMerge.includes(v));
    toMerge.forEach(v => v.join(current));
}

