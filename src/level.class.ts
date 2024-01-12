import LevelType from './level.type';
import { Floor } from './floor.class.js';
import { Room } from './room.class.js';
import { Event } from './event.class.js';
import { MoveEvent } from './move.event.class.js';
import { DelayEvent } from './delay.event.class.js';
import { EventQueue } from './eventQueue.class.js';
import { Bear } from './bear.class.js';
import { Hunter } from './hunter.class.js';
import RoomAdjacentPositions from './roomAdjacentPositions.interface';

/*
* Class Level can be used as a top level controller for generating playable
  levels, containing units, rooms, events, etc
* @param {id|number} if of the level
* @param {floor|Floor} floor controller class to handle room operations
* @param {htmlAnchor|HTMLElement} html element where the level is generated
* @param {bear|Bear} optional Bear unit
* @param {hunter|Hunter} optional Hunter unit
* @param {eventQueueStash|EventQueue[]} stash of EventQueue controllers which holds
*        allows us to oversee any event queue and by extension any event that this
*        level triggers/creates.
*        NB: any eventQueue/events should be pushed into this stash
*/
export class Level {
    private floor: LevelType["floor"];
    private htmlAnchor: LevelType["htmlAnchor"];
    private bear?: Bear;
    private hunter?: Hunter;
    private eventQueueStash: EventQueue[];

    constructor(levelOpts: LevelType) {
        this.floor = levelOpts.floor;
        this.htmlAnchor = levelOpts.htmlAnchor;

        this.eventQueueStash = [];
    };

    setHtmlAnchor (htmlElem: HTMLElement) {
        this.htmlAnchor = htmlElem;
    };

    setHunter (hunter: Hunter) : void {
        this.hunter = hunter;
    };

    deleteHunter () : void {
        delete this.hunter;
    };

    getHunter () : Hunter | null {
        if (this?.hunter) {
            return this.hunter;
        }
        return null;
    };

    getEventQueueStash () : EventQueue[] {
        return this.eventQueueStash;
    };

    killAllEventQueueStash (eventQueuesInStash: EventQueue[]) : void {
        if (eventQueuesInStash.length) {
            for (let i = 0; i < eventQueuesInStash.length; i++) {
                const eventQueue = eventQueuesInStash[i];
                eventQueue.killQueue();
            }
        }
    };

    removeFromEventQueueStash (eventQueueToRemove: EventQueue) : void {
        const indexOfEventQueueToRemove = this.eventQueueStash.indexOf(eventQueueToRemove);

        if (indexOfEventQueueToRemove >= 0) {
            this.eventQueueStash = this.eventQueueStash.splice(indexOfEventQueueToRemove, 1);
        }
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
        if (!this?.hunter) {
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

        const thisHunter = this.hunter;
        if (!thisHunter) {
            return false;
        }

        for (let i = 0; i < roomsToVisit.length; i++) {
            const roomToVisit = roomsToVisit[i];

            travelRouteEvents.push(
                new DelayEvent({ duration: 1000 }),
                new MoveEvent({
                    unit: thisHunter,
                    room: roomToVisit,
                    level: this,
                    onDone: () => {
                        this.renderLevel();
                    },
                })
            );
        }

        const eventAreaElem = this.getEventAreaElem();

        if (eventAreaElem == null) {
            return false;
        }

        const eventQueueMoveHunterAcrossMaze = new EventQueue ({
            events: travelRouteEvents,
            onDone: () => {
                this.removeFromEventQueueStash(eventQueueMoveHunterAcrossMaze);
            },
            eventArea: eventAreaElem,
        });

        this.eventQueueStash.push(eventQueueMoveHunterAcrossMaze);
    };

    addRoomEvents (roomEventOpts: { 'roomId' : string, 'events' : Event[]}) : boolean {
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
            this.bear = new Bear();
            this.bear.setControls([
                {
                    "action": { "move" : "up" },
                    "key": "w",
                },
                {
                    "action": { "move" : "right" },
                    "key": "d",
                },
                {
                    "action": { "move" : "down" },
                    "key": "s",
                },
                {
                    "action": { "move" : "left" },
                    "key": "a",
                },
            ]);
            this.bear.allowMovement();
        }

        bearNewRoom.addUnit(this.bear);

        document.onkeydown = (event) => {
            if (this.bear) {
                const bearControls = this.bear.getControls();
                for (let i = 0; i < bearControls.length ; i++) {
                    const bearControl = bearControls[i];
                    if (event.key == bearControl.key) {
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

        const bearInRoom = room.getUnit('bear');
        if (!bearInRoom) {
            return false;
        }

        const eventAreaElem = this.getEventAreaElem();

        if (eventAreaElem == null) {
            return false;
        }

        bearInRoom.disallowMovement();

        const eventQueueRoomEvents = new EventQueue ({
            events: roomEvents,
            onDone: () => {
                bearInRoom.allowMovement();
                room.removeEvents();
                this.removeFromEventQueueStash(eventQueueRoomEvents);
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
        const bear = this?.bear;

        if (bear) {
            if (!bear.canMove()) {
                return false;
            }

            if (!this.getBearRoom()) {
                return false;
            }

            const bearRoomTarget = this.getBearRoomAdjacentPositions()[direction];

            if (bearRoomTarget === null) {
                return false;
            }

            const eventAreaElem = this.getEventAreaElem();

            if (eventAreaElem == null) {
                return false;
            }

            const eventQueueMoveBearEvent = new EventQueue ({
                events: [
                    new MoveEvent({
                        unit: bear,
                        room: bearRoomTarget,
                        level: this,
                        onDone: () => {},
                    })
                ],
                onDone: () => {
                    this.renderLevel();
                    this.removeFromEventQueueStash(eventQueueMoveBearEvent);
                    if (bearRoomTarget.hasEvents()) {
                        this.playRoomEvents(bearRoomTarget);
                    }
                },
                eventArea: eventAreaElem,
            });

            return true;
        }

        return false;
    };

    initialise (setupFunc: () => void) : void {
        if (this?.bear) {
            delete this.bear;
        }
        if (this?.hunter) {
            delete this.hunter;
        }

        this.killAllEventQueueStash(this.eventQueueStash);

        this.floor.setRooms(
            this.floor.constructRoomsFromMatrix(this.floor.getLayout().matrix)
        );
        setupFunc();
    };

    destroy() {
        this.htmlAnchor.innerHTML = '';
        delete this?.bear;
        delete this?.hunter;
        this.killAllEventQueueStash(this.eventQueueStash);
        this.eventQueueStash = [];
    };
};
