import {game} from './gameLoop';

// let playerTwo;

beforeEach(() => {
    game.createGame();
});

test('carrier placement', () => {
    let carrierCount = 0;

    for (let i = 0; i < 10; i++) {
        let zone = game.playerTwo.fleet.grid[i]
        for (const ship of zone) {
            if (ship.toString().slice(0, -1) === 'carrier') {
                carrierCount++;
            }
        }
    }

    expect(carrierCount).toBe(5);
});

test('battleship placement', () => {
    let battleshipCount = 0;

    for (let i = 0; i < 10; i++) {
        let zone = game.playerTwo.fleet.grid[i]
        for (const ship of zone) {
            if (ship.toString().slice(0, -1) === 'battleship') {
                battleshipCount++;
            }
        }
    }

    expect(battleshipCount).toBe(4);
});

test('destroyer placement', () => {
    let destroyerCount = 0;

    for (let i = 0; i < 10; i++) {
        let zone = game.playerTwo.fleet.grid[i]
        for (const ship of zone) {
            if (ship.toString().slice(0, -1) === 'destroyer') {
                destroyerCount++;
            }
        }
    }

    expect(destroyerCount).toBe(3);
});

test('submarine placement', () => {
    let submarineCount = 0;

    for (let i = 0; i < 10; i++) {
        let zone = game.playerTwo.fleet.grid[i]
        for (const ship of zone) {
            if (ship.toString().slice(0, -1) === 'submarine') {
                submarineCount++;
            }
        }
    }

    expect(submarineCount).toBe(4);
});

test('patrol placement', () => {
    let patrolCount = 0;

    for (let i = 0; i < 10; i++) {
        let zone = game.playerTwo.fleet.grid[i]
        for (const ship of zone) {
            if (ship.toString().slice(0, -1) === 'patrol') {
                patrolCount++;
            }
        }
    }

    expect(patrolCount).toBe(4);
});