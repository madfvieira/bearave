import FloorType from './floor.type';
import LayoutType from './layout.type';
import { Room } from './room.class.js';
import RoomAdjacentPositions from './roomAdjacentPositions.interface';

interface CornerPositions {
    'top-left': Room,
    'top-right': Room,
    'bottom-left': Room,
    'bottom-right': Room,
};

export class Floor {
    private id: number = 0;
    private layout: LayoutType;
    private isRendered?: boolean = false;

    private rooms: Room[] = [];

    constructor(floorOpts: FloorType) {
        this.layout = floorOpts.layout;

        this.rooms = floorOpts.layout.matrix.reduce(
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
        )
        this.id = floorOpts.id;
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
                    wrapperHTML += '<span style="display:inline-block; width:10px; height:10px; background:#ffffff;">&nbsp;</span>';
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
                        wrapperHTML += '<span style="display:inline-block; width:10px; height:1px; background: grey;">&nbsp</span>';
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
                        wrapperHTML += '<span style="display:inline-block; width:10px; height:1px; background: grey;">&nbsp</span>';
                        continue;
                    }
                }

                if (matrixIRoomJ === '|') { // wall
                    if (!matrixIRooms[j - 1] || matrixIRooms[j - 1] === '0') { // it's a left wall
                        wrapperHTML += '<span style="display:inline-block; width:1px; height:10px; background: grey;">&nbsp</span>';
                        continue;
                    }
                    else if (!matrixIRooms[j + 1] || matrixIRooms[j + 1] === '0') { // it's a right wall
                        wrapperHTML += '<span style="display:inline-block; width:1px; height:10px; background: grey;">&nbsp</span>';
                        continue;
                    }
                }

                wrapperHTML += '<span style="display:inline-block; width:10px; height:10px; background:#cd5412;">&nbsp;</span>';
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
