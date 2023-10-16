import { Tool } from "../Tool";

type BorderType = "top" | "bottom" | "left" | "right";

export class Crop extends Tool {
	originalImage: HTMLCanvasElement | null = null;

	darkenImage: HTMLCanvasElement | null = null;

	cropping = false;

	setted = false;

	startX: number | null = null;

	startY: number | null = null;

	finishX: number | null = null;

	finishY: number | null = null;

	mousedownX: number | null = null;

	mousedownY: number | null = null;

	resizingBorder: BorderType | null = null;

	showCropState(): void {
		const ctx = this.el.getContext("2d");

		const x = Math.min(this.startX, this.finishX);
		const y = Math.min(this.startY, this.finishY);

		const width = Math.abs(this.startX - this.finishX);
		const height = Math.abs(this.startY - this.finishY);

		ctx.clearRect(0, 0, this.el.width, this.el.height);
		ctx.drawImage(this.darkenImage, 0, 0, this.el.width, this.el.height);

		if (height <= 0 || width <= 0) {
			return;
		}

		ctx.clearRect(x, y, width, height);
		ctx.drawImage(this.originalImage, x, y, width, height, x, y, width, height);
	}

	applyCrop(): void {
		const x = Math.min(this.startX, this.finishX);
		const y = Math.min(this.startY, this.finishY);

		const width = Math.abs(this.startX - this.finishX);
		const height = Math.abs(this.startY - this.finishY);

		this.el.width = width;
		this.el.height = height;

		const ctx = this.el.getContext("2d");

		ctx.drawImage(this.originalImage, x, y, width, height, 0, 0, width, height);

		this.pushState(this.el.toDataURL());

		this.originalImage = null;
		this.darkenImage = null;

		this.disable();
	}

	cancelCrop(): void {
		this.startX = null;
		this.startY = null;
		this.finishX = null;
		this.finishY = null;

		this.setted = false;

		const ctx = this.el.getContext("2d");
		ctx.drawImage(this.darkenImage, 0, 0, this.el.width, this.el.height);

		this.emit("unset");

		this.disable();
	}

	sortCoords(): void {
		if (this.startX > this.finishX) {
			[this.startX, this.finishX] = [this.finishX, this.startX];
		}

		if (this.startY > this.finishY) {
			[this.startY, this.finishY] = [this.finishY, this.startY];
		}
	}

	getResizingBorder(x: number, y: number): BorderType {
		if (x > this.startX && x < this.finishX) {
			if (y > this.startY - 5 && y < this.startY + 5) {
				return "top";
			}

			if (y > this.finishY - 5 && y < this.finishY + 5) {
				return "bottom";
			}
		}

		if (y > this.startY && y < this.finishY) {
			if (x > this.startX - 5 && x < this.startX + 5) {
				return "left";
			}

			if (x > this.finishX - 5 && x < this.finishX + 5) {
				return "right";
			}
		}

		return null;
	}

	setCursorForResizingBorder(resizingBorder: BorderType): void {
		switch (resizingBorder) {
			case "top":
			case "bottom":
				this.el.style.cursor = "row-resize";
				break;

			case "left":
			case "right":
				this.el.style.cursor = "col-resize";
				break;

			default:
				throw new Error(`Unknown border "${resizingBorder}"`);
		}
	}

	onStartDraw = (event: MouseEvent): void => {
		const x =
			Math.min(Math.max(event.offsetX, 0), this.el.clientWidth) /
			(this.el.clientWidth / this.el.width);
		const y =
			Math.min(Math.max(event.offsetY, 0), this.el.clientHeight) /
			(this.el.clientHeight / this.el.height);

		if (this.setted) {
			const resizingBorder = this.getResizingBorder(x, y);

			if (resizingBorder) {
				this.resizingBorder = resizingBorder;
				this.setCursorForResizingBorder(resizingBorder);

				return;
			}
		}

		this.cropping = true;
		this.mousedownX = x;
		this.mousedownY = y;
	};

	onProcessDraw = (event: MouseEvent): void => {
		const x =
			Math.min(Math.max(event.offsetX, 0), this.el.clientWidth) /
			(this.el.clientWidth / this.el.width);
		const y =
			Math.min(Math.max(event.offsetY, 0), this.el.clientHeight) /
			(this.el.clientHeight / this.el.height);

		if (this.mousedownX !== null && this.mousedownY !== null) {
			this.startX = this.mousedownX;
			this.startY = this.mousedownY;
			this.mousedownX = null;
			this.mousedownY = null;
		}

		if (this.resizingBorder) {
			switch (this.resizingBorder) {
				case "top":
					this.startY = y;
					break;

				case "bottom":
					this.finishY = y;
					break;

				case "left":
					this.startX = x;
					break;

				case "right":
					this.finishX = x;
					break;

				default:
					throw new Error(`Unknown border "${this.resizingBorder}"`);
			}

			this.showCropState();

			return;
		}

		if (this.cropping) {
			this.finishX = x;
			this.finishY = y;

			this.showCropState();

			return;
		}

		if (this.setted) {
			const resizingBorder = this.getResizingBorder(x, y);

			if (resizingBorder) {
				this.setCursorForResizingBorder(resizingBorder);
			} else {
				this.el.style.removeProperty("cursor");
			}
		}
	};

	onStopDraw = (): void => {
		this.mousedownX = null;
		this.mousedownY = null;

		if (this.resizingBorder) {
			this.resizingBorder = null;
			this.el.style.removeProperty("cursor");

			this.sortCoords();

			return;
		}

		if (this.cropping) {
			this.sortCoords();

			this.cropping = false;
			this.setted = true;

			this.emit("set");
		}
	};

	onAfterEnable(): void {
		const { width, height } = this.el;

		this.originalImage = document.createElement("canvas");
		this.originalImage.width = width;
		this.originalImage.height = height;
		this.originalImage.getContext("2d").drawImage(this.el, 0, 0);

		this.darkenImage = document.createElement("canvas");
		this.darkenImage.width = width;
		this.darkenImage.height = height;
		this.darkenImage.getContext("2d").drawImage(this.el, 0, 0);

		const darkenCtx = this.darkenImage.getContext("2d");

		darkenCtx.fillStyle = "rgba(0, 0, 0, 0.4)";
		darkenCtx.fillRect(0, 0, width, height);

		this.el.addEventListener("mousedown", this.onStartDraw);
		this.el.addEventListener("mousemove", this.onProcessDraw);
		this.el.addEventListener("mouseup", this.onStopDraw);
	}

	onBeforeDisable(): void {
		this.cropping = false;
		this.setted = false;
		this.resizingBorder = null;

		this.el.style.removeProperty("cursor");

		if (this.darkenImage) {
			this.el.getContext("2d").drawImage(this.originalImage, 0, 0);

			this.originalImage = null;
			this.darkenImage = null;
		}

		this.el.removeEventListener("mousedown", this.onStartDraw);
		this.el.removeEventListener("mousemove", this.onProcessDraw);
		this.el.removeEventListener("mouseup", this.onStopDraw);
	}
}
