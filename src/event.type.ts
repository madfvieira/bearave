import { Dialogue } from './dialogue.class.js';
import { Unit } from './unit.class.js';
import { Room } from './room.class.js';
import { Level } from './level.class.js';
import ChoiceInterface from './choice.interface.js';

export type EventTypesNames = "message" | "delay" | "dialogue" | "clearArea" | "prompt" | "move";

export type EventOpts <TEvent extends EventTypesNames> =
    TEvent extends "message"
        ? MessageOpts
        : TEvent extends "delay"
            ? DelayOpts
            : TEvent extends "dialogue"
                ? DialogueOpts
                : TEvent extends "prompt"
                    ? PromptOpts
                    : TEvent extends "clearArea"
                        ? ClearAreaOpts
                        : TEvent extends "move"
                            ? MoveOpts
                            : never
;

interface EventType {
    opts?: EventOpts<EventTypesNames>,
};

interface MessageOpts {
    message: string,
    duration: number,
    clearLog?: boolean,
    onDone?: () => void,
    criteriaCheck?: () => boolean,
};

interface DialogueOpts {
    dialogs: Dialogue[],
    onDone?: () => void,
    criteriaCheck?: () => boolean,
};

interface PromptOpts {
    question: string,
    choices: ChoiceInterface[],
    onDone?: () => void,
    criteriaCheck?: () => boolean,
};

interface DelayOpts {
    duration: number,
    onDone?: () => void,
    criteriaCheck?: () => boolean,
};

interface ClearAreaOpts {
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
