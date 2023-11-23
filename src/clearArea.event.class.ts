import { Event } from './event.class.js';
import EventType, { EventOpts } from './event.type';

export class ClearAreaEvent extends Event {
    constructor (ClearAreaOpts?: EventOpts<"clearArea">) {
        super({
            'opts': ClearAreaOpts,
        });
    };

    override execution = () => {
        const ClearAreaOpts = super.getOpts() as EventOpts<"clearArea">;
        const wrapper = super.wrapperHTML();

        const eventArea = super.getEventArea();
        if (eventArea) {
            eventArea.innerHTML = '';
        }

        return (
            new Promise(async resolve => {
                await setTimeout(resolve, 0);
                return resolve;
            })
        );
    };
}
