import { Event } from './event.class.js';
import EventType, { EventOptsType } from './event.type';

export class DialogueEvent extends Event {
    private opts: EventType["opts"];

    constructor (DialogueOpts : EventOptsType["DialogueOpts"]) {
        super({
            'type': 'dialogue',
            'opts': DialogueOpts,
        });
    };
}
