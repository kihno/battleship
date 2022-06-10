import {Gameboard} from './gameboard';
import { Ship } from './ship';

let testBoard;
let testShip;

beforeEach(() => {
    testBoard = new Gameboard;
    testShip = new Ship('ship', 3);
});

test('ship placement, horizontal', () =>  {
    testBoard.placeShip(testShip, 1, 2);

    expect(testBoard.grid[1]).toStrictEqual([0,0,'ship0','ship1','ship2',0,0,0,0,0]);
});

test('ship placement, vertical', () =>  {
    testShip.isVertical = true;
    testBoard.placeShip(testShip, 1, 2);

    expect(testBoard.grid).toStrictEqual([
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,'ship0',0,0,0,0,0,0,0],
        [0,0,'ship1',0,0,0,0,0,0,0],
        [0,0,'ship2',0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
    ]);
});

test('shot miss', () => {
    testBoard.receiveAttack(0, 0);

    expect(testBoard.grid[0]).toStrictEqual(['-', 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

test('shot hit', () => {
    testBoard.placeShip(testBoard.destroyer, 1, 2);
    testBoard.receiveAttack(1, 3);

    expect(testBoard.destroyer.defense).toStrictEqual(['o', 'x', 'o']);
});

test('ship sunk', () => {
    testBoard.placeShip(testBoard.destroyer, 1, 2);
    testBoard.receiveAttack(1, 2);
    testBoard.receiveAttack(1, 3);
    testBoard.receiveAttack(1, 4);

    expect(testBoard.destroyer.isOperational).toBe(false);
});

test('fleet sunk', () => {
    testBoard.placeShip(testBoard.carrier, 1, 2);
    testBoard.placeShip(testBoard.battleship, 2, 2);
    testBoard.placeShip(testBoard.destroyer, 3, 2);
    testBoard.placeShip(testBoard.submarine, 4, 2);
    testBoard.placeShip(testBoard.patrol, 5, 2);

    testBoard.allShips.forEach(ship => {
        ship.isOperational = false;
    });

    expect(testBoard.isFleetSunk()).toBe(true);
});