import {Player} from './player';

export const ui = (() => {
    const display = document.getElementById('display');
    const playerBoard = document.getElementById('playerBoard');
    const aiBoard = document.getElementById('aiBoard');
    const playButton = document.getElementById('playButton');

    let playerOne;
    let playerTwo;

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
            player.fleet.grid[i].forEach(square => {
                let cell = document.createElement('button');
                cell.className = 'cell';

                if (player === playerOne) {
                    playerBoard.appendChild(cell);
                } else {
                    aiBoard.appendChild(cell);
                }
            });
        }
    }

    playButton.addEventListener('click', createGame);

    return {
    
    }
})();