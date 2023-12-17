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

        if (DelayOpts?.criteriaCheck) {
            if (!DelayOpts.criteriaCheck()) {
                return false;
            }
        }


        return (
            new Promise(async resolve => {
                await setTimeout(resolve, DelayOpts.duration);
                return resolve;
            })
        );
    };
}
