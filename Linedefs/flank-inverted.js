// Inspired by ribbiks's DBX Lua script: https://github.com/ribbiks/doom_lua/

`#version 4`;

`#name Create n-sized line segment`; //Modified by taviow based on the original flanking lines script

`#description For each selected line, starting from the center, creates an n-size segment.`;

`#scriptoptions 

width
{
    description = "Width of the flank";
    type = 0;
    default = 64;
}

texture
{
    description = "Texture";
    type = 6;
}

offset
{
    description = "Texture offset";
    type = 0;
    default = 0;
}

fixoriginaloffset
{
    description = "Fix original offset";
    type = 3;
    default = true;
}
`;

let lines = UDB.Map.getSelectedOrHighlightedLinedefs();

if(lines.length == 0)
    die('No linedefs selected or highlighted');

lines.forEach(ld => {
    // The line has to be long enough the flank it
    if(ld.length < UDB.ScriptOptions.width)
        UDB.die(ld + ' is too short to flank');

    // Compute how far along the line the flank with is
    let length = 1.0 / ld.length * UDB.ScriptOptions.width;

    // Remember the original texture offset
    let origoffset = ld.front.offsetX;

    // Collect the original start and end vertices of the line
    let vertices = [ ld.start, ld.end ];

    // Get the actual coordinates of the vertices that have to be created for the flanks
    let v1 = ld.line.getCoordinatesAt(0.5 - length/2);
    let v2 = ld.line.getCoordinatesAt(0.5 + length/2);

    // Mark the line. We'll loop through all marked lines later
    ld.marked = true;

    // Split the line at both vertex positions. This marks the new lines. We're doing this
    // from the end of the line to the beginning, since when splitting the new line will always
    // go from the new vertex to the original end vertex of the line
    ld.split(v2);
    ld.split(v1);
    
    // Only do texture stuff to one-sided lines, and if a texture is set
    if(ld.back == null && UDB.ScriptOptions.texture != '')
    {
        // Loop through all marked lines (which is the original line and the newly created flanks)
        UDB.Map.getMarkedLinedefs().forEach(ld => {
            // Only apply the flank texture if the current linedef has one of the original vertices
            if(vertices.includes(ld.start) || vertices.includes(ld.end))
            {
                ld.front.middleTexture = UDB.ScriptOptions.texture;
                ld.front.offsetX = UDB.ScriptOptions.offset;
            }
            else if(UDB.ScriptOptions.fixoriginaloffset) // Fix original offset, if desired
            {
                ld.front.offsetX = origoffset + UDB.ScriptOptions.width;
            }
        });
    }

    // Clear all marks, since we'll need the correct marks in the next loop iteration
    UDB.Map.clearAllMarks();
});