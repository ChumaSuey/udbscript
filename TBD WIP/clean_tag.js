`#version 4`;
`#name Clean Tag`;
`#description Sets Tag to 0 for selected Linedefs OR Sectors.`;
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
        if (s.tag !== 0) {
            s.tag = 0;
            count++;
        }
    });

    if (count === 0) {
        UDB.showMessage("Selected sectors already have Tag 0.");
    } else {
        UDB.showMessage("Cleaned Tag from " + count + " sector(s).");
    }
} else {
    lines.forEach(l => {
        if (l.tag !== 0) {
            l.tag = 0;
            count++;
        }
    });

    if (count === 0) {
        UDB.showMessage("Selected linedefs already have Tag 0.");
    } else {
        UDB.showMessage("Cleaned Tag from " + count + " linedef(s).");
    }
}
