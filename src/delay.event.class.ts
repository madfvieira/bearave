import { Event } from './event.class.js';
import EventType, { EventOpts } from './event.type';

export class DelayEvent extends Event {
    constructor (DelayOpts : EventOpts<"delay">) {
        super({
            'opts': DelayOpts,
        });
    };

    override execution = () => {
        const DelayOpts = super.getOpts() as EventOpts<"delay">;
        return (
            new Promise(async resolve => {
                await setTimeout(resolve, DelayOpts.duration);
                return resolve;
            })
        );
    };
}
