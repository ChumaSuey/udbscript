`#version 4`;

`#name Meet Lines`;

`#description Extend a sequence of non-parallel lines out to their intersection point.`;

let linedefs = UDB.Map.getSelectedLinedefs();

for (var i = 0; i < linedefs.length - 1; i ++) {
  let normal1 = linedefs[i].line.getPerpendicular().getNormal();
  let normal2 = linedefs[i+1].line.getPerpendicular().getNormal();
  if (Math.abs(Math.abs(UDB.Vector2D.dotProduct(normal1, normal2)) - 1.0) < 0.01)
    UDB.die('The selected lines are too close to parallel');
  
  let intersection = UDB.Line2D.getIntersectionPoint(linedefs[i].start.position, linedefs[i].end.position, linedefs[i+1].start.position, linedefs[i+1].end.position, false);
  let p1 = linedefs[i].nearestOnLine(intersection);
  let p2 = linedefs[i+1].nearestOnLine(intersection);
  
  var d1 = UDB.Vector2D.getDistance(p1, intersection);
  var d2 = UDB.Vector2D.getDistance(p2, intersection);
  UDB.Map.drawLines([p1, intersection, p2]);
}