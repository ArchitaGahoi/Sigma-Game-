"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { saveGameResult } from "@/lib/actions"

export default function ChessGame() {
  const [board, setBoard] = useState(initializeBoard())
  const [selectedPiece, setSelectedPiece] = useState<{ row: number; col: number } | null>(null)
  const [playerTurn, setPlayerTurn] = useState(true) // true for player (white), false for computer (black)
  const [gameStatus, setGameStatus] = useState<"playing" | "checkmate" | "stalemate">("playing")
  const [message, setMessage] = useState("Your turn (White)")

  useEffect(() => {
    if (!playerTurn && gameStatus === "playing") {
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
  }, [playerTurn, gameStatus])

  function initializeBoard() {
    const board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null))

    // Set up pawns
    for (let i = 0; i < 8; i++) {
      board[1][i] = { type: "pawn", color: "black" }
      board[6][i] = { type: "pawn", color: "white" }
    }

    // Set up other pieces
    const backRankPieces = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"]
    for (let i = 0; i < 8; i++) {
      board[0][i] = { type: backRankPieces[i], color: "black" }
      board[7][i] = { type: backRankPieces[i], color: "white" }
    }

    return board
  }

  function makeComputerMove() {
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
      saveGameResult({ game: "chess", result: "stalemate" })
    }
  }

  function isValidMove(fromRow: number, fromCol: number, toRow: number, toCol: number) {
    // This is a simplified version of chess move validation
    // In a real implementation, you would need to check specific rules for each piece type
    // and handle special cases like castling, en passant, etc.

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

  function handleSquareClick(row: number, col: number) {
    if (!playerTurn || gameStatus !== "playing") {
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
          saveGameResult({ game: "chess", result: "win" })
        }
      } else {
        // Invalid move
        setSelectedPiece(null)
      }
    }
  }

  function resetGame() {
    setBoard(initializeBoard())
    setSelectedPiece(null)
    setPlayerTurn(true)
    setGameStatus("playing")
    setMessage("Your turn (White)")
  }

  function getPieceSymbol(piece: { type: string; color: string } | null) {
    if (!piece) return null

    const symbols: Record<string, Record<string, string>> = {
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

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center text-3xl font-bold">Chess</h1>

      <div className="mb-4 text-center text-xl">{message}</div>

      <div className="mx-auto max-w-md">
        <div className="grid grid-cols-8 gap-0 border border-gray-800">
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const isBlackSquare = (rowIndex + colIndex) % 2 === 1
              const isSelected = selectedPiece && selectedPiece.row === rowIndex && selectedPiece.col === colIndex

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    flex aspect-square items-center justify-center text-3xl
                    ${isBlackSquare ? "bg-gray-600" : "bg-gray-300"} 
                    ${isSelected ? "ring-2 ring-blue-500 ring-inset" : ""}
                    ${piece && piece.color === "white" && playerTurn ? "cursor-pointer hover:bg-opacity-80" : ""}
                  `}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                >
                  {piece && (
                    <span className={piece.color === "white" ? "text-white" : "text-black"}>
                      {getPieceSymbol(piece)}
                    </span>
                  )}
                </div>
              )
            }),
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button onClick={resetGame}>Reset Game</Button>
      </div>
    </div>
  )
}
