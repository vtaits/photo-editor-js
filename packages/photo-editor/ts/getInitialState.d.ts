import type { Tool } from './Tool';
import type { PhotoEditorOptions, SourceType } from './types';
export declare const imageToBase64: (image: HTMLImageElement) => Promise<string>;
export declare const getInitialState: <Tools extends Record<string, typeof Tool>, CurrentSource extends SourceType>(el: HTMLCanvasElement, options: PhotoEditorOptions<Tools, CurrentSource>) => Promise<string>;
