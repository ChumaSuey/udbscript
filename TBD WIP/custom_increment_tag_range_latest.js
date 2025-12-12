`#version 4`;
`#name Tag range(Latest + 1)`;
`#description Takes the selected lines or sectors and gives them a range of tags starting from the highest used tag + 1;`;
`#author Chuma`;

`#scriptoptions

X
{
    description = "How many elements before an increment";
    type = 1; //integer
    default = 2;
}
increment
{
    description = "Increment by";
    type = 1; //integer
    default = 1;
}
`;

// Find max tag
let maxTag = 0;

UDB.Map.getSectors().forEach(s => {
    if (s.tag > maxTag) maxTag = s.tag;
});

UDB.Map.getLinedefs().forEach(l => {
    if (l.tag > maxTag) maxTag = l.tag;
});

let startTag = maxTag + 1;

let elements = UDB.Map.getSelectedSectors();

if (elements.length == 0)
    elements = UDB.Map.getSelectedLinedefs();

if (elements.length == 0)
    UDB.die('Select lines or sectors to process');

for (let i = 0; i < elements.length; i++) {
    let offset = Math.floor(i / UDB.ScriptOptions.X) * UDB.ScriptOptions.increment;
    elements[i].tag = startTag + offset;
}
