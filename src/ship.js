export class Ship {
    
    constructor(length) {
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
        if (this.defense.includes('o')) {
            return false;
        } else {
            return true;
        }
    }

}