// ========================================
// GALAXION INFINITY
// Interface do jogador
// ========================================

import { RESOURCES, PLANETS, GAME_CONFIG } from "./config.js";

// Elementos da interface
const elements = {
    menu: document.getElementById("menu"),
    game: document.getElementById("game"),
    playerName: document.getElementById("player-name"),
    playButton: document.getElementById("play-button"),
    planetLabel: document.getElementById("planet-label"),
    clockLabel: document.getElementById("clock-label"),
    daysLabel: document.getElementById("days-label"),
    inventoryList: document.getElementById("inventory-list"),
    missionText: document.getElementById("mission-text"),
    missionProgress: document.getElementById("mission-progress"),
    missionCount: document.getElementById("mission-count"),
    craftButton: document.getElementById("craft-button"),
    saveButton: document.getElementById("save-button"),
    toast: document.getElementById("toast"),
    worldLabel: document.getElementById("world-label")
};

// ========================================
// MOSTRAR UMA MENSAGEM TEMPORÁRIA
// ========================================

let toastTimer;

export function showToast(message) {
    if (!elements.toast) return;

    elements.toast.textContent = message;
    elements.toast.classList.add("visible");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        elements.toast.classList.remove("visible");
    }, 2600);
}

// ========================================
// ABRIR O JOGO
// ========================================

export function showGame() {
    elements.menu?.classList.add("hidden");
    elements.game?.classList.remove("hidden");
}

// ========================================
// ATUALIZAR O NOME DO PLANETA
// ========================================

export function updatePlanetLabel(planetId) {
    const planet = PLANETS.find(item => item.id === planetId);

    if (!planet) return;

    if (elements.planetLabel) {
        elements.planetLabel.textContent = planet.name.toUpperCase();
    }

    if (elements.worldLabel) {
        elements.worldLabel.textContent =
            `${planet.name.toUpperCase()} • ${planet.biome.toUpperCase()}`;
    }
}

// ========================================
// ATUALIZAR O CICLO DE DIA E NOITE
// ========================================

export function updateClock(timeOfDay) {
    if (!elements.clockLabel) return;

    elements.clockLabel.textContent =
        timeOfDay < 0.25 || timeOfDay > 0.75 ? "NOITE" : "DIA";
}

// ========================================
// ATUALIZAR OS DIAS EXPLORADOS
// ========================================

export function updateDays(state) {
    if (!elements.daysLabel) return;

    elements.daysLabel.textContent =
        `Dias explorados: ${state.daysExplored}`;
}

// ========================================
// ATUALIZAR O INVENTÁRIO
// ========================================

export function renderInventory(state) {
    if (!elements.inventoryList) return;

    elements.inventoryList.innerHTML = "";

    for (const resource of RESOURCES) {
        const amount = state.inventory[resource.id] || 0;

        const row = document.createElement("div");
        row.className = "inventory-row";

        const name = document.createElement("span");
        name.className = "inventory-name";
        name.textContent = resource.label;

        const quantity = document.createElement("span");
        quantity.className = "inventory-amount";
        quantity.textContent = amount;

        const symbol = document.createElement("span");
        symbol.className = "inventory-symbol";
        symbol.style.color = `#${resource.color.toString(16).padStart(6, "0")}`;
        symbol.textContent = "◆";

        row.append(symbol, name, quantity);
        elements.inventoryList.appendChild(row);
    }
}

// ========================================
// ATUALIZAR A MISSÃO INICIAL
// ========================================

export function updateMission(state) {
    const target = GAME_CONFIG.missionTarget;
    const collected = Math.min(state.collectedPedrinhas, target);
    const percentage = (collected / target) * 100;

    if (elements.missionProgress) {
        elements.missionProgress.style.width = `${percentage}%`;
    }

    if (elements.missionCount) {
        elements.missionCount.textContent = `${collected} / ${target}`;
    }

    if (!elements.missionText) return;

    if (collected >= target) {
        elements.missionText.textContent =
            "Missão concluída! Continue explorando Verdália.";
    } else {
        elements.missionText.textContent =
            `Explore Verdália e colete ${target} Pedrinhas.`;
    }
}

// ========================================
// CONFIGURAR BOTÃO DE FABRICAÇÃO
// ========================================

export function setCraftButtonEnabled(enabled) {
    if (!elements.craftButton) return;

    elements.craftButton.disabled = !enabled;
}

// ========================================
// CONFIGURAR BOTÃO DE JOGO
// ========================================

export function setPlayButtonEnabled(enabled) {
    if (!elements.playButton) return;

    elements.playButton.disabled = !enabled;
}

// ========================================
// ATUALIZAR TODA A INTERFACE
// ========================================

export function updateInterface(state) {
    updatePlanetLabel(state.currentPlanet);
    updateDays(state);
    renderInventory(state);
    updateMission(state);
}

// ========================================
// CONECTAR BOTÕES BÁSICOS
// ========================================

export function connectBasicButtons(callbacks) {
    elements.playButton?.addEventListener("click", () => {
        const name = elements.playerName?.value.trim() || "Explorador";

        callbacks.onPlay?.(name);
    });

    elements.saveButton?.addEventListener("click", () => {
        callbacks.onSave?.();
    });

    elements.craftButton?.addEventListener("click", () => {
        callbacks.onCraft?.();
    });
}
