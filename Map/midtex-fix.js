`#version 5`;
`#author taviow`;
`#name Midtexture clipping fix`;
`#description Identifies instances of midtexture clipping, and fixes them by adding 1 to the brightness of the back sector.`;

linedefs = UDB.Map.getLinedefs();

let done = new Set();
for (let linedef of linedefs){
	//Skip one sided lines
	if (linedef.back == null){
		continue;
	}	
	
	//Skip lines that don't have a middle texture on both sides
	if (linedef.front.middleTexture === '-' && linedef.back.middleTexture === '-'){
		continue;
	}

	//Skip lines whose front and back sides belong to the same sector
	if (linedef.front.Sector === linedef.back.Sector){
		continue;
	}

	//Skip already done combinations of sectors
	if (done.has(linedef.Back.Sector.index+'_'+linedef.Front.Sector.index)){
		continue;
	}

	//If front and back sector have the same brightness, add +1 to back sector brightness
	if(linedef.Front.Sector.brightness === linedef.Back.Sector.brightness){		
		linedef.Back.Sector.brightness = linedef.Back.Sector.brightness+1;
		done.add(linedef.Back.Sector.index+'_'+linedef.Front.Sector.index);			
	}
}