/*
 * Bearave
 * @author Miguel Vieira
 * @createdOn 17/10/2023, 00:25 (UTC)
 */

import { Floor } from './floor.class.js';
import { Room } from './room.class.js';
import { Bear } from './bear.class.js';
import { Level } from './level.class.js';
import { MessageEvent } from './message.event.class.js';
import { DelayEvent } from './delay.event.class.js';
import { DialogueEvent } from './dialogue.event.class.js';
import { PromptEvent } from './prompt.event.class.js';
import { ClearAreaEvent } from './clearArea.event.class.js';
import { Dialogue } from './dialogue.class.js';

const initialize = () => {
    const appElem = document.getElementById('app');
    if (!appElem) {
        return false;
    }

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
        'htmlAnchor': appElem,
    });

    level1.setRoomEvents({
        'roomId': '2_4',
        'events': [
            new DialogueEvent({
                'dialogs': [
                    new Dialogue({
                        'message': "Cave is starting to flood!",
                        'entity': "Cave",
                        'duration': 1000,
                    }),
                ],
            }),
            new DelayEvent({ 'duration': 600, 'onDone' : () => { alert('hi')}}),
            new PromptEvent({
                'question': "A devilious creature emerges from the dark...",
                'choices': [
                    { id: "choice_0", label: "Attack", onPick: () => { console.log('you have picked me')}},
                    { id: "choice_1", label: "Retreat", onPick: () => {}},
                ],
            }),
            new MessageEvent({
                'message' : "Mind the puddles!",
                'duration': 3600,
            }),
            new ClearAreaEvent(),
        ],
    });

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
};

initialize();
