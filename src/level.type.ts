import { Floor } from './floor.class';
import { Hunter } from './hunter.class';

type LevelType = {
    id: number,
    floor: Floor,
    htmlAnchor: HTMLElement,
};

export default LevelType;
