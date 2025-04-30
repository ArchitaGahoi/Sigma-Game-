"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { saveGameResult } from "@/lib/actions"

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  const gameStateRef = useRef({
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
  })

  useEffect(() => {
    if (!gameStarted) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const gameState = gameStateRef.current

    // Initialize game board
    initializeGame(canvas)

    // Game loop
    function gameLoop(timestamp: number) {
      if (!gameStarted) return

      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      if (timestamp - gameState.lastUpdate > gameState.speed) {
        gameState.lastUpdate = timestamp

        // Update game state
        updateGame()

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw everything
        drawGame(ctx)
      }

      if (!gameOver) {
        gameState.animationFrame = requestAnimationFrame(gameLoop)
      }
    }

    gameState.animationFrame = requestAnimationFrame(gameLoop)

    // Keyboard controls
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "ArrowUp":
        case "w":
          if (gameState.direction !== "down") {
            gameState.nextDirection = "up"
          }
          break
        case "ArrowDown":
        case "s":
          if (gameState.direction !== "up") {
            gameState.nextDirection = "down"
          }
          break
        case "ArrowLeft":
        case "a":
          if (gameState.direction !== "right") {
            gameState.nextDirection = "left"
          }
          break
        case "ArrowRight":
        case "d":
          if (gameState.direction !== "left") {
            gameState.nextDirection = "right"
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      cancelAnimationFrame(gameState.animationFrame)
    }
  }, [gameStarted, gameOver])

  function initializeGame(canvas: HTMLCanvasElement) {
    const gameState = gameStateRef.current

    // Set canvas size
    canvas.width = Math.min(400, window.innerWidth - 40)
    canvas.height = Math.min(400, window.innerWidth - 40)

    // Calculate grid dimensions
    gameState.gridWidth = Math.floor(canvas.width / gameState.gridSize)
    gameState.gridHeight = Math.floor(canvas.height / gameState.gridSize)

    // Initialize snake
    gameState.snake = [{ x: Math.floor(gameState.gridWidth / 2), y: Math.floor(gameState.gridHeight / 2) }]

    // Initialize direction
    gameState.direction = "right"
    gameState.nextDirection = "right"

    // Place food
    placeFood()

    // Reset score
    setScore(0)
    setGameOver(false)
  }

  function placeFood() {
    const gameState = gameStateRef.current

    // Generate random position for food
    let foodX =0 , foodY = 0
    let validPosition = false

    while (!validPosition) {
      foodX = Math.floor(Math.random() * gameState.gridWidth)
      foodY = Math.floor(Math.random() * gameState.gridHeight)

      // Check if food is not on snake
      validPosition = true
      for (const segment of gameState.snake) {
        if (segment.x === foodX && segment.y === foodY) {
          validPosition = false
          break
        }
      }
    }

    gameState.food = { x: foodX, y: foodY }
  }

  function updateGame() {
    const gameState = gameStateRef.current

    // Update direction
    gameState.direction = gameState.nextDirection

    // Calculate new head position
    const head = { ...gameState.snake[0] }

    switch (gameState.direction) {
      case "up":
        head.y -= 1
        break
      case "down":
        head.y += 1
        break
      case "left":
        head.x -= 1
        break
      case "right":
        head.x += 1
        break
    }

    // Check for collisions with walls
    if (head.x < 0 || head.x >= gameState.gridWidth || head.y < 0 || head.y >= gameState.gridHeight) {
      setGameOver(true)
      saveGameResult({ game: "snake", result: "lose" })
      return
    }

    // Check for collisions with self
    for (const segment of gameState.snake) {
      if (head.x === segment.x && head.y === segment.y) {
        setGameOver(true)
        saveGameResult({ game: "snake", result: "lose" })
        return
      }
    }

    // Add new head
    gameState.snake.unshift(head)

    // Check if snake ate food
    if (head.x === gameState.food.x && head.y === gameState.food.y) {
      // Increase score
      setScore((prevScore) => prevScore + 10)

      // Place new food
      placeFood()

      // Increase speed slightly
      if (gameState.speed > 50) {
        gameState.speed -= 2
      }
    } else {
      // Remove tail if no food was eaten
      gameState.snake.pop()
    }
  }

  function drawGame(ctx: CanvasRenderingContext2D) {
    const gameState = gameStateRef.current
    const cellSize = gameState.gridSize

    // Draw snake
    gameState.snake.forEach((segment, index) => {
      // Head is a different color
      if (index === 0) {
        ctx.fillStyle = "#4CAF50"
      } else {
        ctx.fillStyle = "#8BC34A"
      }

      ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize)

      // Add a border to make segments more visible
      ctx.strokeStyle = "#388E3C"
      ctx.strokeRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize)

      // Draw eyes on head
      if (index === 0) {
        ctx.fillStyle = "white"

        let eyeX1 = 0, eyeY1 = 0, eyeX2 = 0, eyeY2 = 0

        switch (gameState.direction) {
          case "right":
            eyeX1 = segment.x * cellSize + cellSize * 0.7
            eyeY1 = segment.y * cellSize + cellSize * 0.3
            eyeX2 = segment.x * cellSize + cellSize * 0.7
            eyeY2 = segment.y * cellSize + cellSize * 0.7
            break
          case "left":
            eyeX1 = segment.x * cellSize + cellSize * 0.3
            eyeY1 = segment.y * cellSize + cellSize * 0.3
            eyeX2 = segment.x * cellSize + cellSize * 0.3
            eyeY2 = segment.y * cellSize + cellSize * 0.7
            break
          case "up":
            eyeX1 = segment.x * cellSize + cellSize * 0.3
            eyeY1 = segment.y * cellSize + cellSize * 0.3
            eyeX2 = segment.x * cellSize + cellSize * 0.7
            eyeY2 = segment.y * cellSize + cellSize * 0.3
            break
          case "down":
            eyeX1 = segment.x * cellSize + cellSize * 0.3
            eyeY1 = segment.y * cellSize + cellSize * 0.7
            eyeX2 = segment.x * cellSize + cellSize * 0.7
            eyeY2 = segment.y * cellSize + cellSize * 0.7
            break
        }

        ctx.beginPath()
        ctx.arc(eyeX1, eyeY1, cellSize * 0.15, 0, Math.PI * 2)
        ctx.arc(eyeX2, eyeY2, cellSize * 0.15, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "black"
        ctx.beginPath()
        ctx.arc(eyeX1, eyeY1, cellSize * 0.07, 0, Math.PI * 2)
        ctx.arc(eyeX2, eyeY2, cellSize * 0.07, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    // Draw food
    ctx.fillStyle = "#F44336"
    ctx.beginPath()
    ctx.arc(
      gameState.food.x * cellSize + cellSize / 2,
      gameState.food.y * cellSize + cellSize / 2,
      cellSize / 2,
      0,
      Math.PI * 2,
    )
    ctx.fill()

    // Add a stem to the food (apple)
    ctx.fillStyle = "#795548"
    ctx.fillRect(
      gameState.food.x * cellSize + cellSize * 0.45,
      gameState.food.y * cellSize,
      cellSize * 0.1,
      cellSize * 0.3,
    )

    // Add a leaf
    ctx.fillStyle = "#4CAF50"
    ctx.beginPath()
    ctx.ellipse(
      gameState.food.x * cellSize + cellSize * 0.6,
      gameState.food.y * cellSize + cellSize * 0.2,
      cellSize * 0.15,
      cellSize * 0.08,
      Math.PI / 4,
      0,
      Math.PI * 2,
    )
    ctx.fill()
  }

  function startGame() {
    setGameStarted(true)
    setGameOver(false)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center text-3xl font-bold">Snake</h1>

      <div className="mb-4 text-center">
        <div className="text-xl font-bold">Score: {score}</div>
        {gameOver && <div className="mt-2 text-xl font-bold">Game Over!</div>}
      </div>

      <div className="flex justify-center">
        <div className="relative">
          <canvas ref={canvasRef} className="border border-gray-400" width="400" height="400" />

          {!gameStarted && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
              <h2 className="mb-4 text-2xl font-bold text-white">Snake</h2>
              <Button onClick={startGame}>Start Game</Button>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
              <h2 className="mb-4 text-2xl font-bold text-white">Game Over!</h2>
              <div className="mb-4 text-xl text-white">Score: {score}</div>
              <Button onClick={startGame}>Play Again</Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <h2 className="mb-2 text-xl font-bold">Controls</h2>
        <p>Use arrow keys or WASD to change direction</p>
      </div>
    </div>
  )
}
