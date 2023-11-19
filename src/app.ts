/*
 * Bearave
 * @author Miguel Vieira
 * @createdOn 17/10/2023, 00:25 (UTC)
 */

import { Floor } from './floor.class.js';
import { Room } from './room.class.js';
import { Bear } from './bear.class.js';
import { Level } from './level.class.js';
import { DialogueEvent } from './dialogue.event.class.js';
import { DecisionEvent } from './decision.event.class.js';

const initialize = () => {
    const floor1 = new Floor(
        {
            'id': 1,
            'layout': {
                'matrix': [
                    '----------------',
                    '|000 00   00000|',
                    '|00  00 0      |',
                    '|000 00 000000 |',
                    '|00  00  0     |',
                    '|00 00   00 000|',
                    '|0  00 0 00    |',
                    '|  000 0 00000 |',
                    '| 000000 0 00  |',
                    '|  000   0 00 0|',
                    '|0     000  0  |',
                    '----------------',
                ],
            },
        }
    );

    const level1 = new Level({
        'id': 1,
        'floor': floor1,
    });

    level1.setRoomEvents({
        'roomId': '1_3',
        'events': [
            new DialogueEvent({
                'message' : "Hello there Bear",
            }),
            new DialogueEvent({
                'message' : "This is a perilous cave you've wandered into",
            }),
            new DialogueEvent({
                'message' : "Mind the puddles!",
            }),
        ],
    });

    level1.setRoomEvents({
        'roomId': 'c',
        'events': [
            new DecisionEvent({
                'choice' : "Onward a stenchy smell oozes in the air.  To the right, the sound of water droplets.",
                'options' : [
                    'Go onwards',
                    'Go right',
                ]
            }),
        ],
    });

    const appElem = document.getElementById('app');
    if (appElem) {
        level1.setHtmlAnchor(appElem);
        level1.placeBear('1_4');
        level1.renderLevel();
        document.onkeydown = (event) => {
            if (event.keyCode == 38) { // up arrow
                level1.moveBear('up');
            }
            else if (event.keyCode == 40) { // down arrow
                level1.moveBear('down');
            }
            else if (event.keyCode == 37) { // left arrow
                level1.moveBear('left');
            }
            else if (event.keyCode == 39) { // right arrow
                level1.moveBear('right');
            }
        };
    }
};

initialize();
