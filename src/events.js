import { pubsub } from './pubsub';
import Carrier from './img/carrier-w.png';
import Battleship from './img/battleship-w.png';
import Submarine from './img/submarine-w.png';
import Destroyer from './img/destroyer-w.png';
import Patrol from './img/patrol-w.png';

export const events = (() => {
    const playButton = document.getElementById('playButton');
    const info = document.getElementById('info');
    const playerBoard = document.getElementById('playerBoard');
    const aiBoard = document.getElementById('aiBoard');
    const shipContainer = document.getElementById('shipContainer');
    const ships = document.getElementById('ships');
    const rotate = document.getElementById('rotate');

    playButton.addEventListener('click', newGame);
    rotate.addEventListener('click', toggleRotate);

    pubsub.sub('gameCreated', renderGame);
    pubsub.sub('missileStrike', renderMissileStrike);
    pubsub.sub('strikeBack', renderStrikeBack);
    pubsub.sub('shipSunk', alertShipSunk);
    pubsub.sub('gameOver', gameOver);

    let dragTarget;
    let vertical = false;

    function newGame() {
        resetBoard();
        playButton.style.display = 'none';
        pubsub.pub('newGame');
    }

    function renderGame(players) {
        playButton.style.display = 'none';
        shipContainer.style.display = 'flex';
        playerBoard.style.display = 'grid';
        aiBoard.style.display = 'grid';

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
            image.addEventListener('dragend', dragEnd);
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
                cell.addEventListener('dragover', dragOver);
                cell.addEventListener('dragleave', dragLeave);
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
                cell.dataset.value = 0;

                aiBoard.appendChild(cell);
                cell.addEventListener('click', fire);
            });
        }
    }

    function toggleRotate() {
        ships.firstChild.classList.toggle('vertical');
        ships.firstChild.firstChild.classList.toggle('rotate');

        vertical = !vertical;

        pubsub.pub('rotateShip', ships.firstChild.firstChild.id);
    }

    function dragStart(e) {
        dragTarget = e.target.id;
        e.dataTransfer.setData('image', e.target.id);
        setTimeout(() => {
            e.target.classList.add('hide');
        });
        [...e.target.parentElement.parentElement.children].forEach(sibling => {
            if (sibling.dataset.value === dragTarget) {
                sibling.dataset.value = 0;
            }
        });
    }

    function dragEnd(e) {
        [...e.target.parentElement.children].forEach(sibling => sibling.classList.remove('dragOver'));
        [...e.target.parentElement.children].forEach(sibling => sibling.classList.remove('hide'));
        e.target.classList.remove('hide');
    }

    let firstSibling;
    let secondSibling;
    let thirdSibling;
    let fourthSibling;
    let dropTarget = [];

    function valueZero(el) {
        return el.dataset.value == 0;
    }

    function dragEnter(e) {

        if (dragTarget === 'carrier') {

            if (vertical === false) {
                if (e.target.dataset.y < 6) {
                    firstSibling = e.target.nextElementSibling;
                    secondSibling = firstSibling.nextElementSibling;
                    thirdSibling = secondSibling.nextElementSibling;
                    fourthSibling = thirdSibling.nextElementSibling;
                    dropTarget = [e.target, firstSibling, secondSibling, thirdSibling, fourthSibling];
                } else {
                    e.target.classList.add('invalid');
                    return;
                }
                 
            } else if (vertical === true) {
                if  (e.target.dataset.x < 6) {

                    let cells = [...e.target.parentElement.children];
                    let index = cells.indexOf(e.target);

                    firstSibling = cells[index + 10];
                    secondSibling = cells[index + 20];
                    thirdSibling = cells[index + 30];
                    fourthSibling = cells[index + 40];
                    dropTarget = [e.target, firstSibling, secondSibling, thirdSibling, fourthSibling];
                } else {
                    e.target.classList.add('invalid');
                    return;
                }
            } 
                
            if (dropTarget !== [] && dropTarget.every(valueZero)) {
                e.preventDefault();
                dropTarget.forEach(target => {
                    target.classList.add('dragOver');
                });
            } else {
                e.target.classList.add('invalid');
            }
        } else if (dragTarget === 'battleship') {

            if (vertical === false) {
                if (e.target.dataset.y < 7) {
                    firstSibling = e.target.nextElementSibling;
                    secondSibling = firstSibling.nextElementSibling;
                    thirdSibling = secondSibling.nextElementSibling;
                    dropTarget = [e.target, firstSibling, secondSibling, thirdSibling];
                } else {
                    e.target.classList.add('invalid');
                    return;
                }
                 
            } else if (vertical === true) {
                if  (e.target.dataset.x < 7) {

                    let cells = [...e.target.parentElement.children];
                    let index = cells.indexOf(e.target);

                    firstSibling = cells[index + 10];
                    secondSibling = cells[index + 20];
                    thirdSibling = cells[index + 30];
                    dropTarget = [e.target, firstSibling, secondSibling, thirdSibling];
                } else {
                    e.target.classList.add('invalid');
                    return;
                }
            } 
                
            if (dropTarget !== [] && dropTarget.every(valueZero)) {
                e.preventDefault();
                dropTarget.forEach(target => {
                    target.classList.add('dragOver');
                });
            } else {
                e.target.classList.add('invalid');
            }

        } else if (dragTarget === 'destroyer' || dragTarget === 'submarine') {

            if (vertical === false) {
                if (e.target.dataset.y < 8) {
                    firstSibling = e.target.nextElementSibling;
                    secondSibling = firstSibling.nextElementSibling;
                    dropTarget = [e.target, firstSibling, secondSibling];
                } else {
                    e.target.classList.add('invalid');
                    return;
                }
                 
            } else if (vertical === true) {
                if  (e.target.dataset.x < 8) {

                    let cells = [...e.target.parentElement.children];
                    let index = cells.indexOf(e.target);

                    firstSibling = cells[index + 10];
                    secondSibling = cells[index + 20];
                    dropTarget = [e.target, firstSibling, secondSibling];
                } else {
                    e.target.classList.add('invalid');
                    return;
                }
            } 
                
            if (dropTarget !== [] && dropTarget.every(valueZero)) {
                e.preventDefault();
                dropTarget.forEach(target => {
                    target.classList.add('dragOver');
                });
            } else {
                e.target.classList.add('invalid');
            }

        } else if (dragTarget === 'patrol') {
            if (vertical === false) {
                if (e.target.dataset.y < 9) {
                    firstSibling = e.target.nextElementSibling;
                    dropTarget = [e.target, firstSibling];
                } else {
                    e.target.classList.add('invalid');
                    return;
                }
                 
            } else if (vertical === true) {

                if  (e.target.dataset.x < 9) {

                    let cells = [...e.target.parentElement.children];
                    let index = cells.indexOf(e.target);

                    firstSibling = cells[index + 10];
                    dropTarget = [e.target, firstSibling];
                } else {
                    e.target.classList.add('invalid');
                    return;
                }
            } 
                
            if (dropTarget !== [] && dropTarget.every(valueZero)) {
                e.preventDefault();
                dropTarget.forEach(target => {
                    target.classList.add('dragOver');
                });
            } else {
                e.target.classList.add('invalid');
            }
        }
    }

    function dragOver(e) {
        dragEnter(e);
    }

    function dragLeave(e) {
        [...e.target.parentElement.children].forEach(sibling => sibling.classList.remove('dragOver'));
        [...e.target.parentElement.children].forEach(sibling => sibling.classList.remove('invalid'));
    }

    function drop(e) {
        [...e.target.parentElement.children].forEach(sibling => sibling.classList.remove('dragOver'));
        [...e.target.parentElement.children].forEach(sibling => {
            if (sibling.dataset.value === dragTarget) {
                sibling.dataset.value = 0;
            }
        });

        const id = e.dataTransfer.getData('image');
        const draggable = document.getElementById(id);

        e.target.appendChild(draggable);
        draggable.classList.remove('hide');

        dropTarget.forEach(target => {
            target.dataset.value = id;
        });

        let emptyDiv = document.getElementById(id + 'Container');
        if (ships.contains(emptyDiv)) {
            ships.removeChild(emptyDiv);
        }

        vertical = false;

        pubsub.pub('shipPlaced', e.target);

        hideShipContainer();
    }

    function hideShipContainer() {
        if (!ships.hasChildNodes()) {
            shipContainer.style.display = 'none';
            aiBoard.style.marginRight = 0;
        }
    }

    function fire(e) {
        if (ships.children.length > 0) {
            info.textContent = 'Place all of your ships before attacking the enemy.'
        } else {
            info.textContent = '';

            let x = e.target.dataset.x;
            let y = e.target.dataset.y;

            pubsub.pub('missileLaunched', [x,y, e.target]);
            e.target.removeEventListener('click', fire);
        }
    }

    function renderMissileStrike(target) {
        target[0].dataset.value = target[1];
    }

    function renderStrikeBack(location) {
        let x = location[1];
        let y = location[2];

        [...playerBoard.children].forEach(cell => {
            if (cell.dataset.x == x && cell.dataset.y == y) {
                if (location[0].fleet.grid[x][y] === '-') {
                    cell.dataset.value = '-';
                } else {
                    cell.dataset.value = 'x'
                }
            }
        });
        
    }

    function alertShipSunk(player) {
        if (player.name === 'computer') {
            info.textContent = `You have sunk your opponent's ${player.shipName}.`;
        } else {
            info.textContent = `Your ${player.shipName} has sunk.`;
        }
    }

    function gameOver(player) {
        [...aiBoard.children].forEach(sibling => sibling.removeEventListener('click', fire));

        if (player === 'computer') {
            info.textContent = `Game Over. Your opponent's fleet has sunk.`;
        } else  {
            info.textContent = `Game Over. Your fleet has sunk.`;
        }

        playButton.style.display = 'block';
        aiBoard.style.marginRight = '220px';
    }

    function resetBoard() {
        while(playerBoard.firstChild) {
            playerBoard.removeChild(playerBoard.firstChild);
        }

        while(aiBoard.firstChild) {
            aiBoard.removeChild(aiBoard.firstChild);
        }
        info.textContent = '';
    }

})();