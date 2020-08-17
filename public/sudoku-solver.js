//http://norvig.com/sudoku.html
//http://pankaj-k.net/sudoku/sudoku.js

/*
SQUARES, UNITS, BOXES, PEERS
grid of 81 SQUARES
columns 1 to 9
rows A to I
call a collection of nine SQUARES (a column, a row, or a box) a UNIT and the SQUARES that share a unit the PEERS
no digit can appear twice in a UNIT, and every digit must appear once. This implies that each SQUARE must have a different value from any of its PEERS
Every SQUARE has exactly 3 UNITS and 20 PEERS
*/

const textArea = document.getElementById("text-input");
// import { puzzlesAndSolutions } from './puzzle-strings.js';

document.addEventListener("DOMContentLoaded", () => {
  // Load a simple puzzle into the text area
  textArea.value =
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  
  
});

//function to create SQUARES
function createSquares(rows, cols) {
  var squareArray = [];
  for (var row in rows)
    for (var col in cols) squareArray.push(rows[row] + cols[col]);
  return squareArray;
}

//define rows and columns and digits
let rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
let cols = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
let digits = "123456789";

// create grid system, SQUARES, UNITS and PEERS

//create SQUARES
let squares = createSquares(rows, cols);

// create UNITS
// (eg. row, column and box units. each unit as arrays, containing squares)
let units = [];
for (let c in cols) {
  units.push(createSquares(rows, [cols[c]]));
}

for (let r in rows) {
  units.push(createSquares([rows[r]], cols));
}

//helper variables
let rrows = [["A", "B", "C"], ["D", "E", "F"], ["G", "H", "I"]];
let ccols = [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"]];

for (let rs in rrows) {
  for (let cs in ccols) {
    units.push(createSquares(rrows[rs], ccols[cs]));
  }
}

//console.log(units);
// end of create UNITS

//create SQUARE-UNIT relationship
//create an object that holds SQUARE as key and 'an array of UNITS that square is a member of' as the value
//e.g. A1 square is in these units: [ 'A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1' ] , [ 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9' ], [ 'A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3' ]
let unitsOfEachSquare = {};

function member(item, list) {
  for (var i in list) if (item == list[i]) return true;
  return false;
}

for (var s in squares) {
  unitsOfEachSquare[squares[s]] = [];
  for (var u in units)
    if (member(squares[s], units[u]))
      unitsOfEachSquare[squares[s]].push(units[u]);
}

//console.log(unitsOfEachSquare);
//end of create SQUARE-UNIT relationship

//create PEERS
let peers = {};
for (let s in squares) {
  peers[squares[s]] = {};
  for (let u in unitsOfEachSquare[squares[s]]) {
    let ul = unitsOfEachSquare[squares[s]][u];
    for (let s2 in ul)
      if (ul[s2] != squares[s]) peers[squares[s]][ul[s2]] = true;
  }
}

//console.log(peers);
//end of create PEERS


// start of solving assigning and eliminating

let nassigns = 0;
let neliminations = 0;

function assign(values, sq, dig) {
  //console.log(values, sq, dig);
  // Eliminate all the other values (except dig) from values[sq] and propagate.
  ++nassigns;
  var result = true;
  var vals = values[sq];
  for (var d = 0; d < vals.length; d++)
    if (vals.charAt(d) != dig)
      result &= eliminate(values, sq, vals.charAt(d)) ? true : false;
  return result ? values : false;
}

function eliminate(values, sq, dig) {
  ++neliminations;
  if (values[sq].indexOf(dig) == -1)
    // already eliminated.
    return values;
  values[sq] = values[sq].replace(dig, "");
  if (values[sq].length == 0)
    // invalid input ?
    return false;
  else if (values[sq].length == 1) {
    // If there is only one value (values[sq]) left in square, remove it from peers
    var result = true;
    for (var s in peers[sq])
      result &= eliminate(values, s, values[sq]) ? true : false;
    if (!result) return false;
  }
  for (var u in unitsOfEachSquare[sq]) {
    var dplaces = [];
    for (var s in unitsOfEachSquare[sq][u]) {
      var sq2 = unitsOfEachSquare[sq][u][s];
      if (values[sq2].indexOf(dig) != -1) dplaces.push(sq2);
    }
    if (dplaces.length == 0) return false;
    else if (dplaces.length == 1)
      if (!assign(values, dplaces[0], dig)) return false;
  }
  return values;
}

// Given a string of 81 digits (or . or 0 or -), return an object as {cell:values}
function parse(input) {
  console.log(input);
  //create a boilerplate result object, each square has every digit as a possible option. (i.e. each square can be "123456789")
  //e.g. {I9: '123456789'} for 81 squares from A1 to I9.
  let values = {};
  for (var s in squares) {
    values[squares[s]] = digits;
  }

  //remove invalid chars from string
  let initialGrid = "";
  for (var c = 0; c < input.length; c++) {
    if ("0.-123456789".indexOf(input.charAt(c)) >= 0) {
      initialGrid += input.charAt(c);
    }
  }
  console.log(initialGrid);

  for (var s in squares)
    if (
      digits.indexOf(initialGrid.charAt(s)) >= 0 &&
      !assign(values, squares[s], initialGrid.charAt(s))
    ) {
      return false;
    }
  //console.log(values);
  return values;
}

// end of solving assigning and eliminating

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {};
} catch (e) {}
