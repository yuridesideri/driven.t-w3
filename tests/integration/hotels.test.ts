import app, { init } from '@/app';
import { TicketStatus } from '@prisma/client';
import { HttpStatusCode } from 'axios';
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
  describe('Testing user Authentication', async () => {
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

      expect(response.status).toBe(HttpStatusCode.Ok);

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
      it("should respond with Forbbiden(403) when ticket doesn't have hotel included", async () => {
        const user = await createUser();
        const validToken = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const response = await api.get('/hotels').set('Authorization', `Bearer ${validToken}`);

        expect(response.status).toBe(HttpStatusCode.Forbidden);
      });

      it('should respond with BadRequest(400) when ticket is not paid', async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const validToken = await generateValidToken(user);
        const ticketType = await createTicketType(true);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

        const response = await api.get('/hotels').set('Authorization', `Bearer ${validToken}`);

        expect(response.status).toBe(HttpStatusCode.BadRequest);
      });

      it('should repond with OK(200) and hotel object with rooms', async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(true);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const validToken = await generateValidToken(user);
        const hotelWithRooms = await createHotelWithRooms();

        const response = await api.get(`/hotels/${hotelWithRooms.id}`).set('Authorization', `Bearer ${validToken}`);

        expect(response.status).toBe(HttpStatusCode.Ok);

        expect(response.body).toEqual(
          {
            ...hotelWithRooms,
            createdAt: hotelWithRooms.createdAt.toISOString(),
            updatedAt: hotelWithRooms.updatedAt.toISOString(),
          },
        );
      });
    });
  });
});
