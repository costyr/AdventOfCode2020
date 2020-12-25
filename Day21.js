const util = require('./Util.js');

function CreateAlergenMap(aReceipes) {
  let map = new Map();
  for (let i = 0; i < aReceipes.length; i++)
    for (let j = 0; j < aReceipes[i].alergens.length; j++) {
      let alergen = aReceipes[i].alergens[j];
      if (!map.has(alergen)) {

        let foodMap = new Map();
        for (let k = 0; k < aReceipes[i].food.length; k++)
          foodMap.set(aReceipes[i].food[k], 1);

        map.set(alergen, foodMap);
      }
      else {
        let value = map.get(alergen);
        for (let k = 0; k < aReceipes[i].food.length; k++) {
          let count = 1;
          if (value.has(aReceipes[i].food[k])) {
            count = value.get(aReceipes[i].food[k]);
            count++;
          }

          value.set(aReceipes[i].food[k], count);
        }
      }
    }

  return map;
}

function RemoveAlergen(aPossibleAlergenMap, aAlergen, aFood, aFoodCount) {

  let found = false;
  let foodMap = aPossibleAlergenMap.get(aAlergen);
  for (let [key, value] of foodMap)
    if ((aFood != key) && (value >= aFoodCount)) {
      found = true;
      break;
    }

  if (found)
    return false;

  aPossibleAlergenMap.delete(aAlergen);

  for (let [key, value] of aPossibleAlergenMap) {
    if (value.has(aFood))
      value.delete(aFood);
  }

  return true;
}

function FindFoodWithAlergen(aAlergenMap, aPossibleAlergenMap, aFoodWithAlergens) {

  if (aFoodWithAlergens.size > 0)
    return;

  let found = false;
  for (let [key, value] of aPossibleAlergenMap)
    if (!aAlergenMap.has(key)) {
      found = true;
      for (let [food, count] of value) {
        let newAlergenMap = new Map(aAlergenMap);
        newAlergenMap.set(key, food);

        let newPossibleAlergenMap = new Map(aPossibleAlergenMap);
        if (RemoveAlergen(newPossibleAlergenMap, key, food, count))
          FindFoodWithAlergen(newAlergenMap, newPossibleAlergenMap, aFoodWithAlergens);
      }
    }

  if (!found) {
    for (let [key, value] of aAlergenMap)
      aFoodWithAlergens.set(value, key);
  }
}

function CountNonAlergenFood(aFoodWithAlergens, aFood) {
  let count = 0;
  for (let i = 0; i < aFood.length; i++) {
    for (let j = 0; j < aFood[i].food.length; j++)
      if (!aFoodWithAlergens.has(aFood[i].food[j]))
        count++;
  }

  return count;
}

function ComputeCanonical(aFoodWithAlergens) {
  let flatFoodWithAlergens = [];

  for (let [key, value] of aFoodWithAlergens)
    flatFoodWithAlergens.push({ alergen: value, food: key });

  flatFoodWithAlergens.sort((a, b) => {
    if (a.alergen < b.alergen)
      return -1;
    else if (a.alergen > b.alergen)
      return 1;
    else
      return 0;
  });

  let canonicalForm = flatFoodWithAlergens.reduce((aTotal, aElem) => {
    if (aTotal.length > 0)
      aTotal += ",";
    aTotal += aElem.food;
    return aTotal;
  }, "");

  return canonicalForm;
}

let recepies = util.MapInput('./Day21Input.txt', (aElem) => {
  let rawElem = aElem.split(' (contains ');

  let ingredients = rawElem[0].split(' ');

  let alergens = rawElem[1].substr(0, rawElem[1].length - 1).split(', ');

  return { food: ingredients, alergens: alergens };
}, '\r\n');

let map = CreateAlergenMap(recepies);
let alergenMap = new Map();
let foodWithAlergens = new Map();
FindFoodWithAlergen(alergenMap, map, foodWithAlergens);
console.log(CountNonAlergenFood(foodWithAlergens, recepies));
console.log(ComputeCanonical(foodWithAlergens));