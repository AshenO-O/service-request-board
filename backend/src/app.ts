import express from 'express';
import cors from 'cors';
import jobRoutes from './routes/jobRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middleware/errorHandler';
import applicationRoutes from './routes/applicationRoutes';
import messageRoutes from './routes/messageRoutes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', jobRoutes);
app.use('/api/auth', authRoutes);  // Add this line
app.use('/api', applicationRoutes);
app.use('/api', messageRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

app.use(errorHandler);

export default app;