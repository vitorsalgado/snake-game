'use strict'

/**
 * Board Boxes
 * ---
 * 0 - Nothing
 * 1 - Snake
 * 2 - Food
 *
 */

// Game Loop
// ---
let gameLoop
const speed = 1000 / 10

// Keys
// ---
const Keys = {
  LEFT: 'ArrowLeft',
  UP: 'ArrowUp',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
  ENTER: 'Enter',
  ESCAPE: 'Escape'
}

const Actions = {
  WAIT: 0,
  PLAY: 1
}

// Components and Config
// ---
const size = 16
const box = 30
const gridSize = box * size
const pointsPerFruit = 1

// Style
const COLOR_CELL_EVEN = '#AAD851'
const COLOR_CELL_ODD = '#A2D249'
const COLOR_SNAKE = '#4775E9'
const COLOR_FRUIT = '#E7471D'

// Game State and Components
const canvas = document.getElementById('root')
const ctx = canvas.getContext('2d')

let snake = [{ x: Math.round(gridSize / 4), y: Math.round(gridSize / 2) }]
let fruit = { x: gridSize - Math.round(gridSize / 4), y: Math.round(gridSize / 2) }
let direction = 'right'
let score = 0
let action = Actions.WAIT

// Init
canvas.width = canvas.height = gridSize

function initialOnKeyDown(event) {
  if (event.defaultPrevented) {
    return
  }

  if (event.key === Keys.ENTER) {
    start()
  }
}

function onKeyDown(event) {
  if (event.defaultPrevented) {
    return
  }

  switch (event.key) {
    case Keys.LEFT:
      direction = direction !== 'right' ? 'left' : direction
      break
    case Keys.UP:
      direction = direction !== 'down' ? 'up' : direction
      break
    case Keys.RIGHT:
      direction = direction !== 'left' ? 'right' : direction
      break
    case Keys.DOWN:
      direction = direction !== 'up' ? 'down' : direction
      break
  }
}

// Drawing
// ---
function drawBackground() {
  const size = gridSize / box

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      ctx.beginPath()
      ctx.fillStyle = (row + col) % 2 === 0 ? COLOR_CELL_ODD : COLOR_CELL_EVEN
      ctx.fillRect(col * box, row * box, box, box)
      ctx.closePath()
    }
  }
}

function drawApple() {
  ctx.fillStyle = COLOR_FRUIT
  ctx.fillRect(fruit.x, fruit.y, box, box)
}

function drawSnake() {
  snake.forEach(pos => {
    ctx.fillStyle = COLOR_SNAKE
    ctx.fillRect(pos.x, pos.y, box, box)
  })
}

// Game Operations
// ---
function checkCollision(head) {
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      clearInterval(gameLoop)
      alert('Game Over. Snake chocked on itself :(')
    }
  }

  if ((head.x <= -box || head.x >= gridSize) || (head.y <= -box || head.y >= gridSize)) {
    clearInterval(gameLoop)
    alert('Game Over. Choked on board edge :(')
  }
}

function ateTheFruit() {
  const pos = snake[0]
  return pos.x === fruit.x && pos.y === fruit.y
}

// Setup DOM
// ---
function setInitialEventListeners() {
  document.addEventListener('keydown', initialOnKeyDown)
}

function resize() {
  document.getElementById('score-container').style.width = gridSize + 20 + 'px'
  canvas.height = gridSize
  canvas.width = gridSize
}

function showInfo() {
  document.getElementById('box-info').style.display = 'block'
}

function closeInfo() {
  document.getElementById('box-info').style.display = 'none'
}

setInitialEventListeners()
resize()
showInfo()

// The Game
// ---
function start() {
  document.removeEventListener('keydown', initialOnKeyDown)
  document.addEventListener('keydown', onKeyDown)
  closeInfo()
  action = Actions.PLAY
}

function game() {
  const head = snake[0]

  let newX = head.x
  let newY = head.y

  checkCollision({ x: newX, y: newY })

  drawBackground()
  drawApple()
  drawSnake()

  if (action === Actions.WAIT) return

  switch (direction) {
    case 'left':
      newX -= box
      break
    case 'right':
      newX += box
      break
    case 'up':
      newY -= box
      break
    case 'down':
      newY += box
      break
  }

  if (ateTheFruit()) {
    fruit.x = Math.floor(Math.random() * 15 + 1) * box
    fruit.y = Math.floor(Math.random() * 15 + 1) * box
    score += pointsPerFruit

    document.getElementById('score').textContent = score
  } else {
    snake.pop()
  }

  snake.unshift({ x: newX, y: newY })
}

// Game Loop
// ---
window.requestAnimationFrame(() => {
  gameLoop = setInterval(game, speed)
})
