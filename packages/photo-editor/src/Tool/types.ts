export type ToolOptions = Readonly<{
	el: HTMLCanvasElement;
	pushState: (nextState: string) => void;
	updateState: (nextState: string) => void;
	disable: () => void;
	touch: () => void;
}>;
