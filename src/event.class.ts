import EventType from './event.type';

export abstract class Event {
    private opts: EventType["opts"];
    protected eventArea?: HTMLElement;

    constructor (eventOpts: EventType) {
        this.opts = eventOpts.opts;
    };

    getOpts() : EventType["opts"] {
        return this.opts;
    };

    protected wrapperHTML() : HTMLElement {
        const wrapper = document.createElement('DIV');
        wrapper.setAttribute('id', 'eventWrapper');
        wrapper.setAttribute('style', 'color:white;');
        return wrapper;
    };

    setEventArea(eventArea : HTMLElement) : void {
        this.eventArea = eventArea;
    };

    getEventArea() : HTMLElement | undefined {
        return this.eventArea;
    };

    onDone() : void {
        if (typeof(this.opts?.onDone) === 'function') {
            this.opts.onDone();
        }
    };

    abstract execution() : void;

};
