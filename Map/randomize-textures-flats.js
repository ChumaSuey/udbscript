`#version 5`;
`#name Randomize textures and flats`;
`#description For each selected sector, applies a random texture to each line and a random flat to the floor.`;

sectors = UDB.Map.getSectors();
lines = UDB.Map.GetLinedefs();
flats = UDB.Data.getFlatNames();
textures = UDB.Data.getTextureNames();

sectors.forEach(s => {
	s.floorTexture = flats[Math.floor(Math.random() * flats.length)];	
})

lines.filter(ld => ld.back != null).forEach(l => {
	l.front.lowerTexture = textures[Math.floor(Math.random() * textures.length)];
	l.back.lowerTexture = textures[Math.floor(Math.random() * textures.length)];	
})