import { Pokemon } from "./pokemon.js";
import { pokemons } from "./pokemons.js";

class Game {
    constructor() {
        this.player1 = null;
        this.player2 = null;
        this.currentEnemyIndex = 0;
        this.enemiesList = [];
        this.setupGame();
    }
    setupGame() {
        this.player1 = new Pokemon(this.getRandomPokemon(), true); // Игрок
        this.player2 = new Pokemon(this.getRandomPokemon(), false, true); // Противник
        this.createEnemies();
        this.updateUI();
        this.setupAttackButtons();
    }

    // Get a random Pokémon from the list
    getRandomPokemon() {
        return pokemons[Math.floor(Math.random() * pokemons.length)];
    }

    // Create enemies for the game
    createEnemies() {
        this.enemiesList = [
            new Pokemon(this.getRandomPokemon(), false, true),
            new Pokemon(this.getRandomPokemon(), false, true),
            new Pokemon(this.getRandomPokemon(), false, true),
        ];
    }
    // Update UI with current Pokémon stats
    updateUI() {
        this.updatePlayerDisplay();
        this.updateEnemyDisplay();
    }

    // Display Player 1 information
    updatePlayerDisplay() {
        if (this.player1) {
            document.getElementById("name-player1").textContent = this.player1.name;
            document.getElementById("sprite-player1").src = this.player1.sprite;
            this.player1.updateHealth();
        }
    }

    // Display current enemy information
    updateEnemyDisplay() {
        const enemy = this.enemiesList[this.currentEnemyIndex];
        if (enemy) {
            document.getElementById("name-player2").textContent = enemy.name;
            document.getElementById("sprite-player2").src = enemy.sprite;
            enemy.updateHealth();
        }
    }

    // Setup attack buttons based on Player 1's attacks
    setupAttackButtons() {
        const controlDiv = document.querySelector(".control");
        controlDiv.innerHTML = ""; // Clear previous buttons

        if (this.player1.attacks) { // Check if attacks are defined
            this.player1.attacks.forEach(attack => {
                const button = document.createElement("button");
                button.className = "button";
                button.textContent = attack.name;
                button.onclick = () => this.handleAttack(attack);
                controlDiv.appendChild(button);
            });
        } else {
            console.error("Player 1 has no attacks defined.");
        }
    }
    generateLog(attackerName, targetName, damage, remainingHealth) {
        return `${attackerName} attacks ${targetName} for ${damage} damage. ${targetName} has ${remainingHealth} health remaining.`;
    }

    // Add log message to the UI
    // Додати новий лог в початок списку
    addLog(logMessage) {
        const logContainer = document.getElementById("log");
        if (!logContainer) {
            console.error("Log container not found!");
            return;
        }
        const logEntry = document.createElement("div");
        logEntry.textContent = logMessage;
        logContainer.prepend(logEntry); // Використовуємо prepend для вставки в початок
}


    // Update handleAttack method    // Update handleAttack method
    handleAttack(attack) {
        if (attack.maxCount > 0) {
            attack.maxCount--;
            const damage = Math.floor(Math.random() * (attack.maxDamage - attack.minDamage + 1)) + attack.minDamage;
            this.player2.health -= damage;
            const logMessage = this.generateLog(this.player1.name, this.player2.name, damage, this.player2.health);
            this.addLog(logMessage);
            this.player2.updateHealth();

            // Check if the enemy is defeated
            if (this.player2.health <= 0) {
                this.addLog(`${this.player1.name} defeated ${this.player2.name}! A new opponent appears!`);
                this.currentEnemyIndex++;
                if (this.currentEnemyIndex < this.enemiesList.length) {
                    this.player2 = this.enemiesList[this.currentEnemyIndex];
                    this.player2.health = this.player2.maxHealth;
                    this.updateEnemyDisplay();
                } else {
                    alert(`${this.player1.name} has defeated all opponents! You win!`);
                    this.resetGame();
                }
            } else {
                // Attack the player after the enemy is defeated
                this.enemyAttack();
            }
        } else {
            this.addLog(`Attack ${attack.name} is out of uses!`);
        }
    }
    enemyAttack() {
        const enemyAttack = this.player2.attacks[Math.floor(Math.random() * this.player2.attacks.length)];
        const damage = Math.floor(Math.random() * (enemyAttack.maxDamage - enemyAttack.minDamage + 1)) + enemyAttack.minDamage;
        this.player1.health -= damage;
        const logMessage = this.generateLog(this.player2.name, this.player1.name, damage, this.player1.health);
        this.addLog(logMessage);
        this.player1.updateHealth(); 
        this.player2.updateHealth();
        if (this.player1.health <= 0) {
            alert(`${this.player1.name} has been defeated! Game Over!`);
            this.resetGame();
        }
    }
    resetGame() {
        this.player1 = new Pokemon(this.getRandomPokemon());
        this.currentEnemyIndex = 0;
        this.createEnemies();
        this.player2 = this.enemiesList[this.currentEnemyIndex]; // Встановлюємо правильного ворога
        this.updateUI();
        this.setupAttackButtons();
        clearLogs();
        this.attachEventListeners();
    }

    attachEventListeners() {
        const kickButton = document.getElementById('btn-kick');
        if (kickButton) {
            kickButton.onclick = () => {
                this.handleAttack();
            };
        } else {
            console.error("Kick button not found!");
        }
    }
}
function clearLogs() {
    const logContainer = document.getElementById('log'); 
    if (logContainer) {
        logContainer.innerHTML = ''; 
    } else {
        console.error("Log container not found!");
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});