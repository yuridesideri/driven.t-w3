import { getHotelById, getHotels } from '@/controllers/hotels-controller';
import { authenticateToken, validateParams } from '@/middlewares';
import { hotelIdSchema } from '@/schemas';
import { Router } from 'express';

export const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken).get('/', getHotels).get('/:hotelId', validateParams(hotelIdSchema), getHotelById);
