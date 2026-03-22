import ImageKit from "imagekit";
import "dotenv/config"

var imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLICKEY,
  privateKey: process.env.IMAGE_KIT_PRIVATEKEY,
  urlEndpoint: process.env.IMAGE_KIT_URL,
});

export const uploadImage = (img) => {
  return new Promise((resolve, reject) => {
    imagekit.upload(
      {
        file: img.buffer,
        fileName: img.originalname,
        folder: "OUTFYT",
      },
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};