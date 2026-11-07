export const state = {
    player: "",
    level: 1,
    timeElapsed: 0,
    isRunning: false,
    isGameOver: false,
    score: 0,
    errors: 0,
    totalTrains: 0,
    nodes: [],
    edges: [],
    trains: []
};

export const levelsData = {
    1: {
        name: "Kitérő vágány jelzőkkel (Könnyű)",
        totalTrains: 4,
        nodes: [
            { id: "start", x: 50, y: 300, type: "entry" },
            { id: "signal1", x: 250, y: 300, type: "signal", state: "green" },
            { id: "switch1", x: 400, y: 300, type: "switch", activeTarget: "top" },
            { id: "signal2", x: 550, y: 200, type: "signal", state: "red" },
            { id: "signal3", x: 550, y: 400, type: "signal", state: "red" },
            { id: "switch2", x: 680, y: 400, type: "switch", activeTarget: "main" },
            { id: "junction1", x: 760, y: 200, type: "junction" },
            { id: "endTop", x: 900, y: 200, type: "station", color: "red" },
            { id: "endBottom", x: 900, y: 400, type: "station", color: "blue" }
        ],
        edges: [
            { from: "start", to: "signal1" },
            { from: "signal1", to: "switch1" },
            { from: "switch1", to: "signal2", direction: "top" },
            { from: "switch1", to: "signal3", direction: "bottom" },
            { from: "signal2", to: "junction1" },
            { from: "junction1", to: "endTop" },
            { from: "signal3", to: "switch2" },
            { from: "switch2", to: "endBottom", direction: "main" },
            { from: "switch2", to: "junction1", direction: "siding" }
        ],
        trainsConfig: [
            { id: 1, spawnTime: 2, color: "red", speed: 2, start: "start", next: "signal1" },
            { id: 2, spawnTime: 8, color: "blue", speed: 2, start: "start", next: "signal1" },
            { id: 3, spawnTime: 15, color: "red", speed: 2.5, start: "start", next: "signal1" },
            { id: 4, spawnTime: 22, color: "blue", speed: 1.5, start: "start", next: "signal1" }
        ]
    },

    2: {
        name: "Rendező-pályaudvar (Közepes)",
        totalTrains: 5,
        nodes: [
            { id: "entryA", x: 50, y: 150, type: "entry" },
            { id: "entryB", x: 50, y: 450, type: "entry" },
            { id: "signalA", x: 180, y: 150, type: "signal", state: "green" },
            { id: "signalB", x: 180, y: 450, type: "signal", state: "green" },
            { id: "switchA", x: 320, y: 150, type: "switch", activeTarget: "straight" },
            { id: "switchB", x: 320, y: 450, type: "switch", activeTarget: "straight" },
            { id: "signalTop", x: 480, y: 150, type: "signal", state: "red" },
            { id: "signalBot", x: 480, y: 450, type: "signal", state: "red" },
            { id: "mid", x: 480, y: 300, type: "junction" },
            { id: "switchC", x: 620, y: 300, type: "switch", activeTarget: "straight" },
            { id: "junctionT", x: 760, y: 150, type: "junction" },
            { id: "junctionB", x: 760, y: 450, type: "junction" },
            { id: "endTop", x: 900, y: 150, type: "station", color: "red" },
            { id: "endMid", x: 900, y: 300, type: "station", color: "green" },
            { id: "endBottom", x: 900, y: 450, type: "station", color: "blue" }
        ],
        edges: [
            { from: "entryA", to: "signalA" },
            { from: "signalA", to: "switchA" },
            { from: "switchA", to: "signalTop", direction: "straight" },
            { from: "switchA", to: "mid", direction: "cross" },
            { from: "signalTop", to: "junctionT" },
            { from: "junctionT", to: "endTop" },

            { from: "entryB", to: "signalB" },
            { from: "signalB", to: "switchB" },
            { from: "switchB", to: "signalBot", direction: "straight" },
            { from: "switchB", to: "mid", direction: "cross" },
            { from: "signalBot", to: "junctionB" },
            { from: "junctionB", to: "endBottom" },

            { from: "mid", to: "switchC" },
            { from: "switchC", to: "endMid", direction: "straight" },
            { from: "switchC", to: "junctionT", direction: "up" },
            { from: "switchC", to: "junctionB", direction: "down" }
        ],
        trainsConfig: [
            { id: 1, spawnTime: 2, color: "red", speed: 2, start: "entryA", next: "signalA" },
            { id: 2, spawnTime: 5, color: "blue", speed: 2.5, start: "entryB", next: "signalB" },
            { id: 3, spawnTime: 12, color: "green", speed: 1.5, start: "entryA", next: "signalA" },
            { id: 4, spawnTime: 18, color: "green", speed: 2, start: "entryB", next: "signalB" },
            { id: 5, spawnTime: 24, color: "blue", speed: 3, start: "entryA", next: "signalA" }
        ]
    },

    3: {
        name: "Fejpályaudvari csúcsforgalom (Nehéz)",
        totalTrains: 6,
        nodes: [
            { id: "entryA", x: 50, y: 150, type: "entry" },
            { id: "entryB", x: 50, y: 450, type: "entry" },
            { id: "signalA", x: 170, y: 150, type: "signal", state: "green" },
            { id: "signalB", x: 170, y: 450, type: "signal", state: "green" },
            { id: "switchA", x: 300, y: 150, type: "switch", activeTarget: "straight" },
            { id: "switchB", x: 300, y: 450, type: "switch", activeTarget: "straight" },
            { id: "signalX1", x: 355, y: 225, type: "signal", state: "red" },
            { id: "signalX2", x: 355, y: 375, type: "signal", state: "red" },
            { id: "junctionT", x: 520, y: 150, type: "junction" },
            { id: "junctionB", x: 520, y: 450, type: "junction" },
            { id: "signalT", x: 620, y: 150, type: "signal", state: "green" },
            { id: "signalBt", x: 620, y: 450, type: "signal", state: "green" },
            { id: "switchC", x: 720, y: 150, type: "switch", activeTarget: "up" },
            { id: "switchD", x: 720, y: 450, type: "switch", activeTarget: "up" },
            { id: "platform1", x: 900, y: 90, type: "station", color: "red", label: "1" },
            { id: "platform2", x: 900, y: 210, type: "station", color: "blue", label: "2" },
            { id: "platform3", x: 900, y: 390, type: "station", color: "green", label: "3" },
            { id: "platform4", x: 900, y: 510, type: "station", color: "orange", label: "4" }
        ],
        edges: [
            { from: "entryA", to: "signalA" },
            { from: "signalA", to: "switchA" },
            { from: "switchA", to: "junctionT", direction: "straight" },
            { from: "switchA", to: "signalX1", direction: "cross" },
            { from: "signalX1", to: "junctionB" },

            { from: "entryB", to: "signalB" },
            { from: "signalB", to: "switchB" },
            { from: "switchB", to: "junctionB", direction: "straight" },
            { from: "switchB", to: "signalX2", direction: "cross" },
            { from: "signalX2", to: "junctionT" },

            { from: "junctionT", to: "signalT" },
            { from: "signalT", to: "switchC" },
            { from: "switchC", to: "platform1", direction: "up" },
            { from: "switchC", to: "platform2", direction: "down" },

            { from: "junctionB", to: "signalBt" },
            { from: "signalBt", to: "switchD" },
            { from: "switchD", to: "platform3", direction: "up" },
            { from: "switchD", to: "platform4", direction: "down" }
        ],
        trainsConfig: [
            { id: 1, spawnTime: 2, color: "red", speed: 2.5, start: "entryA", next: "signalA" },
            { id: 2, spawnTime: 4, color: "orange", speed: 2, start: "entryB", next: "signalB" },
            { id: 3, spawnTime: 8, color: "green", speed: 2, start: "entryA", next: "signalA" },
            { id: 4, spawnTime: 11, color: "blue", speed: 3, start: "entryB", next: "signalB" },
            { id: 5, spawnTime: 14, color: "blue", speed: 1.5, start: "entryA", next: "signalA" },
            { id: 6, spawnTime: 17, color: "green", speed: 2.5, start: "entryB", next: "signalB" }
        ]
    }
};

export function loadLevel(levelId) {
    const data = levelsData[levelId];
    if (!data) {
        throw new Error("Ismeretlen pálya: " + levelId);
    }

    state.level = Number(levelId);
    state.nodes = JSON.parse(JSON.stringify(data.nodes));
    state.edges = JSON.parse(JSON.stringify(data.edges));
    state.totalTrains = data.totalTrains;
    state.trains = [];
    state.timeElapsed = 0;
    state.score = 0;
    state.errors = 0;
    state.isRunning = true;
    state.isGameOver = false;

    for (const t of data.trainsConfig) {
        state.trains.push({
            id: t.id,
            spawnTime: t.spawnTime,
            color: t.color,
            speed: t.speed,
            currentNode: t.start,
            targetNode: t.next,
            progress: 0,
            isSpawned: false,
            isFinished: false,
            isBraking: false,
            isCrashed: false,
            isWaiting: false,
            inDanger: false,
            x: 0,
            y: 0
        });
    }
}

export const DANGER_DISTANCE = 75;
export const CRASH_DISTANCE = 40;

export function findNode(id) {
    return state.nodes.find(n => n.id === id);
}

export function checkCollisions() {
    const active = state.trains.filter(t => t.isSpawned && !t.isFinished && !t.isCrashed);
    let crashed = false;

    for (const train of active) {
        train.inDanger = false;
    }

    for (let i = 0; i < active.length; i++) {
        for (let j = i + 1; j < active.length; j++) {
            const a = active[i];
            const b = active[j];
            const dist = Math.hypot(a.x - b.x, a.y - b.y);

            if (dist < CRASH_DISTANCE) {
                a.isCrashed = true;
                b.isCrashed = true;
                a.inDanger = false;
                b.inDanger = false;
                crashed = true;
            } else if (dist < DANGER_DISTANCE) {
                a.inDanger = true;
                b.inDanger = true;
            }
        }
    }

    return crashed;
}
