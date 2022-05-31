import {Ship} from './ship';

export class Gameboard {

    carrier = new Ship('carrier', 5);
    battleship = new Ship('battleship', 4);
    destroyer = new Ship('destroyer', 3);
    submarine = new Ship('submarine', 3);
    patrol = new Ship('patrol', 2);

    allShips = [];

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
        let index = 0;

        if(!ship.isVertical) {
            for (; index < ship.length; index++) {
                this.grid[x].fill(ship.name + index, y, ++y);
            }
            
        } else {
            for (let i = x; i < x + ship.length; i++) {
                this.grid[i].splice(y, 1, ship.name + index++);
            }
        }

        this.allShips.push(ship);
    }

    receiveAttack(x, y) {
        if (this.grid[x][y] === 0) {
            this.miss(x, y);
        } else {
            this.allShips.forEach(ship => {
                let hitShip = this.grid[x][y].slice(0, -1);
                let hitIndex = this.grid[x][y].slice(-1);

                if (ship.name === hitShip) {
                    ship.hit(hitIndex);
                    this.isSunk(ship);
                }
            });
        }

    }

    miss(x, y) {
        this.grid[x][y] = '-';
    }

    isSunk(ship) {
        ship.defense.every(el => {
            if (el === 'x') {
                ship.isOperational = false;
                this.isFleetSunk();
            }
        });
    }

    isFleetSunk() {
        let result = this.allShips.every(ship => {
            if (ship.isOperational === false) {
                return true;
            }
        });
        return result;
    }
}