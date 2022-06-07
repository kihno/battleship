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
                let div = document.createElement('div');
                div.className = 'cell';

                if (player === playerOne) {
                    playerBoard.appendChild(div);
                } else {
                    aiBoard.appendChild(div);
                }
            });
        }
    }

    playButton.addEventListener('click', createGame);

    return {
    
    }
})();