
//--------------------  VARIABLES ------------------

// Variables Canvas
const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d");
const canvasHeight = canvas.height;
const canvasWidth = canvas.width;

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
        matrix[matrixColumn][matrixRow] = { x: matrixColumn * squareSide, y: matrixRow * squareSide, color: "black", blockPainted: false };
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
const GEM_START_Y = 0;
const gemColors = ["green", "blue", "yellow", "red", "orange", "purple"];
let gem = [];
for (let gemColumn = 0; gemColumn < MAX_GEM_COLUMNS; gemColumn++) {
    gem[gemColumn] = [];
    for (let gemRow = 0; gemRow < MAX_GEM_ROWS; gemRow++) {
        gem[gemColumn][gemRow] = { x: GEM_START_X, y: gemRow * squareSide, color: "white", gemSpawn: false };
    }
}

// Variables buttons
let rightpressed = false;
let leftpressed = false;
let zpressed = false;
let xpressed = false;
let spacepressed = false;
const ARROW_RIGHT = "ArrowRight";
const ARROW_LEFT = "ArrowLeft";
const RIGHT = "Right";
const LEFT = "Left";
const Z = "z";
const X = "x";
const SPACE = " ";

// Variables GAME OVER
const X_GAME_OVER = GEM_START_X / squareSide;
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
const SWAP_GEM_COLOR_SPEED = 1.23;
let swapGemColorAccumulator = 0;

// Variables for game score
const V_H_THREE_GEMS = 30;
const V_H_FOUR_GEMS = 45;
const V_H_FIVE_GEMS = 60;
const D_THREE_GEMS = 40;
const D_FOUR_GEMS = 70;
const D_FIVE_GEMS = 100;

// Variables for game info
let score = 0;
let totalGemsCleared = 0;

// Variables for game difficulty
let increaseSpeed = 0;
let actualScore = 0;
let previousScore = 0;
let deltaScore = 0;
let scoreAccumulator = 0;
let difficultyCounter = 0;
const LIMIT_DIFFICULTY_UP_1 = 20;
const LIMIT_DIFFICULTY_UP_2 = 50;
const DIFFICULTY_UP_TRIGGER = 100;
const DELTA_SPEED_UP = 0.005;
const DELTA_SPEED_UP_HARD = 0.1;

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
    spacepressed = false;
    score = 0;
    totalGemsCleared = 0;
    increaseSpeed = 0;
    actualScore = 0;
    previousScore = 0;
    deltaScore = 0;
    scoreAccumulator = 0;
    difficultyCounter = 0;

    for (let matrixColumn = 0; matrixColumn < MAX_MATRIX_COLUMNS; matrixColumn++) {
        for (let matrixRow = 0; matrixRow < MAX_MATRIX_ROWS; matrixRow++) {
            matrix[matrixColumn][matrixRow].blockPainted = false;
            matrix[matrixColumn][matrixRow].color = "black";
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    initialPosition();
    generateGemRandomColor(gemColors);
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

            if (matrix[X_GAME_OVER][gemRow].blockPainted) {
                gameOver = true;
                break;
            }

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

// Function for clearing gems in a vertical direction
function verticalGemClear() {

    let cleared = false;

    for (let matrixColumn = 0; matrixColumn < MAX_MATRIX_COLUMNS; matrixColumn++) {
        for (let matrixRow = 0; matrixRow < MAX_MATRIX_ROWS; matrixRow++) {

            // check if the cell is empty and proceeds
            if (!matrix[matrixColumn][matrixRow].blockPainted) {
                continue;
            }

            let baseColor = matrix[matrixColumn][matrixRow].color;
            let count = 1;

            // counts how many gems in a row have the same color
            for (let nextRow = matrixRow + 1; nextRow < MAX_MATRIX_ROWS; nextRow++) {
                if (matrix[matrixColumn][nextRow].blockPainted && matrix[matrixColumn][nextRow].color === baseColor) {
                    count++;
                } else {
                    break;
                }
            }
            // Clears the cells with the same color
            if (count >= 3) {
                for (let i = 0; i < count; i++) {
                    matrix[matrixColumn][matrixRow + i].blockPainted = false;
                }
                cleared = true;
            }

            if (count === 3) {
                score += V_H_THREE_GEMS;
                totalGemsCleared += count;
            } else if (count === 4) {
                score += V_H_FOUR_GEMS;
                totalGemsCleared += count;
            } else if (count === 5) {
                score += V_H_FIVE_GEMS;
                totalGemsCleared += count;
            }
        }
    }
    return cleared;
}

// Function for clearing gems in an horizontal direction
function horizontalGemClear() {

    let cleared = false;

    for (let matrixColumn = 0; matrixColumn < MAX_MATRIX_COLUMNS; matrixColumn++) {
        for (let matrixRow = 0; matrixRow < MAX_MATRIX_ROWS; matrixRow++) {

            // check if the cell is empty and proceeds
            if (!matrix[matrixColumn][matrixRow].blockPainted) {
                continue;
            }

            let baseColor = matrix[matrixColumn][matrixRow].color;
            let count = 1;

            // counts how many gems in a row have the same color
            for (let nextColumn = matrixColumn + 1; nextColumn < MAX_MATRIX_COLUMNS; nextColumn++) {
                if (matrix[nextColumn][matrixRow].blockPainted && matrix[nextColumn][matrixRow].color === baseColor) {
                    count++;
                } else {
                    break;
                }
            }

            // Clears the cells with the same color
            if (count >= 3) {
                for (let i = 0; i < count; i++) {
                    matrix[matrixColumn + i][matrixRow].blockPainted = false;
                }
                cleared = true;
            }

            if (count === 3) {
                score += V_H_THREE_GEMS;
                totalGemsCleared += count;
            } else if (count === 4) {
                score += V_H_FOUR_GEMS;
                totalGemsCleared += count;
            } else if (count === 5) {
                score += V_H_FIVE_GEMS;
                totalGemsCleared += count;
            }
        }
    }
    return cleared;
}

// Function to check the diagonal down-right
function diagonalDownRightGemClear() {

    let cleared = false;

    for (let matrixColumn = 0; matrixColumn < MAX_MATRIX_COLUMNS; matrixColumn++) {
        for (let matrixRow = 0; matrixRow < MAX_MATRIX_ROWS; matrixRow++) {

            // check if the cell is empty and proceeds
            if (!matrix[matrixColumn][matrixRow].blockPainted) {
                continue;
            }

            let baseColor = matrix[matrixColumn][matrixRow].color;
            let count = 1;
            let nextColumn = matrixColumn + 1;
            let nextRow = matrixRow + 1;

            // counts how many gems in a row have the same color
            while (nextColumn < MAX_MATRIX_COLUMNS && nextRow < MAX_MATRIX_ROWS && matrix[nextColumn][nextRow].blockPainted && matrix[nextColumn][nextRow].color === baseColor) {
                count++;
                nextColumn++;
                nextRow++;
            }

            // Clears the cells with the same color
            if (count >= 3) {
                for (let i = 0; i < count; i++) {
                    matrix[matrixColumn + i][matrixRow + i].blockPainted = false;
                }
                cleared = true;
            }

            if (count === 3) {
                score += D_THREE_GEMS;
                totalGemsCleared += count;
            } else if (count === 4) {
                score += D_FOUR_GEMS;
                totalGemsCleared += count;
            } else if (count === 5) {
                score += D_FIVE_GEMS;
                totalGemsCleared += count;
            }
        }
    }
    return cleared;
}

// Function to check the diagonal up-right
function diagonalUpRightGemClear() {

    let cleared = false;

    for (let matrixColumn = 0; matrixColumn < MAX_MATRIX_COLUMNS; matrixColumn++) {
        for (let matrixRow = 0; matrixRow < MAX_MATRIX_ROWS; matrixRow++) {

            // check if the cell is empty and proceeds
            if (!matrix[matrixColumn][matrixRow].blockPainted) {
                continue;
            }

            let baseColor = matrix[matrixColumn][matrixRow].color;
            let count = 1;
            let nextColumn = matrixColumn + 1;
            let previousRow = matrixRow - 1;

            // counts how many gems in a row have the same color
            while (nextColumn < MAX_MATRIX_COLUMNS && previousRow >= MATRIX_START_Y && matrix[nextColumn][previousRow].blockPainted && matrix[nextColumn][previousRow].color === baseColor) {
                count++;
                nextColumn++;
                previousRow--;
            }

            // Clears the cells with the same color
            if (count >= 3) {
                for (let i = 0; i < count; i++) {
                    matrix[matrixColumn + i][matrixRow - i].blockPainted = false;
                }
                cleared = true;
            }

            if (count === 3) {
                score += D_THREE_GEMS;
                totalGemsCleared += count;
            } else if (count === 4) {
                score += D_FOUR_GEMS;
                totalGemsCleared += count;
            } else if (count === 5) {
                score += D_FIVE_GEMS;
                totalGemsCleared += count;
            }
        }
    }
    return cleared;
}

// Functions for moving down the gems that remain after clearing any group of gems in any direction
function setUnremovedGems() {

    let moved = false;

    for (let matrixColumn = 0; matrixColumn < MAX_MATRIX_COLUMNS; matrixColumn++) {
        for (let matrixRow = MAX_MATRIX_ROWS - 1; matrixRow >= MATRIX_START_Y; matrixRow--) {

            // check if the cell is empty and proceeds
            if (!matrix[matrixColumn][matrixRow].blockPainted) {
                for (let previousRow = matrixRow - 1; previousRow >= MATRIX_START_Y; previousRow--) {
                    if (matrix[matrixColumn][previousRow].blockPainted) {
                        matrix[matrixColumn][matrixRow].color = matrix[matrixColumn][previousRow].color;
                        matrix[matrixColumn][matrixRow].blockPainted = true;
                        matrix[matrixColumn][previousRow].blockPainted = false;

                        moved = true;
                        break;
                    }
                }
            }
        }
    }
    return moved;
}

// Function for waterfall effect with the functions of clearing and setting gems
function updateMatrixAfterClear() {

    let somethingHappened;

    do {

        let clearedVertical = verticalGemClear();
        let clearedHorizontal = horizontalGemClear();
        let clearedDiagonalUR = diagonalUpRightGemClear();
        let clearedDiagonalDR = diagonalDownRightGemClear();
        let movedGemDown = setUnremovedGems();

        somethingHappened = clearedVertical || clearedHorizontal || clearedDiagonalDR || clearedDiagonalUR || movedGemDown;

    } while (somethingHappened);

    displayScore();
    displayNumberGemsCleared();

}

// Function for horizontal movement of the gems
function horizontalMovement(dt) {

    horizontalMovementAccumulator += dt * HORIZONTAL_MOV_SPEED;

    if (horizontalMovementAccumulator >= HORIZONTAL_MOV_STEP) {

        horizontalMovementAccumulator = 0;

        for (let gemColumn = 0; gemColumn < MAX_GEM_COLUMNS; gemColumn++) {
            for (let gemRow = 0; gemRow < MAX_GEM_ROWS; gemRow++) {

                let xGemSide = Math.floor(gem[gemColumn][gemRow].x / squareSide);
                let yGemSide = Math.floor(gem[gemColumn][gemRow].y / squareSide);
                let xGemSideRight = Math.min(xGemSide + 1, MAX_MATRIX_COLUMNS - 1);
                let xGemSideLeft = Math.max(0, xGemSide - 1);
                let yNextGem = Math.min(yGemSide + 1, MAX_MATRIX_ROWS - 1);

                let halfBlockDown = (gem[gemColumn][gemRow].y % squareSide) !== 0;

                let rightMatrixCellPainted = matrix[xGemSideRight][yGemSide].blockPainted;
                let rightNextMatrixCellPainted = matrix[xGemSideRight][yNextGem].blockPainted;
                let leftMatrixCellPainted = matrix[xGemSideLeft][yGemSide].blockPainted;
                let leftNextMatrixCellPainted = matrix[xGemSideLeft][yNextGem].blockPainted;

                if (rightpressed && (rightMatrixCellPainted || rightNextMatrixCellPainted) && halfBlockDown) {
                    gem[0][0].x = xGemSide * squareSide;
                    gem[0][1].x = xGemSide * squareSide;
                    gem[0][2].x = xGemSide * squareSide;
                } else if (rightpressed && !rightMatrixCellPainted) {
                    xGemSide += 1;
                    xGemSide = Math.min(xGemSide, MAX_MATRIX_COLUMNS - 1);
                    gem[gemColumn][gemRow].x = xGemSide * squareSide;
                } else if (rightpressed && rightMatrixCellPainted) {
                    gem[0][0].x = xGemSide * squareSide;
                    gem[0][1].x = xGemSide * squareSide;
                    gem[0][2].x = xGemSide * squareSide;
                }

                if (leftpressed && (leftMatrixCellPainted || leftNextMatrixCellPainted) && halfBlockDown) {
                    gem[0][0].x = xGemSide * squareSide;
                    gem[0][1].x = xGemSide * squareSide;
                    gem[0][2].x = xGemSide * squareSide;
                } else if (leftpressed && !leftMatrixCellPainted) {
                    xGemSide -= 1;
                    xGemSide = Math.max(xGemSide, 0);
                    gem[gemColumn][gemRow].x = xGemSide * squareSide;
                } else if (leftpressed && leftMatrixCellPainted) {
                    gem[0][0].x = xGemSide * squareSide;
                    gem[0][1].x = xGemSide * squareSide;
                    gem[0][2].x = xGemSide * squareSide;
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
            gem[0][1].color = gem[0][2].color;
            gem[0][2].color = storeTempColorZ;
        }
        if (xpressed) {
            let storeTempColorX = gem[0][0].color;
            gem[0][0].color = gem[0][2].color;
            gem[0][2].color = gem[0][1].color;
            gem[0][1].color = storeTempColorX;
        }
    }
}

// Function for sending the gems to the end of the available space
function instantFall() {
    let lowerGemPosition = Math.floor(gem[0][2].y / squareSide);
    let fallingGemLimitCanvas = lowerGemPosition < MAX_MATRIX_ROWS - 1;

    const MAX_ITERATION = 1;
    let counterIteration = 0;

    for (let gemColumn = 0; gemColumn < MAX_GEM_COLUMNS; gemColumn++) {
        for (let gemRow = 0; gemRow < MAX_GEM_ROWS; gemRow++) {

            let xGemFall = Math.floor(gem[gemColumn][gemRow].x / squareSide);
            let yGemFall = Math.floor(gem[gemColumn][gemRow].y / squareSide);
            let yNextGemFall = yGemFall + 1;
            let matrixNextCellPainted = false;

            if (yNextGemFall < MAX_MATRIX_ROWS) {
                matrixNextCellPainted = matrix[xGemFall][yNextGemFall].blockPainted;
            } else {
                matrixNextCellPainted = true;
            }


            if (fallingGemLimitCanvas && !matrixNextCellPainted) {
                gem[gemColumn][gemRow].y += dyGem;
            }
            if ((!fallingGemLimitCanvas || matrixNextCellPainted) && counterIteration < MAX_ITERATION) {
                setMatrixBlockColor();
                updateMatrixAfterClear();
                setGemRandomColor();
                initialPosition();
                counterIteration++;
            }
        }
    }
}

// Function for increasing the difficult depending on the score
function difficultyUp() {

    if (difficultyCounter > LIMIT_DIFFICULTY_UP_2) {
        return;
    }

    actualScore = score;
    deltaScore = actualScore - previousScore;
    scoreAccumulator += deltaScore;
    previousScore = actualScore;

    let triggerSurpassed = scoreAccumulator > DIFFICULTY_UP_TRIGGER;
    let difficultyLevelOne = difficultyCounter <= LIMIT_DIFFICULTY_UP_1;
    let difficultyLevelTwo = difficultyCounter > LIMIT_DIFFICULTY_UP_1 && difficultyCounter < LIMIT_DIFFICULTY_UP_2;
    let difficultyLevelThree = difficultyCounter === LIMIT_DIFFICULTY_UP_2;

    if (difficultyLevelOne && triggerSurpassed) {
        scoreAccumulator -= DIFFICULTY_UP_TRIGGER;
        difficultyCounter++;
        increaseSpeed += DELTA_SPEED_UP;
    } else if (difficultyLevelTwo && triggerSurpassed) {
        scoreAccumulator -= DIFFICULTY_UP_TRIGGER;
        difficultyCounter++;
    } else if (difficultyLevelThree && triggerSurpassed) {
        increaseSpeed += DELTA_SPEED_UP_HARD;
    }

    displayDifficultyLevel();

}

// Function for vertical movement of the gem
function fallingGem(dt) {

    fallingGemAccumulator += dt * FALLING_GEM_SPEED + increaseSpeed;

    if (fallingGemAccumulator >= FALLING_GEM_STEP) {

        fallingGemAccumulator = 0;

        let lowerGemPosition = Math.floor(gem[0][2].y / squareSide);
        let fallingGemLimitCanvas = lowerGemPosition < MAX_MATRIX_ROWS - 1;

        const MAX_ITERATION = 1;
        let counterIteration = 0;

        for (let gemColumn = 0; gemColumn < MAX_GEM_COLUMNS; gemColumn++) {
            for (let gemRow = 0; gemRow < MAX_GEM_ROWS; gemRow++) {

                let xGemFall = Math.floor(gem[gemColumn][gemRow].x / squareSide);
                let yGemFall = Math.floor(gem[gemColumn][gemRow].y / squareSide);
                let yNextGemFall = yGemFall + 1;
                let matrixNextCellPainted = false;

                if (yNextGemFall < MAX_MATRIX_ROWS) {
                    matrixNextCellPainted = matrix[xGemFall][yNextGemFall].blockPainted;
                } else {
                    matrixNextCellPainted = true;
                }


                if (fallingGemLimitCanvas && !matrixNextCellPainted) {
                    gem[gemColumn][gemRow].y += dyGem;
                }
                if ((!fallingGemLimitCanvas || matrixNextCellPainted) && counterIteration < MAX_ITERATION) {
                    setMatrixBlockColor();
                    updateMatrixAfterClear();
                    setGemRandomColor();
                    initialPosition();
                    counterIteration++;
                }
            }
        }
    }
}

// Function drawing the motion of the game
function drawMotion() {

    if (gameOver) {
        cancelAnimationFrame(myReq);
        resetGame();
        document.fonts.load(fontGameOver).then(() => { // ensure fonts are loaded
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

    if (spacepressed) {
        instantFall();
    }

    horizontalMovement(dt);

    difficultyUp();

    if (!spacepressed) {
        fallingGem(dt);
    }

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
    } else if (event.key === SPACE) {
        spacepressed = true;
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
    } else if (event.key === SPACE) {
        spacepressed = false;
    }
}

// Function start game
function startGame() {
    setGemRandomColor();
    initialPosition();
    drawMotion();
}

// Button start game
const runButton = document.getElementById("runButton");
runButton.addEventListener("click", () => {
    startGame();
    displayScore();
    displayNumberGemsCleared();
    displayDifficultyLevel();
    runButton.disabled = true;
});

// Show score
function displayScore() {
    const displayScore = document.getElementById("scoringBackgroundSpace");
    displayScore.innerHTML = score;
}

// Show gems cleared
function displayNumberGemsCleared() {
    const displayGemsCleared = document.getElementById("numberGemsBackgroundSpace");
    displayGemsCleared.innerHTML = totalGemsCleared;
}

// Show difficulty level
function displayDifficultyLevel() {
    const displayDifficultyLevel = document.getElementById("difficultyBackgroundSpace");
    displayDifficultyLevel.innerHTML = difficultyCounter;
}