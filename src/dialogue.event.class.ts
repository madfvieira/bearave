import { Event } from './event.class.js';
import EventType, { EventOpts } from './event.type';
import { EventQueue } from './eventQueue.class.js';
import { MessageEvent } from './message.event.class.js';

export class DialogueEvent extends Event {
    constructor (DialogueOpts : EventOpts<"dialogue">) {
        super({
            'opts': DialogueOpts,
        });
    };

    override execution = () => {
        const DialogueOpts = super.getOpts() as EventOpts<"dialogue">;
        const eventArea = super.getEventArea();
        if (!eventArea) {
            return;
        };

        const DialogueEvents = DialogueOpts.dialogs.map((dialogue) => {
            return (
                new MessageEvent({
                    'message' : `${dialogue.getEntity()}: ${dialogue.getMessage()}`,
                    'duration': dialogue.getDuration(),
                })
            );
        });

        return (
            new Promise(async resolve => {
                await new EventQueue ({
                    events: DialogueEvents,
                    onDone: () => { // called when all nested DialogueEvents finish
                        return setTimeout(resolve, 0);
                    },
                    eventArea: eventArea,
                });
                return resolve;
            })
        );
    };
}