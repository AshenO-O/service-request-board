import express from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJobStatus,
  deleteJob,
  getMyJobs,
} from '../controllers/jobController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/jobs', getJobs);
router.get('/jobs/my-jobs', auth, getMyJobs);
router.get('/jobs/:id', getJobById);
router.post('/jobs', auth, createJob);
router.patch('/jobs/:id', auth, updateJobStatus);
router.delete('/jobs/:id', auth, deleteJob);

export default router;