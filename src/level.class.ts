import FloorType from './floor.type';
import LevelType from './level.type';
import { Floor } from './floor.class.js';
import { Room } from './room.class.js';
import { Event } from './event.class.js';
import { DelayEvent } from './delay.event.class.js';
import { EventQueue } from './eventQueue.class.js';
import { Bear } from './bear.class.js';
import { Hunter } from './hunter.class.js';
import RoomAdjacentPositions from './roomAdjacentPositions.interface';
import { ActionType } from './action.type.js';

export class Level {
    private id: LevelType["id"];
    private floor: LevelType["floor"];
    private htmlAnchor: LevelType["htmlAnchor"];
    private bearCanMove: boolean;
    private bear?: Bear;
    private hunter?: Hunter;

    constructor(levelOpts: LevelType) {
        this.id = levelOpts.id;
        this.floor = levelOpts.floor;
        this.htmlAnchor = levelOpts.htmlAnchor;
        this.bearCanMove = true;
    };

    setHtmlAnchor (htmlElem: HTMLElement) {
        this.htmlAnchor = htmlElem;
    };

    getFloor() : Floor {
        return this.floor;
    };

    renderMapArea() : void {
        const mapArea = document.createElement('DIV');
        mapArea.setAttribute('id', 'mapArea');

        this.htmlAnchor.appendChild(mapArea);
        this.floor.renderHTML(mapArea);
    };

    getEventAreaElem() : HTMLElement | null {
        return document.getElementById('eventsArea');
    };

    renderEventArea() : void {
        const eventsArea = document.createElement('DIV');
        eventsArea.setAttribute('id', 'eventsArea');
        eventsArea.setAttribute('style', `
            background: #000000;
            color: #ffffff;
            border: 3px solid grey;
            width: 666px;
            height: 360px;
            font-size: 22px;
            padding: 1em;
            box-sizing: border-box;
        `);

        this.htmlAnchor.appendChild(eventsArea);
    };

    renderLevel() {
        if (this.htmlAnchor) {
            this.htmlAnchor.innerHTML = '';

            this.renderMapArea();
            this.renderEventArea();
        }
    };

    placeHunter (roomId : string) : boolean {
        const floor = this.floor;
        if (!floor) {
            return false;
        }
        if (!floor.getRoom(roomId)) {
            return false;
        }

        const floorRooms = floor.getRooms();

        const hunterCurrentRoom = this.getHunterRoom();
        if (hunterCurrentRoom) { // only remove hunter if current room has it
            const hunterUnit = hunterCurrentRoom.getUnit('hunter');
            if (hunterUnit) {
                hunterCurrentRoom.removeUnit(hunterUnit);
            }
        }

        const hunterNewRoom = floorRooms.filter((room) => {
            if (room.getId() === roomId) {
                return true;
            }
            return false;
        })[0];

        if (!this?.hunter) {
            this.hunter = new Hunter({ 'healthPoints': 100});
        }

        hunterNewRoom.addUnit(this.hunter);

        return true;
    };

    moveHunter (direction: keyof RoomAdjacentPositions) : Room | boolean {
        if (!this.getHunterRoom()) {
            return false;
        }

        const hunterRoomTarget = this.getHunterRoomAdjacentPositions()[direction];

        if (hunterRoomTarget === null) {
            return false;
        }

        if (this.placeHunter(hunterRoomTarget.getId())) {
            this.renderLevel();
        };

        return true;
    };

    moveHunterAcrossMaze () {
        const roomsToVisit = this.floor.createRoute();

        const travelRouteEvents = [];

        for (let i = 0; i < roomsToVisit.length; i++) {
            travelRouteEvents.push(
                new DelayEvent({
                    duration: 500,
                    onDone: () => {
                        const bearRoom = this.getBearRoom();
                        if (bearRoom) {
                            if (bearRoom.getId() !== '10_14') {
                                this.placeHunter(roomsToVisit[i].getId());
                                this.renderLevel();
                            }
                        }
                    },
                })
            );
        }

        const eventAreaElem = this.getEventAreaElem();

        if (eventAreaElem == null) {
            return false;
        }

        new EventQueue ({
            events: travelRouteEvents,
            onDone: () => {
                console.log('all moves done');
            },
            eventArea: eventAreaElem,
        });
    };

    setRoomEvents (roomEventOpts: { 'roomId' : string, 'events' : Event[]}) : boolean {
        const floor = this.floor;
        if (!floor) {
            return false;
        }

        const targetRoom = floor.getRoom(roomEventOpts.roomId);
        if (!targetRoom) {
            return false;
        }

        targetRoom.addEvent(roomEventOpts.events);

        return true;
    };

    getHunterRoom () : Room | null {
        const roomStash = this.floor.getRooms();

        const hunterRoom = roomStash.filter((room) => {
            if (room.hasUnitId('hunter')) {
                return true;
            }
            return false;
        })[0];

        if (hunterRoom) {
            return hunterRoom;
        }

        return null;
    };

    getBearRoom () : Room | null {
        const roomStash = this.floor.getRooms();

        const bearRoom = roomStash.filter((room) => {
            if (room.hasUnitId('bear')) {
                return true;
            }
            return false;
        })[0];

        if (bearRoom) {
            return bearRoom;
        }

        return null;
    };

    placeBear (roomId : string) : boolean {
        const floor = this.floor;
        if (!floor) {
            return false;
        }
        if (!floor.getRoom(roomId)) {
            return false;
        }

        const floorRooms = floor.getRooms();

        const bearCurrentRoom = this.getBearRoom();
        if (bearCurrentRoom) { // only remove bear if current room has it
            const bearUnit = bearCurrentRoom.getUnit('bear');
            if (bearUnit) {
                bearCurrentRoom.removeUnit(bearUnit);
            }
        }

        const bearNewRoom = floorRooms.filter((room) => {
            if (room.getId() === roomId) {
                return true;
            }
            return false;
        })[0];

        if (!this?.bear) {
            this.bear = new Bear({
                'healthPoints': 100,
            });
            this.bear.setControls([
                {
                    "action": { "move" : "up" },
                    "keyCode": 38,
                },
                {
                    "action": { "move" : "right" },
                    "keyCode": 39,
                },
                {
                    "action": { "move" : "down" },
                    "keyCode": 40,
                },
                {
                    "action": { "move" : "left" },
                    "keyCode": 37,
                },
            ]);
        }

        bearNewRoom.addUnit(this.bear);

        document.onkeydown = (event) => {
            if (this.bear) {
                const bearControls = this.bear.getControls();
                for (let i = 0; i < bearControls.length ; i++) {
                    const bearControl = bearControls[i];
                    if (event.keyCode == bearControl.keyCode) {
                        if (bearControl.action.move) {
                            this.moveBear(bearControl.action.move);
                        }
                    }
                }
            }
        };

        return true;
    };

    playRoomEvents (room : Room) : boolean {
        const roomEvents = room.getEvents();

        if (roomEvents.length === 0) {
            return false;
        }

        if (!room.hasUnitId('bear')) {
            return false;
        }

        const eventAreaElem = this.getEventAreaElem();

        if (eventAreaElem == null) {
            return false;
        }

        this.bearCanMove = false;

        new EventQueue ({
            events: roomEvents,
            onDone: () => {
                this.bearCanMove = true;
                room.removeEvents();
            },
            eventArea: eventAreaElem,
        });

        return true;
    };

    getHunterRoomAdjacentPositions () : RoomAdjacentPositions {
        const hunterRoom = this.getHunterRoom();
        if (!hunterRoom) {
            return {
                'up' : null,
                'right' : null,
                'down' : null,
                'left' : null,
            };
        }

        const hunterFloor = this.floor;

        return hunterFloor.getRoomAdjacentRooms(hunterRoom);
    };

    getBearRoomAdjacentPositions () : RoomAdjacentPositions {
        const bearRoom = this.getBearRoom();
        if (!bearRoom) {
            return {
                'up' : null,
                'right' : null,
                'down' : null,
                'left' : null,
            };
        }

        const bearFloor = this.floor;

        return bearFloor.getRoomAdjacentRooms(bearRoom);
    };

    moveBear (direction: keyof RoomAdjacentPositions) : Room | boolean {
        console.log('can bear move', this.bearCanMove)
        if (!this.bearCanMove) {
            return false;
        }

        if (!this.getBearRoom()) {
            return false;
        }

        const bearRoomTarget = this.getBearRoomAdjacentPositions()[direction];

        if (bearRoomTarget === null) {
            return false;
        }

        if (this.placeBear(bearRoomTarget.getId())) {
            this.renderLevel();
            if (bearRoomTarget.hasEvents()) {
                this.playRoomEvents(bearRoomTarget);
            }
        };

        return true;
    };

    setBearControls(bear : Bear) {
    };

    unsetBearControls(bear : Bear) {
    };
};
