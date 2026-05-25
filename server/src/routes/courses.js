import { Router } from 'express';
import { z } from 'zod';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { courses, makeId, roles } from '../data/mockStore.js';

const router = Router();

const courseSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    category: z.string().min(2),
    description: z.string().min(10),
    thumbnailUrl: z.string().url().optional(),
    priceCents: z.number().int().nonnegative().default(0),
  }),
});

const lessonSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    videoUrl: z.string().url(),
    materials: z.array(z.string()).default([]),
  }),
});

router.get('/', (req, res) => {
  const { search = '', category } = req.query;
  const normalizedSearch = String(search).toLowerCase();
  const result = courses.filter((course) => {
    const matchesSearch = [course.title, course.description, course.category]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch);
    const matchesCategory = !category || course.category === category;
    return matchesSearch && matchesCategory;
  });
  res.json({ courses: result });
});

router.get('/:id', (req, res) => {
  const course = courses.find((item) => item.id === req.params.id);
  if (!course) {
    return res.status(404).json({ message: 'Course not found.' });
  }
  return res.json({ course });
});

router.post(
  '/',
  authenticate,
  authorize(roles.NUTRITIONIST, roles.ADMIN),
  validate(courseSchema),
  (req, res) => {
    const course = {
      id: makeId('crs'),
      ...req.validated.body,
      nutritionistId: req.user.id,
      status: req.user.role === roles.ADMIN ? 'published' : 'draft',
      lessons: [],
    };
    courses.push(course);
    return res.status(201).json({ course });
  },
);

router.post(
  '/:id/lessons',
  authenticate,
  authorize(roles.NUTRITIONIST, roles.ADMIN),
  validate(lessonSchema),
  (req, res) => {
    const course = courses.find((item) => item.id === req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const lesson = {
      id: makeId('les'),
      ...req.validated.body,
    };
    course.lessons.push(lesson);
    return res.status(201).json({ lesson, course });
  },
);

router.patch('/:id', authenticate, authorize(roles.NUTRITIONIST, roles.ADMIN), (req, res) => {
  const course = courses.find((item) => item.id === req.params.id);
  if (!course) {
    return res.status(404).json({ message: 'Course not found.' });
  }
  Object.assign(course, req.body);
  return res.json({ course });
});

export default router;

