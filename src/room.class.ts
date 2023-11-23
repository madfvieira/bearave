import { Event } from './event.class';
import { Bear } from './bear.class.js';
import RoomPosition from 'roomPosition.interface';

interface roomOpts {
    id: string,
    position: RoomPosition,
};

export class Room {
    private id: string;
    private bear?: Bear;
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

    hasBear() : boolean {
        if (this.bear) {
            return true;
        }
        return false;
    };

    getBear() : Bear | boolean {
        if (this.bear) {
            return this.bear;
        }
        return false;
    };

    addBear() : void {
        this.bear = new Bear({
            healthPoints: 100,
        });
    };

    removeBear() : void {
        delete this.bear;
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
