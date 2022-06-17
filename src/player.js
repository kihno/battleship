import { Gameboard } from './gameboard';

export class Player {

    constructor(name) {
        this.name = name;
    }

    fleet = new Gameboard;

    attack(enemy, x, y) {
        enemy.fleet.receiveAttack(enemy, x, y);
    }

    aiAttack(enemy) {
        let coordinates = this.getCoordinates();

        if (enemy.fleet.grid[coordinates[0]][coordinates[1]] === 0) {
            enemy.fleet.receiveAttack(enemy, [coordinates[0]], [coordinates[1]]);
        } else {
            this.aiAttack(enemy);
        }
    }

    getCoordinates() {
        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);

        return [x, y];
    }
}