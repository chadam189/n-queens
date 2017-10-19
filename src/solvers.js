/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n) {
  var solution = undefined;
  
  
  // start with new (blank) board of NxN size
  var board = new Board ({n: n});
  // place rook in starting spot
  // initial value will be 0,0 via board.togglePiece(0, 0)
  var rookCounter = 0;
  board.togglePiece(0, 0);
  rookCounter++;
  
  var currentRow = 1;
  var currentCol = 1;
  
  while (rookCounter < n && currentRow < n) {
    // toggle the next spot on the board and check if it's a valid placement
    board.togglePiece(currentRow, currentCol);
    if (board.hasAnyRooksConflicts()) {
      board.togglePiece(currentRow, currentCol);
    } else {
      rookCounter++;
    }
    // increment the next spot on the board
    if (currentCol === n - 1) {
      currentCol = 1;
      currentRow++;
    } else {
      currentCol++;
    }
    
  }
  
  if (rookCounter === n) {
    solution = board.rows();
    console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
    return solution;
  } 
  
  // no solutions found
  return null;
  

  // variable called "nextSpot"
    // rule out rest of (0, 1) to (0, n - 1)
    // rule out rest of (1, 0) to (n - 1, 0)
    // while next spot is in bounds AND not breaking one of the two rules above
    // increment to the next spot (keep row the same, col++... or if at end of row, row++ and col=0)
      // toggle piece #2
      // check if board is still valid, if not keep incrementing
      // if it is, try to add piece #N
        // check again
      // if we find a solution, we take a "screencap" by adding current board state (aka this.rows()) to our solution matrix
  

};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  if (n === 0) {
    return 1;
  }
  var solutionCount = 0; 
  
  // start with new (blank) board of NxN size
  var board = new Board ({n: n});
  // place rook in starting spot
  // initial value will be 0,0 via board.togglePiece(0, 0)
  var rookRowPositions = {};
  var rookColPositions = {};
  var rookPlacements = {};
  var rookCounter = 0;
  
  board.togglePiece(0, 0);
  rookCounter++;
  // add starting rook to rookPositions
  //maybe debug here for string issues
  rookRowPositions[0] = true;
  rookColPositions[0] = true;
  rookPlacements[rookCounter] = [0, 0];
  
  // initialize currR and currC for the next piece
  var currentRow = 1;
  var currentCol = 1;
  
  //single move loop
  while (rookCounter !== 0 && currentRow < n && currentCol < n) {
    //check if current set up is solution
    if (rookCounter === n) {
      solutionCount++;
      board.togglePiece(currentRow, currentCol);
      delete rookRowPositions[currentRow];
      delete rookColPositions[currentCol];
      delete rookPlacements[rookCounter];
      rookCounter--;
      if (currentCol === n - 1) {
        currentCol = 0;
        currentRow++;
      } else {
        currentCol++;
      }
    }
    
    //check if current spot is in bounds
    if (currentRow < n && currentCol < n) {
      // check against row conflicts with existing pieces
      while (rookRowPositions.hasOwnProperty(currentRow.toString())) {
        currentRow++;
        currentCol = 0;
      }
      // check against col conflicts with existing pieces
      while (rookColPositions.hasOwnProperty(currentCol.toString())) {
        if (currentCol === n - 1) {
          currentCol = 0;
          currentRow++;
        } else {
          currentCol++;
        }
      }
      
      
      //this is where we check to toggle stuff
      if (currentRow < n && currentCol < n) {
        // toggle the next spot on the board; if so, keep it and increment respective counters
        board.togglePiece(currentRow, currentCol);
        if (board.hasAnyRooksConflicts()) {
          board.togglePiece(currentRow, currentCol);
        } else {
          rookCounter++;
          rookRowPositions[currentRow] = true;
          rookColPositions[currentCol] = true;
          rookPlacements[rookCounter] = [currentRow, currentCol];
        }
      }
    }
    
    //maybe debug here -- check if current spot is off the board
    if (currentRow === n && rookCounter > 0) {
      currentRow = rookPlacements[rookCounter][0];
      currentCol = rookPlacements[rookCounter][1];
      board.togglePiece(currentRow, currentCol);
      delete rookRowPositions[currentRow];
      delete rookColPositions[currentCol];
      delete rookPlacements[rookCounter];
      rookCounter--;
      if (currentCol === n - 1) {
        currentCol = 0;
        currentRow++;
      } else {
        currentCol++;
      }
    }
    
  }
  
  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
