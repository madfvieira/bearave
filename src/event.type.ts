import { Unit } from './unit.class.js';
import { Room } from './room.class.js';
import { Level } from './level.class.js';

export type EventTypesNames = "delay" | "move";

export type EventOpts <TEvent extends EventTypesNames> =
    TEvent extends "delay"
        ? DelayOpts
        : TEvent extends "move"
            ? MoveOpts
            : never
;

interface EventType {
    opts?: EventOpts<EventTypesNames>,
};

interface DelayOpts {
    duration: number,
    onDone?: () => void,
    criteriaCheck?: () => boolean,
};

interface MoveOpts {
    unit: Unit,
    room: Room,
    level: Level,
    onDone?: () => void,
    criteriaCheck?: () => boolean,
};

export default EventType;
