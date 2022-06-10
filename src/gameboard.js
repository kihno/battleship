import {Ship} from './ship';
import {game} from './gameLoop';

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
        let index = 0;
        let space;

        if(!ship.isVertical) {
            for (; index < ship.length; index++) {
                space = this.grid[x].slice(y, y + ship.length);

                if (space.every(this.isZero)) {
                    this.grid[x].fill(ship.name + index, y, ++y);
                } else {
                    if (ship.isVertical) {
                        ship.isVertical = false;
                    } else {
                        ship.isVertical = true;
                    }
                    x = game.generateCoordinate();
                    y = game.generateCoordinate();
                    this.placeShip(ship, x, y);
                }
            }
            
        } else {
            space = [];
            // for (let i = x; i < x + ship.length; i++) {
            //     let item = this.grid[i].slice(y, y + 1);
            //     space.concat(item);
            // }

            this.grid.forEach(row => {
                let cell = row.slice(y, y+1);
                space.concat(cell);
            })

            if (space.every(this.isZero))  {
                let n = 0;
                for (let j = x; j < x + ship.length; j++) {
                    this.grid[j].fill(ship.name + n, y, y+1);
                    n++;
                }

            } else {
                if (ship.isVertical) {
                    ship.isVertical = false;
                } else {
                    ship.isVertical = true;
                }
                x = game.generateCoordinate();
                y = game.generateCoordinate();
                this.placeShip(ship, x, y);
            }
        }
    }

    isZero(num) {
        if (num === 0) {
            return true;
        } else {
            return false;
        }
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