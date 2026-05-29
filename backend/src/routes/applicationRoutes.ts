import express from 'express';
import {
    applyToJob,
    getMyApplications,
    acceptApplication,
    getJobApplications
} from '../controllers/applicationController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/applications', auth, applyToJob);
router.get('/applications/my-applications', auth, getMyApplications);
router.get('/applications/job/:jobId', auth, getJobApplications);
router.patch('/applications/:applicationId/accept', auth, acceptApplication);

export default router;