// WARNING: THIS ONE CAN AND WILL UN-JOIN YOUR SECTORS.

`#version 4`;
`#author TheMisterCat & taviow`;
`#name Remove Excess Vertices`;
`#description Removes any vertices splitting similar-angle lines. PS: will unjoin sectors and may break some detailing. Use with caution.`;
`#scriptoptions

tolerance
{
    description = "Tolerance (degrees)";
    default = 0;
    type = 1; //Float
}
check
{
    description = "Tolerance check";
    default = "True";
    type = 3; // Boolean
}
`;
function mergeVerts() {
	let verts = UDB.Map.getSelectedVertices(true);
	const workList = [];

	verts.forEach(v => v.marked = true);

	UDB.Map.stitchGeometry(1);

	verts.forEach(v => {
		let connected = v.getLinedefs();
		let doMerge = false; let angle = -1000;
		let thisPair = [];

		if (connected.length == 2)// only bother if there are only two lines attached to this vert
		{
		
			thisPair.push(v);
			connected.forEach(c => {
				if (angle == -1000) { angle = c.angle; }// first record the angle of the first line iterated over				
				else if (vertShouldBeDeleted(connected,UDB.ScriptOptions.tolerance) || !(UDB.ScriptOptions.check)){ // second check the next lines angle and textures against the prior
					doMerge = true;
					if (c.start != v) {thisPair.push(c.start); } else { thisPair.push(c.end); } // dont try to merge to self
				}
			});
		}

	
		if (doMerge) {
			workList.push(thisPair); // pushes (original vert, vert to join to original) to the work list
		}
	});

	// now merge
	const mergedList = [];
	let merged = 0;
	workList.forEach(wl => {
		if (wl[0] && wl[1]) {
			let doMerge = true;
			if (mergedList.includes(wl[0])) { doMerge = false; }
			if (mergedList.includes(wl[1])) { doMerge = false; }
			if (doMerge) {
				wl[0].join(wl[1]);
				mergedList.push(wl[0]);
				mergedList.push(wl[1]);
				merged = merged + 1;
			}
		}
	});
	return merged;
}

if (UDB.ScriptOptions.tolerance < 0){
	UDB.die('Tolerance values below zero not supported.');
}

let ret = mergeVerts();
while (ret > 0) {
	ret = mergeVerts();
}

function vertShouldBeDeleted(lines, tolerance){   
	let sidedefs = []   
   
	if(!(lines[0].action === lines[1].action)){
	   return false;
	}	
	
	if(!(lines[0].tag === lines[1].tag)){
	   return false;
	}	
	
	if (Math.abs(lines[0].angle - lines[1].angle) <= tolerance){ //lines are the same direction
		sidedefs.push(lines[0].front);
		sidedefs.push(lines[1].front);

		if (sidedefs[0].other === null && sidedefs[1].other === null){ //lines are single sided
			return (
				(sidedefs[0].lowerTexture === sidedefs[1].lowerTexture) &&
				(sidedefs[0].middleTexture === sidedefs[1].middleTexture) &&
				(sidedefs[0].upperTexture === sidedefs[1].upperTexture)
				);
		}

		sidedefs.push(lines[0].back);
		sidedefs.push(lines[1].back);

	} else if (Math.abs(180 - Math.abs(lines[0].angle - lines[1].angle)) <= tolerance) { //lines are facing opposite directions		
		sidedefs.push(lines[0].front);
		sidedefs.push(lines[1].back);
		sidedefs.push(lines[0].front);
		sidedefs.push(lines[1].back);	   
	} else { //angle difference between the lines exceeds tolerance value
		return false;
	}

	return (
		(sidedefs[0].lowerTexture === sidedefs[1].lowerTexture && sidedefs[2].lowerTexture === sidedefs[3].lowerTexture) &&
		(sidedefs[0].middleTexture === sidedefs[1].middleTexture && sidedefs[2].middleTexture === sidedefs[3].middleTexture) &&
		(sidedefs[0].upperTexture === sidedefs[1].upperTexture && sidedefs[2].upperTexture === sidedefs[3].upperTexture)
		);
 }
 