import {Player} from './player';

let playerOne = new Player;
let playerTwo = new Player;

beforeEach(() => {
    playerTwo.fleet.placeShip(playerTwo.fleet.destroyer, 1, 2);
});

test('player attack', () =>  {
    playerOne.attack(playerTwo, 1, 3);

    expect(playerTwo.fleet.destroyer.defense).toStrictEqual(['o', 'x', 'o']);
});

test('random attack', () =>  {
    playerOne.aiAttack(playerTwo);

    expect(playerTwo.fleet.grid).toEqual(expect.arrayContaining([expect.arrayContaining(['-'])]));
});