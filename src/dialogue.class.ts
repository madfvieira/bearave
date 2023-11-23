type DialogueType = {
    message : string,
    entity  : string,
    duration: number,
};

export class Dialogue {
    private message : DialogueType["message"];
    private entity  : DialogueType["entity"];
    private duration: DialogueType["duration"];

    constructor (dialog: DialogueType) {
        this.message = dialog.message;
        this.entity = dialog.entity;
        this.duration = dialog.duration;
    };

    getMessage() : DialogueType["message"] {
        return this.message;
    };

    getEntity() : DialogueType["entity"] {
        return this.entity;
    };

    getDuration() : DialogueType["duration"] {
        return this.duration;
    };
};
