import { levelsData } from "./state.js";

export function formatTime(seconds) {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(Math.floor(seconds % 60)).padStart(2, "0");
    return `${min}:${sec}`;
}

function findNode(state, id) {
    const node = state.nodes.find(n => n.id === id);
    if (!node) {
        throw new Error("Hiányzó csomópont: " + id);
    }
    return node;
}

export function updateHUD(state) {
    const level = levelsData[state.level];

    document.querySelector("#hud-name").textContent = state.player;
    document.querySelector("#hud-level").textContent = level ? level.name : state.level;
    document.querySelector("#hud-time").textContent = formatTime(state.timeElapsed);
    document.querySelector("#hud-score").textContent = `${state.score} / ${state.totalTrains}`;
    document.querySelector("#hud-errors").textContent = state.errors;
}

function drawSwitch(ctx, state, node) {
    ctx.fillStyle = "#0ea5e9";
    ctx.beginPath();
    ctx.arc(node.x, node.y, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(node.x, node.y);
    const edge = state.edges.find(e => e.from === node.id && e.direction === node.activeTarget);
    if (edge) {
        const target = findNode(state, edge.to);
        const angle = Math.atan2(target.y - node.y, target.x - node.x);
        ctx.lineTo(node.x + Math.cos(angle) * 15, node.y + Math.sin(angle) * 15);
    }
    ctx.stroke();
}

function drawSignal(ctx, node) {
    const isGreen = node.state === "green";

    ctx.fillStyle = "#111827";
    ctx.fillRect(node.x - 12, node.y - 25, 24, 50);

    ctx.fillStyle = isGreen ? "#450a0a" : "#ef4444";
    ctx.beginPath();
    ctx.arc(node.x, node.y - 11, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = isGreen ? "#10b981" : "#052e16";
    ctx.beginPath();
    ctx.arc(node.x, node.y + 11, 8, 0, Math.PI * 2);
    ctx.fill();
}

function drawStation(ctx, node) {
    ctx.fillStyle = node.color;
    ctx.fillRect(node.x, node.y - 30, 40, 60);

    if (node.label) {
        ctx.fillStyle = "white";
        ctx.font = "bold 22px Arial";
        ctx.textAlign = "center";
        ctx.fillText(node.label, node.x + 20, node.y + 8);
    }
}

function drawExplosion(ctx, x, y) {
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    for (let i = 0; i < 16; i++) {
        const radius = i % 2 === 0 ? 30 : 15;
        const angle = (Math.PI * 2 * i) / 16;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        if (i === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }
    ctx.closePath();
    ctx.fill();
}

function drawTrain(ctx, state, train) {
    if (train.isCrashed) {
        drawExplosion(ctx, train.x, train.y);
        return;
    }

    if (train.inDanger) {
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.arc(train.x, train.y, 38 + Math.sin(state.timeElapsed * 8) * 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    ctx.translate(train.x, train.y);
    ctx.fillStyle = train.color;
    ctx.fillRect(-20, -10, 40, 20);

    if (train.isWaiting) {
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 3;
        ctx.strokeRect(-22, -12, 44, 24);
        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 14px Arial";
        ctx.fillText("TILOS", -20, 28);
    }

    if (train.isBraking) {
        ctx.fillStyle = "#fbbf24";
        ctx.font = "14px Arial";
        ctx.fillText("FÉK", -12, -15);
    }
}

export function drawCanvas(ctx, state) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.lineWidth = 6;
    ctx.strokeStyle = "#475569";
    for (const edge of state.edges) {
        const from = findNode(state, edge.from);
        const to = findNode(state, edge.to);
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
    }

    for (const node of state.nodes) {
        ctx.save();
        if (node.type === "switch") {
            drawSwitch(ctx, state, node);
        } else if (node.type === "signal") {
            drawSignal(ctx, node);
        } else if (node.type === "station") {
            drawStation(ctx, node);
        }
        ctx.restore();
    }

    for (const train of state.trains) {
        if (train.isSpawned && !train.isFinished) {
            ctx.save();
            drawTrain(ctx, state, train);
            ctx.restore();
        }
    }
}
