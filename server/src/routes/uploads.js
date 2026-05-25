import fs from 'fs/promises';
import multer from 'multer';
import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { roles } from '../data/mockStore.js';
import { uploadImage } from '../services/cloudinaryService.js';

const router = Router();
const upload = multer({ dest: 'tmp/uploads' });

router.post(
  '/course-thumbnail',
  authenticate,
  authorize(roles.NUTRITIONIST, roles.ADMIN),
  upload.single('image'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Image file is required.' });
      }
      const result = await uploadImage(req.file.path, 'nutricare/courses');
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(201).json({ upload: result });
    } catch (error) {
      return next(error);
    }
  },
);

export default router;

