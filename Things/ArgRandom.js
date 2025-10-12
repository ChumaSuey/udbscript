/// <reference path="../../udbscript.d.ts" />

`#version 4`;

`#name Random Arg`;

`#description Gives random arg to selected things`;

`#scriptoptions
Argument
{
	description = "Argument ID (0-4)";
	type = 0;
}

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
    ld.args[UDB.ScriptOptions.Argument] = Math.random() * (UDB.ScriptOptions.Maximum - UDB.ScriptOptions.Minimum) + UDB.ScriptOptions.Minimum;
	}
	);