import { Unit } from './unit.class.js';

interface BearOpts {
    healthPoints: number,
};

export class Bear extends Unit {
    private healthPoints: number;

    constructor (bearOpts : BearOpts) {
        super({
            id : 'bear',
            width: '5px',
            height: '5px',
            colour: 'black',
        })
        this.healthPoints = bearOpts.healthPoints;
    };
};
