import { EventEmitter } from 'eventemitter3';
import { Tool } from './Tool';
import type { SourceType, PhotoEditorOptions } from './types';
export declare class PhotoEditor<Tools extends Record<string, typeof Tool>, ToolKey extends keyof Tools, CurrentSource extends SourceType = 'current-canvas'> extends EventEmitter {
    _el: HTMLCanvasElement;
    _options: PhotoEditorOptions<Tools, CurrentSource>;
    _currentState: number;
    _states: any[];
    _enabledToolId: ToolKey;
    _touched: boolean;
    _destroyed: boolean;
    tools: Record<ToolKey, Tool>;
    constructor(el: HTMLCanvasElement, editorOptions: PhotoEditorOptions<Tools, CurrentSource>);
    _init(): Promise<void>;
    _initTools(): void;
    _pushState: (state: any) => void;
    _updateState: (state: any) => void;
    _drawCurrentState(): Promise<void>;
    destroy(): void;
    getCurrentState(): any;
    enableTool(toolId: ToolKey): void;
    disableTool: () => void;
    toggleTool(toolId: ToolKey): void;
    touch(): void;
    undo(): void;
    redo(): void;
}
export default PhotoEditor;
