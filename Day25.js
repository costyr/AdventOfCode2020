function FindLoop(aPublicKey, aSubjectNumber) {
  let i = 0;
  let value = 1;
  while (true) {
    value *= aSubjectNumber;
    value = value % 20201227;

    if (value == aPublicKey)
      return i;
    i++;
  }
}

function FindEncryptionKey(aPublicKey, aLoop, aSubjectNumber) {
  let i = 0;
  let value = 1;
  while (i < aLoop) {
    value *= aPublicKey;
    value = value % 20201227;
    i++;
  }

  return value;
}

let testCardKey = 5764801;
let testSubjectKey = 17807724;

let cardKey = 7573546;
let subjectKey = 17786549;

let l1 = FindLoop(cardKey, 7);
let l2 = FindLoop(subjectKey, 7);

let key1 = FindEncryptionKey(cardKey, l2 + 1, 7);
let key2 = FindEncryptionKey(subjectKey, l1 + 1, 7);

if (key1 == key2)
  console.log(key1);