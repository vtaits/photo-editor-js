import { unwrap } from "krustykrab";
import { Tool } from "../../../packages/photo-editor/src/index.js";

export class Pencil extends Tool {
	drawing = false;

	/** @type {number | null} */
	lastX = null;

	/** @type {number | null} */
	lastY = null;

	/**
	 * @param {MouseEvent} event
	 */
	onStartDraw = (event) => {
		const canvas = unwrap(this.el);

		this.drawing = true;

		this.lastX = event.offsetX / (canvas.clientWidth / canvas.width);
		this.lastY = event.offsetY / (canvas.clientHeight / canvas.height);
	};

	/**
	 * @param {MouseEvent} event
	 */
	onProcessDraw = (event) => {
		if (!this.drawing) {
			return;
		}

		const canvas = unwrap(this.el);

		const newLastX = event.offsetX / (canvas.clientWidth / canvas.width);
		const newLastY = event.offsetY / (canvas.clientHeight / canvas.height);

		const ctx = canvas.getContext("2d");

		if (!ctx) {
			throw new Error("Context is not found");
		}

		ctx.beginPath();
		ctx.moveTo(unwrap(this.lastX), unwrap(this.lastY));
		ctx.lineTo(newLastX, newLastY);
		ctx.stroke();

		this.lastX = newLastX;
		this.lastY = newLastY;
	};

	onStopDraw = () => {
		if (!this.drawing) {
			return;
		}

		this.drawing = false;

		this.lastX = null;
		this.lastY = null;

		this.pushState(unwrap(this.el).toDataURL());
	};

	onAfterEnable() {
		const canvas = unwrap(this.el);

		canvas.addEventListener("mousedown", this.onStartDraw);
		canvas.addEventListener("mousemove", this.onProcessDraw);
		canvas.addEventListener("mouseup", this.onStopDraw);
	}

	onBeforeDisable() {
		const canvas = unwrap(this.el);

		this.drawing = false;

		canvas.removeEventListener("mousedown", this.onStartDraw);
		canvas.removeEventListener("mousemove", this.onProcessDraw);
		canvas.removeEventListener("mouseup", this.onStopDraw);
	}
}
