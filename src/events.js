import { pubsub } from './pubsub';
import { game } from './gameLoop';
import Carrier from './img/carrier.png';
import Battleship from './img/battleship.png';
import Submarine from './img/submarine.png';
import Destroyer from './img/destroyer.png';
import Patrol from './img/patrol.png';

export const events = (() => {
    const playButton = document.getElementById('playButton');
    const display = document.getElementById('display');
    const playerBoard = document.getElementById('playerBoard');
    const aiBoard = document.getElementById('aiBoard');
    const ships = document.getElementById('ships');

    playButton.addEventListener('click', newGame);

    pubsub.sub('gameCreated', renderGame);
    pubsub.sub('missileStrike', renderMissileStrike);

    function newGame() {
        playButton.style.display = 'none';
        pubsub.pub('newGame');
    }

    function renderGame(players) {
        playButton.style.display = 'none';

        createPlayerGrid(players.p1);
        createComputerGrid(players.p2);  
        renderShips(players.p1);
    }

    function renderShips(player) {
        const shipIcons = [Carrier, Battleship, Destroyer, Submarine, Patrol];
        let i = 0;
        player.fleet.allShips.forEach(ship => {
            const image = new Image();
            image.src = shipIcons[i];
            image.id = ship.name;
            image.className = 'ship';
            image.draggable = true;
            ships.appendChild(image);
            i++;
        });
    }

    function createPlayerGrid(player) {
        for (let i = 0; i < 10; i++) {
            player.fleet.grid[i].forEach((item, index) => {
                let cell = document.createElement('button');
                cell.className = 'cell';
                cell.dataset.x = i;
                cell.dataset.y = index;
                cell.dataset.value = item;

                playerBoard.appendChild(cell);
            });
        }
    }

    function createComputerGrid(player) {
        for (let i = 0; i < 10; i++) {
            player.fleet.grid[i].forEach((item, index) => {
                let cell = document.createElement('button');
                cell.className = 'cell';
                cell.dataset.x = i;
                cell.dataset.y = index;
                cell.dataset.value = item;

                aiBoard.appendChild(cell);
                cell.addEventListener('click', fire);
            });
        }
    }

    function fire(e) {
        let x = e.target.dataset.x;
        let y = e.target.dataset.y;

        pubsub.pub('missileLaunched', [x,y, e.target]);
        e.target.removeEventListener('click', fire);
    }

    function renderMissileStrike(target) {
        target[0].dataset.value = target[1];
    }

})();