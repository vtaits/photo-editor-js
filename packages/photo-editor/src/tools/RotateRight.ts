import { unwrap } from "krustykrab";
import { Tool } from "../Tool";

export class RotateRight extends Tool {
	onAfterEnable(): void {
		const canvas = unwrap(this.el);
		const ctx = unwrap(canvas.getContext("2d"));

		const { width, height } = canvas;

		const otherCanvas = document.createElement("canvas");
		otherCanvas.width = height;
		otherCanvas.height = width;

		const otherCtx = unwrap(otherCanvas.getContext("2d"));

		otherCtx.clearRect(0, 0, width, height);
		otherCtx.translate(height / 2, width / 2);
		otherCtx.rotate(Math.PI / 2);
		otherCtx.translate(-width / 2, -height / 2);
		otherCtx.drawImage(canvas, 0, 0);

		canvas.width = height;
		canvas.height = width;

		ctx.drawImage(otherCanvas, 0, 0);

		this.pushState(canvas.toDataURL());

		this.disable();
	}
}
