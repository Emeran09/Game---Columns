
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
let dyGem = squareSide / 2;
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
let zpressed = false;
let xpressed = false;
const ARROW_RIGHT = "ArrowRight";
const ARROW_LEFT = "ArrowLeft";
const RIGHT = "Right";
const LEFT = "Left";
const Z = "z";
const X = "x";

// Variables GAME OVER
let gameOver = false;
const fontGameOver = "32px 'Press Start 2P'";

// Variables time
let lastTime = 0;
let nowTime = 0;
let dt = 0;

// Variables and constants for speed regulation in fallingGem
const FALLING_GEM_STEP = 0.5;
const FALLING_GEM_SPEED = 1;
let fallingGemAccumulator = 0;

// Variables and constants for control regulation in horizontalMovement
const HORIZONTAL_MOV_STEP = 0.1;
const HORIZONTAL_MOV_SPEED = 2;
let horizontalMovementAccumulator = 0;

// Variables and constant for gem control in swapGemColor
const SWAP_GEM_COLOR_STEP = 0.2;
const SWAP_GEM_COLOR_SPEED = 1.1;
let swapGemColorAccumulator = 0;

// ------------------ FUNCTIONS ----------------

// Function timestamp (obtaining the time time from the browser or in old computers from Unix)
function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
};

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
    ctx.font = fontGameOver;
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
    console.log("Gem color 1: ", gem[0][0].color);
    console.log("Gem color 2: ", gem[0][1].color);
    console.log("Gem color 3: ", gem[0][2].color);
}

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

// Function for painting and keeping the blocks of the matrix drawn with color
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
function horizontalMovement(dt) {

    horizontalMovementAccumulator += dt * HORIZONTAL_MOV_SPEED;

    if (horizontalMovementAccumulator >= HORIZONTAL_MOV_STEP) {

        horizontalMovementAccumulator = 0;

        for (let gemColumn = 0; gemColumn < MAX_GEM_COLUMNS; gemColumn++) {
            for (let gemRow = 0; gemRow < MAX_GEM_ROWS; gemRow++) {
                if (rightpressed) {
                    gem[gemColumn][gemRow].x += dxGem;
                    gem[gemColumn][gemRow].x = Math.min(gem[gemColumn][gemRow].x, canvas.width - dxGem);
                }
                if (leftpressed) {
                    gem[gemColumn][gemRow].x -= dxGem;
                    gem[gemColumn][gemRow].x = Math.max(gem[gemColumn][gemRow].x, 0);
                }
            }
        }
    }
}

// Function for changing the color of the gems in the block
function swapGemColor(dt) {

    swapGemColorAccumulator += dt * SWAP_GEM_COLOR_SPEED;

    if (swapGemColorAccumulator >= SWAP_GEM_COLOR_STEP) {

        swapGemColorAccumulator = 0;

        if (zpressed) {
            let storeTempColorZ = gem[0][0].color;
            gem[0][0].color = gem[0][1].color;
            console.log("Z color 1: ", gem[0][0].color);
            gem[0][1].color = gem[0][2].color;
            console.log("Z color 2: ", gem[0][1].color);
            gem[0][2].color = storeTempColorZ;
            console.log("Z color 3: ", gem[0][2].color);
        }
        if (xpressed) {
            let storeTempColorX = gem[0][0].color;
            gem[0][0].color = gem[0][2].color;
            console.log("X color 3: ", gem[0][0].color);
            gem[0][2].color = gem[0][1].color;
            console.log("X color 2: ", gem[0][2].color);
            gem[0][1].color = storeTempColorX;
            console.log("X color 1: ", gem[0][1].color);            
        }
    }
}

// Function for vertical movement of the gem
function fallingGem(dt) {

    fallingGemAccumulator += dt * FALLING_GEM_SPEED;

    if (fallingGemAccumulator >= FALLING_GEM_STEP) {

        fallingGemAccumulator = 0;
        const fallingGemLimitCanvas = gem[0][2].y + squareSide < canvas.height;

        if (fallingGemLimitCanvas) {
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

    nowTime = timestamp();
    dt = (nowTime - lastTime) / 1000;
    lastTime = nowTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMatrixVolumeEffect();

    paintMatrixBlock();

    drawGems();

    swapGemColor(dt);

    horizontalMovement(dt);

    fallingGem(dt);

    myReq = requestAnimationFrame(drawMotion);
}

// Key events
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(event) {
    if (event.key === RIGHT || event.key === ARROW_RIGHT) {
        rightpressed = true;
    } else if (event.key === LEFT || event.key === ARROW_LEFT) {
        leftpressed = true;
    } else if (event.key === Z) {
        zpressed = true;
    } else if (event.key === X) {
        xpressed = true;
    }
}

function keyUpHandler(event) {
    if (event.key === RIGHT || event.key === ARROW_RIGHT) {
        rightpressed = false;
    } else if (event.key === LEFT || event.key === ARROW_LEFT) {
        leftpressed = false;
    } else if (event.key === Z) {
        zpressed = false;
    } else if (event.key === X) {
        xpressed = false;
    }
}

// Function start game
function startGame() {
    setGemRandomColor();
    drawMotion();
}

// Button start game
const runButton = document.getElementById("runButton");
runButton.addEventListener("click", () => {
    startGame();
    runButton.disabled = true;
});