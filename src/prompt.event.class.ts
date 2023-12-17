import { Event } from './event.class.js';
import EventType, { EventOpts } from './event.type';
import ChoiceInterface from './choice.interface.js';

export class PromptEvent extends Event {
    constructor (PromptOpts : EventOpts<"prompt">) {
        super({
            'opts': PromptOpts,
        });
    };

    createChoicesHTML(choices : ChoiceInterface[]) : HTMLElement {
        const choicesHTML = document.createElement('DIV');
        choicesHTML.setAttribute('class', 'choices');
        for (const choice of choices) {
            const choiceRadioHTML = document.createElement('INPUT');
            choiceRadioHTML.setAttribute('type', 'radio');
            choiceRadioHTML.setAttribute('name', choice.id);

            const choiceLabelHTML = document.createElement('LABEL');
            choiceLabelHTML.setAttribute('for', choice.id);
            choiceLabelHTML.innerHTML = choice.label;

            choicesHTML.appendChild(choiceRadioHTML);
            choicesHTML.appendChild(choiceLabelHTML);
        }
        return choicesHTML;
    };

    getChoicesInputsHTML() : NodeListOf<Element> {
        return (
            document.querySelectorAll('.choices > input[type=radio]')
        );
    };

    getChoiceOnPickFunc(PromptOpts : EventOpts<"prompt">, choiceId : ChoiceInterface["id"]): () => void {
        return (
            PromptOpts.choices.filter((choice) => {
                return (choice.id === choiceId);
            })[0]["onPick"]
        );
    };

    addListenersForChoices(PromptOpts : EventOpts<"prompt">) : Promise<void> {
        return (
            new Promise(resolve => {
                const inputChoices = this.getChoicesInputsHTML();
                for (const input of inputChoices) {
                    interface clickEventOnHTMLElm {
                        target: {
                            name: string
                        },
                    };
                    input.addEventListener('click', async (event) => {
                        if (event && typeof(event.target) !== 'undefined' &&
                            (event.target instanceof Element)
                        ) {
                            const choicePicked = event.target.getAttribute('name');
                            if (choicePicked?.length) {
                                const choicePickedBehaviour = this.getChoiceOnPickFunc(PromptOpts, choicePicked);
                                console.log('func to run', choicePickedBehaviour)
                                choicePickedBehaviour();
                                await setTimeout(resolve, 100);
                            }
                        }
                        await setTimeout(resolve, 100);
                    });
                }
                return resolve;
            })
        );
    };

    override execution = () => {
        const PromptOpts = super.getOpts() as EventOpts<"prompt">;

        if (PromptOpts?.criteriaCheck) {
            if (!PromptOpts.criteriaCheck()) {
                return false;
            }
        }

        const wrapper = super.wrapperHTML();
        const eventHTML = document.createElement('DIV');
        eventHTML.setAttribute('id', 'event');

        const questionHTML = document.createElement('DIV');
        questionHTML.setAttribute('class', 'question');
        questionHTML.innerHTML = PromptOpts.question

        const optionsHTML = this.createChoicesHTML(PromptOpts.choices);

        eventHTML.appendChild(questionHTML);
        eventHTML.appendChild(optionsHTML);
        wrapper.appendChild(eventHTML);

        const eventArea = super.getEventArea();
        if (eventArea) {
            eventArea.appendChild(wrapper);
        }

        return this.addListenersForChoices(PromptOpts);
    };
};
