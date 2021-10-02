import type { Tool } from './Tool';
export declare type SourceType = 'current-canvas' | 'canvas' | 'img' | 'base64';
export declare type SourceParams<CurrentSource extends SourceType> = CurrentSource extends 'base64' ? {
    source: string;
} : CurrentSource extends 'canvas' ? {
    source: HTMLCanvasElement;
} : CurrentSource extends 'img' ? {
    source: HTMLImageElement;
} : {};
export declare type PhotoEditorOptions<Tools extends Record<string, typeof Tool>, CurrentSource extends SourceType> = {
    sourceType: CurrentSource;
    tools: Tools;
} & SourceParams<CurrentSource>;
