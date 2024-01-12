import { Event } from './event.class.js';
import { EventOpts } from './event.type';

export class ClearAreaEvent extends Event {
    constructor (ClearAreaOpts?: EventOpts<"clearArea">) {
        super({
            'opts': ClearAreaOpts,
        });
    };

    override execution = () => {
        const ClearAreaOpts = super.getOpts() as EventOpts<"clearArea">;

        if (ClearAreaOpts?.criteriaCheck) {
            if (!ClearAreaOpts.criteriaCheck()) {
                return false;
            }
        }

        const eventArea = super.getEventArea();
        if (eventArea) {
            eventArea.innerHTML = '';
        }

        return (
            new Promise(async resolve => {
                setTimeout(resolve, 0);
                return resolve;
            })
        );
    };
}
