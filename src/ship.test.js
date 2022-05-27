import {Ship} from './ship';

test('ship has correct length', () =>  {
    expect(new Ship(5).length).toBe(5);
});

test('ship defense has correct items', () =>  {
    expect(new Ship(5).defense).toStrictEqual(["o", "o", "o", "o", "o"]);
});

test('ship gets hit', () =>  {
    let testShip = new Ship(5);
    testShip.hit(1);
    
    expect(testShip.defense).toStrictEqual(["o", "x", "o", "o", "o"]);
});

test('ship is not sunk', () =>  {
    let testShip = new Ship(3);
    
    expect(testShip.isSunk()).toBe(false);
});

test('ship is hit but not sunk', () =>  {
    let testShip = new Ship(3);
    testShip.hit(0);
    
    expect(testShip.isSunk()).toBe(false);
});

test('ship is sunk', () =>  {
    let testShip = new Ship(3);
    testShip.hit(0);
    testShip.hit(1);
    testShip.hit(2);
    
    expect(testShip.isSunk()).toBe(true);
});