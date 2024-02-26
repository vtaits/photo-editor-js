import { unwrap } from "krustykrab";
import { Tool } from "../Tool";

export class Filter extends Tool {
	value = 0;

	applied = false;

	originalImageData: ImageData | null = null;

	setValue(value: number): void {
		const newValue = Math.min(Math.max(value, -1), 1);
		if (newValue === this.value) {
			return;
		}

		this.value = newValue;
		this.apply();
	}

	getValue(): number {
		return this.value;
	}

	newImageData(): ImageData {
		return unwrap(this.originalImageData);
	}

	apply(): void {
		const canvas = unwrap(this.el);
		const ctx = unwrap(canvas.getContext("2d"));

		ctx.putImageData(this.newImageData(), 0, 0);

		if (this.applied === false) {
			this.pushState(canvas.toDataURL());
			this.applied = true;
		} else {
			this.updateState(canvas.toDataURL());
		}
	}

	onAfterEnable(): void {
		const canvas = unwrap(this.el);
		const ctx = unwrap(canvas.getContext("2d"));
		const { width, height } = canvas;

		this.originalImageData = ctx.getImageData(0, 0, width, height);
	}

	onBeforeDisable(): void {
		this.value = 0;
		this.applied = false;
		this.originalImageData = null;
	}
}
