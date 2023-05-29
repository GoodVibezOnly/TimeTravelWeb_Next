import { IResponseImage } from "./interfaces";

function loadImage(uri: string, gif: any) {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      gif.addFrame(img, { copy: true, delay: 200 }); // Add the image to the GIF with a delay of 200 milliseconds
      resolve();
    };
    img.onerror = reject;
    img.src = uri;
  });
}

export const generateGif = async (images: Array<IResponseImage>) => {
  //@ts-expect-error
  const gif = new GIF({
    workers: 2,
    quality: 10,
  });

  try {
    for (const uri of images) {
      await loadImage("data:image/png;base64," + uri, gif);
    }

    gif.render(); // Start rendering the GIF

    // Handle the GIF rendering completion
    gif.on("finished", function (blob: Blob | MediaSource) {
      const url = URL.createObjectURL(blob);
      return url;
    });
  } catch (error) {
    console.error("Error creating GIF:", error);
    return null;
  }
};
