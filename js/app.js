import { state, levelsData, loadLevel, findNode, checkCollisions } from "./state.js";
import { updateHUD, drawCanvas, formatTime } from "./render.js";

const SAVE_KEY = "trainSimSave";
const BOARD_KEY = "trainSimBoard";

const screens = document.querySelectorAll(".screen");
const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");
const modal = document.querySelector("#custom-modal");
const modalTitle = document.querySelector("#modal-title");
const modalMessage = document.querySelector("#modal-message");
const pauseButton = document.querySelector("#btn-pause");

let lastTime = 0;
let animationFrameId = 0;

function switchScreen(screenId) {
    for (const screen of screens) {
        screen.classList.remove("active");
    }
    document.querySelector(`#${screenId}`).classList.add("active");
}

function showModal(title, message) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.classList.remove("hidden");
}

function updatePauseButton() {
    pauseButton.textContent = state.isRunning ? "Szünet" : "Folytatás";
}

function startLoop() {
    cancelAnimationFrame(animationFrameId);
    lastTime = performance.now();
    animationFrameId = requestAnimationFrame(gameLoop);
}

function startLevel(levelId) {
    try {
        loadLevel(levelId);
    } catch (error) {
        showModal("Hiba", error.message);
        return false;
    }
    updatePauseButton();
    return true;
}

function readBoard() {
    try {
        return JSON.parse(localStorage.getItem(BOARD_KEY)) || {};
    } catch (error) {
        return {};
    }
}

function addResult() {
    const board = readBoard();
    const list = board[state.level] || [];

    list.push({
        name: state.player,
        time: Math.floor(state.timeElapsed),
        errors: state.errors,
        date: new Date().toLocaleDateString("hu-HU")
    });
    list.sort((a, b) => a.errors - b.errors || a.time - b.time);
    board[state.level] = list.slice(0, 10);

    try {
        localStorage.setItem(BOARD_KEY, JSON.stringify(board));
    } catch (error) {
        showModal("Hiba", "Az eredményt nem sikerült elmenteni.");
    }
}

function changeSwitch(node) {
    const directions = state.edges.filter(e => e.from === node.id).map(e => e.direction);
    const index = directions.indexOf(node.activeTarget);
    node.activeTarget = directions[(index + 1) % directions.length];
}

document.querySelector("#btn-modal-ok").addEventListener("click", () => {
    modal.classList.add("hidden");
});

document.querySelector("#btn-start").addEventListener("click", () => {
    const name = document.querySelector("#player-name").value.trim();
    if (!name) {
        showModal("Hiba", "Kérlek, add meg a neved!");
        return;
    }

    state.player = name;
    if (startLevel(document.querySelector("#level-select").value)) {
        switchScreen("game-screen");
        startLoop();
    }
});

document.querySelector("#btn-leaderboard").addEventListener("click", () => {
    const levelId = document.querySelector("#level-select").value;
    const list = readBoard()[levelId] || [];
    let text = "Ezen a pályán még nincs eredmény.";

    if (list.length > 0) {
        text = list
            .map((r, i) => `${i + 1}. ${r.name} – ${formatTime(r.time)} – ${r.errors} hiba – ${r.date}`)
            .join("\n");
    }
    showModal("Dicsőséglista – " + levelsData[levelId].name, text);
});

pauseButton.addEventListener("click", () => {
    if (state.isGameOver) {
        return;
    }
    state.isRunning = !state.isRunning;
    updatePauseButton();
});

document.querySelector("#btn-reset").addEventListener("click", () => {
    startLevel(state.level);
});

document.querySelector("#btn-exit").addEventListener("click", () => {
    cancelAnimationFrame(animationFrameId);
    switchScreen("main-menu");
});

document.querySelector("#btn-save").addEventListener("click", () => {
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(state));
        showModal("Sikeres mentés", "A játékállás elmentve.");
    } catch (error) {
        showModal("Hiba", "A mentés nem sikerült.");
    }
});

document.querySelector("#btn-load").addEventListener("click", () => {
    try {
        const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
        if (!saved || !saved.nodes) {
            showModal("Hiba", "Nincs elmentett játékállás.");
            return;
        }
        Object.assign(state, saved);
    } catch (error) {
        showModal("Hiba", "A mentett játékállás sérült.");
        return;
    }

    updatePauseButton();
    switchScreen("game-screen");
    startLoop();
});

canvas.addEventListener("contextmenu", e => e.preventDefault());

canvas.addEventListener("mousedown", e => {
    if (!state.isRunning || state.isGameOver) {
        return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) * canvas.width) / rect.width;
    const y = ((e.clientY - rect.top) * canvas.height) / rect.height;

    if (e.button === 0) {
        const node = state.nodes.find(n => Math.hypot(n.x - x, n.y - y) < 25);
        if (node && node.type === "signal") {
            node.state = node.state === "green" ? "red" : "green";
        } else if (node && node.type === "switch") {
            changeSwitch(node);
        }
    } else if (e.button === 2) {
        const train = state.trains.find(t => t.isSpawned && !t.isFinished && !t.isCrashed
            && Math.hypot(t.x - x, t.y - y) < 30);
        if (train) {
            train.isBraking = !train.isBraking;
        }
    }
});

function triggerGameOver(reason) {
    state.isGameOver = true;
    state.isRunning = false;
    showModal("Game Over", reason);
}

function checkWinCondition() {
    if (state.score + state.errors === state.totalTrains) {
        state.isGameOver = true;
        state.isRunning = false;
        addResult();
        showModal(
            "Pálya teljesítve!",
            `Célba ért: ${state.score}, Hibák: ${state.errors}, Idő: ${formatTime(state.timeElapsed)}`
        );
    }
}

function updateTrain(train, deltaTime) {
    if (!train.isSpawned && state.timeElapsed >= train.spawnTime) {
        const startNode = findNode(train.currentNode);
        train.isSpawned = true;
        train.x = startNode.x;
        train.y = startNode.y;
    }

    if (!train.isSpawned || train.isFinished || train.isCrashed) {
        return;
    }

    train.isWaiting = false;
    if (train.isBraking) {
        return;
    }

    const from = findNode(train.currentNode);
    const to = findNode(train.targetNode);

    if (to.type === "signal" && to.state === "red" && train.progress >= 0.95) {
        train.isWaiting = true;
        return;
    }

    const length = Math.hypot(to.x - from.x, to.y - from.y);
    train.progress += (train.speed * deltaTime * 20) / length;

    if (train.progress < 1) {
        train.x = from.x + (to.x - from.x) * train.progress;
        train.y = from.y + (to.y - from.y) * train.progress;
        return;
    }

    train.progress = 0;
    train.currentNode = to.id;
    train.x = to.x;
    train.y = to.y;

    if (to.type === "station") {
        train.isFinished = true;
        if (train.color === to.color) {
            state.score++;
        } else {
            state.errors++;
        }
        checkWinCondition();
        return;
    }

    const nextEdge = to.type === "switch"
        ? state.edges.find(e => e.from === to.id && e.direction === to.activeTarget)
        : state.edges.find(e => e.from === to.id);

    if (nextEdge) {
        train.targetNode = nextEdge.to;
    } else {
        train.isCrashed = true;
        state.errors++;
        triggerGameOver("Kisiklás! Egy vonat nyitott vágányvégre futott.");
    }
}

function updateLogic(deltaTime) {
    if (!state.isRunning || state.isGameOver) {
        return;
    }

    state.timeElapsed += deltaTime;

    for (const train of state.trains) {
        updateTrain(train, deltaTime);
    }

    if (!state.isGameOver && checkCollisions()) {
        triggerGameOver("Katasztrófa! Két vonat összeütközött.");
    }
}

function gameLoop(timestamp) {
    try {
        const deltaTime = Math.max(0, Math.min((timestamp - lastTime) / 1000, 0.1));
        lastTime = timestamp;

        updateLogic(deltaTime);
        updateHUD(state);
        drawCanvas(ctx, state);

        animationFrameId = requestAnimationFrame(gameLoop);
    } catch (error) {
        state.isRunning = false;
        showModal("Hiba", "Váratlan hiba történt: " + error.message);
    }
}
