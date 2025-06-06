`#version 4`;
`#author TheMisterCat`;
`#name Long line splitter`;
`#description Splits lines longer than a specific amount`;
`#scriptoptions
LowestCheckSize
{
	description = "Shortest Size";
	default = 256;
	type = 0;
}
`;

let splits = 0;
let doAgain = true;

while(doAgain) {
	let lines = UDB.Map.getLinedefs();
	lines.forEach(l => {
		if(l.length > UDB.ScriptOptions.LowestCheckSize)
		{
			l.split(l.getCenterPoint());
			splits++;
		}
	});
	if(splits > 0) { splits = 0; doAgain = true; } else { doAgain = false; }
}