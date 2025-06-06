`#version 5`;
`#name Give selection new tags`;
`#author taviow`;
`#description For each non-zero tag within the selected sectors, give this sector (or line) a new tag.`;

const tags = new Map();
linedefs = UDB.Map.getSelectedLinedefs();

function updateElement(e, t){
	if (e.tag > 0){
        let oldTag = e.tag;
        if (!tags.has(e.tag)){
            let newTag = UDB.Map.GetNewTag();
            t.set(oldTag,newTag);
            e.tag = newTag;
        } else {            
            e.tag = t.get(oldTag);
        }
	}
    return t;
}

UDB.Map.getSelectedSectors().forEach(s => {
    updateElement(s, tags);
})

linedefs.forEach(l => {
    updateElement(l, tags);
})