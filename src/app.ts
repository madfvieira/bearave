/*
 * Bearave
 * @author Miguel Vieira
 * @createdOn 17/10/2023, 00:25 (UTC)
 */

import { Floor } from './floor.class.js';
import { Hunter } from './hunter.class.js';
import { Level } from './level.class.js';
import { MessageEvent } from './message.event.class.js';
import { DelayEvent } from './delay.event.class.js';
import { ClearAreaEvent } from './clearArea.event.class.js';

const initialize = () => {
    const appElem = document.getElementById('app');
    if (!appElem) {
        return false;
    }

    const controlsList = document.createElement('DIV');
    controlsList.innerHTML  = '<span>w - move up</span>';
    controlsList.innerHTML += '<span style="margin-left: 1em">d - move right</span>';
    controlsList.innerHTML += '<span style="margin-left: 1em">s - move down</span>';
    controlsList.innerHTML += '<span style="margin-left: 1em">a - move left</span>';

    document.body.prepend(controlsList);

    const floor1 = new Floor(
        {
            'id': 1,
            'layout': {
                'matrix': [
                    '----------------', // 0
                    '|000 00   00000|', // 1
                    '|00  00 0      |', // 2
                    '|000 00 000000 |', // 3
                    '|00  0   0     |', // 4
                    '|00 00 0 00 000|', // 5
                    '|0  00 0 00    |', // 6
                    '|  000 0 00000 |', // 7
                    '| 000000 0 00  |', // 8
                    '|  000   0 00 0|', // 9
                    '|0     000  0  |', // 10
                    '----------------',
                ],
            },
        }
    );

    const level1 = new Level({
        'floor': floor1,
        'htmlAnchor': appElem,
    });

    const level1Init = () => {
        level1.setHunter(new Hunter());

        level1.addRoomEvents({
            'roomId': '4_3',
            'events': [
                new MessageEvent({
                    'message' : "Sniff*sniff*... a hunter is entering the cave",
                    'duration': 2600,
                    'onDone'  : () => {
                        level1.placeHunter('1_4');
                        level1.renderLevel();
                        level1.moveHunterAcrossMaze();
                    },
                    'criteriaCheck': () => {
                        const bearRoom = level1.getBearRoom();
                        if (bearRoom) {
                            return bearRoom.getId() === '4_3';
                        }
                        return false;
                    },
                }),

                new ClearAreaEvent(),
            ],
        });

        level1.addRoomEvents({
            'roomId': '10_14',
            'events': [
                new DelayEvent({
                    'duration': 0,
                    'onDone': () => {
                        level1.destroy();
                        level2.initialise(() => {
                            level2Init();
                        });
                    },
                })
            ]
        });

        level1.placeBear('1_4');
        level1.renderLevel();
    };

    level1.initialise(() => {
        level1Init();
    });

    const floor2 = new Floor(
        {
            'id': 2,
            'layout': {
                'matrix': [
                    '----------------', // 0
                    '| 0   0   0   0|', // 1
                    '| 0 0 0 0 0 0 0|', // 2
                    '| 0 0 0 0 0 0 0|', // 3
                    '| 0 0 0 0 0 0 0|', // 4
                    '| 0 0 0 0 0 0 0|', // 5
                    '| 0 0 0 0 0 0 0|', // 6
                    '| 0 0 0 0 0 0 0|', // 7
                    '| 0 0 0 0 0 0 0|', // 8
                    '| 0 0 0 0 0 0 0|', // 9
                    '|   0   0   0  |', // 10
                    '----------------',
                ],
            },
        }
    );


    const level2 = new Level({
        'floor': floor2,
        'htmlAnchor': appElem,
    });

    const level2Init = () => {
        level2.setHunter(new Hunter());
        level2.addRoomEvents({
            'roomId': '5_1',
            'events': [
                new MessageEvent({
                    'message' : "Sniff*sniff*... a hunter is entering the cave",
                    'duration': 600,
                    'onDone'  : () => {
                        level2.placeHunter('1_1');
                        level2.renderLevel();
                        level2.moveHunterAcrossMaze();
                    },
                    'criteriaCheck': () => {
                        const bearRoom = level2.getBearRoom();
                        if (bearRoom) {
                            return bearRoom.getId() === '4_3';
                        }
                        return false;
                    },
                }),

                new ClearAreaEvent(),
            ],
        });

        level2.placeBear('1_1');
        level2.renderLevel();
    };
};

initialize();
