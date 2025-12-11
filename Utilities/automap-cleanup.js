//Warning: will unmark doors and key bars and stuff like that. You just have to mark them back manually or I need to think of a way to exclude them.

`#version 5`;
`#author taviow`;
`#name Automap cleanup`;
`#description Automated automap cleanup. Be careful because this script will unmark doors and similar structures. Works in Boom and UDMF.`;

let linedefs = UDB.Map.getLinedefs();
let isUDMF = UDB.Map.isUDMF;
let flagArray = [];
let flagDict = {
    'blocking': '1',
    'blockmonsters': '2',
    'twosided': '4',
    'dontpegtop': '8',
    'dontpegbottom': '16',
    'secret': '32',
    'blocksound': '64',
    'dontdraw': '128',
    'mapped': '256',
    'blocklandmonsters': '4096',
    'blockplayers': '8192',
};

const getFlag = flagName => isUDMF ? flagName : flagDict[flagName];

for (let linedef of linedefs){
    //Mark lines without a front sector as not shown in automap
    if (linedef.front === null){
        linedef.flags[getFlag('dontdraw')] = true; 
        continue
    }

   //Only check double-sided lines   
   if (linedef.back != null){
        //If it is impassable, then mark as one sided
        if (linedef.flags[getFlag('blocking')] === true){
                linedef.flags[getFlag('secret')] = true;
        }
    
        //If it is a yellow line (front and back of linedef have the same floor height but different ceiling height)
        if(linedef.Front.Sector.ceilingHeight != linedef.Back.Sector.ceilingHeight && linedef.Front.Sector.floorHeight === linedef.Back.Sector.floorHeight){
            linedef.flags[getFlag('dontdraw')] = true; //Set not shown on automap flag
        }

        //If it is an "invisible" line (equal floor/ceiling heights on front and back of linedef)
        if(linedef.Front.Sector.ceilingHeight === linedef.Back.Sector.ceilingHeight && linedef.Front.Sector.floorHeight === linedef.Back.Sector.floorHeight){
            linedef.flags[getFlag('dontdraw')] = true; //Set not shown on automap flag
        }            
    }
}