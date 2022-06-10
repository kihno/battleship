import {Player} from './player';
import { pubsub } from './pubsub';

export const game = (() => {

    let p1;
    let p2;

    pubsub.sub('newGame', createGame);

    function createGame() {
        p1 = new Player;
        p2 = new Player;

        const players = {
            p1,
            p2,
        }

        placeComputerShips(p2);

        pubsub.pub('gameCreated', players);
    }

    function placeComputerShips(player) {
        player.fleet.allShips.forEach(ship => {
            let position = [true, false];
            ship.isVertical = position[Math.floor(Math.random()*position.length)];
            let x = generateCoordinate(ship.length);
            let y = generateCoordinate(ship.length);

            player.fleet.placeShip(ship, x, y);
        });
        console.log(player.fleet.grid);
    }

    function generateCoordinate(length) {
        let num = Math.floor(Math.random() * (9 - length + 1));

        return num;
    }

    return {
        generateCoordinate, createGame,
    }

})();