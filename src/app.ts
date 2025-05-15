import express from 'express';
import cors from 'cors'
import voiceRoutes from './routes/voiceRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());
app.use(cors())

// Routes
app.use('/api/voice', voiceRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;