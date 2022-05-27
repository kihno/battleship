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

    expect(testBoard.grid[1]).toStrictEqual([0,0,'ship','ship','ship',0,0,0,0,0]);
});

test('ship placement, vertical', () =>  {
    testShip.isVertical = true;
    testBoard.placeShip(testShip, 1, 2);

    expect(testBoard.grid).toStrictEqual([
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,'ship',0,0,0,0,0,0,0],
        [0,0,'ship',0,0,0,0,0,0,0],
        [0,0,'ship',0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0]
    ]);
});

test('shot miss', () => {
    testBoard.receiveAttack(0, 0);

    expect(testBoard.grid[0]).toStrictEqual(['-', 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

test('shot hit', () => {
    testBoard.placeShip(testBoard.destroyer, 1, 2);
    testBoard.receiveAttack(1, 3);

    expect(testShip.defense).toStrictEqual(['o', 'x', 'o']);
});