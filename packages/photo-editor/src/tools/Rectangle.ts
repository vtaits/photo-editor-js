import { unwrap } from "krustykrab";
import { Tool } from "../Tool";

export class Rectangle extends Tool {
	originalImage: HTMLCanvasElement | null = null;

	drawing = false;

	startX: number | null = null;

	startY: number | null = null;

	finishX: number | null = null;

	finishY: number | null = null;

	showRectangle(): void {
		const canvas = unwrap(this.el);
		const ctx = unwrap(canvas.getContext("2d"));

		if (
			this.startX === null ||
			this.startY === null ||
			this.finishX === null ||
			this.finishY === null
		) {
			throw new Error("Coordinates are not setted");
		}

		const x = Math.min(this.startX, this.finishX);
		const y = Math.min(this.startY, this.finishY);

		const width = Math.abs(this.startX - this.finishX);
		const height = Math.abs(this.startY - this.finishY);

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(
			unwrap(this.originalImage),
			0,
			0,
			canvas.width,
			canvas.height,
		);

		ctx.beginPath();
		ctx.lineWidth = 4;
		ctx.strokeStyle = "#CB0000";
		ctx.rect(x, y, width, height);
		ctx.stroke();
	}

	onStartDraw = (event: MouseEvent): void => {
		const canvas = unwrap(this.el);

		const x = event.offsetX / (canvas.clientWidth / canvas.width);
		const y = event.offsetY / (canvas.clientHeight / canvas.height);

		this.drawing = true;

		this.startX = x;
		this.startY = y;
	};

	onProcessDraw = (event: MouseEvent): void => {
		const canvas = unwrap(this.el);

		const x = event.offsetX / (canvas.clientWidth / canvas.width);
		const y = event.offsetY / (canvas.clientHeight / canvas.height);

		if (this.drawing) {
			this.finishX = x;
			this.finishY = y;

			this.showRectangle();
		}
	};

	onStopDraw = (): void => {
		if (!this.drawing) {
			return;
		}

		const canvas = unwrap(this.el);

		this.drawing = false;

		const originalCtx = unwrap(unwrap(this.originalImage).getContext("2d"));

		originalCtx.drawImage(canvas, 0, 0);

		originalCtx.drawImage(canvas, 0, 0);
		this.pushState(canvas.toDataURL());
	};

	onAfterEnable(): void {
		const canvas = unwrap(this.el);

		const { width, height } = canvas;

		this.originalImage = document.createElement("canvas");
		this.originalImage.width = width;
		this.originalImage.height = height;

		const originalCtx = unwrap(this.originalImage.getContext("2d"));

		originalCtx.drawImage(canvas, 0, 0);

		canvas.addEventListener("mousedown", this.onStartDraw);
		canvas.addEventListener("mousemove", this.onProcessDraw);
		canvas.addEventListener("mouseup", this.onStopDraw);
	}

	onBeforeDisable(): void {
		const canvas = unwrap(this.el);

		this.drawing = false;

		this.originalImage = null;

		canvas.removeEventListener("mousedown", this.onStartDraw);
		canvas.removeEventListener("mousemove", this.onProcessDraw);
		canvas.removeEventListener("mouseup", this.onStopDraw);
	}
}
