import { writeFile } from "fs/promises";

const uploadImage = async (image) => {
  let imagePath;
  if (image && image !== "undefined") {
    const imageByteData = await image.arrayBuffer();
    const imageBuffer = Buffer.from(imageByteData);
    imagePath = `${Date.now()}-${image.name}`
    await writeFile(`./public/uploads/${imagePath}`,imageBuffer)
  }
  return imagePath;
};
export default uploadImage