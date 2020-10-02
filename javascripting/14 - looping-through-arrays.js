'use strict';

let pets = [ `cat`, `dog`, `rat` ];
pets = pets
    .map(x => `${ x }s`);
console.log(pets);