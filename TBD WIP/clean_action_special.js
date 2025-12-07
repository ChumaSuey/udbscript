`#version 4`;
`#name Clean Action - Special`;
`#description Sets Action to 0 for selected Linedefs OR Special to 0 for selected Sectors.`;
`#author Chuma`;

const sectors = UDB.Map.getSelectedSectors();
const lines = UDB.Map.getLinedefs().filter(l => l.selected);

if (sectors.length === 0 && lines.length === 0) {
    UDB.showMessage("No Sectors or Linedefs selected.");
    UDB.die();
}

let count = 0;

if (sectors.length > 0) {
    sectors.forEach(s => {
        if (s.special !== 0) {
            s.special = 0;
            count++;
        }
    });

    if (count === 0) {
        UDB.showMessage("Selected sectors already have Special 0.");
    } else {
        UDB.showMessage("Cleaned Special from " + count + " sector(s).");
    }
} else {
    lines.forEach(l => {
        if (l.action !== 0) {
            l.action = 0;
            count++;
        }
    });

    if (count === 0) {
        UDB.showMessage("Selected linedefs already have Action 0.");
    } else {
        UDB.showMessage("Cleaned Action from " + count + " linedef(s).");
    }
}
