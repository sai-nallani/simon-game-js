/**
 * @property {HTMLDivElement} green
 * @property {HTMLDivElement} red
 * @property {HTMLDivElement} blue
 * @property {HTMLDivElement} yellow
 *
 */
const buttons = {
    green: document.querySelector("#green"),
    red: document.querySelector("#red"),
    blue: document.querySelector("#blue"),
    yellow: document.querySelector("#yellow"),
};
/**
 * @property {string} a
 * @property {string} s
 * @property {string} d
 * @property {string} f
 */
const keybindings = {
    a: "green",
    s: "red",
    d: "yellow",
    f: "blue",
};
const audioFiles = {
    green: new Audio('sounds/green.mp3'),
    red: new Audio('sounds/red.mp3'),
    blue: new Audio('sounds/blue.mp3'),
    yellow: new Audio('sounds/yellow.mp3'),
    wrong: new Audio('sounds/wrong.mp3')
}
const DELAY_MS = 200;
const levelTitle = document.querySelector("#level-title");
const movesElement = document.querySelector("#moves");
let commands = [];
let userChoices = [];
let gameover = false;
let level = 1;
let duringSimonShows = false;

/**
 * updates moves element to show user how many moves they did
 * @param {Number} moves num of moves
 */
function updateMoves(moves) {
    movesElement.innerHTML = "";
    for (let move of moves) {
        let color = move.id;
        let span = document.createElement("span");
        span.style.backgroundColor = color;
        span.className = "move";
        movesElement.appendChild(span);
    }
}
/**
 * chooses random color for command
 */
function chooseRandomColor() {
    const colors = Object.keys(buttons);
    let randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

/**
 * flashes each button for user
 * @param {HTMLDivElement} btn
 * @param {Number} pressDelay
 * @param {Number} unpressDelay
 * @param {boolean} last
 */
function flash(btn, pressDelay, unpressDelay, last = false) {
    setTimeout(() => {
        btn.classList.add("pressed");
    }, pressDelay);
    setTimeout(() => {
        btn.classList.remove("pressed");
        if (last) {
            duringSimonShows = false;
        }
    }, unpressDelay);
}
/**
 * what simon, or the game, shows the user to do. aka simons commands
 */
function simonShows() {
    duringSimonShows = true;
    levelTitle.innerHTML = `Level ${level}`;
    let color = chooseRandomColor();
    let button = buttons[color];
    commands.push(button);
    for (let i = 0; i < commands.length; i++) {
        let btn = commands[i];
        let pressDelay = i * DELAY_MS * 2;
        let unpressDelay = pressDelay + 200;
        if (i == commands.length - 1) {
            flash(btn, pressDelay, unpressDelay, true);
        } else {
            flash(btn, pressDelay, unpressDelay);
        }
    }
}
/**
 * function that runs once game is over
 */
function lost() {
    levelTitle.innerHTML =
        "You lost! Listen to Simon next time...<hr><h2>Press any key to start again.<h2/>";
    gameover = true;
    document.addEventListener("keydown", () => location.reload());
    audioFiles.wrong.play();
}
/**
 * function that runs on game start
 */
function onGameStart() {
    gameover = false;
    commands = [];
    userChoices = [];
    level = 1;
    simonShows();
}
/**
 * progress user to the next level
 */
function nextLevel() {
    level++;
    userChoices = [];
    simonShows();
    duringSimonShows = true;
    updateMoves(userChoices);
}
/**
 * main game function
 */
function game() {
    /**
     * Tracks the amount of moves user has done for the particular level, also aides in checking if move is valid.
     * @type {Number}
     */
    let userMovesCount = 0;
    updateMoves(userChoices);
    onGameStart();
    for (let [_color, button] of Object.entries(buttons)) {
        button.addEventListener("click", (evt) => {
            if (!duringSimonShows && !gameover) {
                let btnElement = evt.target;
                audioFiles[btnElement.id].seek = 0;
                audioFiles[btnElement.id].play();
                flash(btnElement, 0, 100);
                userChoices.push(btnElement);
                if (commands[userMovesCount] != userChoices[userMovesCount]) {
                    // is the user move the same as Simon's move?
                    lost();
                } else if (commands.length == userChoices.length) {
                    // is the level over?
                    updateMoves(userChoices);

                    setTimeout(() => {
                        nextLevel();
                    }, 200);
                    userMovesCount = 0;
                } else {
                    // if the user is between a level, and his move was right
                    userMovesCount++;
                    updateMoves(userChoices);
                }
            }
        });
    }
    document.addEventListener("keyup", (evt) => {
        let color = keybindings[evt.key];
        if (color) {
            buttons[color].click();
        }
    });
}
document.addEventListener("keydown", game, { once: true });
