import { Unit } from './unit.class.js';

export class Hunter extends Unit {

    constructor () {
        super({
            id : 'hunter',
            width: '20px',
            height: '20px',
            colour: 'red',
        })
    };
};
