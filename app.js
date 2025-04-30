"use client"

import React from "react"

// Navbar Component
function Navbar({ currentPage, onNavigate }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  return (
    <nav>
      <div className="container">
        <a
          href="#"
          className="logo"
          onClick={(e) => {
            e.preventDefault()
            onNavigate("home")
          }}
        >
          Sigma Games
        </a>

        <div className="nav-links">
          <a
            href="#"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault()
              onNavigate("home")
            }}
          >
            Home
          </a>
          <a
            href="#"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault()
              onNavigate("chess")
            }}
          >
            Chess
          </a>
          <a
            href="#"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault()
              onNavigate("pacman")
            }}
          >
            Pacman
          </a>
          <a
            href="#"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault()
              onNavigate("snake")
            }}
          >
            Snake
          </a>
        </div>

        <button className="mobile-menu-button" onClick={() => setIsMenuOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 12H21M3 6H21M3 18H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-header">
            <a
              href="#"
              className="logo"
              onClick={(e) => {
                e.preventDefault()
                onNavigate("home")
                setIsMenuOpen(false)
              }}
            >
              Sigma Games
            </a>
            <button onClick={() => setIsMenuOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div className="mobile-nav-links">
            <a
              href="#"
              className="mobile-nav-link"
              onClick={(e) => {
                e.preventDefault()
                onNavigate("home")
                setIsMenuOpen(false)
              }}
            >
              Home
            </a>
            <a
              href="#"
              className="mobile-nav-link"
              onClick={(e) => {
                e.preventDefault()
                onNavigate("chess")
                setIsMenuOpen(false)
              }}
            >
              Chess
            </a>
            <a
              href="#"
              className="mobile-nav-link"
              onClick={(e) => {
                e.preventDefault()
                onNavigate("pacman")
                setIsMenuOpen(false)
              }}
            >
              Pacman
            </a>
            <a
              href="#"
              className="mobile-nav-link"
              onClick={(e) => {
                e.preventDefault()
                onNavigate("snake")
                setIsMenuOpen(false)
              }}
            >
              Snake
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}

// Footer Component
function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <p className="copyright">&copy; {new Date().getFullYear()} Sigma Games. All rights reserved.</p>
          <div className="footer-links">
            <a href="#" className="footer-link">
              Privacy Policy
            </a>
            <a href="#" className="footer-link">
              Terms of Service
            </a>
            <a href="#" className="footer-link">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Game Card Component
function GameCard({ title, image, description, onClick }) {
  return (
    <div className="game-card">
      <div className="game-image">
        <img src={image || "https://via.placeholder.com/400x300"} alt={`${title} game`} />
      </div>
      <div className="game-content">
        <h2 className="game-title">{title}</h2>
        <p className="game-description">{description}</p>
      </div>
      <div className="game-footer">
        <button className="button" onClick={onClick}>
          Play Now
        </button>
      </div>
    </div>
  )
}

// Home Page Component
function HomePage({ onNavigate }) {
  return (
    <div className="container">
      <header>
        <h1>Sigma Games</h1>
        <p>Play your favorite classic games online</p>
      </header>

      <div className="games-grid">
        <GameCard
          title="Chess"
          image="https://via.placeholder.com/400x300"
          description="Challenge our AI in a strategic game of chess"
          onClick={() => onNavigate("chess")}
        />
        <GameCard
          title="Pacman"
          image="https://via.placeholder.com/400x300"
          description="Navigate through the maze and eat all the dots"
          onClick={() => onNavigate("pacman")}
        />
        <GameCard
          title="Snake"
          image="https://via.placeholder.com/400x300"
          description="Grow your snake by eating food without hitting the walls or yourself"
          onClick={() => onNavigate("snake")}
        />
      </div>
    </div>
  )
}

// Helper function to save game results
function saveGameResult(game, result) {
  // In a real app, this would save to a database
  console.log(`Game result: ${game} - ${result}`)

  // Create or update a cookie to store user ID
  const userId = getCookie("userId") || Math.random().toString(36).substring(2, 15)
  setCookie("userId", userId, 365) // Store for 1 year
}

function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(";").shift()
}

function setCookie(name, value, days) {
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  const expires = `expires=${date.toUTCString()}`
  document.cookie = `${name}=${value};${expires};path=/`
}

// Chess Game Component
function ChessGame() {
  const [board, setBoard] = React.useState(null)
  const [selectedPiece, setSelectedPiece] = React.useState(null)
  const [playerTurn, setPlayerTurn] = React.useState(true) // true for player (white), false for computer (black)
  const [gameStatus, setGameStatus] = React.useState("playing")
  const [message, setMessage] = React.useState("Your turn (White)")
  const [gameStarted, setGameStarted] = React.useState(false)

  React.useEffect(() => {
    if (!gameStarted) return

    setBoard(initializeBoard())
    setSelectedPiece(null)
    setPlayerTurn(true)
    setGameStatus("playing")
    setMessage("Your turn (White)")
  }, [gameStarted])

  React.useEffect(() => {
    if (!playerTurn && gameStatus === "playing" && board) {
      // Computer's turn
      setMessage("Computer thinking...")

      // Simulate computer thinking
      const timeoutId = setTimeout(() => {
        makeComputerMove()
        setPlayerTurn(true)
        setMessage("Your turn (White)")
      }, 1000)

      return () => clearTimeout(timeoutId)
    }
  }, [playerTurn, gameStatus, board])

  function initializeBoard() {
    const newBoard = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null))

    // Set up pawns
    for (let i = 0; i < 8; i++) {
      newBoard[1][i] = { type: "pawn", color: "black" }
      newBoard[6][i] = { type: "pawn", color: "white" }
    }

    // Set up other pieces
    const backRankPieces = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"]
    for (let i = 0; i < 8; i++) {
      newBoard[0][i] = { type: backRankPieces[i], color: "black" }
      newBoard[7][i] = { type: backRankPieces[i], color: "white" }
    }

    return newBoard
  }

  function makeComputerMove() {
    if (!board) return

    // Simple AI: Find all possible moves and choose one randomly
    const possibleMoves = []

    // Find all black pieces
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col]
        if (piece && piece.color === "black") {
          // Find all valid moves for this piece
          for (let newRow = 0; newRow < 8; newRow++) {
            for (let newCol = 0; newCol < 8; newCol++) {
              if (isValidMove(row, col, newRow, newCol)) {
                possibleMoves.push({ from: { row, col }, to: { row: newRow, col: newCol } })
              }
            }
          }
        }
      }
    }

    if (possibleMoves.length > 0) {
      // Choose a random move
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]

      // Execute the move
      const newBoard = [...board.map((row) => [...row])]
      newBoard[randomMove.to.row][randomMove.to.col] = newBoard[randomMove.from.row][randomMove.from.col]
      newBoard[randomMove.from.row][randomMove.from.col] = null
      setBoard(newBoard)
    } else {
      // No valid moves - stalemate or checkmate
      setGameStatus("stalemate")
      setMessage("Game over - Stalemate")
      saveGameResult("chess", "stalemate")
    }
  }

  function isValidMove(fromRow, fromCol, toRow, toCol) {
    if (!board) return false

    // This is a simplified version of chess move validation
    const piece = board[fromRow][fromCol]
    const targetPiece = board[toRow][toCol]

    // Can't move to a square occupied by a piece of the same color
    if (targetPiece && targetPiece.color === piece.color) {
      return false
    }

    // Basic movement rules for each piece type
    switch (piece.type) {
      case "pawn":
        // Simplified pawn movement
        const direction = piece.color === "white" ? -1 : 1
        const startRow = piece.color === "white" ? 6 : 1

        // Move forward one square
        if (toCol === fromCol && toRow === fromRow + direction && !targetPiece) {
          return true
        }

        // Move forward two squares from starting position
        if (
          toCol === fromCol &&
          fromRow === startRow &&
          toRow === fromRow + 2 * direction &&
          !targetPiece &&
          !board[fromRow + direction][fromCol]
        ) {
          return true
        }

        // Capture diagonally
        if (Math.abs(toCol - fromCol) === 1 && toRow === fromRow + direction && targetPiece) {
          return true
        }

        return false

      case "rook":
        // Rook moves horizontally or vertically
        if (fromRow !== toRow && fromCol !== toCol) {
          return false
        }

        // Check if path is clear
        if (fromRow === toRow) {
          const start = Math.min(fromCol, toCol)
          const end = Math.max(fromCol, toCol)
          for (let col = start + 1; col < end; col++) {
            if (board[fromRow][col]) {
              return false
            }
          }
        } else {
          const start = Math.min(fromRow, toRow)
          const end = Math.max(fromRow, toRow)
          for (let row = start + 1; row < end; row++) {
            if (board[row][fromCol]) {
              return false
            }
          }
        }

        return true

      case "knight":
        // Knight moves in an L-shape
        return (
          (Math.abs(fromRow - toRow) === 2 && Math.abs(fromCol - toCol) === 1) ||
          (Math.abs(fromRow - toRow) === 1 && Math.abs(fromCol - toCol) === 2)
        )

      case "bishop":
        // Bishop moves diagonally
        if (Math.abs(fromRow - toRow) !== Math.abs(fromCol - toCol)) {
          return false
        }

        // Check if path is clear
        const rowStep = toRow > fromRow ? 1 : -1
        const colStep = toCol > fromCol ? 1 : -1
        let row = fromRow + rowStep
        let col = fromCol + colStep

        while (row !== toRow && col !== toCol) {
          if (board[row][col]) {
            return false
          }
          row += rowStep
          col += colStep
        }

        return true

      case "queen":
        // Queen moves like a rook or bishop
        const isDiagonal = Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)
        const isStraight = fromRow === toRow || fromCol === toCol

        if (!isDiagonal && !isStraight) {
          return false
        }

        // Check if path is clear (simplified)
        if (isStraight) {
          // Horizontal movement
          if (fromRow === toRow) {
            const start = Math.min(fromCol, toCol)
            const end = Math.max(fromCol, toCol)
            for (let col = start + 1; col < end; col++) {
              if (board[fromRow][col]) {
                return false
              }
            }
          }
          // Vertical movement
          else {
            const start = Math.min(fromRow, toRow)
            const end = Math.max(fromRow, toRow)
            for (let row = start + 1; row < end; row++) {
              if (board[row][fromCol]) {
                return false
              }
            }
          }
        }
        // Diagonal movement
        else {
          const rowStep = toRow > fromRow ? 1 : -1
          const colStep = toCol > fromCol ? 1 : -1
          let row = fromRow + rowStep
          let col = fromCol + colStep

          while (row !== toRow && col !== toCol) {
            if (board[row][col]) {
              return false
            }
            row += rowStep
            col += colStep
          }
        }

        return true

      case "king":
        // King moves one square in any direction
        return Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1

      default:
        return false
    }
  }

  function handleSquareClick(row, col) {
    if (!playerTurn || gameStatus !== "playing" || !board) {
      return
    }

    const piece = board[row][col]

    // If no piece is selected and the clicked square has a player's piece, select it
    if (!selectedPiece && piece && piece.color === "white") {
      setSelectedPiece({ row, col })
      return
    }

    // If a piece is already selected
    if (selectedPiece) {
      // If clicking on another player piece, select that piece instead
      if (piece && piece.color === "white") {
        setSelectedPiece({ row, col })
        return
      }

      // Try to move the selected piece
      if (isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
        const newBoard = [...board.map((row) => [...row])]
        newBoard[row][col] = newBoard[selectedPiece.row][selectedPiece.col]
        newBoard[selectedPiece.row][selectedPiece.col] = null

        setBoard(newBoard)
        setSelectedPiece(null)
        setPlayerTurn(false)

        // Check if this was a winning move (simplified)
        if (piece && piece.type === "king") {
          setGameStatus("checkmate")
          setMessage("Checkmate! You win!")
          saveGameResult("chess", "win")
        }
      } else {
        // Invalid move
        setSelectedPiece(null)
      }
    }
  }

  function renderBoard() {
    if (!board) return null

    return (
      <div className="chess-board">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const isBlackSquare = (rowIndex + colIndex) % 2 === 1
            const isSelected = selectedPiece && selectedPiece.row === rowIndex && selectedPiece.col === colIndex

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`chess-square ${isBlackSquare ? "chess-square-black" : "chess-square-white"} ${
                  isSelected ? "chess-square-selected" : ""
                }`}
                style={{
                  cursor: piece && piece.color === "white" && playerTurn ? "pointer" : "default",
                }}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              >
                {piece && getPieceSymbol(piece)}
              </div>
            )
          }),
        )}
      </div>
    )
  }

  function getPieceSymbol(piece) {
    if (!piece) return null

    const symbols = {
      white: {
        king: "♔",
        queen: "♕",
        rook: "♖",
        bishop: "♗",
        knight: "♘",
        pawn: "♙",
      },
      black: {
        king: "♚",
        queen: "♛",
        rook: "♜",
        bishop: "♝",
        knight: "♞",
        pawn: "♟",
      },
    }

    return symbols[piece.color][piece.type]
  }

  function resetGame() {
    setBoard(initializeBoard())
    setSelectedPiece(null)
    setPlayerTurn(true)
    setGameStatus("playing")
    setMessage("Your turn (White)")
  }

  function startGame() {
    setGameStarted(true)
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Chess</h1>
      </div>

      <div className="game-score">
        <div>{message}</div>
      </div>

      <div className="game-canvas-container">
        {!gameStarted ? (
          <div className="game-overlay">
            <h2>Chess</h2>
            <button className="button" onClick={startGame}>
              Start Game
            </button>
          </div>
        ) : (
          renderBoard()
        )}

        {gameStatus !== "playing" && gameStarted && (
          <div className="game-overlay">
            <h2>{gameStatus === "checkmate" ? "Checkmate! You win!" : "Game over - Stalemate"}</h2>
            <button className="button" onClick={resetGame}>
              Play Again
            </button>
          </div>
        )}
      </div>

      {gameStarted && (
        <div className="game-controls">
          <button className="button" onClick={resetGame}>
            Reset Game
          </button>
        </div>
      )}
    </div>
  )
}

// Pacman Game Component
function PacmanGame() {
  const canvasRef = React.useRef(null)
  const [score, setScore] = React.useState(0)
  const [gameOver, setGameOver] = React.useState(false)
  const [gameStarted, setGameStarted] = React.useState(false)
  const [gameWon, setGameWon] = React.useState(false)
  const [currentDirection, setCurrentDirection] = React.useState("right")
  const gameStateRef = React.useRef({
    pacman: { x: 0, y: 0, direction: "right", mouthOpen: true },
    ghosts: [
      { x: 0, y: 0, direction: "right", color: "red" },
      { x: 0, y: 0, direction: "left", color: "pink" },
      { x: 0, y: 0, direction: "up", color: "cyan" },
      { x: 0, y: 0, direction: "down", color: "orange" },
    ],
    dots: [],
    walls: [],
    cellSize: 20,
    gridWidth: 0,
    gridHeight: 0,
    animationFrame: 0,
    lastMouthChange: 0,
  })

  // Function to handle direction changes
  const changeDirection = React.useCallback(
    (newDirection) => {
      if (!gameStarted || gameOver) return

      const gameState = gameStateRef.current

      // Update the direction in the game state
      gameState.pacman.direction = newDirection
      setCurrentDirection(newDirection)

      console.log("Direction changed to:", newDirection)
    },
    [gameStarted, gameOver],
  )

  // Handle keyboard controls
  const handleKeyDown = React.useCallback(
    (e) => {
      e.preventDefault()
      console.log("Key pressed:", e.key)
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          changeDirection("up")
          break
        case "ArrowDown":
        case "s":
        case "S":
          changeDirection("down")
          break
        case "ArrowLeft":
        case "a":
        case "A":
          changeDirection("left")
          break
        case "ArrowRight":
        case "d":
        case "D":
          changeDirection("right")
          break
      }
    },
    [changeDirection],
  )

  // Add on-screen control buttons
  const moveUp = () => changeDirection("up")
  const moveDown = () => changeDirection("down")
  const moveLeft = () => changeDirection("left")
  const moveRight = () => changeDirection("right")

  React.useEffect(() => {
    if (!gameStarted) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const gameState = gameStateRef.current

    // Initialize game board
    initializeGame(canvas)

    // Game loop
    let lastTime = 0
    const fps = 60
    const interval = 1000 / fps

    function gameLoop(timestamp) {
      if (!gameStarted) return

      const deltaTime = timestamp - lastTime

      if (deltaTime >= interval) {
        lastTime = timestamp - (deltaTime % interval)

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Update game state
        updateGame(deltaTime)

        // Draw everything
        drawGame(ctx)

        // Check win condition
        if (gameState.dots.length === 0 && !gameWon) {
          setGameWon(true)
          setGameOver(true)
          saveGameResult("pacman", "win")
        }
      }

      if (!gameOver) {
        gameState.animationFrame = requestAnimationFrame(gameLoop)
      }
    }

    gameState.animationFrame = requestAnimationFrame(gameLoop)

    // Add event listeners to multiple targets for better reliability
    window.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keydown", handleKeyDown)
    canvas.addEventListener("keydown", handleKeyDown)

    // Focus the canvas to ensure it receives keyboard events
    canvas.focus()

    // Log to help debug
    console.log("Game started, event listeners attached")

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keydown", handleKeyDown)
      canvas.removeEventListener("keydown", handleKeyDown)
      cancelAnimationFrame(gameState.animationFrame)
    }
  }, [gameStarted, gameOver, gameWon, handleKeyDown])

  function initializeGame(canvas) {
    const gameState = gameStateRef.current

    // Set canvas size
    canvas.width = Math.min(480, window.innerWidth - 40)
    canvas.height = Math.min(480, window.innerWidth - 40)

    // Calculate grid dimensions
    gameState.gridWidth = Math.floor(canvas.width / gameState.cellSize)
    gameState.gridHeight = Math.floor(canvas.height / gameState.cellSize)

    // Initialize pacman position
    gameState.pacman.x = Math.floor(gameState.gridWidth / 2) * gameState.cellSize
    gameState.pacman.y = Math.floor(gameState.gridHeight / 2) * gameState.cellSize
    gameState.pacman.direction = "right"
    setCurrentDirection("right")

    // Initialize ghost positions
    gameState.ghosts[0].x = gameState.cellSize * 1
    gameState.ghosts[0].y = gameState.cellSize * 1

    gameState.ghosts[1].x = canvas.width - gameState.cellSize * 2
    gameState.ghosts[1].y = gameState.cellSize * 1

    gameState.ghosts[2].x = gameState.cellSize * 1
    gameState.ghosts[2].y = canvas.height - gameState.cellSize * 2

    gameState.ghosts[3].x = canvas.width - gameState.cellSize * 2
    gameState.ghosts[3].y = canvas.height - gameState.cellSize * 2

    // Create walls
    gameState.walls = [
      // Outer walls
      { x: 0, y: 0, width: canvas.width, height: gameState.cellSize },
      { x: 0, y: 0, width: gameState.cellSize, height: canvas.height },
      { x: 0, y: canvas.height - gameState.cellSize, width: canvas.width, height: gameState.cellSize },
      { x: canvas.width - gameState.cellSize, y: 0, width: gameState.cellSize, height: canvas.height },

      // Inner obstacles
      {
        x: gameState.cellSize * 3,
        y: gameState.cellSize * 3,
        width: gameState.cellSize * 4,
        height: gameState.cellSize * 2,
      },
      {
        x: gameState.cellSize * 10,
        y: gameState.cellSize * 3,
        width: gameState.cellSize * 4,
        height: gameState.cellSize * 2,
      },
      {
        x: gameState.cellSize * 3,
        y: gameState.cellSize * 10,
        width: gameState.cellSize * 4,
        height: gameState.cellSize * 2,
      },
      {
        x: gameState.cellSize * 10,
        y: gameState.cellSize * 10,
        width: gameState.cellSize * 4,
        height: gameState.cellSize * 2,
      },
      {
        x: gameState.cellSize * 8,
        y: gameState.cellSize * 7,
        width: gameState.cellSize * 2,
        height: gameState.cellSize * 2,
      },
    ]

    // Create dots
    gameState.dots = []
    for (let x = gameState.cellSize; x < canvas.width - gameState.cellSize; x += gameState.cellSize) {
      for (let y = gameState.cellSize; y < canvas.height - gameState.cellSize; y += gameState.cellSize) {
        // Skip dots where walls are
        let isWall = false
        for (const wall of gameState.walls) {
          if (x >= wall.x && x < wall.x + wall.width && y >= wall.y && y < wall.y + wall.height) {
            isWall = true
            break
          }
        }

        if (!isWall) {
          gameState.dots.push({ x, y })
        }
      }
    }

    setScore(0)
    setGameOver(false)
  }

  function updateGame(deltaTime) {
    const gameState = gameStateRef.current

    // Update mouth animation
    if (Date.now() - gameState.lastMouthChange > 200) {
      gameState.pacman.mouthOpen = !gameState.pacman.mouthOpen
      gameState.lastMouthChange = Date.now()
    }

    // Move pacman
    let newX = gameState.pacman.x
    let newY = gameState.pacman.y
    const moveSpeed = 3 // Increased speed for better responsiveness

    switch (gameState.pacman.direction) {
      case "up":
        newY -= moveSpeed
        break
      case "down":
        newY += moveSpeed
        break
      case "left":
        newX -= moveSpeed
        break
      case "right":
        newX += moveSpeed
        break
    }

    // Check if the new position is valid before moving
    if (canMove(newX, newY)) {
      gameState.pacman.x = newX
      gameState.pacman.y = newY
    } else {
      // Try to slide along walls when hitting them at an angle
      if (gameState.pacman.direction === "up" || gameState.pacman.direction === "down") {
        if (canMove(gameState.pacman.x + moveSpeed, gameState.pacman.y)) {
          gameState.pacman.x += moveSpeed
        } else if (canMove(gameState.pacman.x - moveSpeed, gameState.pacman.y)) {
          gameState.pacman.x -= moveSpeed
        }
      } else {
        if (canMove(gameState.pacman.x, gameState.pacman.y + moveSpeed)) {
          gameState.pacman.y += moveSpeed
        } else if (canMove(gameState.pacman.x, gameState.pacman.y - moveSpeed)) {
          gameState.pacman.y -= moveSpeed
        }
      }
    }

    // Check for dot collection
    const dotIndex = gameState.dots.findIndex(
      (dot) =>
        Math.abs(dot.x - gameState.pacman.x) < gameState.cellSize / 2 &&
        Math.abs(dot.y - gameState.pacman.y) < gameState.cellSize / 2,
    )

    if (dotIndex !== -1) {
      gameState.dots.splice(dotIndex, 1)
      setScore((prevScore) => prevScore + 10)
    }

    // Move ghosts
    gameState.ghosts.forEach((ghost) => {
      // Occasionally change direction randomly
      if (Math.random() < 0.02) {
        const directions = ["up", "down", "left", "right"]
        ghost.direction = directions[Math.floor(Math.random() * directions.length)]
      }

      let ghostNewX = ghost.x
      let ghostNewY = ghost.y

      switch (ghost.direction) {
        case "up":
          ghostNewY -= 1
          break
        case "down":
          ghostNewY += 1
          break
        case "left":
          ghostNewX -= 1
          break
        case "right":
          ghostNewX += 1
          break
      }

      if (canMove(ghostNewX, ghostNewY)) {
        ghost.x = ghostNewX
        ghost.y = ghostNewY
      } else {
        // If can't move, change direction
        const directions = ["up", "down", "left", "right"]
        ghost.direction = directions[Math.floor(Math.random() * directions.length)]
      }

      // Check for collision with pacman
      if (
        Math.abs(ghost.x - gameState.pacman.x) < gameState.cellSize / 2 &&
        Math.abs(ghost.y - gameState.pacman.y) < gameState.cellSize / 2
      ) {
        setGameOver(true)
        saveGameResult("pacman", "lose")
      }
    })
  }

  function canMove(x, y) {
    const gameState = gameStateRef.current

    // Check wall collisions
    for (const wall of gameState.walls) {
      if (
        x + gameState.cellSize / 2 > wall.x &&
        x - gameState.cellSize / 2 < wall.x + wall.width &&
        y + gameState.cellSize / 2 > wall.y &&
        y - gameState.cellSize / 2 < wall.y + wall.height
      ) {
        return false
      }
    }

    return true
  }

  function drawGame(ctx) {
    const gameState = gameStateRef.current
    //const cellSize = gameState.gridSize
    const { pacman, ghosts, dots, walls, cellSize } = gameState;

    // Draw walls
    ctx.fillStyle = "#3366cc"
    gameState.walls.forEach((wall) => {
      ctx.fillRect(wall.x, wall.y, wall.width, wall.height)
    })

    // Draw dots
    ctx.fillStyle = "#ffcc00"
    gameState.dots.forEach((dot) => {
      ctx.beginPath()
      ctx.arc(dot.x + gameState.cellSize / 2, dot.y + gameState.cellSize / 2, 3, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw pacman
    ctx.fillStyle = "#ffff00"
    ctx.beginPath()

    const pacmanX = gameState.pacman.x + gameState.cellSize / 2
    const pacmanY = gameState.pacman.y + gameState.cellSize / 2
    const radius = gameState.cellSize / 2

    if (gameState.pacman.mouthOpen) {
      let startAngle = 0
      let endAngle = 0

      switch (gameState.pacman.direction) {
        case "right":
          startAngle = 0.25 * Math.PI
          endAngle = 1.75 * Math.PI
          break
        case "down":
          startAngle = 0.75 * Math.PI
          endAngle = 2.25 * Math.PI
          break
        case "left":
          startAngle = 1.25 * Math.PI
          endAngle = 3.75 * Math.PI
          break
        case "up":
          startAngle = 1.75 * Math.PI
          endAngle = 4.25 * Math.PI
          break
      }
      ctx.lineTo(pacmanX, pacmanY)
      ctx.arc(pacmanX, pacmanY, radius, startAngle, endAngle)
    } else {
      ctx.arc(pacmanX, pacmanY, radius, 0, Math.PI * 2)
    }

    // ctx.lineTo(pacmanX, pacmanY)
    ctx.fill()

    // Draw ghosts
    gameState.ghosts.forEach((ghost) => {
      ctx.fillStyle = ghost.color

      // Ghost body
      ctx.beginPath()
      ctx.arc(
        ghost.x + gameState.cellSize / 2,
        ghost.y + gameState.cellSize / 2 - 2,
        gameState.cellSize / 2,
        Math.PI,
        0,
        false,
      )

      // Ghost "skirt"
      ctx.lineTo(ghost.x + gameState.cellSize, ghost.y + gameState.cellSize / 2 + 6)

      // Create wavy bottom
      const waveSize = gameState.cellSize / 6
      for (let i = 0; i < 3; i++) {
        ctx.lineTo(
          ghost.x + gameState.cellSize - (i + 1) * waveSize * 2,
          ghost.y + gameState.cellSize / 2 + (i % 2 === 0 ? 2 : 6),
        )
      }

      ctx.lineTo(ghost.x, ghost.y + gameState.cellSize / 2 + 6)
      ctx.lineTo(ghost.x, ghost.y + gameState.cellSize / 2 - 2)
      ctx.fill()

      // Eyes
      ctx.fillStyle = "white"
      ctx.beginPath()
      ctx.arc(
        ghost.x + gameState.cellSize / 3,
        ghost.y + gameState.cellSize / 2 - 2,
        gameState.cellSize / 6,
        0,
        Math.PI * 2,
      )
      ctx.arc(
        ghost.x + (gameState.cellSize * 2) / 3,
        ghost.y + gameState.cellSize / 2 - 2,
        gameState.cellSize / 6,
        0,
        Math.PI * 2,
      )
      ctx.fill()

      // Pupils
      ctx.fillStyle = "black"

      let pupilOffsetX = 0
      let pupilOffsetY = 0

      switch (ghost.direction) {
        case "left":
          pupilOffsetX = -1
          break
        case "right":
          pupilOffsetX = 1
          break
        case "up":
          pupilOffsetY = -1
          break
        case "down":
          pupilOffsetY = 1
          break
      }

      ctx.beginPath()
      ctx.arc(
        ghost.x + gameState.cellSize / 3 + pupilOffsetX * 2,
        ghost.y + gameState.cellSize / 2 - 2 + pupilOffsetY * 2,
        gameState.cellSize / 10,
        0,
        Math.PI * 2,
      )
      ctx.arc(
        ghost.x + (gameState.cellSize * 2) / 3 + pupilOffsetX * 2,
        ghost.y + gameState.cellSize / 2 - 2 + pupilOffsetY * 2,
        gameState.cellSize / 10,
        0,
        Math.PI * 2,
      )
      ctx.fill()
    })
  }

  function startGame() {
    setGameStarted(true)
    setGameOver(false)
    setGameWon(false)

    // Focus the canvas after a short delay to ensure it's rendered
    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.focus()
      }
    }, 100)
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Pacman</h1>
      </div>

      <div className="game-score">
        <div>Score: {score}</div>
        {gameOver && <div>{gameWon ? "You Win!" : "Game Over!"}</div>}
        <div>Current Direction: {currentDirection}</div>
      </div>

      <div className="game-canvas-container">
        <canvas ref={canvasRef} width="480" height="480" tabIndex="0" style={{ outline: "none" }} />

        {!gameStarted && (
          <div className="game-overlay">
            <h2>Pacman</h2>
            <button className="button" onClick={startGame}>
              Start Game
            </button>
          </div>
        )}

        {gameOver && (
          <div className="game-overlay">
            <h2>{gameWon ? "You Win!" : "Game Over!"}</h2>
            <div className="score">Score: {score}</div>
            <button className="button" onClick={startGame}>
              Play Again
            </button>
          </div>
        )}
      </div>

      <div className="game-controls">
        <h2>Controls</h2>
        <p>Use arrow keys or WASD to move Pacman</p>

        <div className="control-buttons">
          <button className="control-button up-button" onClick={moveUp}>
            ↑
          </button>
          <div className="control-buttons-row">
            <button className="control-button left-button" onClick={moveLeft}>
              ←
            </button>
            <button className="control-button right-button" onClick={moveRight}>
              →
            </button>
          </div>
          <button className="control-button down-button" onClick={moveDown}>
            ↓
          </button>
        </div>
      </div>
    </div>
  )
}

// Snake Game Component
function SnakeGame() {
  const canvasRef = React.useRef(null);
  const [score, setScore] = React.useState(0);
  const [gameOver, setGameOver] = React.useState(false);
  const [gameStarted, setGameStarted] = React.useState(false);

  const gameStateRef = React.useRef({
    snake: [{ x: 10, y: 10 }],
    food: { x: 5, y: 5 },
    direction: "right",
    nextDirection: "right",
    gridSize: 20,
    gridWidth: 0,
    gridHeight: 0,
    speed: 100,
    lastUpdate: 0,
    animationFrame: 0,
  });

  React.useEffect(() => {
    if (!gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gameState = gameStateRef.current;

    // Initialize game board
    initializeGame(canvas);

    // Game loop
    function gameLoop(timestamp) {
      if (!gameStarted) return;

      if (timestamp - gameState.lastUpdate > gameState.speed) {
        gameState.lastUpdate = timestamp;

        // Update game state
        updateGame();

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw everything
        drawGame(ctx);
      }

      if (!gameOver) {
        gameState.animationFrame = requestAnimationFrame(gameLoop);
      }
    }

    gameState.animationFrame = requestAnimationFrame(gameLoop);

    // Keyboard controls
    function handleKeyDown(e) {
      switch (e.key) {
        case "ArrowUp":
        case "w":
          if (gameState.direction !== "down") {
            gameState.nextDirection = "up";
          }
          break;
        case "ArrowDown":
        case "s":
          if (gameState.direction !== "up") {
            gameState.nextDirection = "down";
          }
          break;
        case "ArrowLeft":
        case "a":
          if (gameState.direction !== "right") {
            gameState.nextDirection = "left";
          }
          break;
        case "ArrowRight":
        case "d":
          if (gameState.direction !== "left") {
            gameState.nextDirection = "right";
          }
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      cancelAnimationFrame(gameState.animationFrame);
    };
  }, [gameStarted, gameOver]);

  function initializeGame(canvas) {
    const gameState = gameStateRef.current;

    // Set canvas size
    canvas.width = Math.min(400, window.innerWidth - 40);
    canvas.height = Math.min(400, window.innerWidth - 40);

    // Calculate grid dimensions
    gameState.gridWidth = Math.floor(canvas.width / gameState.gridSize);
    gameState.gridHeight = Math.floor(canvas.height / gameState.gridSize);

    // Initialize snake
    gameState.snake = [{ x: Math.floor(gameState.gridWidth / 2), y: Math.floor(gameState.gridHeight / 2) }];

    // Initialize direction
    gameState.direction = "right";
    gameState.nextDirection = "right";

    // Place food
    placeFood();

    // Reset score
    setScore(0);
    setGameOver(false);
  }

  function placeFood() {
    const gameState = gameStateRef.current;

    // Generate random position for food
    let foodX, foodY;
    let validPosition = false;

    while (!validPosition) {
      foodX = Math.floor(Math.random() * gameState.gridWidth);
      foodY = Math.floor(Math.random() * gameState.gridHeight);

      // Check if food is not on snake
      validPosition = true;
      for (const segment of gameState.snake) {
        if (segment.x === foodX && segment.y === foodY) {
          validPosition = false;
          break;
        }
      }
    }

    gameState.food = { x: foodX, y: foodY };
  }

  function updateGame() {
    const gameState = gameStateRef.current;

    // Update direction
    gameState.direction = gameState.nextDirection;

    // Calculate new head position
    const head = { ...gameState.snake[0] };

    switch (gameState.direction) {
      case "up":
        head.y -= 1;
        break;
      case "down":
        head.y += 1;
        break;
      case "left":
        head.x -= 1;
        break;
      case "right":
        head.x += 1;
        break;
    }

    // Check for collisions with walls
    if (head.x < 0 || head.x >= gameState.gridWidth || head.y < 0 || head.y >= gameState.gridHeight) {
      setGameOver(true);
      saveGameResult("snake", "lose");
      return;
    }

    // Check for collisions with self
    for (const segment of gameState.snake) {
      if (head.x === segment.x && head.y === segment.y) {
        setGameOver(true);
        saveGameResult("snake", "lose");
        return;
      }
    }

    // Add new head
    gameState.snake.unshift(head);

    // Check if snake ate food
    if (head.x === gameState.food.x && head.y === gameState.food.y) {
      // Increase score
      setScore((prevScore) => prevScore + 10);

      // Place new food
      placeFood();

      // Increase speed slightly
      if (gameState.speed > 50) {
        gameState.speed -= 2;
      }
    } else {
      // Remove tail if no food was eaten
      gameState.snake.pop();
    }
  }

  function drawGame(ctx) {
    const gameState = gameStateRef.current;
    const cellSize = gameState.gridSize;

    // Draw snake
    gameState.snake.forEach((segment, index) => {
      // Head is a different color
      if (index === 0) {
        ctx.fillStyle = "#4CAF50";
      } else {
        ctx.fillStyle = "#8BC34A";
      }

      ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);

      // Add a border to make segments more visible
      ctx.strokeStyle = "#388E3C";
      ctx.strokeRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);

      // Draw eyes on head
      if (index === 0) {
        ctx.fillStyle = "white";

        let eyeX1, eyeY1, eyeX2, eyeY2;

        switch (gameState.direction) {
          case "right":
            eyeX1 = segment.x * cellSize + cellSize * 0.7;
            eyeY1 = segment.y * cellSize + cellSize * 0.3;
            eyeX2 = segment.x * cellSize + cellSize * 0.7;
            eyeY2 = segment.y * cellSize + cellSize * 0.7;
            break;
          case "left":
            eyeX1 = segment.x * cellSize + cellSize * 0.3;
            eyeY1 = segment.y * cellSize + cellSize * 0.3;
            eyeX2 = segment.x * cellSize + cellSize * 0.3;
            eyeY2 = segment.y * cellSize + cellSize * 0.7;
            break;
          case "up":
            eyeX1 = segment.x * cellSize + cellSize * 0.3;
            eyeY1 = segment.y * cellSize + cellSize * 0.3;
            eyeX2 = segment.x * cellSize + cellSize * 0.7;
            eyeY2 = segment.y * cellSize + cellSize * 0.3;
            break;
          case "down":
            eyeX1 = segment.x * cellSize + cellSize * 0.3;
            eyeY1 = segment.y * cellSize + cellSize * 0.7;
            eyeX2 = segment.x * cellSize + cellSize * 0.7;
            eyeY2 = segment.y * cellSize + cellSize * 0.7;
            break;
        }

        ctx.beginPath();
        ctx.arc(eyeX1, eyeY1, cellSize * 0.15, 0, Math.PI * 2);
        ctx.arc(eyeX2, eyeY2, cellSize * 0.15, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(eyeX1, eyeY1, cellSize * 0.07, 0, Math.PI * 2);
        ctx.arc(eyeX2, eyeY2, cellSize * 0.07, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw food
    ctx.fillStyle = "#F44336";
    ctx.beginPath();
    ctx.arc(
      gameState.food.x * cellSize + cellSize / 2,
      gameState.food.y * cellSize + cellSize / 2,
      cellSize / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Add a stem to the food (apple)
    ctx.fillStyle = "#795548";
    ctx.fillRect(
      gameState.food.x * cellSize + cellSize * 0.45,
      gameState.food.y * cellSize,
      cellSize * 0.1,
      cellSize * 0.3
    );

    // Add a leaf
    ctx.fillStyle = "#4CAF50";
    ctx.beginPath();
    ctx.ellipse(
      gameState.food.x * cellSize + cellSize * 0.6,
      gameState.food.y * cellSize + cellSize * 0.2,
      cellSize * 0.15,
      cellSize * 0.08,
      Math.PI / 4,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  // function startGame() {
  //   setGameStarted(true);
  //   setGameOver(false);
  //   initializeGame(canvasRef.current);
  // }

  function startGame() {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    setGameOver(false);
    setScore(0);
    setGameStarted(true);
    initializeGame(canvas);
  }
  
  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Snake</h1>
      </div>

      <div className="game-score">
        <div>Score: {score}</div>
        {gameOver && <div>Game Over!</div>}
      </div>

      <div className="game-canvas-container">
        <canvas ref={canvasRef} width="400" height="400" />

        {/* {!gameStarted && (
          <div className="game-overlay">
            <h2>Snake</h2>
            <button className="button" onClick={startGame}>
              Start Game
            </button>
          </div>
        )}

        {gameOver && (
          <div className="game-overlay">
            <h2>Game Over!</h2>
            <div className="score">Score: {score}</div>
            <button className="button" onClick={startGame}>
              Play Again
            </button>
          </div>
        )} */}

        {!gameStarted && !gameOver && (
          <div className="game-overlay">
            <h2>Snake</h2>
            <button className="button" onClick={startGame}>
              Start Game
            </button>
          </div>
        )}

        {/* {gameOver && (
          <div className="game-overlay">
            <h2>Game Over!</h2>
            <div className="score">Score: {score}</div>
            <button className="button" onClick={startGame}>
              Play Again
            </button>
          </div>
        )} */}

        {gameOver && (
          <div className="game-overlay">
            <h2>Game Over!</h2>
            <div className="score">Score: {score}</div>
            <button
              className="button"
              onClick={() => {
                setGameOver(false); // Clear game over state
                startGame(); // Explicitly restart game
              }}
            >
              Play Again
            </button>
          </div>
        )}

      </div>

      <div className="game-controls">
        <h2>Controls</h2>
        <p>Use arrow keys or WASD to change direction</p>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = React.useState("home")

  function navigateTo(page) {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  return (
    <div className="app">
      <Navbar currentPage={currentPage} onNavigate={navigateTo} />

      {currentPage === "home" && <HomePage onNavigate={navigateTo} />}
      {currentPage === "chess" && <ChessGame />}
      {currentPage === "pacman" && <PacmanGame />}
      {currentPage === "snake" && <SnakeGame />}

      <Footer />
    </div>
  )
}

export default App


