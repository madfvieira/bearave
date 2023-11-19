export interface EventType {
    type: "dialogue" | "decision" | "fight" | "loot",
    opts?: object
};

export interface EventOptsType {
    DialogueOpts: {
        message: string,
    },
    DecisionOpts: {
        choice: string,
        options: string[],
    }
};

export default EventType;
