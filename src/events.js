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
    const shipContainer = document.getElementById('shipContainer');
    const ships = document.getElementById('ships');
    const rotate = document.getElementById('rotate');
    const dragOverCell = document.getElementsByClassName('dragOver');

    playButton.addEventListener('click', newGame);
    rotate.addEventListener('click', toggleRotate);

    pubsub.sub('gameCreated', renderGame);
    pubsub.sub('missileStrike', renderMissileStrike);

    let dragTarget;

    function newGame() {
        playButton.style.display = 'none';
        pubsub.pub('newGame');
    }

    function renderGame(players) {
        playButton.style.display = 'none';
        shipContainer.style.display = 'flex';

        createPlayerGrid(players.p1);
        createComputerGrid(players.p2);  
        renderShips(players.p1);
    }

    function renderShips(player) {
        const shipIcons = [Carrier, Battleship, Destroyer, Submarine, Patrol];
        let i = 0;
        player.fleet.allShips.forEach(ship => {
            const div = document.createElement('div');
            div.id = ship.name + "Container";
            const image = new Image();
            image.src = shipIcons[i];
            image.id = ship.name;
            image.className = 'ship';
            image.draggable = true;
            image.addEventListener('dragstart', dragStart);
            div.appendChild(image);
            ships.appendChild(div);
            i++;
        });
    }

    function createPlayerGrid(player) {
        for (let i = 0; i < 10; i++) {
            player.fleet.grid[i].forEach((item, index) => {
                let cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.x = i;
                cell.dataset.y = index;
                cell.dataset.value = item;

                cell.addEventListener('dragenter', dragEnter);
                // cell.addEventListener('dragover', dragOver);
                // cell.addEventListener('dragleave', dragLeave);
                cell.addEventListener('drop', drop);

                playerBoard.appendChild(cell);
            });
        }
    }

    function createComputerGrid(player) {
        for (let i = 0; i < 10; i++) {
            player.fleet.grid[i].forEach((item, index) => {
                let cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.x = i;
                cell.dataset.y = index;
                cell.dataset.value = item;

                aiBoard.appendChild(cell);
                cell.addEventListener('click', fire);
            });
        }
    }

    function toggleRotate() {
        ships.firstChild.classList.toggle('vertical');
        ships.firstChild.firstChild.classList.toggle('rotate');

        pubsub.pub('rotateShip', ships.firstChild.firstChild.id);
    }

    function dragStart(e) {
        dragTarget = e.target.id;
        e.dataTransfer.setData('text/plan', e.target.id);
        setTimeout(() => {
            e.target.classList.add('hide');
        });
    }

    let firstSibling;
    let secondSibling;
    let thirdSibling;
    let fourthSibling;

    function dragEnter(e) {
        [...e.target.parentElement.children].forEach(sibling => sibling.classList.remove('dragOver'));
        e.target.classList.add('dragOver');

        if (dragTarget === 'carrier') {
            firstSibling = e.target.nextElementSibling;
            firstSibling.classList.add('dragOver');
            secondSibling = firstSibling.nextElementSibling;
            secondSibling.classList.add('dragOver');
            thirdSibling = secondSibling.nextElementSibling;
            thirdSibling.classList.add('dragOver');
            fourthSibling = thirdSibling.nextElementSibling;
            fourthSibling.classList.add('dragOver');
        } else if (dragTarget === 'battleship') {
            firstSibling = e.target.nextElementSibling;
            firstSibling.classList.add('dragOver');
            secondSibling = firstSibling.nextElementSibling;
            secondSibling.classList.add('dragOver');
            thirdSibling = secondSibling.nextElementSibling;
            thirdSibling.classList.add('dragOver');
        } else if (dragTarget === 'destroyer' || dragTarget === 'submarine') {
            firstSibling = e.target.nextElementSibling;
            firstSibling.classList.add('dragOver');
            secondSibling = firstSibling.nextElementSibling;
            secondSibling.classList.add('dragOver');
        } else if (dragTarget === 'patrol') {
            firstSibling = e.target.nextElementSibling;
            firstSibling.classList.add('dragOver');
        }
    }

    // function dragOver(e) {

    //     e.target.classList.add('dragOver');

    //     if (e.target.id === 'carrier') {
    //         firstSibling.classList.add('dragOver');
    //         secondSibling.classList.add('dragOver');
    //         thirdSibling.classList.add('dragOver');
    //         fourthSibling.classList.add('dragOver');
    //     }
    // }

    // function dragLeave(e) {
    //     e.target.classList.remove('dragOver');

    //     if (e.target.id === 'carrier') {
    //         firstSibling.classList.remove('dragOver');
    //         secondSibling.classList.remove('dragOver');
    //         thirdSibling.classList.remove('dragOver');
    //         fourthSibling.classList.remove('dragOver');
    //     }
    // }

    function drop(e) {
        // [...e.target.parentElement.children].forEach(sibling => sibling.classList.remove('dragOver'));
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