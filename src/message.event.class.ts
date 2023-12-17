import { Event } from './event.class.js';
import EventType, { EventOpts } from './event.type';

export class MessageEvent extends Event {
    constructor (MessageOpts : EventOpts<"message">) {
        super({
            'opts': MessageOpts,
        });
    };

    override execution = () => {
        const MessageOpts = super.getOpts() as EventOpts<"message">;

        if (MessageOpts?.criteriaCheck) {
            if (!MessageOpts.criteriaCheck()) {
                return false;
            }
        }

        const wrapper = super.wrapperHTML();
        const eventHTML = document.createElement('DIV');
        eventHTML.setAttribute('id', 'event');
        eventHTML.innerHTML = MessageOpts.message;
        wrapper.appendChild(eventHTML);

        const eventArea = super.getEventArea();
        if (eventArea) {
            eventArea.appendChild(wrapper);
        }

        return (
            new Promise(async resolve => {
                await setTimeout(resolve, MessageOpts.duration);
                return resolve;
            })
        );
    };
}
