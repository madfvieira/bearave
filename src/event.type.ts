import { MessageEvent } from './message.event.class.js';
import { DelayEvent } from './delay.event.class.js';
import { Dialogue } from './dialogue.class.js';
import ChoiceInterface from './choice.interface.js';

export type EventTypesNames = "message" | "delay" | "dialogue" | "clearArea" | "prompt";

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

export default EventType;
