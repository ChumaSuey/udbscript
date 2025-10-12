`#version 4`;

`#name Transform vertexes`;

`#description Transform selected vertexes according to a 2x2 transformation matrix bc UDB's edit mode loves to unjoin my sectors; relative to center of bounding box.
Identity 2x2's arguments would be 1 0 0 1.
Vertical flip: 1 0 0 -1; Horizontal flip: -1 0 0 1; etc.`;

`#scriptoptions

tmatix {
	type = 1;
	default = 1.0;
	description = "X of 1st column vec";
}

tmatiy {
	type = 1;
	default = 0.0;
	description = "Y of 1st column vec";
}

tmatjx {
	type = 1;
	default = 0.0;
	description = "X of 2nd column vec";
}

tmatjy {
	type = 1;
	default = -1.0;
	description = "Y of 2nd column vec";
}


`;

/*

[ ix  jx ]
[ iy  jy ]

*/
const so = UDB.ScriptOptions;
var vi = [ so.tmatix, so.tmatiy ];
var vj = [ so.tmatjx, so.tmatjy ];

var verts = UDB.Map.getSelectedVertices();


if(verts.length < 2)
    UDB.die('You have to select at least 1 vertex');

var bbox = {
	x1: Infinity,
	y1: Infinity,
	x2: -Infinity,
	y2: -Infinity,
	cx: 0,
	cy: 0
};

// find bbox
for (var i = 0; i < verts.length; i++) {
	var pos = verts[i].position;
	bbox.x1 = Math.min(bbox.x1, pos.x);
	bbox.x2 = Math.max(bbox.x2, pos.x);
	bbox.y1 = Math.min(bbox.y1, pos.y);
	bbox.y2 = Math.max(bbox.y2, pos.y);
}

bbox.cx = (bbox.x1 + bbox.x2) / 2;
bbox.cy = (bbox.y1 + bbox.y2) / 2;
for (var i = 0; i < verts.length; i++) {
	// translated
	var tpos = {
		x: verts[i].position.x - bbox.cx,
		y: verts[i].position.y - bbox.cy
	};
	// UDB.showMessage((bbox.cx + pos.x*vi[0] + pos.y*vj[0]) + "     " + 
	// 	(bbox.cy + pos.x*vi[1] + pos.y*vj[1]));
	verts[i].position = [
		bbox.cx + tpos.x*vi[0] + tpos.y*vj[0],
		bbox.cy + tpos.x*vi[1] + tpos.y*vj[1]
	];
}
