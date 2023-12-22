import { Event } from './event.class.js';
import EventType from './event.type';

interface eventQueueOpts {
    events: Event[],
    onDone: () => void,
    eventArea: HTMLElement,
};

export class EventQueue {
    private events: eventQueueOpts["events"];
    private onDone: eventQueueOpts["onDone"];
    private eventArea: eventQueueOpts["eventArea"];
    private canProcessQueue: boolean;

    constructor (opts: eventQueueOpts) {
        this.events = opts.events;
        this.onDone = opts.onDone;
        this.eventArea = opts.eventArea;
        this.canProcessQueue = true;

        this.processQueue().then(() => {
            this.onDone();
        });
    };

    async processQueue() : Promise<void> {
        for (let i = 0; i < this.events.length; i++) {
            if (!this.canProcessQueue) {
                console.log('breaking event queues')
                break;
            }
            await this.playEvent({
                event: this.events[i]
            });
            console.log('to next event')
        }
    };

    killQueue() : void {
        this.canProcessQueue = false;
    };

    playEvent (playOpts: { event: Event }) : Promise<any> {
        return new Promise(async resolve => {
            if (!this.canProcessQueue) {
                return setTimeout(resolve, 0);
            }
            playOpts.event.setEventArea(this.eventArea);
            await playOpts.event.execution();
            playOpts.event.onDone();

            return setTimeout(resolve, 0); // use event loop so that an 'awaitable' object is returned back
        })
    };
};
