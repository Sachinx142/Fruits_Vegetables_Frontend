import { writeFile } from "fs/promises";
import fs from "fs";

const updateImage = async (image, currentImage) => {
    let imagePath;
    console.log(image != currentImage)
    if (image != currentImage) {
        const imageByteData = await image.arrayBuffer();
        const imageBuffer = Buffer.from(imageByteData);
        imagePath = `${Date.now()}-${image.name}`
        await writeFile(`./public/uploads/${imagePath}`, imageBuffer);

        if (fs.existsSync(`./public/uploads/${currentImage}`)) {
            fs.unlinkSync(`./public/uploads/${currentImage}`)
        }
    } else {
        imagePath = image
    }
    return imagePath;
}

export default updateImage;