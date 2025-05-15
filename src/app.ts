import express from 'express';
import cors from 'cors';
import voiceRoutes from './routes/voiceRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

const allowedOrigin = 'https://voice-assistant-client-cinx.onrender.com';

app.use(cors({
  origin: allowedOrigin,
  credentials: true, // si usás cookies, tokens, etc.
  methods: ['GET', 'POST', 'OPTIONS'], // incluye OPTIONS para preflight
}));

app.use(express.json());
app.use('/api/voice', voiceRoutes);
app.use(errorHandler);

export default app;
