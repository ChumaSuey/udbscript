`#version 4`;

`#name Snap Ceiling to Neighbor`;
`#description Snaps selected or highlighted sector ceilings to match a touching neighbor's ceiling height.`;
`#author Chuma`;

let sectors = UDB.Map.getSelectedOrHighlightedSectors();

if (sectors.length === 0) {
    UDB.die('Please select or highlight at least one sector.');
}

let count = 0;

sectors.forEach(sector => {
    let neighborCeil = null;

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

        if (otherSector.ceilingHeight === sector.ceilingHeight) {
            continue;
        }

        neighborCeil = otherSector.ceilingHeight;
    }

    if (neighborCeil !== null && sector.ceilingHeight !== neighborCeil) {
        if (neighborCeil <= sector.floorHeight) {
            UDB.log('Skipping sector ' + sector.index + ': neighbor ceiling height (' + neighborCeil + ') would overrun floor height (' + sector.floorHeight + ')');
            return;
        }
        sector.ceilingHeight = neighborCeil;
        count++;
    }
});

if (count === 0) {
    UDB.showMessage('No sectors needed ceiling snapping (already matched or no neighbor found).');
} else {
    UDB.log('Snapped ceiling to neighbor for ' + count + ' sector(s).');
}
