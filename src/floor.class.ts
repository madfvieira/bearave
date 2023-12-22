import FloorType from './floor.type';
import LayoutType from './layout.type';
import { Room } from './room.class.js';
import RoomAdjacentPositions from './roomAdjacentPositions.interface';

export class Floor {
    private id: number = 0;
    private layout: LayoutType;
    private isRendered?: boolean = false;

    private rooms: Room[] = []; // workable (filter, reduce, map) rooms stash
    private initialRooms: Room[]; // holds a 'static' copy of the initial maps, makes it easy to reset 'rooms' to initial state after manipulating this.rooms

    constructor(floorOpts: FloorType) {
        this.layout = floorOpts.layout;

        this.rooms = this.constructRoomsFromMatrix(floorOpts.layout.matrix);
        this.initialRooms = this.rooms;

        this.id = floorOpts.id;
    };

    constructRoomsFromMatrix (matrix: String[]) : Room[] {
        const newRooms = matrix.reduce(
            (roomsAccumulator : Room[], currentRow, rowIndex) : any => {
                const rowBlocks = currentRow.split('');
                for (let colIndex = 0; colIndex < rowBlocks.length; colIndex++) {
                    const rowBlockI = rowBlocks[colIndex];
                    if (rowBlockI === ' ') {
                        roomsAccumulator.push(
                            new Room({
                                id: rowIndex + '_' + colIndex,
                                position: {
                                    row: rowIndex,
                                    col: colIndex,
                                },
                            })
                        );
                    }
                }
                
                return roomsAccumulator;
            },
            []
        );

        return newRooms;
    };

    get () {
        return this;
    };

    getLayout () : LayoutType {
        return this.layout;
    };

    getRows () : number {
        return this.getLayout().matrix.length;
    };

    getCols () : number {
        return this.getLayout().matrix[0].length;
    };

    getId () {
        return this.id;
    };

    getRooms() {
        return this.rooms;
    };

    getRoom(id: string) : Room {
        return (
            this.rooms.filter((room) => {
                return (room.getId() === id);
            })[0]
        );
    };

    setRooms(rooms: Room[]) : void {
        this.rooms = rooms;
        this.initialRooms = this.rooms;
    };

    getRoomByPosition({ row, col } : { row: number, col: number }) : Room | null {
        const roomsAtPosition = this.rooms.filter((room) => {
            return (
                room.getPosition().row === row
                && room.getPosition().col === col
            )
        });

        if (roomsAtPosition.length === 1) {
            return roomsAtPosition[0];
        } else {
            return null;
        }
    };

    areRoomAdjacentRooms(room1: Room, room2: Room) : boolean {
        const adjancentRoomsToRoom1 = this.getRoomAdjacentRooms(room1);

        const room2Id = room2.getId();

        if (adjancentRoomsToRoom1.up) {
            if (adjancentRoomsToRoom1.up.getId() === room2Id) {
                return true
            }
        }
        if (adjancentRoomsToRoom1.right) {
            if (adjancentRoomsToRoom1.right.getId() === room2Id) {
                return true
            }
        }
        if (adjancentRoomsToRoom1.down) {
            if (adjancentRoomsToRoom1.down.getId() === room2Id) {
                return true
            }
        }
        if (adjancentRoomsToRoom1.left) {
            if (adjancentRoomsToRoom1.left.getId() === room2Id) {
                return true
            }
        }

        return false;
    };

    getRoomAdjacentRooms(targetRoom: Room) : RoomAdjacentPositions {
        const targetRoomRow = targetRoom.getPosition().row;
        const targetRoomCol = targetRoom.getPosition().col;

        const roomAbove = this.getRoomByPosition({
            row: targetRoomRow - 1,
            col: targetRoomCol
        });
        const roomLeft = this.getRoomByPosition({
            row: targetRoomRow,
            col: targetRoomCol - 1
        });
        const roomRight = this.getRoomByPosition({
            row: targetRoomRow,
            col: targetRoomCol + 1
        });
        const roomBottom = this.getRoomByPosition({
            row: targetRoomRow + 1,
            col: targetRoomCol
        });

        const adjacentRoomsPositions : RoomAdjacentPositions = {
            'up' : roomAbove,
            'right' : roomRight,
            'down' : roomBottom,
            'left' : roomLeft,
        };

        return adjacentRoomsPositions;
    };

    getNumberOfAdjacentRooms(room: Room) : number {
        const adjacentRooms = this.getRoomAdjacentRooms(room);
        let adjacentRoomCount = 0;
        if (adjacentRooms.up) { adjacentRoomCount++ }
        if (adjacentRooms.right) { adjacentRoomCount++ }
        if (adjacentRooms.down) { adjacentRoomCount++ }
        if (adjacentRooms.left) { adjacentRoomCount++ }

        return adjacentRoomCount;
    };

    isDeadEndRoom(room: Room) : boolean {
        if (this.getNumberOfAdjacentRooms(room) === 1) {
            return true;
        }

        return false;
    };

    getRoomsInDirection(rooms: Room | Room[], direction: "up" | "right" | "down" | "left") : Room[] {
        let roomsInDirection : Room | Room[];
        if (!Array.isArray(rooms)) {
            roomsInDirection = [];
            roomsInDirection.push(rooms);
        } else {
            roomsInDirection = rooms;
        }

        const nextRoomInDirection = this.getRoomAdjacentRooms(roomsInDirection[roomsInDirection.length - 1])[direction];

        if (nextRoomInDirection) { // end recursion as it hit the end in this direction
            roomsInDirection.push(nextRoomInDirection);
            this.getRoomsInDirection(roomsInDirection, direction);
            return roomsInDirection;
        }
        else {
            return roomsInDirection;
        }
    };

    plotRoute(rooms: Room[], route: Room[] = []) : Room[] {
        const startRoom = rooms[0];
        const endRoom = rooms[rooms.length - 1];

        if (!route.length) {
            route = [ startRoom ];
        }

        let nextRoom = route[route.length - 1];
        for (let i = (route.length); i < rooms.length; i++) {
            const room = rooms[i];
            if (this.areRoomAdjacentRooms(nextRoom, room)) {
                route.push(room);
                nextRoom = room;
            }
            else {
                nextRoom = route[route.length - 1];
            }
        }

        // if route has endRoom, then we've plotted the whole route
        // and can end the recursion and return
        const routeHasEndRoom = route.filter((room) => {
            return (room.getId() === endRoom.getId());
        })[0];

        if (routeHasEndRoom) {
            return route;
        } else {
            const UnroutedRooms = rooms.filter((room) => {
                const routedToRoom = route.filter((routedRoom) => {
                    return (routedRoom.getId() === room.getId());
                })[0];

                return routedToRoom ? false : true;
            });

            return this.plotRoute(route.concat(UnroutedRooms), route);
        }
        return [];
    };

    createRoute() : Room[] {
        return this.plotRoute(this.deadEndFillFloor());
    };

    deadEndFillFloor(): Room[] {
        const startRoom = this.rooms[0];
        const endRoom = this.rooms[this.rooms.length - 1];

        // first iteration of the recursion is catchable with:
        //if (this.rooms.length === this.initialRooms.length) {
        //    { ... }
        //}

        const roomsCount = this.rooms.length;
        this.rooms = this.rooms.filter((room) => {
            // remove room if it's a dead end (excluding startRoom and endRoom)
            if (
                this.isDeadEndRoom(room)
                && (startRoom.getId() !== room.getId() && endRoom.getId() !== room.getId())
            ) {
                return false;
            } else {
                return true;
            }
        });

        // if these are equal, then we've filtered out all the deadend rooms and can
        // end the recursion and return
        if (roomsCount === this.rooms.length) {
            const roomsSet = this.rooms;
            this.rooms = this.initialRooms; // reset this.rooms to 'initialRooms'
            return roomsSet;
        } else {
            return this.deadEndFillFloor();
        }
    };

    private getFloorHTML() {
        const wrapper = document.createElement('DIV');
        wrapper.setAttribute('id', `floor_${this.id}`);
        wrapper.setAttribute('style', `display:inline-block; background: #cd5412`);

        let wrapperHTML = '';
        for (let i = 0; i < this.layout.matrix.length; i++) {
            const matrixI = this.layout.matrix[i];
            const matrixIRooms = matrixI.split('');
            wrapperHTML += '<div class="row" style="line-height:0; background: #ffffff">';
            for (let j = 0; j < matrixIRooms.length; j++) {
                /* allowed matrix positions values:
                * "-" ceiling/ground
                * "|" wall
                * "0" impassable ground
                * " " passable ground
                */

                const matrixIRoomJ = matrixIRooms[j];
                if (matrixIRoomJ === ' ') {
                    const thisRoom = this.getRoom(i + '_' + j);
                    if (thisRoom.getUnit('hunter')) {
                        const hunter = thisRoom.getUnit('hunter');
                        if (hunter) {
                            wrapperHTML += hunter.renderHTML().outerHTML;
                        }
                        continue;
                    }

                    if (thisRoom.getUnit('bear')) {
                        const bear = thisRoom.getUnit('bear');
                        if (bear) {
                            wrapperHTML += bear.renderHTML().outerHTML;
                        }
                        continue;
                    }
                    wrapperHTML += '<span style="display:inline-block; width:30px; height:30px; background:#ffffff;">&nbsp;</span>';
                    continue;
                }
                if (matrixIRoomJ === '-') { // ceiling/ground
                    if (i === 0) { // ceiling
                        if (j === 0) { // ceiling left corner
                            wrapperHTML += '<span style="display:inline-block; width:1px; height:1px; background: grey;">&nbsp</span>';
                            continue;
                        }
                        else if (j === matrixIRooms.length - 1) { // ceiling right corner
                            wrapperHTML += '<span style="display:inline-block; width:1px; height:1px; background: grey;">&nbsp</span>';
                            continue;
                        }
                        // ceiling generic 
                        wrapperHTML += '<span style="display:inline-block; width:30px; height:1px; background: grey;">&nbsp</span>';
                        continue;
                    }
                    else if (i === this.layout.matrix.length - 1) { // ground
                        if (j === 0) { // ground left corner
                            wrapperHTML += '<span style="display:inline-block; width:1px; height:1px; background: grey;">&nbsp</span>';
                            continue;
                        }
                        else if (j === matrixIRooms.length - 1) { // ground left corner
                            wrapperHTML += '<span style="display:inline-block; width:1px; height:1px; background: grey;">&nbsp</span>';
                            continue;
                        }
                        // ground generic 
                        wrapperHTML += '<span style="display:inline-block; width:30px; height:1px; background: grey;">&nbsp</span>';
                        continue;
                    }
                }

                if (matrixIRoomJ === '|') { // wall
                    if (!matrixIRooms[j - 1] || matrixIRooms[j - 1] === '0') { // it's a left wall
                        wrapperHTML += '<span style="display:inline-block; width:1px; height:30px; background: grey;">&nbsp</span>';
                        continue;
                    }
                    else if (!matrixIRooms[j + 1] || matrixIRooms[j + 1] === '0') { // it's a right wall
                        wrapperHTML += '<span style="display:inline-block; width:1px; height:30px; background: grey;">&nbsp</span>';
                        continue;
                    }
                }

                wrapperHTML += '<span style="display:inline-block; width:30px; height:30px; background:#cd5412;">&nbsp;</span>';
            }
            wrapperHTML += '</div>';
        }
        wrapper.innerHTML = wrapperHTML;
        return wrapper;
    };

    renderHTML(htmlAnchor : HTMLElement) {
        htmlAnchor.appendChild(this.getFloorHTML());
    };
};
