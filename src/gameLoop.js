import { Player } from './player';
import { pubsub } from './pubsub';

export const game = (() => {

    let p1;
    let p2;

    pubsub.sub('newGame', createGame);
    pubsub.sub('missileLaunched', missileStrike);
    pubsub.sub('rotateShip', rotateShip);
    pubsub.sub('shipPlaced', placePlayerShips);

    function createGame() {
        p1 = new Player('user');
        p2 = new Player('computer');

        const players = {
            p1,
            p2,
        }

        placeComputerShips(p2);

        pubsub.pub('gameCreated', players);

        return p2;
    }

    function rotateShip(shipName) {
        p1.fleet.allShips.forEach(ship => {
            if (ship.name === shipName) {
                ship.isVertical = !ship.isVertical;
            }
        });
    }

    function missileStrike(coordinates) {
        p1.attack(p2, coordinates[0], coordinates[1]);

        let location = p2.fleet.grid[coordinates[0]][coordinates[1]];
        pubsub.pub('missileStrike', [coordinates[2], location]);

        if (p2.fleet.isFleetOperational) {
            computerStrikesBack();
        }
    }

    function computerStrikesBack() {
        let x = generateCoordinate();
        let y = generateCoordinate();

        if (p1.fleet.grid[x][y] !== 'x' && p1.fleet.grid[x][y] !== '-') {
            p2.attack(p1, x, y);
            pubsub.pub('strikeBack', [p1, x, y]);
        } else {
            computerStrikesBack();
        }
    }

    function placePlayerShips(cell) {
        let targetShip;

        p1.fleet.allShips.forEach(ship => {
            if (cell.dataset.value === ship.name) {
                targetShip = ship;
            }
        });

        let x = parseInt(cell.dataset.x);
        let y = parseInt(cell.dataset.y);

        p1.fleet.placeShip(targetShip, x, y);
    }

    function placeComputerShips(player) {
        player.fleet.allShips.forEach(ship => {
            while (!ship.isPlaced) {
                let position = [true, false];
                ship.isVertical = position[Math.floor(Math.random()*position.length)];
                let x = generateCoordinate(ship.length);
                let y = generateCoordinate(ship.length);
    
                player.fleet.placeShip(ship, x, y);
            }
        });
        console.log(player.fleet.grid);
    }

    function generateCoordinate(length) {
        let num = Math.floor(Math.random() * 10);
        let maxLength = length || 1;

        if (num > 10 - maxLength) {
            num = 10 - maxLength;
        }

        return num;
    }
    
})();