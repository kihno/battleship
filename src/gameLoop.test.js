import {game} from './gameLoop';

let p1;
let p2;

beforeAll(() => {
    game.createGame();
    p1 = game.p1;
    p2 = game.p2;
});


test('carrier placement', () => {
    
    let carrierCount = 0;

    for (let i = 0; i < 10; i++) {
        let zone = p2.fleet.grid[i];
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
        let zone = p2.fleet.grid[i];
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
        let zone = p2.fleet.grid[i];
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
        let zone = p2.fleet.grid[i];
        for (const ship of zone) {
            if (ship.toString().slice(0, -1) === 'submarine') {
                submarineCount++;
            }
        }
    }

    expect(submarineCount).toBe(3);
});

test('patrol placement', () => {
    
    let patrolCount = 0;

    for (let i = 0; i < 10; i++) {
        let zone = p2.fleet.grid[i];
        for (const ship of zone) {
            if (ship.toString().slice(0, -1) === 'patrol') {
                patrolCount++;
            }
        }
    }

    expect(patrolCount).toBe(2);
});