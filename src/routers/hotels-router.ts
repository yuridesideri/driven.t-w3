import { authenticateToken } from '@/middlewares';
import { Router } from 'express';

export const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken).get('/').get('/:hotelId');
