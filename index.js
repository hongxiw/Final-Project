const playerHalfCaptured = [], computerHalfCaptured = [], playerFullCaptured = [], computerFullCaptured = [];

function initialize() {
    pickDiv = document.querySelector("#pickDiv");
    boardDiv = document.querySelector("#boardDiv");
    endDiv = document.querySelector("#endDiv");
    showPickScreen();
    turn = "player";
    playerLetter = "X", computerLetter = "O";
    playerRecent = null, computerRecent = null;
    grid = [[],[],[]];
    let gridButtons = document.getElementsByClassName('gridButton');
    for (let i = 0; i < gridButtons.length; i++) {
        gridButtons[i].addEventListener("click", playerPickSpot);
        gridButtons[i].className = "gridButton";
        gridButtons[i].innerHTML = "";
        grid[Math.floor(i / 3)].push(gridButtons[i]);
    }
    document.querySelector("#chooseX").addEventListener("click", chooseLetter);
    document.querySelector("#chooseO").addEventListener("click", chooseLetter);
    document.querySelector("#resetButton").addEventListener("click", resetGame);
}

function showPickScreen() {
    pickDiv.style.display = "block";
    boardDiv.style.display = "none";
    endDiv.style.display = "none";
}

function showGrid() {
    pickDiv.style.display = "none";
    boardDiv.style.display = "block";
}

function showEndDiv() {
    pickDiv.style.display = "none";
    endDiv.style.display = "block";
}

function showWinnerDiv(winner) {
    pickDiv.style.display = "none";
    document.querySelector("#winMessage").innerHTML = `The ${winner} wins!`
    endDiv.style.display = "block";
}

function chooseLetter(event) {
    showGrid();
    showEndDiv();
    turn = (event.target.id === 'chooseO') ? "computer" : "player";
    playerLetter = (event.target.id === 'chooseO') ? "O" : "X";
    computerLetter = (event.target.id === 'chooseO') ? "X" : "O";
    if (event.target.id === 'chooseO') {
        computerPickSpot();
    }
}

function playerPickSpot(evt) {
    if (turn !== "player") {
        return;
    }
    if (!isValidSpot(evt.target, "player")) {
        return;
    }
    playerRecent = evt.target;
    evt.target.innerHTML = playerLetter;
    removeFromArrray(computerHalfCaptured, evt.target);
    if (playerHalfCaptured.includes(evt.target)) {
        removeFromArrray(playerHalfCaptured, evt.target);
        evt.target.classList.remove("halfTaken");
        evt.target.classList.add("fullTaken");
        playerFullCaptured.push(evt.target);
    } else {
        playerHalfCaptured.push(evt.target);
        evt.target.classList.add("halfTaken");
    }
    if (isWinFound(playerLetter)) {
        showWinnerDiv("Player");
        return;
    }
    turn = "computer";
    computerPickSpot();
}

function isValidSpot(button, who) {
    let oppositeRecent = (who === "computer") ? playerRecent : computerRecent;
    let personFull = (who === "computer") ? computerFullCaptured : playerFullCaptured;
    let oppositeFull = (who === "computer") ? playerFullCaptured : computerFullCaptured;
    return button != oppositeRecent && !oppositeFull.includes(button) && !personFull.includes(button);
}

function computerPickSpot() {
    let randomRow = Math.floor(Math.random() * 3), randomCol = Math.floor(Math.random() * 3);
    let randomButton = grid[randomRow][randomCol];
    let failedSlots = [];
    while (!isValidSpot(randomButton, "computer")) {
        randomRow = Math.floor(Math.random() * 3), randomCol = Math.floor(Math.random() * 3);
        randomButton = grid[randomRow][randomCol];
        if (!failedSlots.includes(randomButton)) {
            failedSlots.push(randomButton);
        }
        if (failedSlots.length >= 9) {
            document.querySelector("#winMessage").innerHTML = "The computer detected a tie or unwinnable position. Please reset to play again"
            return;
        }
    }
    computerRecent = randomButton;
    randomButton.innerHTML = computerLetter;
    removeFromArrray(playerHalfCaptured, randomButton);
    if (computerHalfCaptured.includes(randomButton)) {
        removeFromArrray(computerHalfCaptured, randomButton);
        randomButton.classList.remove("halfTaken");
        randomButton.classList.add("fullTaken");
        computerFullCaptured.push(randomButton);
    } else {
        computerHalfCaptured.push(randomButton);
        randomButton.classList.add("halfTaken");
    }
    if (isWinFound(computerLetter)) {
        showWinnerDiv("Computer")
        return;
    }
    turn = "player";
}

function isWinFound(char) {
    for (let row = 0; row < 3; row++) {
        if (grid[row][0].innerHTML === char && grid[row][1].innerHTML === char && grid[row][2].innerHTML === char) {
            return true;
        }
    }
    for (let col = 0; col < 3; col++) {
        if (grid[0][col].innerHTML === char && grid[1][col].innerHTML === char && grid[2][col].innerHTML === char) {
            return true;
        }
    }
    if (grid[0][0].innerHTML === char && grid[1][1].innerHTML === char & grid[2][2].innerHTML === char) {
        return true;
    }
    if (grid[0][2].innerHTML === char && grid[1][1].innerHTML === char && grid[2][0].innerHTML === char) {
        return true;
    }
    return false;
}

function resetGame() {
    clearArray(playerHalfCaptured);
    clearArray(playerFullCaptured);
    clearArray(computerHalfCaptured);
    clearArray(computerFullCaptured);
    grid = [[],[],[]];
    document.querySelector("#winMessage").innerHTML = ``
    initialize();
}

function removeFromArrray(array, value) {
    for (let i in array) {
        if (array[i] === value) {
            array.splice(i, i + 1);
        }
    }
    return array.filter(v => v != value);
}

const clearArray = (array) => {
    while(array.length > 0) {
        array.pop();
    }
}