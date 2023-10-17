import { Filter } from "./Filter";

export class Brightness extends Filter {
	newImageData = (): ImageData => {
		const value = this.getValue();

		if (!this.originalImageData) {
			throw new Error("Image data is not provided");
		}

		const { width, height, data } = this.originalImageData;
		const imageData = new ImageData(width, height);
		const newData = imageData.data;

		const len = data.length;
		const brightness = Math.round(value * 255);

		for (let i = 0; i < len; i += 4) {
			newData[i] = data[i] + brightness;
			newData[i + 1] = data[i + 1] + brightness;
			newData[i + 2] = data[i + 2] + brightness;
			newData[i + 3] = data[i + 3];
		}

		return imageData;
	};
}
