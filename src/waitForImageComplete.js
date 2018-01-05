/* eslint-disable no-param-reassign */
export default function waitForImageComplete(image) {
  return new Promise((resolve, reject) => {
    image.onload = () => {
      resolve();
    };

    image.onerror = () => {
      reject();
    };
  });
}
/* eslint-enable no-param-reassign */
