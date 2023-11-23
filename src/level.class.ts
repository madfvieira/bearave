import FloorType from './floor.type';
import LevelType from './level.type';
import { Floor } from './floor.class.js';
import { Room } from './room.class.js';
import { Event } from './event.class.js';
import { EventQueue } from './eventQueue.class.js';
import RoomAdjacentPositions from './roomAdjacentPositions.interface';

export class Level {
    private id: LevelType["id"];
    private floor: LevelType["floor"];
    private htmlAnchor: LevelType["htmlAnchor"];
    private bearCanMove: boolean;

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
            width: 400px;
            height: 300px;
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

    getBearRoom () : Room | null {
        const roomStash = this.floor.getRooms();

        const bearRoom = roomStash.filter((room) => {
            if (room.hasBear()) {
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
            bearCurrentRoom.removeBear();
        }

        const bearNewRoom = floorRooms.filter((room) => {
            if (room.getId() === roomId) {
                return true;
            }
            return false;
        })[0];

        bearNewRoom.addBear();

        return true;
    };

    playRoomEvents (room : Room) : boolean {
        const roomEvents = room.getEvents();

        if (roomEvents.length === 0) {
            return false;
        }

        if (!room.hasBear()) {
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
};
