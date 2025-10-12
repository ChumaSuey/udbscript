/// <reference path="../../udbscript.d.ts" />

`#version 5`;

`#name Draw Spiral`;

`#description ‎Usage tip: the exponent divisor adjusts how the distance between loops changes, as follows:

c = 1 is an Archimedean spiral that maintains a constant distance between loops ...
with c > 1, the distance between successive loops gets smaller ...
with c < 1 and above zero, the distance between successive loops gets larger  ...
with c < 0, this is a hyperbolic spiral and the distance will rapidly shrink as it approaches the "center." 
`;

`#scriptoptions

total_loops  
{
	description = "Number of loops";
	default = 6;
	type = 1; //Floating Point Number
}

segments_per_loop 
{
	description = "Line segments per loop";
	default = 12; 
	type = 0; //Integer
}

distance_between_loops
{
	description = "Distance between loops";
	default = 256; 
	type = 1; //Floating Point Number
}

drawing_angle
{
	description = "Angle the spiral faces";
	default = 0; 
	type = 1; //Floating Point Number
}

start_angle_offset 
//The a in "a + bθ^(1/c)"
{
	description = "Angle traversed before spiral starts";
	default = 0; 
	type = 1; //Floating Point Number
}

exponent_divisor 
//The c in "a + bθ^(1/c)"
{
	description = "Exponent divisor";
	default = 1; 
	type = 1; //Floating Point Number
}
`;

//all angles should be in radians unless otherwise specified

let init_pos = UDB.Map.snappedToGrid(UDB.Map.mousePosition);
let total_loops = UDB.ScriptOptions.total_loops;
let segments_per_loop = UDB.ScriptOptions.segments_per_loop; 
let distance_between_loops = UDB.ScriptOptions.distance_between_loops; 
let start_angle_offset = UDB.Angle2D.degToRad(UDB.ScriptOptions.start_angle_offset);
let drawing_angle = UDB.Angle2D.degToRad(UDB.ScriptOptions.drawing_angle);

const MAX_POSSIBLE_DISTANCE = 92680; 
/*The largest possible distance in map units between two valid points on the grid -- used
to catch overflows to infinity, and distant offmap points that hang computation.
You can still end up drawing points well off the map, because I'm not your mom.*/

//handle bad inputs
if(!UDB.Map.mousePosition.isFinite())
	UDB.die('Mouse cursor must be at a valid map position');
if (segments_per_loop < 1)
	UDB.Die("Must have at least one segment per rotation.");
if (total_loops < 0)
	UDB.Die("Can't have a negative number of rotations.");

let b = distance_between_loops/(2*Math.PI);
let init_draw_angle = 0.0 + start_angle_offset; 
let angle = init_draw_angle;

let points_to_draw = []; 

let c = UDB.ScriptOptions.exponent_divisor;

//compute the points we need to draw:
while (angle <= (init_draw_angle + total_loops*2*Math.PI + 2*Math.PI/segments_per_loop)) 
	{
 		let r = b*(angle**(1/c)); 
		
		//if r is infinite or so big it's useless, advance the angle and skip the rest of this iteration
		if (r > MAX_POSSIBLE_DISTANCE) 
			{
				angle += (Math.PI/segments_per_loop);
				continue; 
			}
			
		let x = r*Math.cos(angle); 
		let y = r*Math.sin(angle);
				
		//rotate spiral if needed
		if (drawing_angle != 0)
			{
				let x_rot = x*Math.cos(drawing_angle) + y*Math.sin(drawing_angle);
				let y_rot = -x*Math.sin(drawing_angle) + y*Math.cos(drawing_angle);
				x = x_rot;
				y = y_rot;						
			}
					
		let new_pos = new UDB.Vector2D((init_pos.x + x), (init_pos.y + y));
		points_to_draw.push(new_pos)
		
		angle += (2*Math.PI/segments_per_loop);
	}

UDB.Map.drawLines(points_to_draw);
