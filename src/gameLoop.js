import { Player } from './player';
import { pubsub } from './pubsub';

export const game = (() => {

    let p1;
    let p2;

    pubsub.sub('newGame', createGame);
    pubsub.sub('missileLaunched', missileStrike);

    function createGame() {
        p1 = new Player;
        p2 = new Player;

        const players = {
            p1,
            p2,
        }

        placeComputerShips(p2);

        pubsub.pub('gameCreated', players);

        return p2;
    }

    function missileStrike(coordinates) {
        p1.attack(p2, coordinates[0], coordinates[1]);

        let location = p2.fleet.grid[coordinates[0]][coordinates[1]];
        pubsub.pub('missileStrike', [coordinates[2], location]);
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

        if (num > 10 - length) {
            num = 10 - length;
        }

        return num;
    }

    return {
        generateCoordinate, createGame, p2,
    }

})();