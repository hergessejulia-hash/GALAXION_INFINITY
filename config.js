// ========================================
// GALAXION INFINITY
// Configurações principais do jogo
// ========================================

export const GAME_CONFIG = {
    title: "GALAXION INFINITY",

    startingPlanet: "verdalia",

    missionTarget: 3,

    dayLengthSeconds: 360,

    playerSpeed: 6,

    jumpVelocity: 7,

    gravity: 18
};

// ========================================
// RECURSOS DO UNIVERSO
// ========================================

export const RESOURCES = [
    {
        id: "pedrinhas",
        label: "Pedrinhas",
        color: 0xb4c3d6
    },
    {
        id: "esmeraldas",
        label: "Esmeraldas",
        color: 0x42ff9b
    },
    {
        id: "safiras",
        label: "Safiras",
        color: 0x4c8dff
    },
    {
        id: "ametistas",
        label: "Ametistas",
        color: 0xb86cff
    },
    {
        id: "rubis",
        label: "Rubis",
        color: 0xff4f73
    },
    {
        id: "diamantesEstelares",
        label: "Diamantes Estelares",
        color: 0xe9f6ff
    },
    {
        id: "nucleosGalacticos",
        label: "Núcleos Galácticos",
        color: 0xffa8ff
    },
    {
        id: "opalas",
        label: "Opalas",
        color: 0x61fff2
    },
    {
        id: "cosmita",
        label: "Cosmita",
        color: 0xfff3ff
    },
    {
        id: "nexars",
        label: "Nexars",
        color: 0xffd86b
    }
];

// ========================================
// OS 12 PLANETAS
// ========================================

export const PLANETS = [
    {
        id: "verdalia",
        name: "Verdália",
        biome: "Florestas gigantes e rios",
        color: 0x4a9b62,
        unlock: 0
    },
    {
        id: "glacius",
        name: "Glacius",
        biome: "Geleiras e montanhas de gelo",
        color: 0x83dfff,
        unlock: 1
    },
    {
        id: "ignis",
        name: "Ignis",
        biome: "Vulcões e rios de lava",
        color: 0xff623e,
        unlock: 2
    },
    {
        id: "aquaria",
        name: "Aquária",
        biome: "Oceanos e recifes",
        color: 0x279dff,
        unlock: 3
    },
    {
        id: "mycora",
        name: "Mycora",
        biome: "Florestas de cogumelos gigantes",
        color: 0xc47bff,
        unlock: 4
    },
    {
        id: "umbra",
        name: "Umbra",
        biome: "Terras misteriosas e sombrias",
        color: 0x50456f,
        unlock: 5
    },
    {
        id: "prismara",
        name: "Prismara",
        biome: "Cristais coloridos",
        color: 0xff7ce8,
        unlock: 6
    },
    {
        id: "nebula",
        name: "Nébula",
        biome: "Ilhas flutuantes",
        color: 0x9e9dff,
        unlock: 7
    },
    {
        id: "solaria",
        name: "Solária",
        biome: "Desertos e dunas",
        color: 0xffc46b,
        unlock: 8
    },
    {
        id: "cristallis",
        name: "Cristallis",
        biome: "Cavernas de cristal",
        color: 0x65fff0,
        unlock: 9
    },
    {
        id: "mechanis",
        name: "Mechanis",
        biome: "Ruínas e estruturas mecânicas",
        color: 0xaab5c9,
        unlock: 10
    },
    {
        id: "eternia",
        name: "Eternia",
        biome: "Mistérios cósmicos",
        color: 0xc8a0ff,
        unlock: 11
    }
];

// ========================================
// RECEITAS DE FABRICAÇÃO
// ========================================

export const RECIPES = {
    lanterna: {
        label: "Lanterna",

        costs: {
            pedrinhas: 5,
            opalas: 3
        }
    },

    ferramentaBasica: {
        label: "Ferramenta Básica",

        costs: {
            pedrinhas: 4,
            esmeraldas: 1
        }
    },

    cristalDecorativo: {
        label: "Cristal Decorativo",

        costs: {
            ametistas: 2,
            opalas: 2
        }
    }
};

// ========================================
// CONTROLES DO JOGADOR
// ========================================

export const PLAYER_CONTROLS = {
    forward: ["KeyW", "ArrowUp"],
    backward: ["KeyS", "ArrowDown"],
    left: ["KeyA", "ArrowLeft"],
    right: ["KeyD", "ArrowRight"],
    jump: ["Space"],
    collect: ["KeyE"]
};
