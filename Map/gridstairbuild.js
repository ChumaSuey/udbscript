`#version 4`;

`#name Grid-safe Stair-building`;

`#description Builds a stair from a selected set of linedefs, where step depth is measured between vertices, (rather than linedefs, like Stair Builder)`;

`#scriptoptions

stairDepth
{
	description = "Depth of the step";
	default = 16;
    type = 0; // Integer
}

direction
{
	description = "Direction of stair";
	default = 0;
	type = 11; // Enum
	enumvalues {
		0 = "Outward";
		1 = "Inward";
	}
}
`;

const INWARD_DIRECTION = 1;

function convertAngle(angle){
	return Math.PI - angle;
}

//returns a list of linedefs ordered so that the start position of each is equal to the end position of
//  the previous.
//if the linedefs don't form a closed shape, the script will terminate with an error
function getOrderedLinedefs(inputArray){
	//copy input argument to a separate array (to enforce non-destructive changes)
	const linedefs = [...inputArray];
	const expectedLength = inputArray.length;

	const orderedLinedefs = [];

	const firstLinedef = linedefs.splice(0, 1).pop();
	let previousEndPos = firstLinedef.end.position;
	orderedLinedefs.push(firstLinedef);

	function eq(p1, p2){
		return (p1.x === p2.x) && (p1.y === p2.y);
	}

	const MAX_LOOP_COUNT = 4000;
	let loopCount = 0;

	while(linedefs.length > 0){
		if (loopCount >= MAX_LOOP_COUNT){
			UDB.die('Too many linedefs. Maximum recursion reached.');
		}
		loopCount++;

		let nextLinedefIndex = linedefs.findIndex(l => eq(l.start.position, previousEndPos));

		if(nextLinedefIndex === -1){
			
			//look for linedefs which *end* with the last end position
			nextLinedefIndex = linedefs.findIndex(l => eq(l.start.position, previousEndPos));

			if(nextLinedefIndex === -1){
				UDB.die('The selected linedefs do not form a closed shape');			
			}

			//if we found one ending with the previous end position it needs to be flipped
			const foundFlippedLinedef = linedefs.splice(nextLinedefIndex, 1).pop();
			foundFlippedLinedef.flip();
			orderedLinedefs.push(foundFlippedLinedef);
			previousEndPos = foundFlippedLinedef.end.position;
			continue;
		}

		const foundLinedef = linedefs.splice(nextLinedefIndex, 1).pop();
		orderedLinedefs.push(foundLinedef);
		previousEndPos = foundLinedef.end.position;
	}

	//we have looped through all the linedefs
	// - There has been a script error if
	//   - the array we started with should be empty
	//   - the ordered array should have the expected length
	if(linedefs.length != 0){
		UDB.showMessage(`Script error sorting the linedefs: there were ${linedefs.length} left over after sorting.`);
		UDB.die('SCRIPT ERROR');
	} else if (orderedLinedefs.length != expectedLength) {
		UDB.showMessage(`Script error sorting the linedefs: sorted array contained ${orderedLinedefs} elements; expected ${expectedLength}.`);
		UDB.die('SCRIPT ERROR');
	}

	// - There is an input error if
	//   - the end position of the last ordered linedef doesn't match teh start position of the first.
	const startPos = orderedLinedefs[0].start.position;
	const endPos = orderedLinedefs[orderedLinedefs.length - 1].end.position;
	const positionsMatch = (startPos.x === endPos.x) && (startPos.y === endPos.y);

	if(!positionsMatch){
		UDB.die('Selected Linedefs do not form a closed shape.');
	}

	return orderedLinedefs;
}

let linedefs = UDB.Map.getSelectedLinedefs();

if(linedefs.length < 3){
	UDB.die('Must select at least 3 linedefs in a closed shape.');
}

const orderedLinedefs = getOrderedLinedefs(linedefs);
let previousLinedef = orderedLinedefs[orderedLinedefs.length-1];

const newVertexPositions = [];

for(let linedef of orderedLinedefs){

	const diffAngle = convertAngle(
			UDB.Angle2D.getAngleRad( previousLinedef.start.position,
									 linedef.start.position,
									 linedef.end.position)
		/ 2);

	const targetAngle = previousLinedef.angleRad - diffAngle;

	const offsetVector = UDB.Vector2D.fromAngleRad(targetAngle);

	offsetVector.x *= UDB.scriptOptions.stairDepth;
	offsetVector.y *= UDB.scriptOptions.stairDepth;

	if(UDB.scriptOptions.direction == INWARD_DIRECTION){
		offsetVector.x *= -1;
		offsetVector.y *= -1;
	}

	const newVertexPosition = [linedef.start.position.x - offsetVector.x, linedef.start.position.y - offsetVector.y];
	newVertexPositions.push(newVertexPosition);

	UDB.Map.drawLines([linedef.start.position, newVertexPosition])

	previousLinedef = linedef;
}

//append the starting vertex to the end to allow drawing a closed shape
newVertexPositions.push(newVertexPositions[0]);
UDB.Map.drawLines(newVertexPositions);
