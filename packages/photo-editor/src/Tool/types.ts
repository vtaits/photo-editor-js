export type ToolOptions = {
	el: HTMLCanvasElement;
	pushState: (nextState: string) => void;
	updateState: (nextState: string) => void;
	disable: () => void;
	touch: () => void;
};
