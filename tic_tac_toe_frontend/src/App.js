import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * Main App component for the Tic Tac Toe game.
 * Features:
 * - Responsive, light, modern UI
 * - Two player (local pass-and-play) mode
 * - Centered Tic Tac Toe game board
 * - Score and control area below the game
 * - Win/draw detection
 * - Game restart control
 */
function App() {
  // Game board: a 3x3 array (represented as single array of 9)
  const [board, setBoard] = useState(Array(9).fill(null));
  // X always goes first
  const [xIsNext, setXIsNext] = useState(true);
  const [status, setStatus] = useState('playing'); // 'playing', 'won', 'draw'
  const [winner, setWinner] = useState(null); // 'X' | 'O' | null
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    // Check for winner or draw only if at least 5 moves
    const res = calculateWinner(board);
    if (res) {
      setStatus('won');
      setWinner(res);
      setScores(prev => ({
        ...prev,
        [res]: prev[res] + 1
      }));
    } else if (moves === 9) {
      setStatus('draw');
      setWinner(null);
    } else {
      setStatus('playing');
      setWinner(null);
    }
  }, [board, moves]);

  // PUBLIC_INTERFACE
  const handleSquareClick = idx => {
    if (board[idx] || status !== 'playing') return;
    const nextBoard = board.slice();
    nextBoard[idx] = xIsNext ? 'X' : 'O';
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
    setMoves(moves + 1);
  };

  // PUBLIC_INTERFACE
  const handleRestart = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setMoves(0);
    setStatus('playing');
    setWinner(null);
  };

  // PUBLIC_INTERFACE
  const handleResetScores = () => {
    setScores({ X: 0, O: 0 });
    handleRestart();
  };

  const currentPlayer = xIsNext ? 'X' : 'O';

  // Prepare status message
  let statusMsg = '';
  if (status === 'won') {
    statusMsg = `Player ${winner} wins! 🎉`;
  } else if (status === 'draw') {
    statusMsg = "It's a draw!";
  } else {
    statusMsg = `Player ${currentPlayer}'s turn`;
  }

  return (
    <div className="tic-tac-toe-app">
      <h1 className="ttt-title">Tic Tac Toe</h1>
      <div className="ttt-board-outer">
        <Board squares={board} onSquareClick={handleSquareClick} gameStatus={status} />
      </div>
      <div className="ttt-status">{statusMsg}</div>
      <div className="ttt-controls-area">
        <Scoreboard scores={scores} />
        <div className="ttt-controls">
          <button className="ttt-btn ttt-btn-restart" onClick={handleRestart}>
            Restart Game
          </button>
          <button className="ttt-btn ttt-btn-reset" onClick={handleResetScores}>
            Reset Scores
          </button>
        </div>
      </div>
      <footer className="ttt-footer">
        <span>
          Made with <span className="ttt-heart">♥</span> using React | KAVIA UI
        </span>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, gameStatus }) {
  // Generate rows and columns
  const renderSquare = i => (
    <button
      className="ttt-square"
      key={i}
      onClick={() => onSquareClick(i)}
      disabled={!!squares[i] || gameStatus !== 'playing'}
      aria-label={`Square ${i + 1} ${squares[i] ? (squares[i] === 'X' ? 'cross' : 'nought') : 'empty'}`}
    >
      {squares[i] && (
        <span
          className={`ttt-symbol ttt-symbol-${squares[i]}`}
        >
          {squares[i]}
        </span>
      )}
    </button>
  );

  // Board: 3x3
  return (
    <div className="ttt-board">
      {[0, 1, 2].map(row =>
        <div className="ttt-row" key={row}>
          {[0, 1, 2].map(col => renderSquare(row * 3 + col))}
        </div>
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
function Scoreboard({ scores }) {
  return (
    <div className="ttt-scoreboard">
      <div className="ttt-score ttt-score-x">
        <span className="ttt-label">X</span>
        <span className="ttt-score-val">{scores.X}</span>
      </div>
      <div className="ttt-score ttt-score-o">
        <span className="ttt-label">O</span>
        <span className="ttt-score-val">{scores.O}</span>
      </div>
    </div>
  );
}

// Calculation helpers
function calculateWinner(squares) {
  // Lines (rows, columns, diagonals)
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // Rows
    [0,3,6],[1,4,7],[2,5,8], // Cols
    [0,4,8],[2,4,6]          // Diags
  ];
  for (let [a,b,c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default App;
