import {Player} from './player';

export const ui = (() => {
    const display = document.getElementById('display');
    const playerBoard = document.getElementById('playerBoard');
    const aiBoard = document.getElementById('aiBoard');
    const playButton = document.getElementById('playButton');

    let playerOne;
    let playerTwo;
    let currentPlayer = playerOne;
    let opponent = playerTwo;

    // function createPlayButton() {
    //     let button = document.createElement('button');
    //     button.id = 'playButton';
    //     button.textContent = "New Game";

    //     display.appendChild(button);
    // }

    function createGame() {
        playerOne = new Player;
        playerTwo = new Player;

        createPlayerGrid(playerOne);
        createPlayerGrid(playerTwo);  
        
        playButton.style.display = 'none';
    }

    function createPlayerGrid(player) {
        for (let i = 0; i < 10; i++) {
            player.fleet.grid[i].forEach((item, index) => {
                let cell = document.createElement('button');
                cell.className = 'cell';
                cell.dataset.x = i;
                cell.dataset.y = index;
                cell.dataset.value = item;

                if (player === playerOne) {
                    playerBoard.appendChild(cell);
                } else {
                    aiBoard.appendChild(cell);
                    cell.addEventListener('click', fire);
                }
            });
        }

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

        console.log(playerTwo.fleet.grid);
    }

    function fire(e) {
        let x = e.target.dataset.x;
        let y = e.target.dataset.y;
        playerOne.attack(playerTwo, x, y);
        e.target.dataset.value = playerTwo.fleet.grid[x][y]
        e.target.removeEventListener('click', fire);
    }

    playButton.addEventListener('click', createGame);

    return {
    
    }
})();