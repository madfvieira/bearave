import { Unit } from './unit.class.js';

interface HunterOpts {
    healthPoints: number,
};

export class Hunter extends Unit {
    private healthPoints: number;

    constructor (hunterOpts : HunterOpts) {
        super({
            id : 'hunter',
            width: '7px',
            height: '7px',
            colour: 'red',
        })

        this.healthPoints = hunterOpts.healthPoints;
    };
};
