`#version 5`;
`#author taviow`;
`#name Calculate map size`;
`#description Use the farthest away coordinates of the map in each direction to calculate the total size of the bounding box surrounding it.`;

let vertices = UDB.Map.getVertices();

let north = 0
let south = 0
let east = 0
let west = 0
vertices.forEach(v => {
    if (v.position.x > east){
        east = v.position.x;
    }
    if (v.position.x < west){
        west = v.position.x;
    }
    if (v.position.y > north){
        north = v.position.y;
    }
    if (v.position.y < south){
        south = v.position.y;
    }
})

let northwest = new UDB.Vector2D(west, north);
let northeast = new UDB.Vector2D(east, north);
let southwest = new UDB.Vector2D(west, south);
let southeast = new UDB.Vector2D(east, south);

UDB.ShowMessage("Map bounding box: "+(southeast.x-southwest.x)+" x "+(northwest.y-southwest.y));