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
    let vertical = false;

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

    function dragLeave(e) {
        [...e.target.parentElement.children].forEach(sibling => sibling.classList.remove('dragOver'));
        [...e.target.parentElement.children].forEach(sibling => sibling.classList.remove('invalid'));
    }

    function drop(e) {
        const target = document.getElementsByClassName('dragOver');
        pubsub.pub('shipPlaced', target);

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