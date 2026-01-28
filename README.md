LINK TRELLO BOARD

https://trello.com/b/YjW5YiJU/my-trello-board

********************************************************************************************************************

VERSION LOG

!!! v0 - Base Code and Testing Functions !!!

Upload base code and testing of basic functions:

1) "index_game.html" -> base .hmtl file of the project
2) "logic_game.js" -> base .js file of the project
3) "styles_game.css" -> base .css file of the project

Detail of the initial functions, constants and variables in "logic_game.js":

Variables

* Canvas
* Matrix variables for 3D effect and 2D 6x14 object matrix creation
* "requestAnimationFrame"
* Gems (1x3 2D object matrix)
* Game Over
* Right and left movement

Functions

* resetGame: in this initial stage, the logic of this function does not match the real logic, created to check that each time the game is reset, the color of the gems is randomly generated properly
* drawGameOver: created to verify the used font and it is centered in the canvas
* drawMatrixVolumeEffect: used to paint gray lines in each square of the matrix to give the 3D effect, at the start of the game and when reseted
* generateGemRandomColor: generation of a color for each gem
* setGemRandomColor: apply the color to each gem
* drawGems: draw the gems with all the properties
* horizontalMovement: right and left movement when the right and left arrows are pressed
* fallingGem: initial physics of the falling gems, in this version when a gem reaches the vertical end of the canvas, the "resetGame" and "drawGameOver" are executed (not the real logic of the game)
* drawMotion: the core function fo the game, which unifies all the functions and keeps the game running
* keyDownHandler & keyUpHandler: used for the keyboard events (pressed and not pressed)
* startGame: to initialize the game

--------------------------------------------------------------------

!!! v0.1 - Cleaning Folders and Organisation of Files !!!

(No code added or removed)

--------------------------------------------------------------------

!!! v0.2 - Painting blocks in the matrix when falling a gem !!!

In this update that cool "Game Over" animation will not be seen, for a greater good.

Some new functions are added:

* initialPosition: sets the gems on the upper region of the matrix, centered, for starting to fall again
* setMatrixBlockColor: the core for coloring the matrix each time a gem falls, once the gem touches the vertical end of the canvas, converts the "x" and "y" position into subindexes of the matrix, for stating the specific matrix block color and the "blockPainted" status
* paintMatrixBlock: when "blockPainted" is true, paints the specific block of the matrix with the color set from setMatrixBlockColor
* resetGame: rewrote the code with initialPosition and generateGemRandomColor

--------------------------------------------------------------------

!!! v0.3 - Minor code improvements !!!

After a quick review, some minor changes to the actual code were added:

Variables

* created the constants LEFT, RIGHT, ARROW_LEFT, ARROW_RIGHT for the keyUpHandler and keyDownHandler, for storing the same values stated as strings (better practice)
* renamed the font from Game Over animation from "retroFont" as "fontGameOver"

Functions

* set the function setGemRandomColor inside the startGame function, instead of floating in the middle of the code
* set as a constant the condition to keep the gem falling inside the fallingGem function to make it easier to read
* convert the "if / else if" from horizontalMovement in two separate "if" statements

Others

* Corrected some spelling msitakes in the readme and code (comments)

--------------------------------------------------------------------

!!! v0.4 - Separating render functions from logic functions (time dependant)

Big improvement in the code. Until now, all the functions for the movement of the gems (fallingGem and horizontalMovement) were not dependant of time, but of the refreshment of the speed of "animationRequestFrame" from drawMotion. The falling speed of the gem and its horizontal movement was uncontrollable. Moreover, adding a new feature to the gem, the capability of swapping its color between the gems, it was clear that something was missing: the dependance of time factors and not the refreshment speed.

Time variables for a time dependency inside drawMotion are created, new constants and variables for each modified function also, and adding the swapGemColor function

Variables and constants

* nowTime: actual time in the iteration
* lastTime: previously saved time in the iteration
* dt: difference of time between nowTime and lastTime

* for setting a value which triggers the time-dependant functions: HORIZONTAL_MOV_STEP, SWAP_GEM_COLOR_STEP, FALLING_GEM_STEP
* creation of an accumulator in each function to trigger the steps based on the increase of "dt": horizontalMovementAccumulator, swapGemColorAccumulator, fallingGemAccumulator
* creation of a constant to regulate how fast each accumulator increases its value: HORIZONTAL_MOV_SPEED, SWAP_GEM_COLOR_SPEED, FALLING_GEM_SPEED

* created the constants Z and X for the keyUpHandler and keyDownHandler functions, storing the values of the letters as strings
* for the swapGemColor function, created the variables zpressed and xpressed to enable the functionality of swapping color by pressing the "z" or "x" buttons

Functions

* creation of the timestamp function to obtain a time reference to use to create the time dependency of the functions, it uses "performance.now()" to create a first time reference in modern web browsers, and "date.now()" in older ones, which allows the function to be processed in all cases
* deleted the "returns" from horizontalMovement (it only run the first value of each double-for loop)
* creation of the function swapGemColor, for swapping the colors of the gems, and added in drawMotion
* horizontalMovement, swapGemColor and fallingGem are now time dependant functions
* due to the new dependency of time in fallingGem, and give a more retro feeling to its falling movement, increased the travelled step from squareSide/10 to squareside/2
* after lowering the falling speed in fallingGem, it has been erased the "dyGem" from the if condition that allows the movement, as the gem block did not collide with the end of the canvas properly (the block surpassed the limit of the canvas)

--------------------------------------------------------------------

!!! v0.5 - Vertical collisions

Implemented vertical collisions with the gems once they have reached the limit and no more collisions with the end of the canvas can occur. To do so, some changes have been made to the fallingGem function.

Functions

* fallingGem has been rewritten

    1. All the logic is now dependant on coordinates, not position. Position is transformed to coordinates dividing by squareSide, creating:

        * variable lowerGemPosition = Math.floor(gem[0][2].y / squareSide)
        * dividing canvas.height by squareSide, we obtain MAX_MATRIX_ROWS
        * the constraint fallingGemLimitCanvas now looks like: lowerGemPosition < MAX_MATRIX_ROWS - 1

    2. Each coordinate of each gem is calculated following the same method as before, dividing by sqaureSide and rounding the result to the lower integer:

        * xGemFall = Math.floor(gem[gemColumn][gemRow].x / squareSide)
        * yGemFall = Math.floor(gem[gemColumn][gemRow].y / squareSide)
        * To properly calculate the collision, the variable "yNextGemFall" (defined as yGemFall + 1) is created
    
    3. The logic when a gem reaches the end of the canvas or has a collision with another gem is now inside the double-for loop. Due to that, the execution of the setMatrixBlockColor, initialPosition and setGemRandomColor functions was repeated three times. In order to avoid that, a variable and a constant were added:

        * constant MAX_ITERATION: to limit the amount of times the functions have to be executed
        * variable counterIteration: to count the number of times the three functions have been executed
    
    With that, and the constraint matrixCellPainted, defined as "!matrix[xGemFall][yNextGemFall].blockPainted", combined with the variable counterIteration and the fallingGemLimitCanvas, the proper logic for reseting the gems was possible. 

    4. Now the gem falls if both fallingGemLimitCanvas and matrixCellPainted conditions are met. If only one of the conditions is true, it means a collision either with the end of the canvas or another block has occured, and both conditions can never be false at the same time.