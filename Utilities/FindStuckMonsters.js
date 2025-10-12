`#version 5`;
`#name Find stuck monsters`;
`#description Find all monsters that are stuck in ceilings, linedefs, and other things. (Discord: ilup)`;
`#scriptoptions
check_boom { description = "Check for Boom flags";
	type = 3;
	default = true;
}
`;

// For Eureka implementation see src/e_checks.cc -> Things_FindStuckies

const MODE_STUCK  = 0;
const MODE_OVERLAP= 1;
const CLIP_THINGS = 0b10;
const CLIP_WALLS  = 0b01;
const CLIP_THINGS_WALLS = CLIP_THINGS | CLIP_WALLS;

////////////////// ID CATEGORISATION
///////////// LAST EDITED: 27/07/24
// Things are considered in an inheritance hierarchy:
// Things (has type, radius)
//   - Immovables (not affected by blockmap, only a few things, don't care)
//   - Movables (affected by blockmap, only things we care about)
//     - Nonblockers (can walk through)
//     - Blockers (cannot walk through)
//       - Shootables (can block lifts if stuck in ceilings)
//         - Movers (has height, speed)
//           - Floaters (can not get stuck on ledges because they float up, can escape being stuck in walls if there is clearance above)
// Things hanging off ceilings fit in no hierarchy.

// Types and radii: https://doomwiki.org/wiki/Thing_types
const ID_BAR = 3003, ID_CAC = 3005, ID_CYB = 16  , ID_DEM = 3002, ID_IMP = 3001, ID_LOS = 3006;
const ID_SHG = 9   , ID_SPE = 58  , ID_MAS = 7   , ID_ZOM = 3004, ID_ARA = 68  , ID_ARV = 64  ;
const ID_CHG = 65  , ID_KNI = 69  , ID_MAN = 67  , ID_PAI = 71  , ID_REV = 66  , ID_NAZ = 84  ;
const ID_KEE = 72  , ID_BRL = 2035, ID_ROM = 88  ;

// define subcategories
const _IMMOVABLES = [ // useless for finding clipping monsters and things snapping up, but nice for completeness
	[79,20],[80,20],[81,20],
];
const _NONSHOOTABLE_BLOCKERS_FLOOR = [
	[47,16],[70,16],[43,16],[35,16],[41,16],[28,16],[42,16],[2028,16],
	[25,16],[54,32],[29,16],[55,16],[56,16],[31,16],[36,16],[57,16],[33,16],[37,16],
	[86,16],[27,16],[44,16],[45,16],[30,16],[46,16],[32,16],[48,16],[85,16],[26,16],
];
const _NONSHOOTABLE_BLOCKERS_CEILING = [
	[53,16],[52,16],[78,16],[75,16],[77,16],[76,16],[50,16],[74,16],[73,16],[51,16],[49,16],
];
const _NONSHOOTABLE_BLOCKERS = [..._NONSHOOTABLE_BLOCKERS_FLOOR, ..._NONSHOOTABLE_BLOCKERS_CEILING];
const _NONMOVER_SHOOTABLES = [
	[ID_BRL,10,0,42],[ID_ROM,16,0,16],[ID_KEE,16,0,72],
];
const _MOVER_FLOATERS = [
	[ID_CAC,31,8,56],[ID_LOS,16,8,56],[ID_PAI,31,8,56],
];
const _MOVER_NONFLOATERS = [
	[ID_BAR,24,8,64],[ID_CYB,40,16,110],[ID_DEM,30,10,56],[ID_IMP,20,8 ,56],[ID_ARA,64 ,12,64 ],
	[ID_ZOM,20,8,56],[ID_SHG,20,8 ,56 ],[ID_CHG,20,8 ,56],[ID_SPE,30,10,56],[ID_MAS,128,12,100],
	[ID_KNI,24,8,64],[ID_MAN,48,8 ,64 ],[ID_REV,20,10,56],[ID_NAZ,20,8 ,56],[ID_ARV,20 ,15,56 ],
];
const _MOVER_SPAWNER = [87,20,8,64];

// define categories
// constants for indexing categorised things
const I_TYPE   = 0;
const I_RADIUS = 1;
const I_SPEED  = 2;
const I_HEIGHT = 3;
const _MOVERS      = [..._MOVER_FLOATERS, ..._MOVER_NONFLOATERS, _MOVER_SPAWNER];
const _SHOOTABLES  = [..._NONMOVER_SHOOTABLES, ..._MOVERS];
const _BLOCKERS    = [..._SHOOTABLES.map(x => [x[I_TYPE], x[I_RADIUS]]), ..._NONSHOOTABLE_BLOCKERS];
const _NONBLOCKERS_FLOOR = [
	// Items
	[2006,20],[2002,20],[2005,20],[2004,20],[2003,20],[2001,20],[82  ,20],[2008,20],[2048,20],[2046,20],[2049,20],
	[2007,20],[2047,20],[17  ,20],[2010,20],[2015,20],[2023,20],[2026,20],[2014,20],[2022,20],[2045,20],[83  ,20],
	[2024,20],[2013,20],[2018,20],[8   ,20],[2012,20],[2019,20],[2025,20],[2011,20],[5   ,20],[40  ,20],[13  ,20],
	[38  ,20],[6   ,20],[39  ,20],
	// Decorations
	[10  ,20],[12  ,20],[34  ,20],[22  ,20],[21  ,20],[18  ,20],[19  ,20],[20  ,20],
	[23  ,20],[15  ,20],[24  ,20],
];
const _NONBLOCKERS_CEILING = [
	[62  ,20],[60  ,20],[59  ,20],[61  ,20],[63  ,20],
];
const _NONBLOCKERS = [..._NONBLOCKERS_FLOOR, ..._NONBLOCKERS_CEILING];
const _MOVABLES    = [..._BLOCKERS, ..._NONBLOCKERS];

// define convenient arrays and objects
const TYPES_IMMOVABLES      = _IMMOVABLES    .map(x => x[I_TYPE]);
const TYPES_FLOATERS        = _MOVER_FLOATERS.map(x => x[I_TYPE]);
const TYPES_BLOCKERS        = _BLOCKERS      .map(x => x[I_TYPE]);
const TYPES_NONBLOCKERS     = _NONBLOCKERS   .map(x => x[I_TYPE]);
const TYPES_SHOOTABLES      = _SHOOTABLES    .map(x => x[I_TYPE]);
const TYPES_MOVERS          = _MOVERS        .map(x => x[I_TYPE]);
const TYPES_CEILING         = [ID_KEE, 49, 50, 51, 52, 53, 59, 60, 61, 62, 63, 73, 74, 75, 76, 77, 78];
const MAP_THING_RADII       = Object.fromEntries( [..._IMMOVABLES, ..._MOVABLES] );
const MAP_MOVABLE_SPEEDS    = Object.fromEntries( _MOVERS.map(x => [x[I_TYPE], x[I_SPEED]]) );
const MAP_SHOOTABLE_HEIGHTS = Object.fromEntries( _SHOOTABLES.map(x => [x[I_TYPE], x[I_HEIGHT]]) );
const MAX_MOVABLE_RADIUS    = Math.max( ..._MOVABLES.map(x => x[I_RADIUS]) );
const MAX_BLOCKER_RADIUS    = Math.max( ..._BLOCKERS.map(x => x[I_RADIUS]) );
////////////////// ID CATEGORISATION/

const DS = 0x0_B798; // p_enemy.c P_Move, bad approximation of sin(pi/4).
const FS = 0x1_0000;
const MOVE_DIRECTIONS_ONE = [
	[-DS, DS],[0, FS],[DS, DS], // NW, N, NE
	[-FS, 0 ],        [FS, 0 ], // W,      E
	[-DS,-DS],[0,-FS],[DS,-DS], // SW, S, SE
];

const STEP_HEIGHT = 24;

function fmod(dividend, divisor) { // modulo towards negative infinity
	return (dividend%divisor + divisor) % divisor;
}
const F_EASY  = 0x1;
const F_MEDM  = 0x2;
const F_HARD  = 0x4;
const F_NSIPL = 0x10;
const F_NDEMA = 0x20;
const F_NCOOP = 0x40;
const F_LD_IMPASSABLE = 0x1;
const F_LD_BLOCK_MONSTERS = 0x2;

const clipping_conditions = UDB.ScriptOptions.clipping_conditions;
const check_boom = UDB.ScriptOptions.check_boom;
const clipping_mode_stuck = UDB.ScriptOptions.clipping_mode == MODE_STUCK;

UDB.Map.clearSelectedThings();
const blockers = UDB.Map.getThings().filter(t => TYPES_BLOCKERS.includes(t.type));
UDB.log(`Scanning for clipping monsters...`);

const blockmap = UDB.BlockMap(/*lines*/true, /*things*/true, /*sectors*/true, /*vertices*/false);
function iter_linedefs_around_rect(x, y, width, height, func) {
	let seen = new Set();
	// added 5 radius in case of stingy linedef-in-blockmap behaviour
	for (const block of blockmap.getRectangleBlocks(x - 5, y - 5, width + 2*5, height + 2*5)) {
		for (const linedef of block.getLinedefs()) {
		 	if (seen.has(linedef.index)) continue;
			seen.add(linedef.index);
			if (func(linedef)) return true;
		}
	}
	return false;
}
function iter_things_around_rect(x, y, width, height, func) {
	// a given thing can only be in 1 block, so expand rect to get outer things that overlap into this area
	for (const block of blockmap.getRectangleBlocks(x - MAX_BLOCKER_RADIUS, y - MAX_BLOCKER_RADIUS, width + 2*MAX_BLOCKER_RADIUS, height + 2*MAX_BLOCKER_RADIUS)) {
		for (const thing of block.getThings()) {
			if (func(thing)) return true;
		}
	}
	return false;
}
function iter_sectors_under_point(x, y, func) { // can call multiple times for overlapping sectors
	let point = [x, y];
	let seen = new Set();
	// rationale for blockmap.getRectangleBlocks instead of blockmap.getBlockAt
	//  eliminate the uncertainty of sector boundary, blockmap boundary, and centre coinciding
	//  where the block decided to not include the boundary sector
	for (const block of blockmap.getRectangleBlocks(x - 1, y - 1, 3, 3)) {
		for (const sector of block.getSectors()) {
		 	if (seen.has(sector.index)) continue;
			seen.add(sector.index);
			if (point_in_sector(sector, point)) {
				if (func(sector)) return true;
			}
		}
	}
	return false;
}
function iter_sectors_around_rect(x, y, width, height, func) {
	let point = [x, y];
	let seen = new Set();
	// added 5 radius in case of stingy sector-in-blockmap behaviour
	for (const block of blockmap.getRectangleBlocks(x - 5, y - 5, width + 2*5, height + 2*5)) {
		for (const sector of block.getSectors()) {
		 	if (seen.has(sector.index)) continue;
			seen.add(sector.index);
			if (point_in_sector(sector, point)) {
				if (func(sector)) return true;
			}
		}
	}
	return false;
}

function point_in_sector(sector, point) {
	// uses Sector.intersect which is probably not engine correct
	// the engine uses nodes which are not reachable from udbscript despite being loaded in the editor
	return sector.intersect(point);
}

//
// P_PointOnLineSide
// Returns 0 (front or on) or 1 (back)
//
function P_PointOnLineSide(x, y, v1x, v1y, v2x, v2y) {
	let vdx = v2x - v1x;
	let vdy = v2y - v1y;
	
	if (!vdx) { // no horiz diff, i.e. vertical line
		if (x <= v1x) // west of or on line
			return vdy > 0; // v1 is lower (d = v2 - v1) - point is on, or at front
		return vdy < 0; // v1 is higher - point is at back
	}
	if (!vdy) { // no vertical diff, i.e. horizontal line
		if (y <= v1y) // below or on line
			return vdx < 0; // v1 is eastmost (d = v2 - v1) - point is on, or at front (below)
		return vdx > 0; // v1 is westmost - point is at back
	}
	
	let dx = x - v1x;
	let dy = y - v1y;
	
	let left  = BigInt(vdy >> 16) * BigInt(dx) >> 16n;
	let right = BigInt(vdx >> 16) * BigInt(dy) >> 16n;
	
	if (left > right) return 0; // front side
	return 1; // back side or on
}

const ST_HORIZONTAL = 0;
const ST_VERTICAL   = 1;
const ST_POSITIVE   = 2;
const ST_NEGATIVE   = 3;
//
// P_BoxOnLineSide
// Considers the line to be infinite
// Returns side 0 or 1, -1 if box crosses the line.
//
function P_BoxOnLineSide(top, bottom, left, right, v1x, v1y, v2x, v2y) {
	let p1 = undefined;
	let p2 = undefined;
	let slopetype = undefined
	let vdx = v2x - v1x;
	let vdy = v2y - v1y;
	if (v1x == v2x) {
		slopetype = ST_VERTICAL;
	} else if (v1y == v2y) {
		slopetype = ST_HORIZONTAL;
	} else {
		slopetype = BigInt(vdx)*BigInt(vdy) > 0n ? ST_POSITIVE : ST_NEGATIVE;
	}
	
	switch (slopetype) {
	case ST_HORIZONTAL:
		p1 = top > v1y;
		p2 = bottom > v1y;
		if (vdx < 0) {
			p1 ^= 1;
			p2 ^= 1;
		}
		break;
	case ST_VERTICAL:
		p1 = right < v1x;
		p2 = left < v1x;
		if (vdy < 0) {
			p1 ^= 1;
			p2 ^= 1;
		}
		break;
	case ST_POSITIVE:
		p1 = P_PointOnLineSide(left, top, v1x, v1y, v2x, v2y);
		p2 = P_PointOnLineSide(right, bottom, v1x, v1y, v2x, v2y);
		break;
	case ST_NEGATIVE:
		p1 = P_PointOnLineSide(right, top, v1x, v1y, v2x, v2y);
		p2 = P_PointOnLineSide(left, bottom, v1x, v1y, v2x, v2y);
		break;
	}
	
	return p1 == p2 ? p1 : -1;
}

function box_overlaps_linedef_bbox(right, left, top, bot, ld, threshold = 0) {
	let ld_bbox_lef = Math.min(ld.start.position.x, ld.end.position.x) << 16;
	let ld_bbox_rig = Math.max(ld.start.position.x, ld.end.position.x) << 16;
	let ld_bbox_bot = Math.min(ld.start.position.y, ld.end.position.y) << 16;
	let ld_bbox_top = Math.max(ld.start.position.y, ld.end.position.y) << 16;
	return (
		right - threshold > ld_bbox_lef &&
		left  + threshold < ld_bbox_rig &&
		top   - threshold > ld_bbox_bot &&
		bot   + threshold < ld_bbox_top
	);
}

function things_both_appear(a, b) {
	return (
		a.flags[F_EASY] && b.flags[F_EASY] ||
		a.flags[F_MEDM] && b.flags[F_MEDM] ||
		a.flags[F_HARD] && b.flags[F_HARD]
	) && (
		!check_boom ||
		!a.flags[F_NSIPL] && !b.flags[F_NSIPL] ||
		!a.flags[F_NDEMA] && !b.flags[F_NDEMA] ||
		!a.flags[F_NCOOP] && !b.flags[F_NCOOP]
	);
}
function thing_in_thing(aposition, aradius, bposition, bradius, tolerance = 0) {
	return (
		Math.abs(aposition.x - bposition.x) < aradius + bradius - tolerance &&
		Math.abs(aposition.y - bposition.y) < aradius + bradius - tolerance
	);
}

function format_flags(thing_flags) {
	let formatted = "".concat(
		thing_flags[F_EASY] ? "E" : "",
		thing_flags[F_MEDM] ? "M" : "",
		thing_flags[F_HARD] ? "H" : "",
		thing_flags[F_NSIPL] ? "!S" : "",
	);
	if (check_boom) {
		formatted = formatted.concat(
			thing_flags[F_NDEMA] ? "!D" : "",
			thing_flags[F_NCOOP] ? "!C" : "",
		)
	}
	return formatted;
}

function log_mover_if_stuck(mover) {
	let fpRadius = MAP_THING_RADII[mover.type] << 16;
	let height = MAP_SHOOTABLE_HEIGHTS[mover.type];
	let speed  = MAP_MOVABLE_SPEEDS[mover.type];
	
	// bit field used as sets, there are 8 directions
	let thingStuckDirections   = 0;
	let ldStuckDirections      = 0;
	let ceilingStuckDirections = 0;
	let ceilingSuperStuck      = false; // same ceiling blocks all moves
	
	//// We are interested in:
	// things not able to move in any direction because of ledge/wall linedefs
	// things not able to move in any direction because of nonmover blockers
	// things not able to move in any direction because of the same mover in every direction (because monsters may be shoulder to shoulder in closets)
	// things not able to move in any direction because of low ceilings
	
	let superBlockerIndex       = undefined;
	let superBlocker            = undefined;
	let superBlockerDirectionsN = 0;
	let floorHeightMax = undefined;
	for (const [direction_i, fpDirection] of MOVE_DIRECTIONS_ONE.entries()) {
		fpSpoofedMoverPos.x = (mover.position.x << 16) + fpDirection[0]*speed;
		fpSpoofedMoverPos.y = (mover.position.y << 16) + fpDirection[1]*speed;
		
		iter_things_around_rect(
			(fpSpoofedMoverPos.x - fpRadius)>>16,
			(fpSpoofedMoverPos.y - fpRadius)>>16,
			(fpRadius>>16)*2,
			(fpRadius>>16)*2,
			blocker => {
				if (!TYPES_BLOCKERS.includes(blocker.type)) return false;
				if (mover.index == blocker.index) return false;
				if (!things_both_appear(mover, blocker)) return false;
				fpFixedPos.x = blocker.position.x << 16;
				fpFixedPos.y = blocker.position.y << 16;
				if (!thing_in_thing(fpSpoofedMoverPos, fpRadius, fpFixedPos, MAP_THING_RADII[blocker.type] << 16)) return false;
				
				if (superBlocker !== undefined && superBlocker.index == blocker.index) {
					superBlockerDirectionsN++;
					return false;
				}
				
				
				if (TYPES_MOVERS.includes(blocker.type)) {
					if (superBlocker === undefined) {
						superBlocker = blocker;
						superBlockerDirectionsN = 1;
					}
					// Do not acknowledge any old monster
					return false;
				}
				
				// Acknowledge
				thingStuckDirections |= (1 << direction_i);
				return false;
			}
		);
		
		if (superBlockerDirectionsN == MOVE_DIRECTIONS_ONE.length) {
			UDB.log(`Find ${String(finds_things++).padStart(4, "0")}: Thing ${mover.index} (${format_flags(mover.flags)}) may be stuck in mover ${superBlocker.index} (${format_flags(superBlocker.flags)})`);
			return;
		}
		
		if (thingStuckDirections == (1 << MOVE_DIRECTIONS_ONE.length) - 1) {
			UDB.log(`Find ${String(finds_things++).padStart(4, "0")}: Thing ${mover.index} (${format_flags(mover.flags)}) may be stuck in nearby things`);
			return;
		}
		
		// Get floor heights of dude
		let moverSectors = [];
		iter_sectors_under_point( 
			fpSpoofedMoverPos.x >> 16,
			fpSpoofedMoverPos.y >> 16,
			sector => moverSectors.push(sector);
		);
		let floorHighestHeight = undefined;
		let floorLowestHeight  = undefined;
		let ceilingHighestHeight = undefined;
		let ceilingLowestHeight  = undefined;
		if (moverSectors.length > 0) {
			floorHighestHeight   = Math.max(...moverSectors.map(f => f.floorHeight));
			floorLowestHeight    = Math.min(...moverSectors.map(f => f.floorHeight));
			ceilingHighestHeight = Math.max(...moverSectors.map(f => f.ceilingHeight));
			ceilingLowestHeight  = Math.min(...moverSectors.map(f => f.ceilingHeight));
			
			// Assumption: things are never fast enough to walk the length of their radius in a given tic
			if (ceilingLowestHeight - floorHighestHeight < height) {
				ceilingSuperStuck = true;
			}
		}
		
		iter_linedefs_around_rect(
			(fpSpoofedMoverPos.x - fpRadius)>>16,
			(fpSpoofedMoverPos.y - fpRadius)>>16,
			(fpRadius>>16)*2, (fpRadius>>16)*2,
			ld => {
				// Bounding box check
				// Needed because the intersect function treats lines as infinite
				if (!box_overlaps_linedef_bbox(
					fpSpoofedMoverPos.x + fpRadius,
					fpSpoofedMoverPos.x - fpRadius,
					fpSpoofedMoverPos.y + fpRadius,
					fpSpoofedMoverPos.y - fpRadius,
					ld,
				)) return false;
				
				// Thing box must be considered intersecting
				if (P_BoxOnLineSide(
					fpSpoofedMoverPos.y + fpRadius,
					fpSpoofedMoverPos.y - fpRadius,
					fpSpoofedMoverPos.x - fpRadius,
					fpSpoofedMoverPos.x + fpRadius,
					ld.start.position.x << 16, ld.start.position.y << 16,
					ld.end.position.x << 16, ld.end.position.y << 16,
				) != -1) return false;
				
				if (ld.flags[F_LD_IMPASSABLE] || ld.flags[F_LD_BLOCK_MONSTERS]) {
					ldStuckDirections |= (1 << direction_i);
					return false;
				}
				
				// if (ld.back.sector === null && ld.front.sector === null) // Trigger line, don't care
				
				if (ld.back === null || ld.front === null) { // Leads into the void (or is trigger line if both null)...
					ldStuckDirections |= (1 << direction_i);
					return false;
				}
				// Both sides of the line are sectors
				
				if (
					(
						ld.back.sector.floorHeight  - floorHighestHeight < -STEP_HEIGHT ||
						ld.front.sector.floorHeight - floorHighestHeight < -STEP_HEIGHT
					) && !TYPES_FLOATERS.includes(mover.type)
				) { //  standing atop significant ledge
					ldStuckDirections |= (1 << direction_i);
					return false;
				} else if (
					ld.back.sector.floorHeight  - floorLowestHeight > STEP_HEIGHT ||
					ld.front.sector.floorHeight - floorLowestHeight > STEP_HEIGHT
				) { //  standing below significant ledge
					// floaters are partially immune to this; they can float out, but need clearance above
					ldStuckDirections |= (1 << direction_i);
					return false;
				}
				
				// See if there is height clearance to walk this direction
				if (
					ld.back.sector.ceilingHeight  - ld.back.sector.floorHeight < height ||
					ld.front.sector.ceilingHeight - ld.front.sector.floorHeight < height
				) {
					ceilingStuckDirections |= (1 << direction_i);
					return false;
				}
				
				return false;
			}
		);
	}
	
	if (ldStuckDirections == (1 << MOVE_DIRECTIONS_ONE.length) - 1) {
		UDB.log(`Find ${String(finds_things++).padStart(4, "0")}: Thing ${mover.index} (${format_flags(mover.flags)}) has no room to move because of linedefs.`);
		return;
	}
	
	if (ceilingSuperStuck) {
		UDB.log(`Find ${String(finds_things++).padStart(4, "0")}: Thing ${mover.index} (${format_flags(mover.flags)}) is stuck in a ceiling.`);
		return;
	}
	
	if (ceilingStuckDirections == (1 << MOVE_DIRECTIONS_ONE.length) - 1) {
		UDB.log(`Find ${String(finds_things++).padStart(4, "0")}: Thing ${mover.index} (${format_flags(mover.flags)}) is stuck in one or more low ceilings.`);
		return;
	}
	
	if ( (thingStuckDirections | ldStuckDirections | ceilingStuckDirections) == (1 << MOVE_DIRECTIONS_ONE.length) - 1 ) {
		UDB.log(`Find ${String(finds_things++).padStart(4, "0")}: Thing ${mover.index} (${format_flags(mover.flags)}) may be stuck.`);
		return;
	}
}

let finds_things = 0;
let fpSpoofedMoverPos = new UDB.Vector2D(0, 0);
let fpFixedPos = new UDB.Vector2D(0, 0);
let mover_i = 0;
for (const mover of blockers) {
	UDB.setProgress( mover_i++/blockers.length*100 );
	if (!TYPES_MOVERS.includes(mover.type)) continue;
	log_mover_if_stuck(mover);
}
UDB.log(`Finished.`);