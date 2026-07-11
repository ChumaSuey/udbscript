`#version 4`;

`#name Snap Floor to Neighbor`;
`#description Snaps selected or highlighted sector floors to match a touching neighbor's floor height.`;
`#author Chuma`;

let sectors = UDB.Map.getSelectedOrHighlightedSectors();

if (sectors.length === 0) {
    UDB.die('Please select or highlight at least one sector.');
}

let count = 0;

sectors.forEach(sector => {
    let neighborFloor = null;

    let sidedefs = sector.getSidedefs();

    if (!sidedefs || sidedefs.length === 0) {
        return;
    }

    for (let i = 0; i < sidedefs.length; i++) {
        let sidedef = sidedefs[i];
        let line = sidedef.line;

        if (!line || !line.front || !line.back) {
            continue;
        }

        let otherSector = (line.front.sector === sector) ? line.back.sector : line.front.sector;

        if (!otherSector || otherSector === sector) {
            continue;
        }

        if (otherSector.floorHeight === sector.floorHeight) {
            continue;
        }

        neighborFloor = otherSector.floorHeight;
    }

    if (neighborFloor !== null && sector.floorHeight !== neighborFloor) {
        if (neighborFloor >= sector.ceilingHeight) {
            UDB.log('Skipping sector ' + sector.index + ': neighbor floor height (' + neighborFloor + ') would overrun ceiling height (' + sector.ceilingHeight + ')');
            return;
        }
        sector.floorHeight = neighborFloor;
        count++;
    }
});

if (count === 0) {
    UDB.showMessage('No sectors needed floor snapping (already matched or no neighbor found).');
} else {
    UDB.log('Snapped floor to neighbor for ' + count + ' sector(s).');
}
