import { prisma } from '@/config';
import { TicketStatus } from '@prisma/client';
import { Http2ServerRequest } from 'http2';

export function getHotelsRepo() {
  return prisma.hotel.findMany();
}

export function getHotelWithRoomsByIdRepo(hotelId: number) {
  return prisma.hotel.findUnique({
    where: {
      id: hotelId
    },
    include:{
      Rooms: true
    }
  });
}
