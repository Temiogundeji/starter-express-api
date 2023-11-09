import express from 'express';
import { Uploader } from '../middlewares';
import UserController from '../controllers/user';

const router = express.Router();

const {
  upload,
  getUser,
  resetPin,
} = UserController;

router.get('/me', getUser);
router.post('/reset', resetPin);
router.post('/upload', Uploader.single('image'), upload);

export default router;
