// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict

    hasRowConflictAt: function(rowIndex) {
      // if (this.get(rowIndex).indexOf(1) >= 0) {
      //   return true;
      // }
      // return false;
      return this.get(rowIndex).reduce((count, column) => {
        count += column;
        return count;
      }) > 1;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      // this.rows().forEach(row => {
      //   if (hasRowConflictAt(row)) {
      //     conflict = true;
      //   }
      // });
      for (var i = 0; i < this.attributes.n; i += 1) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var count = 0;
      this.rows().forEach(row => {
        if (row[colIndex] === 1) {
          count += 1;
        }
      });
      return count > 1;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      for (var i = 0; i < this.attributes.n; i += 1) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      if (majorDiagonalColumnIndexAtFirstRow > this.attributes.n - 2 || majorDiagonalColumnIndexAtFirstRow < 2 - this.attributes.n) {
        return false;
      }
      
      var currentRow = null;
      var currentColumn = null;
            
      if (majorDiagonalColumnIndexAtFirstRow >= 0) {
        currentRow = 0;
        currentColumn = majorDiagonalColumnIndexAtFirstRow;
      } else {
        currentRow = Math.abs(majorDiagonalColumnIndexAtFirstRow);
        currentColumn = 0;
      }
      
      var currentSpot = this.rows()[currentRow][currentColumn];
      var count = 0;
      var bound = this.attributes.n;
      
      do {
        currentSpot = this.rows()[currentRow][currentColumn];
        if (currentSpot === 1) {
          count++;
        }
        currentRow++;
        currentColumn++;
      } while (currentRow < bound && currentColumn < bound);
      
      return count > 1;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var bound = this.attributes.n - 2;
      for (var i = ((bound) * -1); i <= bound; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      if (minorDiagonalColumnIndexAtFirstRow > (this.attributes.n * 2) - 3 || minorDiagonalColumnIndexAtFirstRow <= 0 ) {
        return false;
      }
      
      var currentRow = null;
      var currentColumn = null;
            
      if (minorDiagonalColumnIndexAtFirstRow >= this.attributes.n) {
        //we changed this below from 1 to 3
        currentRow = minorDiagonalColumnIndexAtFirstRow - this.attributes.n + 1;
        currentColumn = this.attributes.n - 1;
      } else {
        currentRow = 0;
        currentColumn = minorDiagonalColumnIndexAtFirstRow;
      }
      // console.log('currentRow:', currentRow);
      // console.log('currentColumn:', currentColumn);
      // console.log('this.rows:', this.rows());
      var currentSpot = this.rows()[currentRow][currentColumn];
      var count = 0;
      var bound = this.attributes.n;
      
      do {
        currentSpot = this.rows()[currentRow][currentColumn];
        if (currentSpot === 1) {
          count++;
        }
        currentRow++;
        currentColumn--;
      } while (currentRow < bound && currentColumn >= 0);
      
      return count > 1;      
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var bound = (this.attributes.n * 2) - 3;
      if (this.attributes.n === 2) {
        if (this.attributes[0][1] === this.attributes[1][0]) {
          return true;
        }
      } else if (this.attributes.n === 3) {
        if (this.attributes[0][1] === this.attributes[1][0]) {
          return true;
        }
        if (this.attributes[1][2] === this.attributes[2][1]) {
          return true;
        }
        if (this.hasMinorDiagonalConflictAt(2)) {
          return true;
        }
      } else {
        for (var i = 1; i <= bound; i++) {
          if (this.hasMinorDiagonalConflictAt(i)) {
            return true;
          }
        }
      }
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
