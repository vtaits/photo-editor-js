import { EventEmitter } from "eventemitter3";
import { expect, test, vi } from "vitest";

import { Tool } from "./Tool";
import type { ToolOptions } from "./types";

const toolOptions = {
	el: document.createElement("canvas"),
	pushState: () => {},
	updateState: () => {},
	disable: () => {},
	touch: () => {},
};

test("should throw an exception if options is not object", () => {
	expect(() => {
		// @ts-ignore
		new Tool("test");
	}).toThrowError("Tool options should be an object");
});

test("should throw an exception if options is null", () => {
	expect(() => {
		new Tool(null as unknown as ToolOptions);
	}).toThrowError("Tool options can't be null");
});

test("should throw an exception if element is not canvas", () => {
	expect(() => {
		// @ts-ignore
		new Tool({});
	}).toThrowError("Element for init Tool should be a canvas");
});

test("should throw an exception if pushState is not a function", () => {
	expect(() => {
		// @ts-ignore
		new Tool({
			el: document.createElement("canvas"),
			updateState: () => {},
		});
	}).toThrowError('Tool option "pushState" should be a function');
});

test("should throw an exception if updateState is not a function", () => {
	expect(() => {
		// @ts-ignore
		new Tool({
			el: document.createElement("canvas"),
			pushState: () => {},
		});
	}).toThrowError('Tool option "updateState" should be a function');
});

test("should throw an exception if disable is not a function", () => {
	expect(() => {
		// @ts-ignore
		new Tool({
			el: document.createElement("canvas"),
			pushState: () => {},
			updateState: () => {},
		});
	}).toThrowError('Tool option "disable" should be a function');
});

test("should throw an exception if touch is not a function", () => {
	expect(() => {
		// @ts-ignore
		new Tool({
			el: document.createElement("canvas"),
			pushState: () => {},
			updateState: () => {},
			disable: () => {},
		});
	}).toThrowError('Tool option "touch" should be a function');
});

test("should be disabled after init", () => {
	const tool = new Tool(toolOptions);

	expect(tool.enabled).toEqual(false);
});

test("should extend EventEmitter", () => {
	const tool = new Tool(toolOptions);

	expect(tool instanceof EventEmitter).toEqual(true);
});

test("should enable tool", () => {
	const tool = new Tool(toolOptions);

	tool.enableFromEditor();

	expect(tool.enabled).toEqual(true);
});

test("should call hooks on enable tool", () => {
	const mockFnBefore = vi.fn();
	const mockFnAfter = vi.fn();

	class CustomTool extends Tool {
		onBeforeEnable() {
			expect(this.enabled).toEqual(false);
			mockFnBefore();
		}

		onAfterEnable() {
			expect(this.enabled).toEqual(true);
			mockFnAfter();
		}
	}

	const tool = new CustomTool(toolOptions);

	tool.enableFromEditor();

	expect(mockFnBefore.mock.calls.length).toEqual(1);
	expect(mockFnAfter.mock.calls.length).toEqual(1);
});

test("should disable tool", () => {
	const tool = new Tool(toolOptions);

	tool.enableFromEditor();
	tool.disableFromEditor();

	expect(tool.enabled).toEqual(false);
});

test("should call hooks on disableFromEditor tool", () => {
	const mockFnBefore = vi.fn();
	const mockFnAfter = vi.fn();

	class CustomTool extends Tool {
		onBeforeDisable() {
			expect(this.enabled).toEqual(true);
			mockFnBefore();
		}

		onAfterDisable() {
			expect(this.enabled).toEqual(false);
			mockFnAfter();
		}
	}

	const tool = new CustomTool(toolOptions);

	tool.enableFromEditor();
	tool.disableFromEditor();

	expect(mockFnBefore.mock.calls.length).toEqual(1);
	expect(mockFnAfter.mock.calls.length).toEqual(1);
});

test("should call hook on destroy tool", () => {
	const mockFnDestroy = vi.fn();

	class CustomTool extends Tool {
		onBeforeDestroy = mockFnDestroy;
	}

	const tool = new CustomTool(toolOptions);

	tool.destroy();

	expect(mockFnDestroy.mock.calls.length).toEqual(1);
});
