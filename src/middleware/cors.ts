import cors from 'cors';

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://intership-2025.vercel.app',
    'https://web-production-c47f.up.railway.app'  // Thay bằng domain Railway của bạn
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

export const corsMiddleware = cors(corsOptions); 