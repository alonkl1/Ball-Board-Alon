'use strict'

const WALL = 'WALL'
const FLOOR = 'FLOOR'
const BALL = 'BALL'
const GAMER = 'GAMER'
const GLUE = 'GLUE'

const GAMER_IMG = '<img src="img/gamer.png">'
const BALL_IMG = '<img src="img/ball.png">'
const GLUE_IMG = '<img src="img/glue.png">'

// Model:
var gBoard
var gGamerPos

var gIntervalId
var gGlueId

var gCounter = 0
var gBalls

var gIsStcuk=false

function initGame() {
	const elMoadl = document.querySelector('.modal')
	elMoadl.style.display = 'none'
	gGamerPos = { i: 2, j: 9 }
	        
	gBoard = buildBoard()
	renderBoard(gBoard)
	gIntervalId = setInterval(newRandBall, 2000)
	gGlueId = setInterval (newRandGlue,3000)
}

function buildBoard() {
	// TODO: Create the Matrix 10 * 12 
	const board = createMat(10, 12)

	// TODO: Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			board[i][j] = { type: FLOOR, gameElement: null }

			if (i === 0 || i === board.length - 1 ||
				j === 0 || j === board[i].length - 1) {

				board[i][j].type = WALL
			}
		}
	}
	// TODO: Place the gamer and two balls

	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER
	board[2][5].gameElement = BALL
	board[5][7].gameElement = BALL
	gBalls = 2

	const midRow = Math.floor(board.length / 2)
	const midCol = Math.floor(board[0].length / 2)

	board[0][midCol].type = FLOOR
	board[board.length - 1][midCol].type = FLOOR

	board[midRow][0].type = FLOOR
	board[midRow][board[0].length - 1].type = FLOOR

	return board
}

function newRandGlue(){
	var emptyPlaces = []
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[i].length; j++) {
			if (gBoard[i][j].type !== WALL && gBoard[i][j].gameElement === null)
				emptyPlaces.push({ i: i, j: j })
		}
	}

	if (emptyPlaces.length === 0) return;

	var randIdx = getRandomInt(0, emptyPlaces.length)
	var randPos = emptyPlaces[randIdx]

	gBoard[randPos.i][randPos.j].gameElement = GLUE
	renderCell(randPos, GLUE_IMG)

	setTimeout(()=> {
		removeGlue(randPos.i,randPos.j)
	}, 3000)

	console.log('I PUT GLUE ON ' + randPos.i +' and ' +randPos.j)

}

function removeGlue(cellI,cellJ){
	const cell=gBoard[cellI][cellJ]
	if (cell.gameElement!= GLUE) return
	cell.gameElement=FLOOR
	renderCell({i: cellI , j: cellJ},'')
}

function newRandBall() {
	var emptyPlaces = []
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[i].length; j++) {
			if (gBoard[i][j].type !== WALL && gBoard[i][j].gameElement === null)
				emptyPlaces.push({ i: i, j: j })
		}
	}

	if (emptyPlaces.length === 0) return;

	var randIdx = getRandomInt(0, emptyPlaces.length)
	var randPos = emptyPlaces[randIdx]

	gBoard[randPos.i][randPos.j].gameElement = BALL
	renderCell(randPos, BALL_IMG)

	gBalls++
	countNeighborBalls()

}
// Render the board to an HTML table
function renderBoard(board) {

	const elBoard = document.querySelector('.board')
	var strHTML = ''
	const elCounter = document.querySelector('.counter span')
	elCounter.innerText = gCounter

	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n'

		for (var j = 0; j < board[0].length; j++) {
			const currCell = board[i][j]

			var classList = getClassName({ i: i, j: j })

			if (currCell.type === FLOOR) classList += ' floor'
			else if (currCell.type === WALL) classList += ' wall'

			strHTML += `\t<td class="cell ${classList}" onclick="moveTo(${i},${j})">`

			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG
			}

			strHTML += '</td>\n'
		}
		strHTML += '</tr>\n'
	}
	// console.log('strHTML is:')
	// console.log(strHTML)
	elBoard.innerHTML = strHTML

}

// Move the player to a specific location
function moveTo(i, j) {
	console.log ("GISSTUCJK IN moveto(): " +gIsStcuk)
	if (gIsStcuk) return
	var isTeleport = false
	if (i === -1) {
		i = gBoard.length - 1
		isTeleport = true
		console.log("UYRESDF")
	}
	else if (i === gBoard.length ) {
		i = 0
		isTeleport = true
		console.log("UYRESDF")
	}

	else if (j === gBoard[0].length ) {
		j = 0
		isTeleport = true
		console.log("UYRESDF")
	}

	else if (j === -1) {
		j = gBoard[0].length - 1
		isTeleport = true
		console.log("UYRESDF")
	}

	const fromCell = gBoard[gGamerPos.i][gGamerPos.j]
	const toCell = gBoard[i][j]

	if (toCell.type === WALL) return

	// Calculate distance to make sure we are moving to a neighbor cell
	const iAbsDiff = Math.abs(i - gGamerPos.i)
	const jAbsDiff = Math.abs(j - gGamerPos.j)

	// If the clicked Cell is one of the four allowed
	// if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {
	if (iAbsDiff + jAbsDiff !== 1 && !isTeleport) return

	countNeighborBalls(i, j)



	if (toCell.gameElement === BALL) {
		console.log('Collecting!')
		gCounter++
		gBalls--

		const elCounter = document.querySelector(".counter span")
		elCounter.innerText = gCounter
		if (gBalls === 0) handleVictory()

	}

	if (toCell.gameElement === GLUE){
		gIsStcuk=true
		console.log('IS STUCK NOW')
		console.log('gIsStuc: ' +gIsStcuk)
		setTimeout(()=>{
			gIsStcuk=false}, 3000)
	}

	// TODO: Move the gamer
	// Update model origin
	fromCell.gameElement = null

	// Update DOM origin
	renderCell(gGamerPos, '')

	// Update model destination
	toCell.gameElement = GAMER

	// Update DOM destination
	gGamerPos = { i, j }
	renderCell(gGamerPos, GAMER_IMG)
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	const cellSelector = '.' + getClassName(location)
	const elCell = document.querySelector(cellSelector)
	elCell.innerHTML = value
}

// Move the player by keyboard arrows
function handleKey(ev) {

	const i = gGamerPos.i
	const j = gGamerPos.j

	switch (ev.key) {
		case 'ArrowLeft':
			moveTo(i, j - 1)
			break
		case 'ArrowRight':
			moveTo(i, j + 1)
			break
		case 'ArrowUp':
			moveTo(i - 1, j)
			break
		case 'ArrowDown':
			moveTo(i + 1, j)
			break
	}
}

function countNeighborBalls() {
	var counter = 0

	for (var i = gGamerPos.i - 1; i <= gGamerPos.i + 1; i++) {
		for (var j = gGamerPos.j - 1; j <= gGamerPos.j + 1; j++) {
			if (gGamerPos.i === i && gGamerPos.j === j) continue
			if (i < 0 || i >= gBoard.length) continue
			if (j < 0 || j >= gBoard[0].length) continue
			if (gBoard[i][j].gameElement === BALL)
				counter++
		}
	}
	const elNeighbor = document.querySelector('.nearby span')
	elNeighbor.innerText = counter
	return counter
}

function handleVictory() {

	clearInterval(gIntervalId)
	const elModal = document.querySelector(".modal")
	elModal.style.display = 'block'




	gCounter = 0
}
// Returns the class name for a specific cell
function getClassName(position) {
	const cellClass = `cell-${position.i}-${position.j}`
	return cellClass
}

