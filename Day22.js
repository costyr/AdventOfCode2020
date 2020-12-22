const util = require('./Util.js');
const list = require('./LinkedList.js');

function PlayWar(aPlayer1, aPlayer2) {

  while ((aPlayer1.GetSize() > 0) && (aPlayer2.GetSize() > 0)) {
    let player1Card = aPlayer1.GetHead();
    let player2Card = aPlayer2.GetHead();

    aPlayer1.RemoveNode(player1Card);
    aPlayer2.RemoveNode(player2Card);

    if (player1Card.mValue > player2Card.mValue) {
      aPlayer1.AddTail(player1Card.mValue);
      aPlayer1.AddTail(player2Card.mValue);
    }
    else {
      aPlayer2.AddTail(player2Card.mValue);
      aPlayer2.AddTail(player1Card.mValue);
    }
  }

  let winner = (aPlayer1.GetSize() > 0) ? aPlayer1 : aPlayer2;

  let size = winner.GetSize();

  let score = winner.ToString().split(' ').reduce((aScore, aNode) => {
    let newScore = aScore + aNode * size;
    size--;
    return newScore;
  }, 0);

  return { winner: ((aPlayer1.size > 0) ? 1 : 2), score: score };
}

function Sublist(aList, aCount) {
  let subList = aList.ToString().split(' ').slice(0, aCount);
  let newList = new list.LinkedList();
  for (let i = 0; i < subList.length; i++)
    newList.AddTail(parseInt(subList[i], 0));

  return newList;
}

function PlayRecursive(aPlayer1, aPlayer2) {

  let player1Map = new Map();
  let player2Map = new Map();

  player1Map.set(aPlayer1.ToString());
  player2Map.set(aPlayer2.ToString());

  let winner;

  while ((aPlayer1.GetSize() > 0) && (aPlayer2.GetSize() > 0)) {

    let player1Card = aPlayer1.GetHead();
    let player2Card = aPlayer2.GetHead();

    aPlayer1.RemoveNode(player1Card);
    aPlayer2.RemoveNode(player2Card);

    if ( (player1Map.has(aPlayer1.ToString()) ||
          player2Map.has(aPlayer2.ToString()))) {
      winner = aPlayer1;
      break;
    }

    let player1Win = (player1Card.mValue > player2Card.mValue)

    if ((player1Card.mValue <= aPlayer1.GetSize()) &&
        (player2Card.mValue <= aPlayer2.GetSize())) {
      let player1 = Sublist(aPlayer1, player1Card.mValue);
      let player2 = Sublist(aPlayer2, player2Card.mValue);

      let ret = PlayRecursive(player1, player2);

      player1Win = (ret.winner == 1);
    }

    if (player1Win) {

      if (aPlayer1.GetSize() == 0)
        aPlayer1 = new list.LinkedList(); 
        
      aPlayer1.AddTail(player1Card.mValue);
      aPlayer1.AddTail(player2Card.mValue);
    }
    else {

      if (aPlayer2.GetSize() == 0)
        aPlayer2 = new list.LinkedList();    
      
      aPlayer2.AddTail(player2Card.mValue);
      aPlayer2.AddTail(player1Card.mValue);
    }

    player1Map.set(aPlayer1.ToString(), 1);
    player2Map.set(aPlayer2.ToString(), 1);
  }

  if (winner === undefined)
    winner = (aPlayer1.GetSize() > 0) ? aPlayer1 : aPlayer2;

  let size = winner.GetSize();

  let score = winner.ToString().split(' ').reduce((aScore, aNode) => {
    let newScore = aScore + aNode * size;
    size--;
    return newScore;
  }, 0);

  return { winner: (winner == aPlayer1) ? 1 : 2, score: score };
}

let board = { player1: new list.LinkedList(), player2: new list.LinkedList() };

util.ReduceInput('./Day22Input.txt', (aBoard, aElem, aIndex) => {

  let rawElem = aElem.split(':\r\n');

  let cards = rawElem[1].split('\r\n');

  let list = (aIndex == 0) ? aBoard.player1 : aBoard.player2;

  for (let i = 0; i < cards.length; i++)
    list.AddTail(parseInt(cards[i], 10));

  return aBoard;
}, board, '\r\n\r\n');

let initialPleyer1 = Sublist(board.player1, board.player1.GetSize());
let initialPleyer2 = Sublist(board.player2, board.player2.GetSize());

console.log(PlayWar(board.player1, board.player2).score);
console.log(PlayRecursive(initialPleyer1, initialPleyer2).score);