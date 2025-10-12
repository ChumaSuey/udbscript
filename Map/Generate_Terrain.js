/// <reference path="../udbscript.d.ts" />
`#version 5`;
`#author TheMisterCat`;
`#name Generate a heightmapped terrain`;
`#description Uses noise algorithms to generate vertex heightmaps into a selection.`;
`#scriptoptions
Divisions
{
	description = "Divisions";
	default = 24;
	type = 11;
	enumvalues {
        2 = "2";
        4 = "4";
		8 = "8";
		16 = "16";
		24 = "24";
		32 = "32";
		48 = "48";
		56 = "56";
		64 = "64";
    }
}
HeightPower
{
	description = "Height Power";
	default = 256;
	type = 0;
}
Scale
{
	description = "Noise scale";
	default = 5.0;
	type = 1;
}
DoLight
{
	description = "Apply lighting noise";
	default = true;
	type = 3;
}
DoNormals
{
	description = "Apply normal colors?!";
	default = false;
	type = 3;
}
`;

function produceNormal(sectorIndex)
{
	const sector = UDB.Map.getSectors()[sectorIndex];
	const positions = [...new Set(sector.getSidedefs().map(sd => [ new UDB.Vector3D(sd.line.start.position.x, sd.line.start.position.y, isNaN(sd.line.start.floorZ) ? sd.sector.floorHeight : sd.line.start.floorZ), new UDB.Vector3D(sd.line.end.position.x, sd.line.end.position.y, isNaN(sd.line.end.floorZ) ? sd.sector.floorHeight : sd.line.end.floorZ) ]).flat())];
	const plane = new UDB.Plane(positions[0], positions[1], positions[2], true);
	return plane.normal;
}

function pperc(value, vmin, vmax)
{
	return parseInt(((value-vmin)/(vmax-vmin))*100);
}

function perc(value, vmin, vmax)
{
	vrange = vmax-vmin;
	vval = vrange*value;
	return vmin + vval;
}

function dateStr()
{
	var currentdate = new Date(); 
	var datetime = currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
	return datetime
}

let perlin = {
    rand_vect: function(){
        let theta = Math.random() * 2 * Math.PI;
        return {x: Math.cos(theta), y: Math.sin(theta)};
    },
    dot_prod_grid: function(x, y, vx, vy){
        let g_vect;
        let d_vect = {x: x - vx, y: y - vy};
        if (this.gradients[[vx,vy]]){
            g_vect = this.gradients[[vx,vy]];
        } else {
            g_vect = this.rand_vect();
            this.gradients[[vx, vy]] = g_vect;
        }
        return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
    },
    smootherstep: function(x){
        return 6*x**5 - 15*x**4 + 10*x**3;
    },
    interp: function(x, a, b){
        return a + this.smootherstep(x) * (b-a);
    },
    seed: function(){
        this.gradients = {};
        this.memory = {};
    },
    get: function(x, y) {
        if (this.memory.hasOwnProperty([x,y]))
            return this.memory[[x,y]];
        let xf = Math.floor(x);
        let yf = Math.floor(y);
        //interpolate
        let tl = this.dot_prod_grid(x, y, xf,   yf);
        let tr = this.dot_prod_grid(x, y, xf+1, yf);
        let bl = this.dot_prod_grid(x, y, xf,   yf+1);
        let br = this.dot_prod_grid(x, y, xf+1, yf+1);
        let xt = this.interp(x-xf, tl, tr);
        let xb = this.interp(x-xf, bl, br);
        let v = this.interp(y-yf, xt, xb);
        this.memory[[x,y]] = v;
        return v;
    }
}

perlin.seed();
if(UDB.ScriptOptions.Divisions == 64) {	UDB.Log(dateStr() + ' - 64 divisions selected, this may take a while!'); }

const currentSectors = UDB.Map.getSelectedSectors(true);
if(!currentSectors || currentSectors.length == 0) { UDB.Log(dateStr() + ' - Nothing selected!'); UDB.exit(); }
let TriangleList = [];

const baseFloorHeight = 0;

let x1 = 999999;
let x2 = -999999;
let y1 = 999999;
let y2 = -999999;

UDB.Log(dateStr() + ' - collating shapes');

currentSectors.forEach(cs => { 
	const sd = cs.getSidedefs();

	sd.forEach(s => { 
		if(s.line.start.position.x < x1) { x1 = s.line.start.position.x; }
		if(s.line.end.position.x > x2) { x2 = s.line.end.position.x; }
		if(s.line.start.position.y < y1) { y1 = s.line.start.position.y; }
		if(s.line.end.position.y > y2) { y2 = s.line.end.position.y; } });

});

let sizeX = x2-x1; let sizeY = y2-y1;
UDB.Log(dateStr() + ' - size: ' + sizeX + ' ' + sizeY);

let divisionSizeX = parseInt(sizeX/UDB.ScriptOptions.Divisions);
let divisionSizeY = parseInt(sizeY/UDB.ScriptOptions.Divisions);

UDB.Log(dateStr() + ' - division size: '+divisionSizeX + ' ' + divisionSizeY);

let cx = 0; let cy = 0;
UDB.Map.clearAllMarks();
let xLines = [];
let yLines = []

for(let ix = x1; ix <= x2; ix += divisionSizeX)
{
	for(let iy = y1; iy <= y2; iy += divisionSizeX)
	{
		UDB.Map.drawLines([[x1, iy], [x2, iy]]);
	}
	UDB.setProgress(pperc(ix, x1, x2));
	UDB.Map.drawLines([[ix, y1], [ix, y2]]);
}

let sVerts = [];
let currentNewSectors = UDB.Map.getSelectedSectors();

UDB.Log(dateStr() + " - Split sectors");

currentNewSectors.forEach(cns => { 
	TriangleList.push(cns.getTriangles()[1]);
});

TriangleList.forEach(t => {	
	UDB.Map.drawLines(t);
	UDB.setProgress(pperc(TriangleList.indexOf(t), 0, TriangleList.length));
	t.forEach(tvert => { if(sVerts.indexOf(tvert)==-1) { sVerts.push(tvert); } } );
});

UDB.Log(dateStr() + " - Triangulated Sectors");

const verts = UDB.Map.getVertices();

sVerts.forEach(v => {
	let vx = Math.abs(x2 - v.x) / divisionSizeX;
	let vy = Math.abs(y2 - v.y) / divisionSizeX;
	verts.forEach(vt => {
		if(parseInt(vt.position.x) == parseInt(v.x) && parseInt(vt.position.y) == parseInt(v.y))
		{
			let heightValue = parseInt(UDB.ScriptOptions.HeightPower * perlin.get((vx/UDB.ScriptOptions.Divisions)*UDB.ScriptOptions.Scale, (vy/UDB.ScriptOptions.Divisions)*UDB.ScriptOptions.Scale));
			
			//UDB.Log('height: ' + heightValue)
			vt.floorZ = heightValue;
			if(UDB.ScriptOptions.DoLight == true)
			{
				let lightValue = 96+Math.abs(parseInt(256 * perlin.get((vx/UDB.ScriptOptions.Divisions)*UDB.ScriptOptions.Scale, (vy/UDB.ScriptOptions.Divisions)*UDB.ScriptOptions.Scale)));
				lightValue /= 2;
				lightValue += 80;
				vt.getLinedefs().forEach(vl => { vl.front.sector.brightness = lightValue; if(vl.back) { vl.back.sector.brightness = lightValue;}} );
			}
			if(UDB.ScriptOptions.DoNormals == true)
			{
				
				vt.getLinedefs().forEach(vl => { 
					let n = produceNormal(vl.front.sector.index); 
					//UDB.Log(n.x + ' ' + n.y + ' ' + n.z);
					let lCol = (perc(n.x, 0x010000, 0xFF0000) | perc(n.y, 0x000100, 0x00FF00) | perc(n.z, 0x000001, 0x0000FF));
					vl.front.sector.fields.lightcolor = lCol; 
					if(vl.back) { vl.back.sector.fields.lightcolor = lCol; }} 
				);
			}
		}
	});
});

UDB.Log(dateStr() + ' - Applied perlin noise to vertices');
