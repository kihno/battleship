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
    let gamePlayers;

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

        gamePlayers = players;
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
        e.dataTransfer.setData('image', e.target.id);
        setTimeout(() => {
            e.target.classList.add('hide');
        });
    }

    function dragEnd(e) {
        [...e.target.parentElement.children].forEach(sibling => sibling.classList.remove('dragOver'));
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

            if (gamePlayers.p1.fleet.carrier.isVertical === false) {
                if (e.target.dataset.y < 6) {
                    firstSibling = e.target.nextElementSibling;
                    secondSibling = firstSibling.nextElementSibling;
                    thirdSibling = secondSibling.nextElementSibling;
                    fourthSibling = thirdSibling.nextElementSibling;
                }  else {
                    e.target.classList.add('invalid');
                }
                 
            } else if (gamePlayers.p1.fleet.carrier.isVertical === true) {
                if  (e.target.dataset.x < 6) {
                    let targetX = e.target.dataset.x;
                    let targetY = e.target.dataset.y;

                    [...e.target.parentElement.children].forEach(sibling => {
                        if (sibling.dataset.y === targetY && sibling.dataset.x === targetX + 1) {
                            firstSibling = sibling;
                        }

                        if (sibling.dataset.y === targetY && sibling.dataset.x === targetX + 2) {
                            secondSibling = sibling;
                        }

                        if (sibling.dataset.y === targetY && sibling.dataset.x === targetX + 3) {
                            thirdSibling = sibling;
                        }

                        if (sibling.dataset.y === targetY && sibling.dataset.x === targetX + 4) {
                            fourthSibling = sibling;
                        }

                    });
                }  else {
                    e.target.classList.add('invalid');
                }
            } 
                
            dropTarget = [e.target, firstSibling, secondSibling, thirdSibling, fourthSibling];
            
            if (dropTarget.every(valueZero)) {
                e.preventDefault();
                dropTarget.forEach(target => {
                    target.classList.add('dragOver');
                });
            } else {
                e.target.classList.add('invalid');
            }
        } else if (dragTarget === 'battleship') {

            if (e.target.dataset.y < 7) {
                firstSibling = e.target.nextElementSibling;
                secondSibling = firstSibling.nextElementSibling;
                thirdSibling = secondSibling.nextElementSibling;
               
                dropTarget = [e.target, firstSibling, secondSibling, thirdSibling];
                
                if (dropTarget.every(valueZero)) {
                    e.preventDefault();
                    dropTarget.forEach(target => {
                        target.classList.add('dragOver');
                    });
                } else {
                    e.target.classList.add('invalid');
                }
            } else {
                e.target.classList.add('invalid');
            } 

        } else if (dragTarget === 'destroyer' || dragTarget === 'submarine') {
            if (e.target.dataset.y < 8) {
                firstSibling = e.target.nextElementSibling;
                secondSibling = firstSibling.nextElementSibling;
               
                dropTarget = [e.target, firstSibling, secondSibling];
                
                if (dropTarget.every(valueZero)) {
                    e.preventDefault();
                    dropTarget.forEach(target => {
                        target.classList.add('dragOver');
                    });
                } else {
                    e.target.classList.add('invalid');
                }
            } else {
                e.target.classList.add('invalid');
            }

        } else if (dragTarget === 'patrol') {
            if (e.target.dataset.y < 9) {
                firstSibling = e.target.nextElementSibling;
               
                dropTarget = [e.target, firstSibling];
                
                if (dropTarget.every(valueZero)) {
                    e.preventDefault();
                    dropTarget.forEach(target => {
                        target.classList.add('dragOver');
                    });
                } else {
                    e.target.classList.add('invalid');
                }
            } else {
                e.target.classList.add('invalid');
            }
        }
    }

    function dragOver(e) {

        if (dragTarget === 'carrier') {

            if (e.target.dataset.y < 6) {
                firstSibling = e.target.nextElementSibling;
                secondSibling = firstSibling.nextElementSibling;
                thirdSibling = secondSibling.nextElementSibling;
                fourthSibling = thirdSibling.nextElementSibling;
               
                dropTarget = [e.target, firstSibling, secondSibling, thirdSibling, fourthSibling];
                
                if (dropTarget.every(valueZero)) {
                    e.preventDefault();
                    dropTarget.forEach(target => {
                        target.classList.add('dragOver');
                    });
                } else {
                    e.target.classList.add('invalid');
                }
            } else {
                e.target.classList.add('invalid');
            }

        } else if (dragTarget === 'battleship') {

            if (e.target.dataset.y < 7) {
                firstSibling = e.target.nextElementSibling;
                secondSibling = firstSibling.nextElementSibling;
                thirdSibling = secondSibling.nextElementSibling;
               
                dropTarget = [e.target, firstSibling, secondSibling, thirdSibling];
                
                if (dropTarget.every(valueZero)) {
                    e.preventDefault();
                    dropTarget.forEach(target => {
                        target.classList.add('dragOver');
                    });
                } else {
                    e.target.classList.add('invalid');
                }
            } else {
                e.target.classList.add('invalid');
            } 

        } else if (dragTarget === 'destroyer' || dragTarget === 'submarine') {
            if (e.target.dataset.y < 8) {
                firstSibling = e.target.nextElementSibling;
                secondSibling = firstSibling.nextElementSibling;
               
                dropTarget = [e.target, firstSibling, secondSibling];
                
                if (dropTarget.every(valueZero)) {
                    e.preventDefault();
                    dropTarget.forEach(target => {
                        target.classList.add('dragOver');
                    });
                } else {
                    e.target.classList.add('invalid');
                }
            } else {
                e.target.classList.add('invalid');
            }

        } else if (dragTarget === 'patrol') {
            if (e.target.dataset.y < 9) {
                firstSibling = e.target.nextElementSibling;
               
                dropTarget = [e.target, firstSibling];
                
                if (dropTarget.every(valueZero)) {
                    e.preventDefault();
                    dropTarget.forEach(target => {
                        target.classList.add('dragOver');
                    });
                } else {
                    e.target.classList.add('invalid');
                }
            } else {
                e.target.classList.add('invalid');
            }
        }
    }

    function dragLeave(e) {
        [...e.target.parentElement.children].forEach(sibling => sibling.classList.remove('dragOver'));
        [...e.target.parentElement.children].forEach(sibling => sibling.classList.remove('invalid'));
    }

    function drop(e) {
        const target = document.getElementsByClassName('dragOver');
        pubsub.pub('shipPlaced', target);

        [...e.target.parentElement.children].forEach(sibling => sibling.classList.remove('dragOver'));

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