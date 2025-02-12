import multer from 'multer';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/uploads'));
    },
    filename: function(req, file, cb) {
        const extension = path.extname(file.originalname);

        cb(null, file.fieldname + '-' + Date.now() + extension);
    }
});

const upload = multer({storage: storage});

export default upload;