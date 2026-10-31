


import { GAME_CONFIG, RECIPES } from "./config.js";

import {
    createInitialState,
    saveGame,
    loadGame,
    addResource,
    hasResources,
    removeResources,
    registerCraftedItem
} from "./state.js";

import {
    createWorld,
    getNearbyCrystal,
    collectCrystal,
    enableMouseLook
} from "./world.js";

import {
    showToast,
    showGame,
    updateInterface,
    connectBasicButtons,
    setCraftButtonEnabled
} from "./ui.js";

let gameState = loadGame() || createInitialState();

let gameStarted = false;
let collectCooldown = false;

// Inicializa o jogo
function initializeGame() {
    const canvas = document.getElementById("game-canvas");

    if (!canvas) {
        console.error("Não foi possível encontrar o canvas do jogo.");
        return;
    }

    try {
        createWorld(canvas);

        connectBasicButtons({
            onPlay: startGame,
            onSave: saveCurrentGame,
            onCraft: craftLantern
        });

        updateInterface(gameState);

        setCraftButtonEnabled(
            hasResources(gameState, RECIPES.lanterna.costs)
        );

        console.log("GALAXION INFINITY foi inicializado!");
    } catch (error) {
        console.error("Erro ao inicializar o jogo:", error);
        showToast("Ocorreu um erro ao carregar o universo.");
    }
}

// Inicia a exploração
function startGame(playerName) {
    if (gameStarted) return;

    gameStarted = true;
    gameState.playerName = playerName || "Explorador";

    showGame();
    updateInterface(gameState);

    showToast(`Bem-vindo a Verdália, ${gameState.playerName}!`);

    enableMouseLook();
}

// Salva o progresso
function saveCurrentGame() {
    const success = saveGame(gameState);

    if (success) {
        showToast("Progresso salvo com sucesso!");
    } else {
        showToast("Não foi possível salvar o progresso.");
    }
}

// Fabrica uma lanterna
function craftLantern() {
    const recipe = RECIPES.lanterna;

    if (gameState.lanternCrafted) {
        showToast("Você já fabricou uma lanterna!");
        return;
    }

    if (!hasResources(gameState, recipe.costs)) {
        showToast("Você ainda não tem os materiais necessários.");
        return;
    }

    const removed = removeResources(gameState, recipe.costs);

    if (!removed) {
        showToast("Não foi possível fabricar a lanterna.");
        return;
    }

    registerCraftedItem(gameState, "lanterna");

    updateInterface(gameState);

    setCraftButtonEnabled(
        hasResources(gameState, RECIPES.lanterna.costs)
    );

    saveGame(gameState);

    showToast("Lanterna fabricada com sucesso!");
}

// Coleta um recurso próximo
function collectNearbyResource() {
    if (!gameStarted || collectCooldown) return;

    const crystal = getNearbyCrystal();

    if (!crystal) {
        showToast("Nenhum cristal por perto. Explore a região!");
        return;
    }

    const resourceId = collectCrystal(crystal);

    if (!resourceId) return;

    addResource(gameState, resourceId, 1);

    updateInterface(gameState);

    setCraftButtonEnabled(
        hasResources(gameState, RECIPES.lanterna.costs)
    );

    showToast("Recurso coletado!");

    collectCooldown = true;

    setTimeout(() => {
        collectCooldown = false;
    }, 350);
}

// Tecla E: coletar recursos
window.addEventListener("keydown", event => {
    if (event.code === "KeyE") {
        collectNearbyResource();
    }
});

// Tecla K: salvar o jogo
window.addEventListener("keydown", event => {
    if (event.code === "KeyK" && !event.repeat) {
        saveCurrentGame();
    }
});

// Ciclo de dias do jogo
setInterval(() => {
    if (!gameStarted) return;

    gameState.totalPlayTime += 1;

    if (
        gameState.totalPlayTime > 0 &&
        gameState.totalPlayTime % GAME_CONFIG.dayLengthSeconds === 0
    ) {
        gameState.daysExplored += 1;

        updateInterface(gameState);

        showToast("Um novo dia começou em Verdália!");
    }
}, 1000);

// Aguarda o HTML carregar
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeGame);
} else {
    initializeGame();
}
