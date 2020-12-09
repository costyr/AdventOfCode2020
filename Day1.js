const util = require('./Util.js');

function Analize(aCoins) {
  for (let i = 0; i < aCoins.length; i++)
    for (let j = i + 1; j < aCoins.length; j++)
      if ((aCoins[i] + aCoins[j]) == 2020)
        return aCoins[i] * aCoins[j];

  return 0;
}

function Analize2(aCoins) {
  for (let i = 0; i < aCoins.length; i++)
    for (let j = i + 1; j < aCoins.length; j++)
      for (let k = j + 1; k < aCoins.length; k++)
        if ((aCoins[i] + aCoins[j] + aCoins[k]) == 2020)
          return aCoins[i] * aCoins[j] * aCoins[k];

  return 0;
}

let coins = util.MapInput('./Day1Input.txt', (aElem) => { return parseInt(aElem, 10); }, '\r\n');

console.log(Analize(coins));
console.log(Analize2(coins));