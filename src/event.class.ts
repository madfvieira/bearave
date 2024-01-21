import EventType from './event.type';

export abstract class Event {
    private opts: EventType["opts"];

    constructor (eventOpts: EventType) {
        this.opts = eventOpts.opts;
    };

    getOpts() : EventType["opts"] {
        return this.opts;
    };

    onDone() : void {
        if (typeof(this.opts?.onDone) === 'function') {
            this.opts.onDone();
        }
    };

    abstract execution() : void;
};
