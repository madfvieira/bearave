import EventType from './event.type';

export class Event {
    private type: EventType["type"];

    constructor (eventOpts: EventType) {
        this.type = eventOpts.type;
    };
};
