
//--------------------  VARIABLES ------------------

// Variables Canvas
const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d");

// Variables matrix squares 3D effect
const squareSide = 50;
const squareEffect = 42;

// Variables matrix
const MAX_MATRIX_COLUMNS = 6;
const MAX_MATRIX_ROWS = 14;
const MATRIX_START_X = 0;
const MATRIX_START_Y = 0;
let matrix = [];
for (let matrixColumn = 0; matrixColumn < MAX_MATRIX_COLUMNS; matrixColumn++) {
    matrix[matrixColumn] = [];
    for (let matrixRow = 0; matrixRow < MAX_MATRIX_ROWS; matrixRow++) {
        matrix[matrixColumn][matrixRow] = { x: matrixColumn * squareSide, y: matrixRow * squareSide, blockPainted: false, color: "black" };
    }
}

// Variable requestAnimationFrame
let myReq = 0;

// Variables Gems
let dxGem = squareSide;
let dyGem = squareSide / 10;
const MAX_GEM_COLUMNS = 1;
const MAX_GEM_ROWS = 3;
const GEM_START_X = 100;
const gemColors = ["green", "blue", "yellow", "red", "orange", "purple"];
let gem = [];
for (let gemColumn = 0; gemColumn < MAX_GEM_COLUMNS; gemColumn++) {
    gem[gemColumn] = [];
    for (let gemRow = 0; gemRow < MAX_GEM_ROWS; gemRow++) {
        gem[gemColumn][gemRow] = { x: GEM_START_X, y: gemRow * squareSide, color: "white" };
    }
}

// Variables right/left buttons
let rightpressed = false;
let leftpressed = false;

// Variables GAME OVER
let gameOver = false;
const retroFont = "32px 'Press Start 2P'";

// ------------------ FUNCTIONS ----------------

// Function reset game
function resetGame() {
    gameOver = false;
    rightpressed = false;
    leftpressed = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initialPosition();
    generateGemRandomColor();
    drawMatrixVolumeEffect();
}

// Function draw Game Over
function drawGameOver() {
    ctx.imageSmoothingEnabled = false;
    ctx.font = retroFont;
    ctx.fillStyle = "#c41010";
    ctx.fillText("GAME OVER", 8, canvas.height / 2);
}

// Function for initial position of the gem
function initialPosition() {
    for (let gemColumn = 0; gemColumn < MAX_GEM_COLUMNS; gemColumn++) {
        for (let gemRow = 0; gemRow < MAX_GEM_ROWS; gemRow++) {
            gem[gemColumn][gemRow].x = GEM_START_X;
            gem[gemColumn][gemRow].y = gemRow * squareSide;
        }
    }
}

// Function for drawing the matrix squares 3D effect
function drawMatrixVolumeEffect() {
    for (let ySquare = 2; ySquare < canvas.height; ySquare += squareSide) {
        for (let xSquare = 2; xSquare < canvas.width; xSquare += squareSide) {
            ctx.beginPath();
            ctx.strokeStyle = "grey";
            ctx.lineWidth = 3;
            ctx.lineCap = "square";
            ctx.moveTo(xSquare, ySquare);
            ctx.lineTo(xSquare + squareEffect, ySquare);
            ctx.moveTo(xSquare, ySquare);
            ctx.lineTo(xSquare, ySquare + squareEffect);
            ctx.stroke();
            ctx.closePath();
        }
    }
}

drawMatrixVolumeEffect(); // To initialize the screen with the 3D effect

// Function for generating a random color for a gem
function generateGemRandomColor(gemsColorsList) {
    return gemsColorsList[Math.floor(Math.random() * gemsColorsList.length)];
}

// Function for setting a random color to a gem
function setGemRandomColor() {
    for (let gemColumn = 0; gemColumn < MAX_GEM_COLUMNS; gemColumn++) {
        for (let gemRow = 0; gemRow < MAX_GEM_ROWS; gemRow++) {
            gem[gemColumn][gemRow].color = generateGemRandomColor(gemColors);
        }
    }
}

setGemRandomColor(); // to have an initial color for each gem

// Function for drawing the gem
function drawGems() {
    for (let gemColumn = 0; gemColumn < MAX_GEM_COLUMNS; gemColumn++) {
        for (let gemRow = 0; gemRow < MAX_GEM_ROWS; gemRow++) {
            ctx.beginPath();
            ctx.fillStyle = gem[gemColumn][gemRow].color;
            ctx.fillRect(gem[gemColumn][gemRow].x, gem[gemColumn][gemRow].y, squareSide, squareSide);
            ctx.fill();
            ctx.closePath();
        }
    }
}

// Function for setting the matrix blocks with color
function setMatrixBlockColor() {
    for (let gemColumn = 0; gemColumn < MAX_GEM_COLUMNS; gemColumn++) {
        for (let gemRow = 0; gemRow < MAX_GEM_ROWS; gemRow++) {
            let roundXPosition = Math.floor(gem[gemColumn][gemRow].x / squareSide);
            let roundYPosition = Math.floor(gem[gemColumn][gemRow].y / squareSide);
            matrix[roundXPosition][roundYPosition].color = gem[gemColumn][gemRow].color;
            matrix[roundXPosition][roundYPosition].blockPainted = true;
        }
    }
}

// Function for painting and keeping the blocks of the amtrix drawn with color
function paintMatrixBlock() {
    for (let matrixColumn = 0; matrixColumn < MAX_MATRIX_COLUMNS; matrixColumn++) {
        for (let matrixRow = 0; matrixRow < MAX_MATRIX_ROWS; matrixRow++) {
            if (matrix[matrixColumn][matrixRow].blockPainted) {
                ctx.beginPath();
                ctx.fillStyle = matrix[matrixColumn][matrixRow].color;
                ctx.fillRect(matrix[matrixColumn][matrixRow].x, matrix[matrixColumn][matrixRow].y, squareSide, squareSide);
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Function for horizontal movement of the gems
function horizontalMovement() {
    for (let gemColumn = 0; gemColumn < MAX_GEM_COLUMNS; gemColumn++) {
        for (let gemRow = 0; gemRow < MAX_GEM_ROWS; gemRow++) {
            if (rightpressed) {
                gem[gemColumn][gemRow].x += dxGem;
                gem[gemColumn][gemRow].x = Math.min(gem[gemColumn][gemRow].x, canvas.width - dxGem);
            } else if (leftpressed) {
                gem[gemColumn][gemRow].x -= dxGem;
                gem[gemColumn][gemRow].x = Math.max(gem[gemColumn][gemRow].x, 0);
            }
        }
    }
}

// Function for vertical movement of the gem
function fallingGem() {
    if (gem[0][2].y + squareSide - dyGem < canvas.height) {
        for (let gemColumn = 0; gemColumn < MAX_GEM_COLUMNS; gemColumn++) {
            for (let gemRow = 0; gemRow < MAX_GEM_ROWS; gemRow++) {
                gem[gemColumn][gemRow].y += dyGem;
            }
        }
    } else {
        setMatrixBlockColor();
        initialPosition();
        setGemRandomColor();
    }
}

// Function drawing the motion of the game
function drawMotion() {

    if (gameOver) {
        cancelAnimationFrame(myReq);
        resetGame();
        document.fonts.load(retroFont).then(() => { // ensure fonts are loaded
            drawGameOver();
        });
        runButton.disabled = false;
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMatrixVolumeEffect();

    paintMatrixBlock();

    drawGems();

    horizontalMovement();

    fallingGem();

    myReq = requestAnimationFrame(drawMotion);
}

// Key Down/Up events
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(event) {
    if (event.key === "Right" || event.key === "ArrowRight") {
        rightpressed = true;
    } else if (event.key === "Left" || event.key === "ArrowLeft") {
        leftpressed = true;
    }
}

function keyUpHandler(event) {
    if (event.key === "Right" || event.key === "ArrowRight") {
        rightpressed = false;
    } else if (event.key === "Left" || event.key === "ArrowLeft") {
        leftpressed = false;
    }
}

// Function start game
function startGame() {
    drawMotion();
}

// Button start game
const runButton = document.getElementById("runButton");
runButton.addEventListener("click", () => {
    startGame();
    runButton.disabled = true;
});