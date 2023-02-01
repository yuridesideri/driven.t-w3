import { authenticateToken, validateParams } from '@/middlewares';
import { hotelIdSchema } from '@/schemas';
import { Router } from 'express';

export const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken).get('/').get('/:hotelId', validateParams(hotelIdSchema));
