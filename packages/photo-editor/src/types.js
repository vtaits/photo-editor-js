/**
 * @import { Tool } from "./Tool/index.js"
 * /

/**
 * @typedef {"current-canvas" | "canvas" | "img" | "base64"} SourceType
*/

/**
 * @template {SourceType} CurrentSource
 * @typedef {CurrentSource extends "base64" ? { source: string } : CurrentSource extends "canvas" ? { source: HTMLCanvasElement } : CurrentSource extends "img" ? { source: HTMLImageElement } : {}} SourceParams
 */

/**
 * @template {Record<string, typeof Tool>} Tools
 * @template {SourceType} CurrentSource
 * @typedef {{
 *   sourceType?: CurrentSource,
 *   tools: Tools
 * } & SourceParams<CurrentSource>} PhotoEditorOptions
 */

export {};
