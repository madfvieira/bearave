import { Unit } from './unit.class.js';
import { ActionType } from './action.type.js';

type KeyboardControl = { "action": ActionType, "keyCode" : number};
type KeyboardControls = KeyboardControl[];

interface BearOpts {
    healthPoints: number,
    controls?: KeyboardControls,
};

export class Bear extends Unit {
    private healthPoints: number;
    private controls?: KeyboardControls = [];

    constructor (bearOpts : BearOpts) {
        super({
            id : 'bear',
            width: '15px',
            height: '15px',
            colour: 'black',
        })
        this.healthPoints = bearOpts.healthPoints;
    };

    setControls(newControls: KeyboardControls) : void {
        this.controls = newControls;
    };

    getControls() : KeyboardControls {
        return this?.controls ? this.controls : [];
    };
};
