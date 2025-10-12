`#version 4`;

`#name Tag range (wrap-around)`;

`#description Similar to tag range but wraps around.
For example, tagging lines as 2, 3, 2, 3, ... or 2, 3, 4, 2, 3, 4, ... or even 2, 4, 6, 3, 5, 2, 4, ...`;

`#scriptoptions

start {
	description = "Tag start";
	type = 0;
	default = 100;
}
max {
	description = "Max tag";
	type = 0;
	default = 105;
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
const start = so.start, max = so.max, step = so.step;
const interval = max - start + 1;
const report = so.report;

if (interval < 1 || start < 0 || max < 0 || step <= 0)
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
for (var i = 0; i < targ.length; i++) {
	if (t > max)
		t -= interval;
	targ[i].tag = t;
	if (report)
		rep.push(t);
	t += step;
}

if (report)
	UDB.showMessage	(`${targname}: ${rep.toString()}`);