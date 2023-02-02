import app, { init } from '@/app';
import { TicketStatus } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from '../factories';
import { createHotelWithRooms } from '../factories/hotels-factory';
import { cleanDb, generateValidToken, testingTicketForHotel, testingToken } from '../helpers';

const api = supertest(app);

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

describe('GET /hotels', () => {
  describe('Testing user Authentication', () => {
    testingToken(api.get, '/hotels');
  });
  describe('When token is valid', () => {
    testingTicketForHotel(api.get, '/hotels');

    it('should respond with OK(200) and hotels object array', async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(true, false);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const validToken = await generateValidToken(user);
      const hotelWithRooms = await createHotelWithRooms();
      const hotel2WithRooms = await createHotelWithRooms();
      const { Rooms: rooms, ...hotel } = hotelWithRooms;
      const { Rooms: rooms2, ...hotel2 } = hotel2WithRooms;

      const response = await api.get('/hotels').set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(httpStatus.OK);

      expect(response.body).toEqual([
        {
          ...hotel,
          createdAt: hotel.createdAt.toISOString(),
          updatedAt: hotel.updatedAt.toISOString(),
        },
        {
          ...hotel2,
          createdAt: hotel2.createdAt.toISOString(),
          updatedAt: hotel2.updatedAt.toISOString(),
        },
      ]);
    });
  });
});

describe('GET /hotels/:id', () => {
  describe('Testing user Authentication', () => {
    testingToken(api.get, '/hotels/:id');

    describe('When token is valid', () => {
      
      testingTicketForHotel(api.get, '/hotels/1');

      it('should respond with NOT_FOUND(404) when hotel does not exist', async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(true, false);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const validToken = await generateValidToken(user);

        const response = await api.get('/hotels/1').set('Authorization', `Bearer ${validToken}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      it('should repond with OK(200) and hotel object with rooms', async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(true);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const validToken = await generateValidToken(user);
        const hotelWithRooms = await createHotelWithRooms();

        const response = await api.get(`/hotels/${hotelWithRooms.id}`).set('Authorization', `Bearer ${validToken}`);

        expect(response.status).toBe(httpStatus.OK);

        expect(response.body).toEqual({
          ...hotelWithRooms,
          Rooms: hotelWithRooms.Rooms.map((room) => ({
            createdAt: room.createdAt.toISOString(),
            updatedAt: room.updatedAt.toISOString(),
            ...room,
          })),
          createdAt: hotelWithRooms.createdAt.toISOString(),
          updatedAt: hotelWithRooms.updatedAt.toISOString(),
        });
      });
    });
  });
});
