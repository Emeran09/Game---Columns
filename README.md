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
