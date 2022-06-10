import { pubsub } from "./pubsub";

export const events = (() => {
    const playButton = document.getElementById('playButton');

    playButton.addEventListener('click', newGame);

    function newGame() {
        pubsub.pub('newGame');
    }

})();