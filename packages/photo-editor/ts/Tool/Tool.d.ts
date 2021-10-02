import { EventEmitter } from 'eventemitter3';
import type { ToolOptions } from './types';
export declare class Tool extends EventEmitter {
    el: any;
    enabled: boolean;
    pushState: any;
    updateState: any;
    touch: any;
    disable: any;
    constructor(options: ToolOptions);
    onBeforeDisable(): void;
    onAfterDisable(): void;
    onBeforeEnable(): void;
    onAfterEnable(): void;
    onBeforeDestroy(): void;
    disableFromEditor(): void;
    enableFromEditor(): void;
    destroy(): void;
    reset(): void;
}
