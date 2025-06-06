`#version 5`;

`#name Split joined sectors`;

`#description Split each selected sector into several different individual sectors.`;

let sectors = UDB.Map.getSelectedSectors();

if (sectors.length === 0) {
   UDB.die('You need to select at least one sector.');
}

let success = true;
for (let sector of sectors) {   
   let positions = sector.getLabelPositions();
   if(positions.length > 0){
      for(let position of positions){
         if (!UDB.Map.nearestLinedef(position,2)){
            let p = new Pen(position)
            p.drawVertex();
            p.moveForward(1);
            p.drawVertex();
            p.finishDrawing()
            UDB.Map.nearestLinedef(position).delete()
         } else {
            success = false;            
         }        
      }      
   }   
}

if (success === false){
   UDB.ShowMessage("Warning: may have failed to split one or more sectors")
}
