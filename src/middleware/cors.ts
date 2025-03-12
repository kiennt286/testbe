import cors from 'cors';

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://Intership-2025.vercel.app',
    'https://your-app-name.railway.app'  // Thay bằng domain Railway của bạn
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

export const corsMiddleware = cors(corsOptions); 