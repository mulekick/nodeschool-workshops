'use strict';

const
    numbers = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
    filtered = numbers
        .filter(x => x % 2 === 0);
console.log(filtered);