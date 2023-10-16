import { Tool } from "../Tool";

export class RotateRight extends Tool {
	onAfterEnable(): void {
		const ctx = this.el.getContext("2d");

		const { width, height } = this.el;

		const otherCanvas = document.createElement("canvas");
		otherCanvas.width = height;
		otherCanvas.height = width;

		const otherCtx = otherCanvas.getContext("2d");

		otherCtx.clearRect(0, 0, width, height);
		otherCtx.translate(height / 2, width / 2);
		otherCtx.rotate(Math.PI / 2);
		otherCtx.translate(-width / 2, -height / 2);
		otherCtx.drawImage(this.el, 0, 0);

		this.el.width = height;
		this.el.height = width;

		ctx.drawImage(otherCanvas, 0, 0);

		this.pushState(this.el.toDataURL());

		this.disable();
	}
}
