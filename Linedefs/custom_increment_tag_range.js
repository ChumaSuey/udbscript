`#version 4`;

`#name Tag range (increment every X elements)`;

`#description Takes the selected lines or sectors and gives them a range of tags while incrementing every set number of elements`;

`#scriptoptions

first_tag
{
    description = "Starting tag";
	type = 1; //integer
    default = 1;
}

X
{
    description = "How many elements before an increment";
	type = 1; //integer
    default = 2;
}
increment
{
    description = "Increment by";
	type = 1; //integer
    default = 1;
}
`;

let elements = UDB.Map.getSelectedSectors();

if (elements.length == 0)
	elements = UDB.Map.getSelectedLinedefs();

if (elements.length == 0)
	UDB.die('Select lines or sectors to process');

for (let i = 0; i < elements.length; i++) {
		elements[i].tag = UDB.ScriptOptions.first_tag + Math.floor( i / UDB.ScriptOptions.X );
	}
