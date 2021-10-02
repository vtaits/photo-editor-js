export const waitForImageComplete = (
  image: HTMLImageElement,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const onLoad = () => {
      image.removeEventListener('load', onLoad);
      image.removeEventListener('error', onError);
      resolve();
    };

    const onError = () => {
      image.removeEventListener('load', onLoad);
      image.removeEventListener('error', onError);
      reject();
    };

    image.addEventListener('load', onLoad);
    image.addEventListener('error', onError);
  });
}
