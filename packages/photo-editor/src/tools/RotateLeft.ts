import { Tool } from "../Tool";

export class RotateLeft extends Tool {
	onAfterEnable(): void {
		if (!this.el) {
			throw new Error("Canvas is not provided");
		}

		const ctx = this.el.getContext("2d");

		if (!ctx) {
			throw new Error("Context is not found");
		}

		const { width, height } = this.el;

		const otherCanvas = document.createElement("canvas");
		otherCanvas.width = height;
		otherCanvas.height = width;

		const otherCtx = otherCanvas.getContext("2d");

		if (!otherCtx) {
			throw new Error("Context of other canvas is not found");
		}

		otherCtx.clearRect(0, 0, width, height);
		otherCtx.translate(height / 2, width / 2);
		otherCtx.rotate(-Math.PI / 2);
		otherCtx.translate(-width / 2, -height / 2);
		otherCtx.drawImage(this.el, 0, 0);

		this.el.width = height;
		this.el.height = width;

		ctx.drawImage(otherCanvas, 0, 0);

		this.pushState(this.el.toDataURL());

		this.disable();
	}
}
