import { Event } from './event.class.js';
import EventType, { EventOptsType } from './event.type';

export class DecisionEvent extends Event {
    private opts: EventType["opts"];

    constructor (DecisionOpts : EventOptsType["DecisionOpts"]) {
        super({
            'type': 'dialogue',
            'opts': DecisionOpts,
        });
    };
}
