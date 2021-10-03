export const waitForImageComplete = (
  image: HTMLImageElement,
): Promise<void> => new Promise((resolve, reject) => {
  const onLoad = () => {
    image.removeEventListener('load', onLoad);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
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
