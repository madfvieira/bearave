interface unitParams {
    id : string,
    width: string,
    height: string,
    colour: string,
};

export class Unit {
    private id : string;
    private width: string;
    private height: string;
    private colour: string;
    private movement?: boolean;

    constructor (params : unitParams) {
        this.id = params.id;
        this.width = params.width;
        this.height = params.height;
        this.colour = params.colour;
    };

    allowMovement() : void {
        this.movement= true;
    };

    disallowMovement() : void {
        this.movement= false;
    };

    canMove() : boolean {
        if (this?.movement) {
            return true;
        }
        return false;
    };

    getId() : unitParams["id"] {
        return this.id;
    };

    renderHTML() : HTMLElement {
        const unitHTML = document.createElement('SPAN');
        unitHTML.setAttribute('style', `display:inline-block; width:30px; height:30px; background:#FFFFFF; position:relative;`);
        unitHTML.innerHTML  = '&nbsp;';
        unitHTML.innerHTML += `<span id="${this.id}" style="position:absolute; left:calc(50% - ${this.width} / 2); top: calc(50% - ${this.height} / 2); border-radius:15px; background: ${this.colour}; width:${this.width}; height:${this.height};"></span>`;

        return unitHTML;
    };
};
