import { Event } from './event.class.js';

type EventSubscriber = {
    notifyMe: (event: Event) => void,
};

interface eventQueueOpts {
    events: Event[],
    onDone: () => void,
    eventsSubscriber?: EventSubscriber,
};

export class EventQueue {
    private events: eventQueueOpts["events"];
    private onDone: eventQueueOpts["onDone"];
    private canProcessQueue: boolean;
    private eventsSubscriber?: EventSubscriber;

    constructor (opts: eventQueueOpts) {
        this.events = opts.events;
        this.onDone = opts.onDone;
        this.canProcessQueue = true;
        if (opts.eventsSubscriber) {
            this.eventsSubscriber = opts.eventsSubscriber;
        }

        this.processQueue().then(() => {
            this.onDone();
        });
    };

    notifyAll(eventDone : Event): void{
        if (this.eventsSubscriber) {
            this.eventsSubscriber.notifyMe(eventDone);
        }
    };

    async processQueue() : Promise<void> {
        for (let i = 0; i < this.events.length; i++) {
            if (!this.canProcessQueue) {
                break;
            }
            await this.playEvent({
                event: this.events[i]
            });

            this.notifyAll(this.events[i]);
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
            await playOpts.event.execution();
            playOpts.event.onDone();

            return setTimeout(resolve, 0); // use event loop so that an 'awaitable' object is returned back
        })
    };
};
