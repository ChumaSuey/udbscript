`#version 5`;
`#name Get list of sector tags`;
`#author taviow`;
`#description Get list of every tag present in the selected sectors.`;

let sectors = UDB.Map.getSelectedSectors();

if (sectors.length === 0) {
   UDB.die('You need to select at least one sector.');
}

const uniqueTags = [...new Set(sectors.map(s => s.tag))];
UDB.ShowMessage("Found "+uniqueTags.length+" unique tags in selection.");
UDB.ShowMessage(uniqueTags.join(";"));