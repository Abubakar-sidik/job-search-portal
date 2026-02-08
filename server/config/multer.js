import multer from "multer";

// Fixed the typo: 'starage' -> 'storage'
const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    // This ensures the file keeps its original name or a unique timestamp
    callback(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

export default upload;
