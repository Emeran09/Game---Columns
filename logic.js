//--------------------  VARIABLES ------------------

// Variables Canvas principal
const canvas = document.getElementById("game-canvas")
const ctx = canvas.getContext("2d");
const canvasHeight = canvas.height;
const canvasWidth = canvas.width;

// Variables UI Canvas
const uiCanvas = document.getElementById("ui-canvas");
const uiCtx = uiCanvas.getContext("2d");
const uiCanvasHeight = uiCanvas.height;
const uiCanvasWidth = uiCanvas.width;

// Variables states of the game
const state = {
    playing: runStatePlaying,
    clearing: runStateClearing,
    fallingAfterClear: runStateFallingAfterClearing
};
let gameState = "playing" // posibles: "playing", "clearing" y "fallingAfterClear"

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
        matrix[matrixColumn][matrixRow] = { x: matrixColumn * squareSide, y: matrixRow * squareSide, color: "black", blockPainted: false, clearing: false, clearTimer: 0 };
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
        gem[gemColumn][gemRow] = { x: GEM_START_X, y: gemRow * squareSide, color: "black" };
    }
}

let loadedGemImages = 0;
let loadedGemExplosionImages = 0;
const TOTAL_EXPLOSION_IMAGES = 7;
const gemImages = {};
const gemExplosions = [];

// Variables next gem color
let nextGemColors = [];
for (let gemColumn = 0; gemColumn < MAX_GEM_COLUMNS; gemColumn++) {
    nextGemColors[gemColumn] = [];
    for (let gemRow = 0; gemRow < MAX_GEM_ROWS; gemRow++) {
        nextGemColors[gemColumn][gemRow] = { x: gemColumn, y: gemRow * squareSide, color: "black" };
    }
}

// Variables for clearing animation
let CLEAR_ANIMATION_DURATION = 0.4;
const CLEAR_ANIMATION_SPEED = 20;
const EXPLOSION_ANIMATION_DURATION = 0.3;
let TOTAL_ANIMATION_DURATION = CLEAR_ANIMATION_DURATION + EXPLOSION_ANIMATION_DURATION;

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
const VERTICAL_HORIZONTAL_THREE_GEMS = 30; // modificar nombres completos o cambiar nombre
const VERTICAL_HORIZONTAL_FOUR_GEMS = 45;
const VERTICAL_HORIZONTAL_FIVE_GEMS = 60;
const DIAGONAL_THREE_GEMS = 40;
const DIAGONAL_FOUR_GEMS = 70;
const DIAGONAL_FIVE_GEMS = 100;

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
const DIFFICULTY_UP_TRIGGER = 1000;
const DELTA_SPEED_UP = 0.005;
const DELTA_SPEED_UP_HARD = 0.1;

// ------------------ AUDIO VARIABLES --------------------

const bgMusic = new Audio("audio/Ziggurat Theme.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.5;

const bgMenuMusic = new Audio ("audio/Nile_Twilight.mp3");
bgMenuMusic.loop = true;
bgMenuMusic.volume = 0.5;

const sfxSwapGems = new Audio("audio/sfx_swap_gems.mp3");
const sfxGemReachingEnd = new Audio("audio/sfx_gem_reaching_end.mp3");
sfxGemReachingEnd.onloadedmetadata = function () {
    CLEAR_ANIMATION_DURATION = sfxGemReachingEnd.duration;
    TOTAL_ANIMATION_DURATION = CLEAR_ANIMATION_DURATION + EXPLOSION_ANIMATION_DURATION;
    if (!isNaN(sfxGemClear.duration)) {
        sfxGemClear.playbackRate = sfxGemClear.duration / TOTAL_ANIMATION_DURATION;
    }
}

const sfxGemClear = new Audio("audio/sfx_gem_clear.wav");
sfxGemClear.onloadedmetadata = function () {
    sfxGemClear.playbackRate = sfxGemClear.duration / TOTAL_ANIMATION_DURATION;
}
const chiquitoCasasCode = new Audio("audio/chiquito_casas_code.mp3");
const chuquitoAtaquerl = new Audio("audio/chiquito_al_ataquerl.mp3");

// ---------------- ANIMATION VARIABLES -----------------

let transitionInitiated = false;
const introButton = document.querySelector(".initial-button-format");
const screenIntro = document.querySelector(".screen-intro");
const firstScene = document.querySelector(".intro-first-scene");
const secondScene = document.querySelector(".intro-second-scene");
const companyTitle = document.querySelector(".my-company-title");
const presentationTitle = document.querySelector(".presentation-title");
const collaborationTitle = document.querySelector(".collaboration-title");
const davidCompanyTitle = document.querySelector(".david-company-title");

const screenMenu = document.querySelector(".screen-menu");
const playButton = document.getElementById("play-button");
const controlsButton = document.getElementById("controls-button");
const screenControls = document.getElementById("screen-controls");
const backButton = document.getElementById("back-button");

const screenGame = document.querySelector(".screen-game");
const resetButton = document.getElementById("reset-button");
const menuButton = document.getElementById("menu-button");

// ------------------ FUNCTIONS ----------------

// Function timestamp (obtaining the time time from the browser or in old computers from Unix)
function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
};

// Function to use the first button (which enables all the later sounds)
function enableIntroButton() {

    setTimeout(() => { // enables intro button
        introButton.classList.add("fade-in")
    }, 100);

}

// Function to transition to the intro
function transitionToIntroScenes() {

    setTimeout(() => {
        introButton.classList.remove("fade-in")
        setTimeout(() => {
            introButton.classList.replace("screen-on", "screen-off")
            runIntro();
        }, 1500);
    }, 500);

}

// Function to convert callback hell into promises
function wait(ms) {
    return new Promise(function (resolve) {
        setTimeout(() => {resolve()}, ms);
    });
}

// Function animating the intro scene
async function runIntro() {

    screenIntro.classList.replace("screen-off", "screen-on")
    await wait(100);

    firstScene.classList.remove("screen-off");
    await wait(100);

    companyTitle.classList.add("fade-in")
    await wait(1500);

    presentationTitle.classList.add("fade-in")
    await wait(2000);

    companyTitle.classList.remove("fade-in")
    presentationTitle.classList.remove("fade-in")
    await wait(2000);

    firstScene.classList.add("screen-off")
    secondScene.classList.remove("screen-off")
    await wait(1000);

    collaborationTitle.classList.add("fade-in")
    await wait(1500);

    davidCompanyTitle.classList.add("fade-in")
    chiquitoCasasCode.play();
    await wait(1500);

    collaborationTitle.classList.remove("fade-in")
    davidCompanyTitle.classList.remove("fade-in")
    await wait(2000);

    transitionToMainMenu();
    await wait(1000);

}

// Function to transition to the main menu
function transitionToMainMenu() {

    setTimeout(() => {
        screenIntro.classList.replace("screen-on", "screen-off")
        screenMenu.classList.replace("screen-off", "screen-on")
        bgMenuMusic.play();
    }, 1000);

}

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

    bgMusic.pause();
    bgMusic.currentTime = 0;

    displayScore();
    displayNumberGemsCleared();
    displayDifficultyLevel();

    clearBlocks()

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    initialPosition();
    generateGemRandomColor(gemColors);
    drawMatrixVolumeEffect();
}

// Function for the game state "playing"
function runStatePlaying() {

    drawGems();
    swapGemColor(dt);
    horizontalMovement(dt);

    if (spacepressed) {
        instantFall();
    } else {
        fallingGem(dt);
    }
}

// Function for the game state "clearing"
function runStateClearing() {

    const stillAnimating = animateClearing(dt);

    if (!stillAnimating) {
        gameState = "fallingAfterClear";
    }
    difficultyUp();
}

// Function for the game state "fallingAfterClearing"
function runStateFallingAfterClearing() {

    const moved = setUnremovedGems();

    if (!moved) {

        if (detectClears()) {
            gameState = "clearing"; // combo
        } else {
            gameState = "playing";
            setCurrentGemColor();
            generateNextGemRandomColor();
            initialPosition();
        }
    }
}

// Function clear matrix
function clearBlocks() {
    for (let matrixColumn = 0; matrixColumn < MAX_MATRIX_COLUMNS; matrixColumn++) {
        for (let matrixRow = 0; matrixRow < MAX_MATRIX_ROWS; matrixRow++) {
            matrix[matrixColumn][matrixRow].blockPainted = false;
            matrix[matrixColumn][matrixRow].color = "black";
        }
    }
    for (let gemColumn = 0; gemColumn < MAX_GEM_COLUMNS; gemColumn++) {
        for (let gemRow = 0; gemRow < MAX_GEM_ROWS; gemRow++) {
            nextGemColors[gemColumn][gemRow].color = "black";
        }
    }
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

// Function to preload the images
function preloadImages() {
    gemColors.forEach((color) => {
        const image = new Image();
        image.src = `images/${color}_gem_sprite.png`;
        image.onload = function () {
            gemImages[color] = image;
            loadedGemImages++;
            checkAllImagesLoaded();
        }
    })

    for (let i = 0; i < TOTAL_EXPLOSION_IMAGES; i++) {
        const imageExplosion = new Image();
        imageExplosion.src = `images/gems_explosion_sequence_${i}.png`;
        imageExplosion.onload = function () {
            gemExplosions[i] = imageExplosion;
            loadedGemExplosionImages++;
            checkAllImagesLoaded();
        }
    }
}

// Function to check if all images have been loaded
function checkAllImagesLoaded() {
    if (loadedGemImages === gemColors.length && loadedGemExplosionImages === TOTAL_EXPLOSION_IMAGES) {
        playButton.disabled = false;
    }
}

// Function to play sounds effects overlapping
function playSoundEffect(audioElement) {
    if (audioElement) {
        audioElement.currentTime = 0;
        audioElement.play();
    }
}

preloadImages();

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

// Function for setting a random color to the initial gem
function setInitialGemRandomColor() {
    for (let gemColumn = 0; gemColumn < MAX_GEM_COLUMNS; gemColumn++) {
        for (let gemRow = 0; gemRow < MAX_GEM_ROWS; gemRow++) {
            gem[gemColumn][gemRow].color = generateGemRandomColor(gemColors);
        }
    }
}

// Function for next gem colors
function generateNextGemRandomColor() {
    for (let gemColumn = 0; gemColumn < MAX_GEM_COLUMNS; gemColumn++) {
        for (let gemRow = 0; gemRow < MAX_GEM_ROWS; gemRow++) {
            nextGemColors[gemColumn][gemRow].color = generateGemRandomColor(gemColors);
        }
    }
}

// Function to set the next color to the actual gem
function setCurrentGemColor() {
    for (let gemColumn = 0; gemColumn < MAX_GEM_COLUMNS; gemColumn++) {
        for (let gemRow = 0; gemRow < MAX_GEM_ROWS; gemRow++) {
            gem[gemColumn][gemRow].color = nextGemColors[gemColumn][gemRow].color;
        }
    }
}

// Function for drawing the gem
function drawGems() {
    for (let gemColumn = 0; gemColumn < MAX_GEM_COLUMNS; gemColumn++) {
        for (let gemRow = 0; gemRow < MAX_GEM_ROWS; gemRow++) {

            const actualColor = gem[gemColumn][gemRow].color;

            if (actualColor !== "black") {
                ctx.drawImage(gemImages[actualColor], gem[gemColumn][gemRow].x, gem[gemColumn][gemRow].y, squareSide, squareSide);
            }
        }
    }
}

// Function to display the next gem color on the UI
function displayGemNextColors() {

    const centerUiX = (uiCanvasWidth - squareSide) / 2
    const totalGemsHeight = MAX_GEM_ROWS * squareSide;
    const centerUiY = (uiCanvasHeight - totalGemsHeight) / 2;

    for (let gemColumn = 0; gemColumn < MAX_GEM_COLUMNS; gemColumn++) {
        for (let gemRow = 0; gemRow < MAX_GEM_ROWS; gemRow++) {

            const showNextColor = nextGemColors[gemColumn][gemRow].color

            if (showNextColor !== "black") {
                const finalY = centerUiY + (gemRow * squareSide);
                uiCtx.drawImage(gemImages[showNextColor], centerUiX, finalY, squareSide, squareSide);
            }
        }
    }
}

// Function for setting the matrix blocks with color
function setMatrixBlockColor() {
    for (let gemColumn = 0; gemColumn < MAX_GEM_COLUMNS; gemColumn++) {
        for (let gemRow = 0; gemRow < MAX_GEM_ROWS; gemRow++) {

            const roundXPosition = Math.floor(gem[gemColumn][gemRow].x / squareSide);
            const roundYPosition = Math.floor(gem[gemColumn][gemRow].y / squareSide);

            matrix[roundXPosition][roundYPosition].color = gem[gemColumn][gemRow].color;
            matrix[roundXPosition][roundYPosition].blockPainted = true;
        }
    }
}

// Function for painting and keeping the blocks of the matrix drawn with color
function paintMatrixBlock() {
    for (let matrixColumn = 0; matrixColumn < MAX_MATRIX_COLUMNS; matrixColumn++) {
        for (let matrixRow = 0; matrixRow < MAX_MATRIX_ROWS; matrixRow++) {

            const matrixGemImage = matrix[matrixColumn][matrixRow].color;
            const matrixX = matrix[matrixColumn][matrixRow].x;
            const matrixY = matrix[matrixColumn][matrixRow].y;

            if (matrix[matrixColumn][matrixRow].blockPainted) {

                if (matrix[matrixColumn][matrixRow].clearing) {

                    if (matrix[matrixColumn][matrixRow].clearTimer < CLEAR_ANIMATION_DURATION) {

                        playSoundEffect(sfxGemClear);
                        const BLINK = Math.floor(matrix[matrixColumn][matrixRow].clearTimer * CLEAR_ANIMATION_SPEED) % 2;

                        if (BLINK) {
                            // we take advantage of the matrix black color and
                            // do nothing ti generate the blinking effect at clearing gems
                        } else {
                            if (gemImages[matrixGemImage]) {
                                ctx.drawImage(gemImages[matrixGemImage], matrixX, matrixY, squareSide, squareSide);
                            }
                        }

                    } else {

                        let EXPLOSION_SELECTOR = Math.floor(gemExplosions.length * ((matrix[matrixColumn][matrixRow].clearTimer - CLEAR_ANIMATION_DURATION) / EXPLOSION_ANIMATION_DURATION));
                        EXPLOSION_SELECTOR = Math.min(EXPLOSION_SELECTOR, gemExplosions.length - 1);

                        if (gemExplosions[EXPLOSION_SELECTOR]) {
                            ctx.drawImage(gemExplosions[EXPLOSION_SELECTOR], matrixX, matrixY, squareSide, squareSide);
                        }

                    }

                } else {
                    if (gemImages[matrixGemImage]) {
                        ctx.drawImage(gemImages[matrixGemImage], matrixX, matrixY, squareSide, squareSide);
                    }
                }
            }
        }
    }
}

// Function for the clearing animation
function animateClearing(dt) {

    let stillAnimating = false;

    for (let matrixColumn = 0; matrixColumn < MAX_MATRIX_COLUMNS; matrixColumn++) {
        for (let matrixRow = 0; matrixRow < MAX_MATRIX_ROWS; matrixRow++) {
            if (matrix[matrixColumn][matrixRow].clearing) {

                matrix[matrixColumn][matrixRow].clearTimer += dt;

                if (matrix[matrixColumn][matrixRow].clearTimer >= TOTAL_ANIMATION_DURATION) {
                    matrix[matrixColumn][matrixRow].blockPainted = false;
                    matrix[matrixColumn][matrixRow].clearing = false;
                } else {
                    stillAnimating = true;
                }
            }
        }
    }

    return stillAnimating;
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
            let countBlock = 1;

            // counts how many gems in a row have the same color
            for (let nextRow = matrixRow + 1; nextRow < MAX_MATRIX_ROWS; nextRow++) {
                if (matrix[matrixColumn][nextRow].blockPainted && matrix[matrixColumn][nextRow].color === baseColor) {
                    countBlock++;
                } else {
                    break;
                }
            }
            // Clears the cells with the same color
            if (countBlock >= 3) {
                for (let i = 0; i < countBlock; i++) {
                    matrix[matrixColumn][matrixRow + i].clearing = true;
                    matrix[matrixColumn][matrixRow + i].clearTimer = 0;
                }
                cleared = true;
            }

            if (countBlock === 3) {
                score += VERTICAL_HORIZONTAL_THREE_GEMS;
                totalGemsCleared += countBlock;
            } else if (countBlock === 4) {
                score += VERTICAL_HORIZONTAL_FOUR_GEMS;
                totalGemsCleared += countBlock;
            } else if (countBlock === 5) {
                score += VERTICAL_HORIZONTAL_FIVE_GEMS;
                totalGemsCleared += countBlock;
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
            let countBlock = 1;

            // counts how many gems in a row have the same color
            for (let nextColumn = matrixColumn + 1; nextColumn < MAX_MATRIX_COLUMNS; nextColumn++) {
                if (matrix[nextColumn][matrixRow].blockPainted && matrix[nextColumn][matrixRow].color === baseColor) {
                    countBlock++;
                } else {
                    break;
                }
            }

            // Clears the cells with the same color
            if (countBlock >= 3) {
                for (let i = 0; i < countBlock; i++) {
                    matrix[matrixColumn + i][matrixRow].clearing = true;
                    matrix[matrixColumn + i][matrixRow].clearTimer = 0;
                }
                cleared = true;
            }

            if (countBlock === 3) {
                score += VERTICAL_HORIZONTAL_THREE_GEMS;
                totalGemsCleared += countBlock;
            } else if (countBlock === 4) {
                score += VERTICAL_HORIZONTAL_FOUR_GEMS;
                totalGemsCleared += countBlock;
            } else if (countBlock === 5) {
                score += VERTICAL_HORIZONTAL_FIVE_GEMS;
                totalGemsCleared += countBlock;
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
            let countBlock = 1;
            let nextColumn = matrixColumn + 1;
            let nextRow = matrixRow + 1;

            // counts how many gems in a row have the same color
            while (nextColumn < MAX_MATRIX_COLUMNS && nextRow < MAX_MATRIX_ROWS && matrix[nextColumn][nextRow].blockPainted && matrix[nextColumn][nextRow].color === baseColor) {
                countBlock++;
                nextColumn++;
                nextRow++;
            }

            // Clears the cells with the same color
            if (countBlock >= 3) {
                for (let i = 0; i < countBlock; i++) {
                    matrix[matrixColumn + i][matrixRow + i].clearing = true;
                    matrix[matrixColumn + i][matrixRow + i].clearTimer = 0;
                }
                cleared = true;
            }

            if (countBlock === 3) {
                score += DIAGONAL_THREE_GEMS;
                totalGemsCleared += countBlock;
            } else if (countBlock === 4) {
                score += DIAGONAL_FOUR_GEMS;
                totalGemsCleared += countBlock;
            } else if (countBlock === 5) {
                score += DIAGONAL_FIVE_GEMS;
                totalGemsCleared += countBlock;
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
            let countBlock = 1;
            let nextColumn = matrixColumn + 1;
            let previousRow = matrixRow - 1;

            // counts how many gems in a row have the same color
            while (nextColumn < MAX_MATRIX_COLUMNS && previousRow >= MATRIX_START_Y && matrix[nextColumn][previousRow].blockPainted && matrix[nextColumn][previousRow].color === baseColor) {
                countBlock++;
                nextColumn++;
                previousRow--;
            }

            // Clears the cells with the same color
            if (countBlock >= 3) {
                for (let i = 0; i < countBlock; i++) {
                    matrix[matrixColumn + i][matrixRow - i].clearing = true;
                    matrix[matrixColumn + i][matrixRow - i].clearTimer = 0;
                }
                cleared = true;
            }

            if (countBlock === 3) {
                score += DIAGONAL_THREE_GEMS;
                totalGemsCleared += countBlock;
            } else if (countBlock === 4) {
                score += DIAGONAL_FOUR_GEMS;
                totalGemsCleared += countBlock;
            } else if (countBlock === 5) {
                score += DIAGONAL_FIVE_GEMS;
                totalGemsCleared += countBlock;
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

// Function for detecting the "clearing" state
function detectClears() {

    const clearedVertical = verticalGemClear();
    const clearedHorizontal = horizontalGemClear();
    const clearedDiagonalUR = diagonalUpRightGemClear();
    const clearedDiagonalDR = diagonalDownRightGemClear();

    const anyClear = clearedVertical || clearedHorizontal || clearedDiagonalUR || clearedDiagonalDR;

    displayScore();
    displayNumberGemsCleared();

    return anyClear;
}

// Function for horizontal movement of the gems
function horizontalMovement(dt) {

    if (gameOver) {
        return;
    }

    horizontalMovementAccumulator += dt * HORIZONTAL_MOV_SPEED;

    if (horizontalMovementAccumulator >= HORIZONTAL_MOV_STEP) {

        horizontalMovementAccumulator = 0;

        for (let gemColumn = 0; gemColumn < MAX_GEM_COLUMNS; gemColumn++) {
            for (let gemRow = 0; gemRow < MAX_GEM_ROWS; gemRow++) {

                let xGemSide = Math.floor(gem[gemColumn][gemRow].x / squareSide);
                let yGemSide = Math.floor(gem[gemColumn][gemRow].y / squareSide);
                const xGemSideRight = Math.min(xGemSide + 1, MAX_MATRIX_COLUMNS - 1);
                const xGemSideLeft = Math.max(0, xGemSide - 1);
                const yNextGem = Math.min(yGemSide + 1, MAX_MATRIX_ROWS - 1);

                const halfBlockDown = (gem[gemColumn][gemRow].y % squareSide) !== 0;

                const rightMatrixCellPainted = matrix[xGemSideRight][yGemSide].blockPainted;
                const rightNextMatrixCellPainted = matrix[xGemSideRight][yNextGem].blockPainted;
                const leftMatrixCellPainted = matrix[xGemSideLeft][yGemSide].blockPainted;
                const leftNextMatrixCellPainted = matrix[xGemSideLeft][yNextGem].blockPainted;

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

    if (gameOver) {
        return;
    }

    swapGemColorAccumulator += dt * SWAP_GEM_COLOR_SPEED;

    if (swapGemColorAccumulator >= SWAP_GEM_COLOR_STEP) {

        swapGemColorAccumulator = 0;

        if (zpressed) {
            let storeTempColorZ = gem[0][0].color;
            gem[0][0].color = gem[0][1].color;
            gem[0][1].color = gem[0][2].color;
            gem[0][2].color = storeTempColorZ;
            playSoundEffect(sfxSwapGems);
        }
        if (xpressed) {
            let storeTempColorX = gem[0][0].color;
            gem[0][0].color = gem[0][2].color;
            gem[0][2].color = gem[0][1].color;
            gem[0][1].color = storeTempColorX;
            playSoundEffect(sfxSwapGems);
        }
    }
}

// Function for sending the gems to the end of the available space
function instantFall() {

    if (gameOver) {
        return;
    }

    let bottomX = Math.floor(gem[0][2].x / squareSide);
    let bottomY = Math.floor(gem[0][2].y / squareSide);

    let canMoveDown = true;

    if (bottomY >= MAX_MATRIX_ROWS - 1 || matrix[bottomX][bottomY + 1].blockPainted) {
        canMoveDown = false;
    }

    if (canMoveDown) {
        for (let gemColumn = 0; gemColumn < MAX_GEM_COLUMNS; gemColumn++) {
            for (let gemRow = 0; gemRow < MAX_GEM_ROWS; gemRow++) {
                gem[gemColumn][gemRow].y += dyGem;
            }
        }
    } else {

        playSoundEffect(sfxGemReachingEnd);
        setMatrixBlockColor();

        if (detectClears()) {
            gameState = "clearing";
        } else {
            setCurrentGemColor();
            generateNextGemRandomColor();
            initialPosition();
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

    if (gameOver) {
        return;
    }

    fallingGemAccumulator += dt * FALLING_GEM_SPEED + increaseSpeed;

    if (fallingGemAccumulator >= FALLING_GEM_STEP) {

        fallingGemAccumulator = 0;

        let bottomX = Math.floor(gem[0][2].x / squareSide);
        let bottomY = Math.floor(gem[0][2].y / squareSide);

        let canMoveDown = true;

        if (bottomY >= MAX_MATRIX_ROWS - 1 || matrix[bottomX][bottomY + 1].blockPainted) {
            canMoveDown = false;
        }

        if (canMoveDown) {
            for (let gemColumn = 0; gemColumn < MAX_GEM_COLUMNS; gemColumn++) {
                for (let gemRow = 0; gemRow < MAX_GEM_ROWS; gemRow++) {
                    gem[gemColumn][gemRow].y += dyGem;
                }
            }
        }

        let newBottomY = Math.floor(gem[0][2].y / squareSide);

        if (newBottomY >= MAX_MATRIX_ROWS - 1) {
            canMoveDown = false;
        } else if (matrix[bottomX][newBottomY + 1].blockPainted && gem[0][2].y % squareSide === 0) {
            canMoveDown = false;
        }

        if (!canMoveDown) {

            playSoundEffect(sfxGemReachingEnd);
            setMatrixBlockColor();

            if (detectClears()) {
                gameState = "clearing";
            } else {
                setCurrentGemColor();
                generateNextGemRandomColor();
                initialPosition();
            }
        }
    }
}

// Function drawing the motion of the game
function drawMotion() {

    nowTime = timestamp();
    dt = (nowTime - lastTime) / 1000;
    lastTime = nowTime;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    uiCtx.clearRect(0, 0, uiCanvasWidth, uiCanvasHeight);

    drawMatrixVolumeEffect();

    if (gameOver) {

        clearBlocks();

        document.fonts.load(fontGameOver).then(() => {
            drawGameOver();
        })

        playButton.disabled = false;

        return;

    }

    paintMatrixBlock();

    displayGemNextColors();

    state[gameState]();

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
    setInitialGemRandomColor();
    initialPosition();

    lastTime = timestamp();

    drawMotion();
    generateNextGemRandomColor();
    bgMusic.play();
}

// Intro button event
introButton.addEventListener("click", () => {
    if (transitionInitiated) {
        return; 
    }

    transitionInitiated = true;

    introButton.blur(); 

    chuquitoAtaquerl.play();
    transitionToIntroScenes();
});

// Go to game screen
playButton.addEventListener("click", () => {

    playButton.blur();

    cancelAnimationFrame(myReq);

    screenMenu.classList.replace("screen-on", "screen-off")
    screenGame.classList.replace("screen-off", "screen-on")

    bgMenuMusic.pause();
    bgMenuMusic.currentTime = 0;
    //poner cuenta atrás
    resetGame();
    startGame();
    playButton.disabled = true;
});

// Reset button in game
resetButton.addEventListener("click", () => {

    resetButton.blur();

    cancelAnimationFrame(myReq); 
    resetGame();
    startGame();
});

// Got to menu from screen game
menuButton.addEventListener("click", () => {

    menuButton.blur();

    cancelAnimationFrame(myReq);

    bgMusic.pause();
    bgMusic.currentTime = 0;
    bgMenuMusic.play();
    
    screenGame.classList.replace("screen-on", "screen-off");
    screenMenu.classList.replace("screen-off", "screen-on");

    playButton.disabled = false;
});

// Go to controls screen
controlsButton.addEventListener("click", () => {
    screenControls.classList.replace("screen-off", "screen-on")
});

// Go back to menu
backButton.addEventListener("click", () => {
    screenControls.classList.replace("screen-on", "screen-off")
});

// Show score
function displayScore() {
    const displayScore = document.getElementById("scoring-background-space");
    displayScore.innerHTML = score;
};

// Show gems cleared
function displayNumberGemsCleared() {
    const displayGemsCleared = document.getElementById("number-gems-background-space");
    displayGemsCleared.innerHTML = totalGemsCleared;
};

// Show difficulty level
function displayDifficultyLevel() {
    const displayDifficultyLevel = document.getElementById("difficulty-background-space");
    displayDifficultyLevel.innerHTML = difficultyCounter;
};

// To load the inital button after everything is loaded
window.onload = enableIntroButton;