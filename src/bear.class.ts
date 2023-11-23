interface BearOpts {
    healthPoints: number,
};

export class Bear {
    private healthPoints: number;

    constructor (bearOpts : BearOpts) {
        this.healthPoints = bearOpts.healthPoints;
    };
};
