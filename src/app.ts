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
        'id': 1,
        'floor': floor1,
        'htmlAnchor': appElem,
    });

    level1.setRoomEvents({
        'roomId': '4_3',
        'events': [
            new MessageEvent({
                'message' : "Sniff*sniff*... a hunter is entering the cave",
                'duration': 3600,
                'onDone'  : () => {
                    level1.placeHunter('1_4');
                    level1.renderLevel();
                    level1.moveHunterAcrossMaze();
                },
            }),

            //new DialogueEvent({
            //    'dialogs': [
            //        new Dialogue({
            //            'message': "!",
            //            'entity': "Cave",
            //            'duration': 1000,
            //        }),
            //    ],
            //    'onDone' : () => { level1.floodFloor() },
            //}),
            //new MessageEvent({
            //    'message' : "Mind the puddles!",
            //    'duration': 3600,
            //}),
            new ClearAreaEvent(),
        ],
    });

    level1.setRoomEvents({
        'roomId': '10_14',
        'events': [
            new PromptEvent({
                'question': "Success! Continue to next level?",
                'choices': [
                    { id: "choice_0", label: "Yes", onPick: () => { console.log('you have picked me')}},
                    { id: "choice_1", label: "No", onPick: () => {}},
                ],
            }),
        ]
    });

    level1.placeBear('1_4');
    level1.renderLevel();
};

initialize();
