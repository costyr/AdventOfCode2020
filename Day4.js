const util = require('./Util.js');

function ScanPassports(aTotal, aElem) {
  let colors = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']
  let lines = aElem.split('\r\n');

  let fieldMap = [];
  let count = 0;
  for (let j = 0; j < lines.length; j++) {
    let line = lines[j].split(' ');
    for (let i = 0; i < line.length; i++) {
      let rawField = line[i].split(':');

      if (fieldMap[rawField[0]] === undefined)
        count++;

      fieldMap[rawField[0]] = rawField[1];
    }
  }

  let hasRequiedFields = false;
  if (count == 8)
    hasRequiedFields = true;
  else if (count == 7 && fieldMap['cid'] === undefined)
    hasRequiedFields = true;

  let isValid = true;
  for (let field in fieldMap) {
    if (field == 'byr') {
      let year = parseInt(fieldMap[field], 10);
      isValid = (year >= 1920) && (year <= 2002);
    }
    else if (field == 'iyr') {
      let year = parseInt(fieldMap[field], 10);
      isValid = (year >= 2010) && (year <= 2020);
    }
    else if (field == 'eyr') {
      let year = parseInt(fieldMap[field], 10);
      isValid = (year >= 2020) && (year <= 2030);
    }
    else if (field == 'hgt') {
      if (fieldMap[field].endsWith('cm')) {
        let unit = parseInt(fieldMap[field].split('cm')[0], 10);
        isValid = (unit >= 150) && (unit <= 193);
      }
      else if (fieldMap[field].endsWith('in')) {
        let unit = parseInt(fieldMap[field].split('cm')[0], 10);
        isValid = ((unit >= 59) && (unit <= 76));
      }
      else
        isValid = false;
    }
    else if (field == 'hcl') {
      isValid = (fieldMap[field].length == 7) && fieldMap[field].match(/#[0-9a-f]+/);
    }
    else if (field == 'ecl') {
      let found = false;
      for (let k = 0; k < colors.length; k++)
        if (fieldMap[field] == colors[k]) {
          found = true;
          break;
        }
      isValid = found;
    }
    else if (field == 'pid') {
      isValid = (fieldMap[field].length == 9) && fieldMap[field].match(/^\d+$/);
    }
    else if (field == 'cid') {

    }

    if (!isValid)
      break;
  }

  if (hasRequiedFields)
    aTotal.valid++;

  if (hasRequiedFields && isValid)
    aTotal.validFields++;

  return aTotal;
}

let total = { passports: [], valid: 0, validFields: 0 };
util.ReduceInput('./Day4Input.txt', ScanPassports, total, '\r\n\r\n');

console.log(total.valid);
console.log(total.validFields);