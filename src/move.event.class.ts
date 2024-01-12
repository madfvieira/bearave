import { Event } from './event.class.js';
import { EventOpts } from './event.type';

export class MoveEvent extends Event {
    constructor (MoveOpts : EventOpts<"move">) {
        super({
            'opts': MoveOpts,
        });
    };

    override execution = () => {
        const MoveOpts = super.getOpts() as EventOpts<"move">;

        if (MoveOpts?.criteriaCheck) {
            if (!MoveOpts.criteriaCheck()) {
                return false;
            }
        }

        const { unit, room, level } = MoveOpts;

        if (unit.getId() === 'hunter') {
            level.placeHunter(room.getId());
        }

        if (unit.getId() === 'bear') {
            level.placeBear(room.getId());
        }

        return (
            new Promise(async resolve => {
                setTimeout(resolve, 0);
                return resolve;
            })
        );
    };
}
