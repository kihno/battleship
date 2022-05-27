import {Ship} from './ship';

export class Gameboard {

    carrier = new Ship('carrier', 5);
    battleship = new Ship('battleship', 4);
    destroyer = new Ship('destroyer', 3);
    submarine = new Ship('submarine', 3);
    patrol = new Ship('patrol', 2);

    allShips = [this.carrier, this.battleship, this.destroyer, this.submarine, this.patrol];

    grid = [
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0]
    ];

    placeShip(ship, x, y) {
        if(!ship.isVertical) {
            this.grid[x].fill(ship.name, y, y + ship.length);
        } else {
            for (let i = x; i < x + ship.length; i++) {
                this.grid[i].splice(y, 1, ship.name);
            }
        }
    }

    receiveAttack(x, y) {
        if (this.grid[x][y] === 0) {
            this.miss(x, y);
        } else {
            this.allShips.forEach(ship => {
                if (ship.name === this.grid[x][y]) {
                    ship.hit();
                }
            });
        }

    }

    miss(x, y) {
        this.grid[x][y] = '-';
    }
}