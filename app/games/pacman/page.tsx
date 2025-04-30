"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { saveGameResult } from "@/lib/actions"

export default function PacmanGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameWon, setGameWon] = useState(false)

  const gameStateRef = useRef({
    pacman: { x: 0, y: 0, direction: "right", mouthOpen: true },
    ghosts: [
      { x: 0, y: 0, direction: "right", color: "red" },
      { x: 0, y: 0, direction: "left", color: "pink" },
      { x: 0, y: 0, direction: "up", color: "cyan" },
      { x: 0, y: 0, direction: "down", color: "orange" },
    ],
    dots: [] as { x: number; y: number }[],
    walls: [] as { x: number; y: number; width: number; height: number }[],
    cellSize: 20,
    gridWidth: 0,
    gridHeight: 0,
    animationFrame: 0,
    lastMouthChange: 0,
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
    let lastTime = 0
    const fps = 60
    const interval = 1000 / fps

    function gameLoop(timestamp: number) {
      if (!gameStarted) return

      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

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
          saveGameResult({ game: "pacman", result: "win" })
        }
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
          if (canMove(gameState.pacman.x, gameState.pacman.y - gameState.cellSize)) {
            gameState.pacman.direction = "up"
          }
          break
        case "ArrowDown":
        case "s":
          if (canMove(gameState.pacman.x, gameState.pacman.y + gameState.cellSize)) {
            gameState.pacman.direction = "down"
          }
          break
        case "ArrowLeft":
        case "a":
          if (canMove(gameState.pacman.x - gameState.cellSize, gameState.pacman.y)) {
            gameState.pacman.direction = "left"
          }
          break
        case "ArrowRight":
        case "d":
          if (canMove(gameState.pacman.x + gameState.cellSize, gameState.pacman.y)) {
            gameState.pacman.direction = "right"
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      cancelAnimationFrame(gameState.animationFrame)
    }
  }, [gameStarted, gameOver, gameWon])

  function initializeGame(canvas: HTMLCanvasElement) {
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

  function updateGame(deltaTime: number) {
    const gameState = gameStateRef.current

    // Update mouth animation
    if (Date.now() - gameState.lastMouthChange > 200) {
      gameState.pacman.mouthOpen = !gameState.pacman.mouthOpen
      gameState.lastMouthChange = Date.now()
    }

    // Move pacman
    let newX = gameState.pacman.x
    let newY = gameState.pacman.y

    switch (gameState.pacman.direction) {
      case "up":
        newY -= 2
        break
      case "down":
        newY += 2
        break
      case "left":
        newX -= 2
        break
      case "right":
        newX += 2
        break
    }

    if (canMove(newX, newY)) {
      gameState.pacman.x = newX
      gameState.pacman.y = newY
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
        saveGameResult({ game: "pacman", result: "lose" })
      }
    })
  }

  function canMove(x: number, y: number) {
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

  function drawGame(ctx: CanvasRenderingContext2D) {
    const gameState = gameStateRef.current

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

      ctx.arc(pacmanX, pacmanY, radius, startAngle, endAngle)
    } else {
      ctx.arc(pacmanX, pacmanY, radius, 0, Math.PI * 2)
    }

    ctx.lineTo(pacmanX, pacmanY)
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
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center text-3xl font-bold">Pacman</h1>

      <div className="mb-4 text-center">
        <div className="text-xl font-bold">Score: {score}</div>
        {gameOver && <div className="mt-2 text-xl font-bold">{gameWon ? "You Win!" : "Game Over!"}</div>}
      </div>

      <div className="flex justify-center">
        <div className="relative">
          <canvas ref={canvasRef} className="border border-gray-400" width="480" height="480" />

          {!gameStarted && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
              <h2 className="mb-4 text-2xl font-bold text-white">Pacman</h2>
              <Button onClick={startGame}>Start Game</Button>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
              <h2 className="mb-4 text-2xl font-bold text-white">{gameWon ? "You Win!" : "Game Over!"}</h2>
              <div className="mb-4 text-xl text-white">Score: {score}</div>
              <Button onClick={startGame}>Play Again</Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <h2 className="mb-2 text-xl font-bold">Controls</h2>
        <p>Use arrow keys or WASD to move Pacman</p>
      </div>
    </div>
  )
}
