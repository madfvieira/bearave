import { Room } from './room.class.js';

export default interface RoomAdjacentPositions {
    'up' : Room | null,
    'right' : Room | null,
    'down' : Room | null,
    'left' : Room | null,
};
