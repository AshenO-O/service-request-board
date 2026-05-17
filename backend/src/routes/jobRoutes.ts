import express from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJobStatus,
  deleteJob,
} from '../controllers/jobController';

const router = express.Router();

router.get('/jobs', getJobs);
router.get('/jobs/:id', getJobById);
router.post('/jobs', createJob);
router.patch('/jobs/:id', updateJobStatus);
router.delete('/jobs/:id', deleteJob);

export default router;
