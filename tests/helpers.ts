import * as jwt from "jsonwebtoken";
import { TicketStatus, User } from "@prisma/client";

import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from "./factories";
import { createSession } from "./factories/sessions-factory";
import { prisma } from "@/config";
import httpStatus from "http-status";
import faker from "@faker-js/faker";
import supertest from "supertest";
import app from "./app";
import { superTestMethod } from "./types/types-helper";
import { HttpStatusCode } from "axios";

const server = supertest(app);

export async function cleanDb() {
  await prisma.address.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.ticket.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.ticketType.deleteMany({});
}

export async function generateValidToken(user?: User) {
  const incomingUser = user || (await createUser());
  const token = jwt.sign({ userId: incomingUser.id }, process.env.JWT_SECRET);

  await createSession(token);

  return token;
}

export function testingToken(serverMethod: superTestMethod, route: string) {
  describe("While testing token", () => {
    it("should respond with status 401 if no token is given", async () => {
     const response = await serverMethod(route);
 
     expect(response.status).toBe(httpStatus.UNAUTHORIZED);
   });
 
   it("should respond with status 401 if given token is not valid", async () => {
     const token = faker.lorem.word();
 
     const response = await serverMethod(route).set("Authorization", `Bearer ${token}`);
 
     expect(response.status).toBe(httpStatus.UNAUTHORIZED);
   });
 
   it("should respond with status 401 if there is no session for given token", async () => {
     const userWithoutSession = await createUser();
     const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
 
     const response =await serverMethod(route).set("Authorization", `Bearer ${token}`);
 
     expect(response.status).toBe(httpStatus.UNAUTHORIZED);
   });
  })
}

export function testingTicketForHotel(serverMethod: superTestMethod, route: string){
  describe('While testing ticket', () => {
    it("should respond with Require Payment(402) when ticket doesn't have hotel included", async () => {
      const user = await createUser();
      const validToken = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await serverMethod(route).set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(HttpStatusCode.PaymentRequired);
    });

    it('should respond with Require Payment(402) when ticket is not paid', async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const validToken = await generateValidToken(user);
      const ticketType = await createTicketType(true, false);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await serverMethod(route).set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(HttpStatusCode.PaymentRequired);
    });

    it ('should repond with Require Payment(402) when ticket is remote', async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const validToken = await generateValidToken(user);
      const ticketType = await createTicketType(true, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await serverMethod(route).set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(HttpStatusCode.PaymentRequired);
    })
  })
}

export function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}