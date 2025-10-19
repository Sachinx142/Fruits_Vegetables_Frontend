import fs from "fs"

const deleteImage =  (imagePath) => {
  if(fs.existsSync(`./public/uploads/${imagePath}`)){
    fs.unlinkSync(`./public/uploads/${imagePath}`)
  }
}

export default deleteImage;