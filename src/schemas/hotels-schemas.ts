import Joi from 'joi';

export const hotelIdSchema = Joi.object({ hotelId: Joi.string().regex(/^\d+$/).required() }).required();
