export class Ship {
    isVertical = false;
    isOperational = true;
    isPlaced = false;

    constructor(name, length) {
        this.name = name;
        this.length = length;
        this.defense = this.buildShip();
    }

    buildShip() {
        let array = [];

        for (let i = 0; i < this.length; i++) {
            array.push('o');
        }
        return array;
    }

    hit(index) {
        this.defense.splice(index, 1, 'x');
    }

    isSunk() {
        return !this.isOperational;
    }

}