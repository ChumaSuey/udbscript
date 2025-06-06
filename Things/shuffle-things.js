`#version 5`;
`#author taviow`;
`#name Shuffle selected things`;

`#description Swap selected things with one another randomly.`;
;

let things = UDB.Map.getSelectedThings();

if (things.length === 0) {
   UDB.die('You need to select at least one thing.');
}

let currentIndex = things.length;
 
   // While there remain elements to shuffle...
   while (currentIndex != 0) {
 
     // Pick a remaining element...
     let randomIndex = Math.floor(Math.random() * currentIndex);
     currentIndex--;
 
     // And swap it with the current element.
     [things[currentIndex].position, things[randomIndex].position] = [
       things[randomIndex].position, things[currentIndex].position];
   }
 
