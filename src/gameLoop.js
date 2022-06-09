import {Player} from './player';

export const game = (() => {

    let playerOne = new Player;
    let playerTwo = new Player;

    function createGame() {
        // playerOne = new Player;
        // playerTwo = new Player;

        placeComputerShips();
    }

    function placeComputerShips() {
        playerTwo.fleet.allShips.forEach(ship => {
            let position = [true, false];
            ship.isVertical = position[Math.floor(Math.random()*position.length)];
            let x = Math.floor(Math.random() * 10);
            let y = Math.floor(Math.random() * 10);

            playerTwo.fleet.placeShip(ship, x, y);
        });
    }

    return {
        createGame, playerOne, playerTwo,
    }

})();