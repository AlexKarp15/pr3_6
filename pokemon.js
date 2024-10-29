export class Pokemon {
    constructor(pokemonData, isHero = true, isEnemy = false) {
        this.name = pokemonData.name;
        this.health = pokemonData.hp;
        this.maxHealth = pokemonData.hp;
        this.attacks = pokemonData.attacks;
        this.isHero = isHero;
        this.isEnemy = isEnemy; // Новый параметр
        this.sprite = pokemonData.img;
    }
    updateHealth() {
        const healthPercentage = (this.health / this.maxHealth) * 100;
        const progressBar = document.getElementById(this.isEnemy ? "progressbar-enemy" : "progressbar-character");
        const healthText = document.getElementById(this.isEnemy ? "health-enemy" : "health-character");

        // Установка ширины полосы здоровья
        progressBar.style.width = healthPercentage + "%";
        healthText.textContent = `${this.health} / ${this.maxHealth}`;

        // Сброс классов
        progressBar.classList.remove("low", "critical");

        // Условия для добавления классов
        if (this.health < 20) {
            progressBar.classList.add("critical");
        } else if (this.health < 60) {
            progressBar.classList.add("low");
        }
    }
}
