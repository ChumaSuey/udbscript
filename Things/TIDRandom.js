/// <reference path="../../udbscript.d.ts" />

`#version 4`;

`#name Random TIDs`;

`#description Gives random TIDs to selected things`;

`#scriptoptions
Minimum
{
	description = "Minimum";
	type = 0;
}

Maximum
{
	description = "Maximum";
	type = 0;
}
`;

let Things = UDB.Map.getSelectedThings();

if(Things.length == 0)
    UDB.die('You have to select at least one thing!');

	Things.forEach(ld => 
	{
    ld.tag = Math.random() * (UDB.ScriptOptions.Maximum - UDB.ScriptOptions.Minimum) + UDB.ScriptOptions.Minimum;
	}
	);