import multer from "multer";

const starage = multer.diskStorage({})

const upload = multer({ starage })

export default upload;