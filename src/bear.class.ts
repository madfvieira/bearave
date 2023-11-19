import InterfaceLevelPosition from './levelPosition.interface';
import RoomAdjacentPositions from './roomAdjacentPositions.interface';

interface BearOpts {
    position: InterfaceLevelPosition,
    healthPoints: number,
};

export class Bear {
    private position: InterfaceLevelPosition;
    private healthPoints: number;
    private adjacentPositions?: RoomAdjacentPositions;

    constructor (bearOpts : BearOpts) {
        this.position = bearOpts.position;
        this.healthPoints = bearOpts.healthPoints;
    };

    getPosition () : InterfaceLevelPosition {
        return this.position;
    };

    setPosition (position: InterfaceLevelPosition) {
        this.position = position;
        return true;
    };

    getAdjacentPositions () : RoomAdjacentPositions | boolean {
        if (this.adjacentPositions) {
            return this.adjacentPositions;
        }
        return false;
    };
};
