`#version 5`;

`#name Add prefix to existing tags`;

`#author taviow`;

`#description For each tag in the map, adds a given prefix in front of the existing value.`;

`#scriptoptions

prefix
{
    description = "Prefix";
    default = 0;
    type = 0; // Integer
}
`;

UDB.Map.getSectors().forEach(s => {
	if (s.tag != 0){
		s.tag = parseInt("" + UDB.ScriptOptions.prefix + s.tag)
	}	
})

UDB.Map.getLinedefs().forEach(l => {
	if (l.tag != 0){
		l.tag = parseInt("" + UDB.ScriptOptions.prefix + l.tag)
	}	
})