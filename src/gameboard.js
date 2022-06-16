import { pubsub } from './pubsub';
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
        [0,0,0,0,0,0,0,0,0,0]
    ];

    placeShip(ship, x, y) {
        let index = 0;
        let space;

        if(!ship.isVertical) {
            for (; index < ship.length; index++) {
                space = this.grid[x].slice(y, y + ship.length);

                if (space.every(this.isZero)) {
                    this.grid[x].fill(ship.name + index, y, ++y);
                    ship.isPlaced = true;
                }
            }
            
        } else {
            space = [];
            for (let i = x; i < x + ship.length; i++) {
                let cell = this.grid[i][y];
                space.push(cell);
            }

            if (space.every(this.isZero))  {
                let n = 0;
                for (let j = x; j < x + ship.length; j++) {
                    this.grid[j].fill(ship.name + n, y, y+1);
                    n++;
                }
                ship.isPlaced = true;
            }
        }
    }

    rotateShip(ship) {
        if (ship.isVertical === false) {
            ship.isVertical = true;
        } else {ss
            ship.isVertical = false;
        }
    }

    isZero(num) {
        return num === 0;
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

            this.grid[x][y] = 'x';
        }
    }

    miss(x, y) {
        this.grid[x][y] = '-';
    }

    isSunk(ship) {
        ship.defense.every(el => {
            if (el === 'x') {
                ship.isOperational = false;
                console.log(`${ship.name} has been sunk`);
                this.isFleetSunk();
            }
        });
    }

    isFleetSunk() {
        let result = this.allShips.every(ship => {
            if (ship.isOperational === false) {
                console.log('fleet has been sunk')
                return true;
            }
        });
        return result;
    }
}