`#version 4`;

`#name Tag range (Slow-increasing/k-tuple)`;

`#description Tag range but only increments tag after k lines/sectors have been tagged with the same tag.
For example, tagging lines as 2 2 2 3 3 3 4 4 4 or 2 2 2 4 4 4 6 6 6.`;

`#scriptoptions

start {
	description = "Tag start";
	type = 0;
	default = 100;
}
k {
	description = "k (Increment after)";
	type = 0;
	default = 2;
}
step {
	description = "Tag step";
	type = 0;
	default = 1;
}
target {
	description = "Sectors or Linedefs";
	type = 11;
	enumvalues {
		0 = "Auto (lines if no sectors)";
		1 = "Lines";
		2 = "Sectors";
	}
	default = 0;
}
report {
	description = "Report on exit (debug)";
	type = 3;
	default = false;
}
`;

var so = UDB.ScriptOptions;
const start = so.start, k = so.k, step = so.step;
const report = so.report;

if (k < 1 || start < 0 || step <= 0)
	UDB.die("Invalid arguments.");


var linedefs = UDB.Map.getSelectedLinedefs();
var sectors = UDB.Map.getSelectedSectors();
var targ = so.target == 0 ? (sectors.length != 0 ? sectors : linedefs)
			: so.target == 1 ? linedefs
			: sectors;

var targname = targ == sectors ? "Sectors" : "Linedefs";

if (targ.length == 0)
	UDB.die(`No ${targname} selected.`);


// :Clueless: :xddx:
var t = start;
var rep = [];
for (var i = 0; i < targ.length;) {
	for (var j = 0; j < k && i < targ.length; j++) {
		targ[i].tag = t;
		if (report)
			rep.push(t);
		i++;
	}
	t += step;
}

if (report)
	UDB.showMessage	(`${targname}: ${rep.toString()}`);