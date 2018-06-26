import Filter from './Filter';

class Contrast extends Filter {
  newImageData = () => {
    const { value, originalImageData } = this;

    const { width, height, data } = originalImageData;
    const imageData = new ImageData(width, height);
    const newData = imageData.data;

    const len = data.length;
    const contrast = Math.floor(value * 255);
    const contrastF = (259 * (contrast + 255)) / (255 * (259 - contrast));

    for (let i = 0; i < len; i += 4) {
      newData[i] = (contrastF * (data[i] - 128)) + 128;
      newData[i + 1] = (contrastF * (data[i + 1] - 128)) + 128;
      newData[i + 2] = (contrastF * (data[i + 2] - 128)) + 128;
      newData[i + 3] = data[i + 3];
    }

    return imageData;
  }
}

export default Contrast;
