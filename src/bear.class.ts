import { Unit } from './unit.class.js';
import { ActionType } from './action.type.js';

type KeyboardControl = { "action": ActionType, "keyCode" : number};
type KeyboardControls = KeyboardControl[];

export class Bear extends Unit {
    private controls?: KeyboardControls = [];

    constructor () {
        super({
            id : 'bear',
            width: '15px',
            height: '15px',
            colour: 'black',
        })
    };

    setControls(newControls: KeyboardControls) : void {
        this.controls = newControls;
    };

    getControls() : KeyboardControls {
        return this?.controls ? this.controls : [];
    };
};
