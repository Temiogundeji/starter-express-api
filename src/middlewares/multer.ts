import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from '../config';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: {
        folder: 'MCICS app users',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        resource_type: 'auto',
        max_file_size: 5000000, // 5 MB in bytes
    } as any,
});

const upload = multer({ storage });

export default upload;
