import { Event } from './event.class';
import { Unit } from './unit.class.js';
import RoomPosition from 'roomPosition.interface';

interface roomOpts {
    id: string,
    position: RoomPosition,
};

export class Room {
    private id: string;
    private units?: Unit[];
    private position: RoomPosition;
    private events: Event[];

    constructor(roomOpts: roomOpts) {
        this.id = roomOpts.id;
        this.position = roomOpts.position;
        this.events = [];
    };

    get () : Room {
        return this;
    };

    getPosition () : RoomPosition {
        return this.position;
    };

    getId () : string {
        return this.id;
    };

    hasUnitId(searchUnitId : string) : boolean {
        if (this?.units?.length) {
            const findUnitId = this.units.filter((unit) => {
                return (unit.getId() === searchUnitId);
            })[0];
            if (findUnitId) {
                return true;
            }
        }
        return false;
    };

    hasUnit(searchUnit : Unit) : boolean {
        if (this?.units?.length) {
            const findUnitId = this.units.filter((unit) => {
                return (unit.getId() === searchUnit.getId());
            })[0];
            if (findUnitId) {
                return true;
            }
        }
        return false;
    };

    getUnit(id : string) : Unit | false {
        if (this?.units?.length) {
            const findUnitId = this.units.filter((unit) => {
                return (unit.getId() === id);
            })[0];
            if (findUnitId) {
                return findUnitId;
            }
        }
        return false;
    };

    addUnit(newUnit : Unit) : void {
        if (!this.units) {
            this.units = [];
        };
        this.units.push(newUnit);
    };

    removeUnit(rmUnit : Unit) : void {
        if (this?.units?.length) {
            this.units = this.units.filter((unit) => {
                return (unit.getId() !== rmUnit.getId());
            });
        }
    };

    addEvent <TypeArg extends Event | Event[]> (event : TypeArg) : boolean {
        if (Array.isArray(event)) { // if multiple passed
            for (let i = 0; i < event.length ; i++) {
                this.events.push(event[i]);
            }
        } else {
            this.events.push(event);
        }

        return true;
    };

    hasEvents () : boolean {
        if (this.events.length > 0) {
            return true;
        }

        return false;
    };

    getEvents () : Event[] {
        return this.events;
    };

    removeEvents() : void {
        this.events = [];
    };
};
